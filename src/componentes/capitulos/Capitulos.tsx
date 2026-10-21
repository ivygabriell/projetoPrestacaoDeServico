'use client';

import { UseCanvas, useScrollRig } from '@14islands/r3f-scroll-rig';
import { useEffect, useRef, useState } from 'react';
import { capitulos, capitulosRotulo } from '@/conteudo/identidade';
import { gsap } from '@/gsap';
import { ehCelular, prefereMenosMovimento } from '@/lib/ambiente';
import { suave } from '@/lib/suave';
import { useEfeitoDeLayout } from '@/lib/useEfeitoDeLayout';
import { desenharCartaz } from '@/texturas/cartazes';
import { BarraProgresso } from './BarraProgresso';
import { CenaCartoes, type EstadoCartoes } from './CenaCartoes';
import { Previa } from './Previa';

type Modo = 'galeria' | 'grade' | 'lista';
const LARGURA_CARTAZ = 730;
const ALTURA_CARTAZ = 1080;

export function Capitulos() {
  const { isCanvasAvailable } = useScrollRig();
  const [modo, setModo] = useState<Modo>('galeria');
  const [cartazes, setCartazes] = useState<HTMLCanvasElement[]>([]);
  const [imagens, setImagens] = useState<string[]>([]);
  const [emFoco, setEmFoco] = useState(-1);
  const estado = useRef<EstadoCartoes>({ progresso: 0, hover: capitulos.map(() => 0) });

  useEffect(() => {
    setModo(prefereMenosMovimento() ? 'grade' : ehCelular(window.innerWidth) ? 'lista' : 'galeria');
    document.fonts.ready.then(() => {
      const telas = capitulos.map((c) => desenharCartaz(c.tipo, LARGURA_CARTAZ, ALTURA_CARTAZ));
      setCartazes(telas);
      setImagens(telas.map((t) => (t.getContext('2d') ? t.toDataURL('image/jpeg', 0.9) : '')));
    });
  }, []);

  const comWebgl = modo === 'galeria' && isCanvasAvailable && cartazes.length === capitulos.length;

  useEfeitoDeLayout(() => {
    if (modo !== 'galeria') return;
    const secao = document.querySelector<HTMLElement>('.secao-capitulos')!;
    const ctx = gsap.context(() => {
      const fileira = secao.querySelector<HTMLElement>('.cartoes')!;
      const cartoes = secao.querySelectorAll<HTMLElement>('.cartao');
      const tracinhos = secao.querySelectorAll<HTMLElement>('.tracinho');
      const extra = fileira.scrollWidth - window.innerWidth + 60;
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: secao,
          start: 'top top',
          end: `+=${Math.max(extra - 500, window.innerHeight)}`,
          scrub: 1,
          pin: true,
          onUpdate: ({ progress }) => {
            const t = Math.max(0, 1.2 * progress - 0.04);
            tracinhos.forEach((tr, i) => (tr.style.opacity = String(suave(0.02, 0.1, (i + 1) / 28 - t))));
            cartoes.forEach((c) => (c.style.pointerEvents = progress >= 0.15 ? 'auto' : 'none'));
          },
        },
      });
      tl.to(estado.current, { progresso: 1, duration: 0.5 }, 0)
        .to(fileira, { x: -extra, duration: 2 }, 0.6)
        .to('.barra-ativa', { width: '100%', duration: 2.5 }, 0)
        .to('.barra-progresso', { rotateZ: 6, opacity: 0, duration: 0.3 }, 2.6);
    }, secao);
    return () => ctx.revert();
  }, [modo]);

  const passar = (i: number, dentro: boolean) => {
    setEmFoco(dentro ? i : -1);
    gsap.to(estado.current.hover, { [i]: dentro ? 1 : 0, duration: dentro ? 0.4 : 0.3 });
  };

  return (
    <section className={`secao-capitulos trecho-escuro modo-${modo}${comWebgl ? ' com-webgl' : ''}`} id="capitulos">
      <div className="capitulos-palco">
        <p className="rotulo-capitulos">{capitulosRotulo}</p>
        <div className="cartoes">
          {capitulos.map((c, i) => (
            <article key={c.id} className="cartao" onMouseEnter={() => passar(i, true)} onMouseLeave={() => passar(i, false)}>
              <div className="cartao-info">
                <p className="cartao-subtitulo">
                  {c.subtitulo}
                  <br />
                  {c.categoria}
                </p>
                <h3 className="cartao-titulo">{c.titulo}</h3>
              </div>
              {modo === 'galeria' && <Previa cartaz={cartazes[i] ?? null} ativa={emFoco === i} />}
              <div className="cartao-img">
                {/* eslint-disable-next-line @next/next/no-img-element -- imagem gerada em canvas, sem arquivo para otimizar */}
                <img src={imagens[i] || undefined} alt={c.titulo} width={LARGURA_CARTAZ} height={ALTURA_CARTAZ} />
              </div>
            </article>
          ))}
        </div>
      </div>
      {modo === 'galeria' && <BarraProgresso />}
      {comWebgl && (
        <UseCanvas>
          <CenaCartoes cartazes={cartazes} estado={estado} />
        </UseCanvas>
      )}
    </section>
  );
}
