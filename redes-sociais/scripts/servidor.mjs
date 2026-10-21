// Servidor local só para ver o manual e os modelos: node redes-sociais/scripts/servidor.mjs [porta]
import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = resolve(fileURLToPath(new URL('..', import.meta.url)));
const porta = Number(process.argv[2] ?? process.env.PORTA ?? 3200);
const tipos = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.png': 'image/png', '.pdf': 'application/pdf', '.md': 'text/markdown; charset=utf-8', '.svg': 'image/svg+xml' };

createServer((req, res) => {
  const caminho = decodeURIComponent(new URL(req.url ?? '/', 'http://local').pathname);
  let arquivo = normalize(join(raiz, caminho === '/' ? 'manual.html' : caminho));
  if (!arquivo.startsWith(raiz)) return res.writeHead(403).end();
  if (existsSync(arquivo) && statSync(arquivo).isDirectory()) arquivo = join(arquivo, 'index.html');
  if (!existsSync(arquivo)) return res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' }).end('Não encontrado');
  res.writeHead(200, { 'content-type': tipos[extname(arquivo)] ?? 'application/octet-stream', 'cache-control': 'no-store' });
  createReadStream(arquivo).pipe(res);
}).listen(porta, () => console.log(`Manual das redes sociais em http://localhost:${porta}`));
