'use client';

import { UseCanvas, useScrollRig } from '@14islands/r3f-scroll-rig';
import { useEffect, useRef, useState } from 'react';
import { decisoes } from '@/conteudo/identidade';
import { gsap } from '@/gsap';
import { ehCelular, prefereMenosMovimento } from '@/lib/ambiente';
import { useEfeitoDeLayout } from '@/lib/useEfeitoDeLayout';
import { desenharFolha } from '@/texturas/folhaDecisoes';
import { CenaLencol, type EstadoLencol } from './CenaLencol';

export function Decisoes() {
  const { isCanvasAvailable } = useScrollRig();
  const [animado, setAnimado] = useState(false);
  const [folha, setFolha] = useState<HTMLCanvasElement | null>(null);
  const estado = useRef<EstadoLencol>({ descida: 0, visivel: false });

  useEffect(() => {
    const animar = !ehCelular(window.innerWidth) && !prefereMenosMovimento();
    setAnimado(animar);
    if (animar) document.fonts.ready.then(() => setFolha(desenharFolha(decisoes.itens, 0.6 * window.innerWidth * Math.min(window.devicePixelRatio, 2))));
  }, []);

  const comLencol = animado && isCanvasAvailable && folha !== null;

  useEfeitoDeLayout(() => {
    if (!comLencol || !folha) return;
    const secao = document.querySelector<HTMLElement>('.secao-decisoes')!;
    const altura = (0.6 * window.innerWidth * folha.height) / folha.width;
    secao.style.setProperty('--altura-folha', `${altura}px`);
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: secao,
          start: 'top top',
          end: `+=${1.2 * altura}`,
          scrub: 1,
          pin: true,
          onUpdate: ({ progress }) => (estado.current.visivel = progress > 0),
          onLeaveBack: () => (estado.current.visivel = false),
        },
      });
      tl.to('.titulo-decisoes .linha', { width: 'calc(60vw + 200px)', duration: 1 }, 0.5)
        .to('.titulo-decisoes', { gap: 20, duration: 0.2 }, 0.5)
        .from('.frase', { text: '', duration: 1.2, stagger: 0.5 }, 1.4)
        .to(estado.current, { descida: 1, duration: 6 }, 1.5);
    }, secao);
    return () => ctx.revert();
  }, [comLencol, folha]);

  return (
    <section className={`secao-decisoes trecho-escuro${comLencol ? ' com-lencol' : ''}`} id="decisoes">
      <div className="frases">
        {decisoes.frases.map((f) => (
          <p key={f} className="frase">
            {f}
          </p>
        ))}
      </div>
      <h2 className="titulo-decisoes">
        <span className="titulo-parte">{decisoes.rotulo[0]}</span>
        <span className="linha" aria-hidden="true" />
        <span className="titulo-parte">{decisoes.rotulo[1]}</span>
      </h2>
      <div className="mascara-decisoes" aria-hidden="true" />
      <ol className="lista-decisoes">
        {decisoes.itens.map((item, i) => (
          <li key={item}>
            {item}
            <sup>({i + 1})</sup>
          </li>
        ))}
      </ol>
      {comLencol && folha && (
        <UseCanvas>
          <CenaLencol folha={folha} estado={estado} />
        </UseCanvas>
      )}
    </section>
  );
}
