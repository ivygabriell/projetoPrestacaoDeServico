'use client';

import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { cena } from '@/estado/cena';
import { gsap } from '@/gsap';
import { vertUv } from '@/shaders/comum';
import { passagemFrag } from '@/shaders/passagem';

// Plano de tela cheia atrás de todo o conteúdo: é ele que leva a página do claro ao escuro.
export function CenaPassagem() {
  const plano = useRef<THREE.Mesh>(null);
  const progresso = useRef({ valor: 1 });
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vertUv,
        fragmentShader: passagemFrag,
        transparent: true,
        depthWrite: false,
        uniforms: { uTempo: { value: 0 }, uProgresso: { value: 1 }, uCor: { value: new THREE.Color('#121212') } },
      }),
    [],
  );

  useEffect(() => {
    plano.current?.scale.set(2 * window.innerWidth, 2 * window.innerHeight, 1);
    const tl = gsap.timeline({
      scrollTrigger: { trigger: '.secao-hero', start: `top+=${0.6 * window.innerHeight}`, end: `+=${0.6 * window.innerHeight}`, scrub: 1 },
    });
    tl.to(progresso.current, { valor: 0, duration: 1, ease: 'none' });
    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  useFrame(({ clock }) => {
    if (plano.current) plano.current.visible = !cena.contatoAtivo;
    material.uniforms.uTempo.value = clock.elapsedTime;
    material.uniforms.uProgresso.value = progresso.current.valor;
  });

  return (
    <mesh ref={plano} name="passagem" material={material} position={[0, 0, -100]} renderOrder={-1}>
      <planeGeometry args={[1, 1]} />
    </mesh>
  );
}
