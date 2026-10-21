// Testa se o navegador cria um contexto WebGL antes de montar o canvas global: sem essa checagem,
// a falha ao criar o contexto escapa da proteção do scroll-rig e derruba a página inteira.
export function temWebgl(): boolean {
  try {
    const tela = document.createElement('canvas');
    const opcoes = { failIfMajorPerformanceCaveat: false };
    return !!(tela.getContext('webgl2', opcoes) || tela.getContext('webgl', opcoes));
  } catch {
    return false;
  }
}
