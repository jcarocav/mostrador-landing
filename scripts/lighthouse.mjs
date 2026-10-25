#!/usr/bin/env node
// Lighthouse sobre el sitio compilado (dist/), emulando un celular (lo que Lighthouse hace por
// defecto: pantalla chica, CPU 4x más lenta y red 4G lenta). Corre 3 veces cada página, toma la
// mediana de rendimiento y falla si un puntaje queda bajo el mínimo. Los informes quedan en
// informes/lighthouse/ y nunca se suben a ningún servidor.
import { createServer } from 'node:http';
import { createReadStream, existsSync, mkdirSync, statSync, writeFileSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';
import * as chromeLauncher from 'chrome-launcher';
import lighthouse from 'lighthouse';

const PAGINAS = ['/'];
const CORRIDAS = 3;
// error = detiene la CI; aviso = solo se informa.
const MINIMOS = {
  performance: { minimo: 0.9, nivel: 'error' },
  accessibility: { minimo: 0.95, nivel: 'error' },
  'best-practices': { minimo: 0.9, nivel: 'aviso' },
  seo: { minimo: 0.9, nivel: 'aviso' },
};

const DIST = resolve('dist');
const SALIDA = resolve('informes/lighthouse');
if (!existsSync(DIST)) {
  console.error('No existe dist/. Corre antes «npm run build».');
  process.exit(2);
}
mkdirSync(SALIDA, { recursive: true });

const TIPOS = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif',
  '.woff2': 'font/woff2', '.json': 'application/json', '.ico': 'image/x-icon', '.txt': 'text/plain',
};

// Servidor estático mínimo y sin compresión: el hosting aún no está elegido, así que se mide el
// peor caso (con gzip o brotli el puntaje real solo puede subir).
const servidor = createServer((req, res) => {
  let ruta = join(DIST, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (!ruta.startsWith(DIST)) return res.writeHead(403).end();
  if (existsSync(ruta) && statSync(ruta).isDirectory()) ruta = join(ruta, 'index.html');
  if (!existsSync(ruta)) return res.writeHead(404).end();
  res.writeHead(200, { 'Content-Type': TIPOS[extname(ruta)] ?? 'application/octet-stream' });
  createReadStream(ruta).pipe(res);
});
await new Promise((r) => servidor.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${servidor.address().port}`;

const chrome = await chromeLauncher.launch({
  chromeFlags: ['--headless=new', '--disable-gpu', ...(process.env.CI ? ['--no-sandbox'] : [])],
});

const mediana = (valores) => [...valores].sort((a, b) => a - b)[Math.floor(valores.length / 2)];
let fallas = 0;

try {
  for (const pagina of PAGINAS) {
    const corridas = [];
    for (let i = 0; i < CORRIDAS; i++) {
      const r = await lighthouse(`${base}${pagina}`, { port: chrome.port, output: 'html', logLevel: 'error' });
      corridas.push(r);
    }
    const puntaje = (r, c) => r.lhr.categories[c].score;
    const elegida = corridas.find((r) => puntaje(r, 'performance') === mediana(corridas.map((r) => puntaje(r, 'performance'))));
    const nombre = pagina === '/' ? 'inicio' : pagina.replace(/\W+/g, '-').replace(/^-|-$/g, '');
    writeFileSync(join(SALIDA, `${nombre}.html`), elegida.report);

    const m = elegida.lhr.audits;
    console.log(`\nLighthouse celular · ${pagina} (mediana de ${CORRIDAS} corridas)`);
    for (const [categoria, { minimo, nivel }] of Object.entries(MINIMOS)) {
      const valor = categoria === 'performance'
        ? mediana(corridas.map((r) => puntaje(r, categoria)))
        : Math.min(...corridas.map((r) => puntaje(r, categoria)));
      const ok = valor >= minimo;
      if (!ok && nivel === 'error') fallas++;
      const marca = ok ? 'OK   ' : nivel === 'error' ? 'FALLA' : 'AVISO';
      console.log(`  ${marca} ${categoria.padEnd(15)} ${Math.round(valor * 100)} (mínimo ${minimo * 100})`);
    }
    console.log(`  LCP ${m['largest-contentful-paint'].displayValue} · CLS ${m['cumulative-layout-shift'].displayValue} · TBT ${m['total-blocking-time'].displayValue} · FCP ${m['first-contentful-paint'].displayValue}`);
  }
} finally {
  chrome.kill();
  servidor.close();
}

console.log(`\nInformes en ${SALIDA}`);
if (fallas) {
  console.error(`Lighthouse: ${fallas} puntaje(s) bajo el mínimo.`);
  process.exit(1);
}
