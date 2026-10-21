'use client';

import { Fragment, useEffect } from 'react';
import { apoio, manifesto, unico } from '@/conteudo/identidade';
import { gsap } from '@/gsap';
import { ehCelular, prefereMenosMovimento } from '@/lib/ambiente';
import { CuboMarca } from './CuboMarca';

export function Manifesto() {
  useEffect(() => {
    const secao = document.querySelector<HTMLElement>('.secao-manifesto')!;
    const ajustarEscala = () => secao.style.setProperty('--escala-cubo', String(Math.min(1, (window.innerWidth - 60) / 1000)));
    ajustarEscala();
    window.addEventListener('resize', ajustarEscala);
    if (prefereMenosMovimento()) {
      secao.classList.add('cubo-girado');
      return () => window.removeEventListener('resize', ajustarEscala);
    }

    const ctx = gsap.context(() => {
      if (ehCelular(window.innerWidth)) {
        gsap.timeline({ scrollTrigger: { trigger: '.cubo-palco', start: 'top 80%' } }).to('.cubo', { rotateY: '-90deg', duration: 1, ease: 'none' });
        return;
      }

      // Os vãos do manifesto abrem enquanto o texto entra.
      gsap.to('.manifesto-texto .vao', {
        width: 0.03 * window.innerWidth,
        ease: 'none',
        scrollTrigger: { trigger: secao, start: 'top top-=50', end: '+=200', scrub: 1 },
      });

      // O cubo gira com a seção fixada; os retângulos encolhem e depois seguem o mouse.
      const palavras = secao.querySelectorAll<HTMLElement>('.palavra-contorno');
      const caixas = secao.querySelectorAll<HTMLElement>('.caixa');
      const cuboEl = secao.querySelector<HTMLElement>('.cubo')!;
      const seguidores: gsap.core.Tween[] = [];
      const seguir = (e: MouseEvent) => {
        const r = cuboEl.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        caixas.forEach((c, i) => seguidores.push(gsap.to(c, { left: `${100 * x}%`, top: `${100 * y}%`, duration: 0.15 * i })));
      };
      let seguindo = false;
      const topoCubo = cuboEl.getBoundingClientRect().top - secao.getBoundingClientRect().top;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: secao,
          start: `top+=${topoCubo - 0.5 * window.innerHeight + 300}`,
          end: `+=${0.8 * window.innerHeight}`,
          scrub: 1,
          pin: true,
          onUpdate: ({ progress }) => {
            if (progress > 0.87 && !seguindo) {
              palavras.forEach((p) => (p.style.animationPlayState = 'paused'));
              cuboEl.addEventListener('mousemove', seguir);
              seguindo = true;
            } else if (progress <= 0.87 && seguindo) {
              palavras.forEach((p) => (p.style.animationPlayState = 'running'));
              cuboEl.removeEventListener('mousemove', seguir);
              seguidores.splice(0).forEach((t) => t.kill());
              gsap.set(caixas, { left: '50%', top: '50%' });
              seguindo = false;
            }
          },
        },
      });
      tl.to('.cubo', { rotateY: '-90.01deg', duration: 1, ease: 'none' }, 0.1)
        .to('.cubo-lado', { borderWidth: 1, duration: 0.1, ease: 'none' }, 1.2)
        .from('.caixa', { width: 1200, height: 800, duration: 0.3, stagger: 0.01, ease: 'none' }, 1.1)
        .to('.cubo', { scale: 1, duration: 0.2, ease: 'none' }, 1.4);
      return () => cuboEl.removeEventListener('mousemove', seguir);
    }, secao);

    return () => {
      window.removeEventListener('resize', ajustarEscala);
      ctx.revert();
    };
  }, []);

  return (
    <section className="secao-manifesto trecho-escuro" id="manifesto">
      <div className="manifesto-texto">
        <span className="rotulo-manifesto">{manifesto.rotulo}</span>
        {manifesto.partes.map((parte, i) => (
          <Fragment key={i}>
            {i > 0 && <span className="vao" aria-hidden="true" />}
            {parte}{' '}
          </Fragment>
        ))}
      </div>
      <p className="manifesto-apoio">{apoio}</p>
      <div className="manifesto-conteudo">
        <CuboMarca />
        <div className="unico">
          <span className="rotulo-unico">{unico.rotulo}</span>
          {unico.paragrafos.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </div>
    </section>
  );
}

