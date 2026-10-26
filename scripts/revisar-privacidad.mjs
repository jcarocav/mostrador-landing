#!/usr/bin/env node
// Revisa que el repositorio (que es público) no contenga nada privado ni de seguimiento.
// Mira los archivos que git sigue o va a seguir (no los ignorados). Sale con 1 si encuentra algo.
import { execFileSync } from 'node:child_process';
import { readFileSync, statSync } from 'node:fs';
import { basename, extname } from 'node:path';

const ESTE_ARCHIVO = 'scripts/revisar-privacidad.mjs';

const archivos = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard', '-z'], {
  encoding: 'utf8',
})
  .split('\0')
  .filter(Boolean);

const NOMBRES_PROHIBIDOS = [
  [/(^|\/)\.env(\.|$)(?!example$)/, 'archivo .env'],
  [/\.(pem|key|p12|pfx)$/i, 'llave o certificado'],
  [/(^|\/)id_(rsa|ed25519|ecdsa)/, 'llave SSH'],
  [/(^|\/)settings\.local\.json$/, 'ajustes locales de Claude'],
  [/(^|\/)supabase\//i, 'carpeta de Supabase'],
  [/(^|\/)(ESPECIFICACION_PRODUCTO|PROGRESO|ESQUEMA)\.md$/, 'documento interno de la plataforma'],
];

const CONTENIDO_PROHIBIDO = [
  [/eyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\./, 'token JWT'],
  [/\bsb_(secret|publishable)_[A-Za-z0-9_-]{10,}/, 'clave de Supabase'],
  [/[a-z0-9]{20}\.supabase\.co/, 'URL de un proyecto de Supabase'],
  [/service_role/, 'mención a service_role'],
  [/\b(ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{30,}/, 'token de GitHub'],
  [/\b(sk|rk)_(live|test)_[A-Za-z0-9]{10,}/, 'clave de pasarela de pago'],
  [/\bAKIA[0-9A-Z]{16}\b/, 'clave de AWS'],
  [/\bAIza[0-9A-Za-z_-]{35}\b/, 'clave de Google'],
  [/-----BEGIN [A-Z ]*PRIVATE KEY-----/, 'llave privada'],
  [/googletagmanager|google-analytics|gtag\(|\bfbq\(|hotjar|clarity\.ms|plausible\.io|posthog|segment\.(com|io)/i, 'analítica o seguimiento'],
];

const BINARIOS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif', '.gif', '.ico', '.woff', '.woff2', '.mp4', '.webm', '.pdf']);
const hallazgos = [];

for (const archivo of archivos) {
  for (const [patron, motivo] of NOMBRES_PROHIBIDOS) {
    if (patron.test(archivo)) hallazgos.push(`${archivo}: ${motivo}`);
  }
  if (archivo === ESTE_ARCHIVO || archivo.startsWith('.claude/skills/') || BINARIOS.has(extname(archivo).toLowerCase())) continue;
  let contenido;
  try {
    if (statSync(archivo).size > 2_000_000) continue;
    contenido = readFileSync(archivo, 'utf8');
  } catch {
    continue;
  }
  if (basename(archivo) === 'package-lock.json') continue;
  contenido.split(/\r?\n/).forEach((linea, i) => {
    for (const [patron, motivo] of CONTENIDO_PROHIBIDO) {
      // Se informa el motivo y la línea, nunca el valor encontrado.
      if (patron.test(linea)) hallazgos.push(`${archivo}:${i + 1}: ${motivo}`);
    }
  });
}

if (hallazgos.length) {
  console.error(`Privacidad: ${hallazgos.length} hallazgo(s). No se puede subir así:`);
  for (const h of hallazgos) console.error(`  - ${h}`);
  process.exit(1);
}
console.log(`Privacidad: ${archivos.length} archivos revisados, sin hallazgos.`);
