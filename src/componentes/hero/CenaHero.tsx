'use client';

import { useScrollbar } from '@14islands/r3f-scroll-rig';
import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { logotipo } from '@/conteudo/identidade';
import { useAbertura } from '@/estado/abertura';
import { PRIORIDADE, gsap, recalcularGatilhos } from '@/gsap';
import { ehCelular, prefereMenosMovimento } from '@/lib/ambiente';
import { vertUv } from '@/shaders/comum';
import { glitchFrag } from '@/shaders/glitch';
import { refracaoFrag, refracaoVert } from '@/shaders/refracao';
import { desenharLogotipo } from '@/texturas/logotipo';
import { criarFormas } from './formas';

const CLARO = new THREE.Color('#F7F7F5');

// Unidade do hero, como na referência: a cena inteira escala com a largura da tela.
const unidade = () => (window.innerWidth < 1800 ? window.innerWidth / 2.5 : window.innerWidth / 2.8);

// Escalas de repouso (em unidades) e o quanto cada peça muda na saída.
const ESCALA = { principal: 1.5, laje: 1.0, pequena: 0.55, principalCelular: 2.2 };

export function CenaHero() {
  const { gl, scene, camera, size } = useThree();
  const { terminou } = useAbertura();
  const { scroll, enabled: rolagemSuave } = useScrollbar();
  const [celular] = useState(() => ehCelular(window.innerWidth));
  const [reduzido] = useState(() => prefereMenosMovimento());
  const [logo, setLogo] = useState<{ textura: THREE.CanvasTexture; razao: number } | null>(null);

  const refLogo = useRef<THREE.Mesh>(null);
  const refPrincipal = useRef<THREE.Mesh>(null);
  const refLaje = useRef<THREE.Mesh>(null);
  const refPequena = useRef<THREE.Mesh>(null);
  const vidroDom = useRef<HTMLElement | null>(null);

  // Valores animados pelo GSAP e lidos a cada quadro.
  const estado = useRef({ progresso: reduzido ? 1 : 0, opacidade: 1, yPrincipal: 0, yLaje: 0, yPequena: 0, ativo: true });

  const formas = useMemo(() => criarFormas(), []);
  const alvo = useMemo(() => new THREE.WebGLRenderTarget(1, 1), []);
  const materialVidro = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: refracaoVert,
        fragmentShader: refracaoFrag,
        transparent: true,
        uniforms: {
          uFundo: { value: alvo.texture },
          uResolucao: { value: new THREE.Vector2(1, 1) },
          uClaro: { value: CLARO },
          uTempo: { value: 0 },
          uBorrao: { value: new THREE.Vector2() },
          uOpacidade: { value: 1 },
          uForca: { value: 1 },
        },
      }),
    [alvo],
  );
  const materialLogo = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vertUv,
        fragmentShader: glitchFrag,
        transparent: true,
        uniforms: { uLogo: { value: null }, uProgresso: { value: estado.current.progresso } },
      }),
    [],
  );

  // O logotipo só é desenhado depois de a fonte carregar.
  useEffect(() => {
    let vivo = true;
    document.fonts.ready.then(() => {
      if (!vivo) return;
      const familia = getComputedStyle(document.documentElement).getPropertyValue('--sans') || 'sans-serif';
      const largura = window.innerWidth * (celular ? 0.9 : 0.86);
      const tela = desenharLogotipo(logotipo, largura * Math.min(window.devicePixelRatio, 2), familia);
      const textura = new THREE.CanvasTexture(tela);
      textura.colorSpace = THREE.SRGBColorSpace;
      materialLogo.uniforms.uLogo.value = textura;
      setLogo({ textura, razao: tela.height / tela.width });
    });
    return () => {
      vivo = false;
    };
  }, [celular, materialLogo]);

  // Alvo da refração do tamanho da tela (em pixels do dispositivo).
  useEffect(() => {
    const v = gl.getDrawingBufferSize(new THREE.Vector2());
    alvo.setSize(v.x, v.y);
    materialVidro.uniforms.uResolucao.value.copy(v);
    const u = unidade();
    refPrincipal.current?.scale.setScalar((celular ? ESCALA.principalCelular : ESCALA.principal) * u);
    refLaje.current?.scale.setScalar(ESCALA.laje * u);
    refPequena.current?.scale.setScalar(ESCALA.pequena * u);
  }, [gl, size, alvo, materialVidro, celular]);

  // Entrada (quando a abertura termina) e saída ligada à rolagem.
  useEffect(() => {
    if (!terminou || reduzido) return;
    const u = unidade();
    const s = estado.current;
    const principal = refPrincipal.current!;
    const pequena = refPequena.current!;
    vidroDom.current = document.querySelector('.secao-hero .vidro-dom');
    const palavras = document.querySelectorAll('.secao-hero .palavra-intro');

    const entrada = gsap.timeline();
    entrada.set('.secao-hero .intro', { opacity: 1 }, 0);
    if (celular) {
      s.yPrincipal = -3 * u;
      entrada
        .to(s, { progresso: 1, duration: 1, ease: 'power1.inOut' }, 1)
        .to('.secao-hero .faixas', { opacity: 1, duration: 0.4 }, 1)
        .to(s, { yPrincipal: 0, duration: 1.2, ease: 'power1.inOut' }, 0)
        .from(principal.rotation, { y: 0.1 * Math.PI, duration: 1, ease: 'power2.inOut' }, 0.4)
        .to('.secao-hero .role-para-baixo', { opacity: 1, duration: 0.3 }, 1.2);
      palavras.forEach((p) => entrada.from(p, { opacity: 0, duration: 0.1, repeat: 4 }, 1.1 + 0.5 * Math.random()));
    } else {
      s.yPrincipal = -2 * u;
      s.yLaje = -2 * u;
      s.yPequena = -2 * u;
      entrada
        .to(s, { progresso: 1, duration: 1, ease: 'power1.inOut' }, 1.2)
        .to('.secao-hero .faixas', { opacity: 1, duration: 0.5 }, 1.5)
        .to(s, { yPrincipal: 0, duration: 1.8, ease: 'power1.inOut' }, 0)
        .to(s, { yLaje: 0, duration: 1.4 }, 0)
        .to(s, { yPequena: 0, duration: 1.4 }, 0.5)
        .from(principal.rotation, { y: 0.15 * Math.PI, duration: 2, ease: 'power2.inOut' }, 0.4)
        .from(pequena.rotation, { z: -Math.PI / 4, x: pequena.rotation.x + Math.PI / 9, duration: 1.2, ease: 'power1.inOut' }, 0.8)
        .set('.secao-hero .vidro-dom', { opacity: 1 }, 0.5)
        .from('.secao-hero .vidro-dom-recorte', { rotateZ: 45, rotateY: 45, scale: 1.2, duration: 1.2, ease: 'power1.inOut' }, 0.8)
        .to('.secao-hero .role-para-baixo', { opacity: 1, duration: 0.5 }, 1);
      palavras.forEach((p) => entrada.from(p, { opacity: 0, duration: 0.1, repeat: 5 }, 1.5 + Math.random()));
    }

    let saida: gsap.core.Timeline | undefined;
    const mostrar = (sim: boolean) => {
      s.ativo = sim;
      [refPrincipal, refLaje, refPequena].forEach((r) => r.current && (r.current.visible = sim && (!celular || r === refPrincipal)));
    };
    const atraso = setTimeout(() => {
      saida = gsap.timeline({
        scrollTrigger: {
          trigger: '.secao-hero',
          start: 'top+=10',
          end: `+=${(celular ? 0.7 : 2) * window.innerHeight}`,
          scrub: 1,
          refreshPriority: PRIORIDADE.hero,
          onLeave: () => mostrar(false),
          onEnterBack: () => mostrar(true),
        },
      });
      saida.to(['.secao-hero .role-para-baixo', '.secao-hero .faixas'], { opacity: 0, duration: 0.2 }, 0);
      if (celular) {
        saida.to(s, { opacidade: 0, duration: 0.3 }, 0.2).to(principal.rotation, { y: 0.05 * Math.PI, duration: 1 }, 0);
      } else {
        saida
          .to(principal.scale, { x: 1.35 * u, y: 1.35 * u, z: 1.35 * u, duration: 2 }, 0.2)
          .to(s, { opacidade: 0, duration: 0.58, ease: 'power1.in' }, 0.4)
          .to(refLaje.current!.scale, { x: 1.2 * u, y: 1.2 * u, z: 1.2 * u, duration: 2 }, 0.2)
          .to(s, { yLaje: 0.1 * u, duration: 1 }, 0.2)
          .to(pequena.scale, { x: 0.45 * u, y: 0.45 * u, z: 0.45 * u, duration: 1.6 }, 0.2)
          .to('.secao-hero .vidro-dom-recorte', { scale: 0, opacity: 0, rotateZ: -9, duration: 1.2 }, 0.2)
          .to(principal.rotation, { y: 0.1 * Math.PI, duration: 1.5 }, 0.1)
          .to(refLaje.current!.rotation, { y: -0.05 * Math.PI, duration: 1.4 }, 0.2)
          .to(pequena.rotation, { z: -0.05 * Math.PI, duration: 1.2 }, 0.2);
      }
      recalcularGatilhos();
    }, 1000);

    return () => {
      clearTimeout(atraso);
      entrada.kill();
      saida?.scrollTrigger?.kill();
      saida?.kill();
    };
  }, [terminou, reduzido, celular]);

  useFrame((estadoR3f) => {
    const s = estado.current;
    const principal = refPrincipal.current;
    if (!principal || !refLogo.current) return;

    const u = unidade();
    const t = reduzido ? 0 : estadoR3f.clock.elapsedTime;
    const m = reduzido ? { x: 0, y: 0 } : estadoR3f.pointer;
    const sy = rolagemSuave ? scroll.y : window.scrollY;

    materialLogo.uniforms.uProgresso.value = s.progresso;
    refLogo.current.position.y = 0.178 * window.innerHeight + (reduzido ? 1 : 1.6) * sy;

    const laje = refLaje.current!;
    const pequena = refPequena.current!;
    if (celular) {
      principal.position.set(-0.02 * u + 0.07 * Math.sin(0.9 * t) * u, -0.3 * u + 0.03 * Math.sin(0.7 * t) * u + s.yPrincipal + 0.1 * sy, 0);
    } else {
      principal.position.x = -0.02 * u + 0.07 * Math.sin(0.9 * t) * u + 0.1 * m.x * u;
      principal.position.y = -0.41 * u + 0.03 * Math.sin(0.6 * t) * u + 0.03 * m.y * u + s.yPrincipal + (reduzido ? 1 : 0.1) * sy;
      principal.rotation.z = -0.04 * m.x;
      laje.position.x = 0.08 * u - Math.cos(0.8 * t) * u * 0.05 + 0.08 * m.x * u;
      laje.position.y = -1.6 * u + s.yLaje + (reduzido ? 1 : 0.9) * sy;
      pequena.position.x = 0.32 * u - 0.04 * Math.sin(0.7 * t) * u + 0.05 * m.x * u;
      pequena.position.y = -0.55 * u - 0.02 * m.y * u + s.yPequena + (reduzido ? 1 : 0.4) * sy;
      if (vidroDom.current) gsap.set(vidroDom.current, { x: pequena.position.x, y: -pequena.position.y });
    }
    materialVidro.uniforms.uTempo.value = t;
    materialVidro.uniforms.uBorrao.value.set(5 * m.x, 3 * m.y);
    materialVidro.uniforms.uOpacidade.value = s.opacidade;

    if (!s.ativo || s.opacidade < 0.01) return;
    // Passo da refração: a cena sem o vidro vai para o alvo, e o vidro amostra esse alvo.
    const visiveis = [principal.visible, laje.visible, pequena.visible];
    principal.visible = laje.visible = pequena.visible = false;
    gl.setRenderTarget(alvo);
    gl.clear();
    gl.render(scene, camera);
    gl.setRenderTarget(null);
    [principal.visible, laje.visible, pequena.visible] = visiveis;
  });

  const larguraLogo = typeof window === 'undefined' ? 0 : window.innerWidth * (celular ? 0.9 : 0.86);

  return (
    <group>
      {logo && (
        <mesh ref={refLogo} material={materialLogo} position={[0, 0, -0.2 * unidade()]}>
          <planeGeometry args={[larguraLogo, larguraLogo * logo.razao]} />
        </mesh>
      )}
      <mesh ref={refPrincipal} geometry={formas.principal} material={materialVidro} rotation={[-0.35, 0, 0]} renderOrder={2} />
      <mesh ref={refLaje} geometry={formas.laje} material={materialVidro} rotation={[-1.05, 0, 0]} visible={!celular} renderOrder={2} />
      <mesh ref={refPequena} geometry={formas.pequena} material={materialVidro} rotation={[0.5, 0.3, 0]} visible={!celular} renderOrder={2} />
    </group>
  );
}
