// Barra com 29 tracinhos a cada 9px e uma barra ativa que cresce conforme a galeria anda.
export function BarraProgresso() {
  return (
    <div className="barra-progresso" aria-hidden="true">
      <div className="barra-ativa" />
      {Array.from({ length: 29 }, (_, i) => (
        <span key={i} className="tracinho" style={{ left: `${9 * i}px` }} />
      ))}
    </div>
  );
}
