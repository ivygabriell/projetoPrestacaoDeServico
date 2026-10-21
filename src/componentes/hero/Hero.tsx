'use client';

import { UseCanvas } from '@14islands/r3f-scroll-rig';
import { faixas, intro, logotipo, rolarParaBaixo } from '@/conteudo/identidade';
import { CenaHero } from './CenaHero';

const REPETICOES = 4;

// Hero: o logotipo e o vidro vivem no canvas; aqui ficam as faixas, a intro, o convite a rolar e o vidro em DOM.
export function Hero() {
  return (
    <section className="secao-hero">
      <h1 className="titulo-hero ScrollRig-transparentColor">
        {logotipo}
        <span className="ponto">.</span>
      </h1>
      <div className="faixas" aria-hidden="true">
        {faixas.map((itens, i) => (
          <div key={i} className={`faixa faixa-${i + 1}`}>
            {Array.from({ length: REPETICOES }, () => itens)
              .flat()
              .map((t, j) => (
                <span key={j} className="faixa-item">
                  {t}
                </span>
              ))}
          </div>
        ))}
      </div>
      <p className="intro">
        {intro.split(' ').map((p, i) => (
          <span key={i} className="palavra-intro">
            {p}{' '}
          </span>
        ))}
      </p>
      <p className="role-para-baixo">{rolarParaBaixo}</p>
      <div className="vidro-dom" aria-hidden="true">
        <div className="vidro-dom-recorte" />
      </div>
      <UseCanvas>
        <CenaHero />
      </UseCanvas>
    </section>
  );
}
