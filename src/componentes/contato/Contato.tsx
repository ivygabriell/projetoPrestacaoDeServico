'use client';

import { UseCanvas, useScrollRig } from '@14islands/r3f-scroll-rig';
import { useEffect, useRef, useState } from 'react';
import { contato } from '@/conteudo/identidade';
import { gsap } from '@/gsap';
import { ehCelular, prefereMenosMovimento } from '@/lib/ambiente';
import { useEfeitoDeLayout } from '@/lib/useEfeitoDeLayout';
import { CenaFisica, type EstadoFisica } from './CenaFisica';
import { Rodape } from './Rodape';

type Modo = 'desktop' | 'celular' | 'reduzido';

export function Contato() {
  const { isCanvasAvailable } = useScrollRig();
  const [modo, setModo] = useState<Modo | null>(null);
  const [orbitar, setOrbitar] = useState(false);
  const estado = useRef<EstadoFisica>({ ativo: false, rodando: false });

  useEffect(() => {
    setModo(prefereMenosMovimento() ? 'reduzido' : ehCelular(window.innerWidth) ? 'celular' : 'desktop');
  }, []);

  useEfeitoDeLayout(() => {
    if (!modo) return;
    const secao = document.querySelector<HTMLElement>('.secao-contato')!;
    const rodape = secao.querySelector<HTMLElement>('.rodape')!;
    const ativar = (sim: boolean) => {
      estado.current.ativo = sim;
      rodape.classList.toggle('visivel', sim);
      setOrbitar(sim);
    };

    if (modo === 'reduzido') {
      // Sem círculo e sem física rodando: o cubo aparece pronto, com as caixas assentadas.
      const io = new IntersectionObserver(([e]) => ativar(e.isIntersecting), { threshold: 0.3 });
      io.observe(secao);
      return () => io.disconnect();
    }

    const ctx = gsap.context(() => {
      const circulo = secao.querySelector<HTMLElement>('.circulo-escuro')!;
      if (modo === 'celular') {
        gsap.timeline({
          scrollTrigger: {
            trigger: secao,
            start: 'top top+=35%',
            onEnter: () => ativar(true),
            onLeaveBack: () => ativar(false),
          },
        }).to(circulo, { scale: 0, duration: 1.5, ease: 'expoScale(3,1)', onComplete: () => void (estado.current.rodando = true) });
        return;
      }
      gsap.timeline({
        scrollTrigger: {
          trigger: secao,
          start: 'top top',
          end: `+=${0.8 * window.innerHeight}`,
          scrub: 1,
          pin: true,
          onUpdate: ({ progress }) => {
            if (progress > 0.001 && !estado.current.ativo) ativar(true);
            if (progress <= 0.001 && estado.current.ativo) ativar(false);
            estado.current.rodando = progress > 0.999;
          },
        },
      }).to(circulo, { scale: 0, duration: 1.5, ease: 'expoScale(3,1)' });
    }, secao);
    return () => ctx.revert();
  }, [modo]);

  return (
    <section className={`secao-contato modo-${modo ?? 'desktop'}`} id="contato">
      <p className="frase-contato">{contato}</p>
      <div className="circulo-escuro" aria-hidden="true" />
      <Rodape />
      {isCanvasAvailable && modo && (
        <UseCanvas orbitar={orbitar}>
          <CenaFisica qtd={modo === 'celular' ? 50 : 100} estado={estado} parado={modo === 'reduzido'} />
        </UseCanvas>
      )}
    </section>
  );
}
