// Exporta cada peça dos modelos em PNG no tamanho real e cada carrossel em PDF (para o LinkedIn).
// Uso: node redes-sociais/scripts/exportar.mjs [modelo ...]   (sem argumentos, exporta todos)
// Fora do CI usa o Chrome da máquina; com CI=1, o Chromium do Playwright.
import { mkdirSync, readFileSync, rmSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from '@playwright/test';
import { PNG } from 'pngjs';

const raiz = resolve(fileURLToPath(new URL('..', import.meta.url)));
const saida = join(raiz, 'exportados');
const MODELOS = ['carrossel-manifesto', 'carrossel-educativo', 'posts', 'stories', 'perfil'];
const TAMANHOS = { retrato: [1080, 1350], quadrado: [1080, 1080], story: [1080, 1920], linkedin: [1584, 396] };

const pedidos = process.argv.slice(2);
const modelos = pedidos.length ? MODELOS.filter((m) => pedidos.includes(m)) : MODELOS;
const navegador = await chromium.launch({ channel: process.env.CI ? undefined : 'chrome' });
const pagina = await navegador.newPage({ viewport: { width: 1600, height: 2000 }, deviceScaleFactor: 1 });
const erros = [];
pagina.on('pageerror', (e) => erros.push(e.message));

let total = 0;
for (const modelo of modelos) {
  const pasta = join(saida, modelo);
  rmSync(pasta, { recursive: true, force: true });
  mkdirSync(pasta, { recursive: true });
  await pagina.goto(`${pathToFileURL(join(raiz, 'modelos', `${modelo}.html`)).href}?exportar`);
  await pagina.waitForSelector('body[data-pronto]');

  const pecas = await pagina.$$('.peca');
  for (const peca of pecas) {
    const { nome, formato } = await peca.evaluate((el) => ({ nome: el.dataset.nome, formato: el.dataset.formato }));
    const arquivo = join(pasta, `${nome}.png`);
    await peca.screenshot({ path: arquivo, animations: 'disabled' });
    const { width, height } = PNG.sync.read(readFileSync(arquivo));
    const [l, a] = TAMANHOS[formato];
    if (width !== l || height !== a) throw new Error(`${modelo}/${nome}: ${width}×${height}, esperado ${l}×${a}`);
    total++;
  }

  if (modelo.startsWith('carrossel')) {
    await pagina.emulateMedia({ media: 'print' });
    await pagina.pdf({ path: join(pasta, `${modelo}.pdf`), width: '1080px', height: '1350px', printBackground: true });
    await pagina.emulateMedia({ media: 'screen' });
  }
  console.log(`${modelo}: ${pecas.length} peças`);
}

await navegador.close();
if (erros.length) throw new Error(`Erros na página:\n${erros.join('\n')}`);
console.log(`${total} PNG em ${saida}`);
