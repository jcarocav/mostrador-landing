// Servidor estático mínimo para dist/, usado por las capturas, los fotogramas y Lighthouse.
// Sin compresión: el hosting aún no está elegido, así que se mide el peor caso.
import { createServer } from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';

const TIPOS = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif',
  '.woff2': 'font/woff2', '.json': 'application/json', '.ico': 'image/x-icon', '.txt': 'text/plain',
};

/** Levanta el servidor en un puerto libre de 127.0.0.1 y devuelve { base, cerrar }. */
export async function servirDist(carpeta = 'dist') {
  const raiz = resolve(carpeta);
  if (!existsSync(raiz)) {
    console.error(`No existe ${carpeta}/. Corre antes «npm run build».`);
    process.exit(2);
  }
  const servidor = createServer((req, res) => {
    let ruta = join(raiz, decodeURIComponent(new URL(req.url, 'http://x').pathname));
    if (!ruta.startsWith(raiz)) return res.writeHead(403).end();
    if (existsSync(ruta) && statSync(ruta).isDirectory()) ruta = join(ruta, 'index.html');
    if (!existsSync(ruta)) return res.writeHead(404).end();
    res.writeHead(200, { 'Content-Type': TIPOS[extname(ruta)] ?? 'application/octet-stream' });
    createReadStream(ruta).pipe(res);
  });
  await new Promise((r) => servidor.listen(0, '127.0.0.1', r));
  return { base: `http://127.0.0.1:${servidor.address().port}`, cerrar: () => servidor.close() };
}

/** Nombre de archivo para una ruta: «/» es «inicio», «/direcciones/a/» es «direcciones-a». */
export const nombreDePagina = (pagina) =>
  pagina === '/' ? 'inicio' : pagina.replace(/\W+/g, '-').replace(/^-|-$/g, '');
