import type { APIRoute } from 'astro';
import { marca } from '../marca/marca';

// El favicon sale del mismo logo y del color principal de marca.ts.
export const GET: APIRoute = () =>
  new Response(marca.logoSvg.replaceAll('currentColor', marca.colores.marca[600]), {
    headers: { 'Content-Type': 'image/svg+xml' },
  });
