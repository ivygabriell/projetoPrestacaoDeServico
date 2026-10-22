// Desenha o que é gerado por código nas peças: tracinhos, índice, panorama e ASCII.
// Nas páginas de modelo também monta a prancha. ?exportar põe as peças em tamanho real; ?grade mostra margens e zonas seguras.
(() => {
  const LARGURA = { retrato: 1080, quadrado: 1080, story: 1080, linkedin: 1584 };
  const ALTURA = { retrato: 1350, quadrado: 1080, story: 1920, linkedin: 396 };
  const dois = (n) => String(n).padStart(2, '0');

  // Carrossel: tracinhos, índice "(03/08)" e panorama que atravessa as lâminas.
  function carrosseis(raiz) {
    for (const carrossel of raiz.querySelectorAll('[data-carrossel]')) {
      const laminas = [...carrossel.querySelectorAll('.peca')];
      laminas.forEach((lamina, i) => {
        for (const t of lamina.querySelectorAll('.tracinhos')) {
          t.replaceChildren(...laminas.map((_, j) => {
            const tracinho = document.createElement('i');
            if (j < i) tracinho.className = 'feito';
            if (j === i) tracinho.className = 'atual';
            return tracinho;
          }));
        }
        for (const n of lamina.querySelectorAll('[data-indice]')) n.textContent = `(${dois(i + 1)}/${dois(laminas.length)})`;
      });

      const molde = carrossel.querySelector('template.panorama-molde');
      if (!molde) continue;
      laminas.forEach((lamina, i) => {
        if (lamina.querySelector(':scope > .panorama')) return;
        const largura = LARGURA[lamina.dataset.formato];
        const camada = document.createElement('div');
        camada.className = 'panorama';
        camada.style.left = `${-i * largura}px`;
        camada.style.width = `${laminas.length * largura}px`;
        camada.append(molde.content.cloneNode(true));
        lamina.prepend(camada);
      });
    }
  }

  // ASCII: formas desenhadas com um raymarcher pequeno e uma rampa de caracteres.
  const rampa = ' .:-=+*#%@';
  const formas = {
    esfera: (x, y, z) => Math.hypot(x, y, z) - 1,
    cubo: (x, y, z) => {
      const q = [Math.abs(x) - 0.75, Math.abs(y) - 0.75, Math.abs(z) - 0.75];
      return Math.hypot(...q.map((v) => Math.max(v, 0))) + Math.min(Math.max(...q), 0) - 0.08;
    },
    toro: (x, y, z) => Math.hypot(Math.hypot(x, z) - 0.85, y) - 0.38,
  };
  const girar = ([x, y, z], a, b) => {
    const x1 = x * Math.cos(a) - z * Math.sin(a), z1 = x * Math.sin(a) + z * Math.cos(a);
    return [x1, y * Math.cos(b) - z1 * Math.sin(b), y * Math.sin(b) + z1 * Math.cos(b)];
  };
  function ascii(raiz) {
    for (const alvo of raiz.querySelectorAll('[data-ascii]')) {
      const sdf = formas[alvo.dataset.ascii];
      const cols = +alvo.dataset.colunas || 60, linhas = +alvo.dataset.linhas || 30;
      const a = +(alvo.dataset.giro ?? 0.6), b = +(alvo.dataset.inclinacao ?? 0.5);
      const f = (x, y, z) => sdf(...girar([x, y, z], a, b));
      const luz = [-0.7, 0.6, -0.4].map((v, _, l) => v / Math.hypot(...l));
      let saida = '';
      for (let j = 0; j < linhas; j++) {
        for (let i = 0; i < cols; i++) {
          // O caractere mono tem cerca de 0,6 de largura por altura de linha.
          const u = ((i + 0.5) / cols * 2 - 1) * (cols * 0.6) / linhas, v = -((j + 0.5) / linhas * 2 - 1);
          let t = 0, acertou = false, p = [0, 0, 0];
          for (let k = 0; k < 64; k++) {
            p = [u * 1.6, v * 1.6, -3 + t];
            const d = f(...p);
            if (d < 0.002) { acertou = true; break; }
            t += d;
            if (t > 6) break;
          }
          if (!acertou) { saida += ' '; continue; }
          const e = 0.001;
          const n = [f(p[0] + e, p[1], p[2]) - f(p[0] - e, p[1], p[2]), f(p[0], p[1] + e, p[2]) - f(p[0], p[1] - e, p[2]), f(p[0], p[1], p[2] + e) - f(p[0], p[1], p[2] - e)];
          const brilho = 0.12 + 0.88 * Math.max(0, (n[0] * luz[0] + n[1] * luz[1] + n[2] * luz[2]) / Math.hypot(...n));
          saida += rampa[Math.min(rampa.length - 1, 1 + Math.floor(brilho * (rampa.length - 1.01)))];
        }
        saida += '\n';
      }
      alvo.textContent = saida;
    }
  }

  // Prancha: cada peça numa moldura reduzida, com legenda.
  function emoldurar(raiz) {
    for (const peca of raiz.querySelectorAll('.peca')) {
      const externa = document.createElement('figure');
      const interna = document.createElement('div');
      interna.className = 'moldura-prancha';
      const legenda = document.createElement('figcaption');
      legenda.className = 'legenda-prancha';
      legenda.textContent = `${peca.dataset.nome} · ${LARGURA[peca.dataset.formato]}×${ALTURA[peca.dataset.formato]}`;
      peca.replaceWith(externa);
      interna.append(peca);
      externa.append(interna, legenda);
    }
  }

  function preparar(raiz) {
    carrosseis(raiz);
    ascii(raiz);
  }

  window.Pecas = { preparar, LARGURA, ALTURA };

  if (document.body.dataset.pagina !== 'modelo') return;
  const params = new URLSearchParams(location.search);
  if (params.has('exportar')) document.body.classList.add('exportar');
  if (params.has('grade')) document.body.classList.add('grade');
  if (params.has('embutido')) document.body.classList.add('embutido');
  preparar(document);
  emoldurar(document);

  // Dentro do manual (iframe), avisa a altura para o quadro crescer junto.
  const avisarAltura = () => parent !== window && parent.postMessage({ pecasAltura: document.documentElement.scrollHeight, pagina: location.pathname }, '*');
  document.fonts.ready.then(() => {
    document.body.setAttribute('data-pronto', '');
    avisarAltura();
  });
  addEventListener('resize', avisarAltura);
})();
