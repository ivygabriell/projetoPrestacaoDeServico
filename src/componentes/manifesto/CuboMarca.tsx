'use client';

import { useEffect, useState } from 'react';
import { cubo } from '@/conteudo/identidade';
import { desenharFundoDesfocado } from '@/texturas/fundoDesfocado';

// Cópias por linha: duas paradas (0° e 180°) e cinco girando com atrasos escalonados.
const COPIAS = ['parada', 'parada-invertida', 'g1', 'g2', 'g3', 'g4', 'g5'];
const LINHAS = ['linha-1', 'linha-2', 'linha-3'];
export const TAMANHOS_CAIXAS: [number, number][] = [
  [43, 66], [74, 110], [110, 170], [160, 250], [230, 370], [330, 530], [454, 803], [620, 1076], [780, 1240], [980, 1430],
];

// Bloco 3D de 1000×600: na frente, a palavra em contorno girando; na lateral, retângulos sobre um fundo desfocado.
export function CuboMarca() {
  const [fundo, setFundo] = useState('');
  useEffect(() => setFundo(desenharFundoDesfocado(1000, 600)), []);

  return (
    <div className="cubo-palco">
      <div className="cubo-escala">
        <div className="cubo">
          <div className="cubo-frente" aria-hidden="true">
            {LINHAS.map((linha) =>
              COPIAS.map((copia) => (
                <span key={`${linha}-${copia}`} className={`palavra-contorno ${linha} ${copia}`}>
                  {cubo.palavra}
                </span>
              )),
            )}
          </div>
          <div className="cubo-lado" style={fundo ? { backgroundImage: `url(${fundo})` } : undefined}>
            {TAMANHOS_CAIXAS.map(([l, a], i) => (
              <span key={i} className="caixa" style={{ width: l, height: a }} />
            ))}
            <p className="cubo-legenda">{cubo.legenda}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
