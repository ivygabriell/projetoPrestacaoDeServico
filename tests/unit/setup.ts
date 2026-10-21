// O jsdom não implementa matchMedia; o ScrollTrigger e os componentes consultam ao carregar.
if (!window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({ matches: false, media: query, onchange: null, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {}, dispatchEvent: () => false }) as MediaQueryList;
}

// Sem canvas no jsdom: os desenhos em canvas devolvem nada, como num navegador sem suporte.
HTMLCanvasElement.prototype.getContext = (() => null) as typeof HTMLCanvasElement.prototype.getContext;

// O jsdom não tem a API de fontes; as seções esperam document.fonts.ready antes de desenhar.
if (!('fonts' in document)) Object.defineProperty(document, 'fonts', { value: { ready: Promise.resolve() } });

window.scrollTo = (() => {}) as typeof window.scrollTo;
