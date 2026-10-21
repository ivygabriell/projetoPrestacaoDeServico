'use client';

import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { tecidoFrag, tecidoVert } from '@/shaders/tecido';

export type EstadoLencol = { descida: number; visivel: boolean };

// O lençol: plano de 20×24 segmentos com a folha de decisões. Desce a partir da linha do título,
// saindo de trás da máscara escura, e acompanha a página depois que o pin termina.
export function CenaLencol({ folha, estado }: { folha: HTMLCanvasElement; estado: { current: EstadoLencol } }) {
  const plano = useRef<THREE.Mesh>(null);
  const material = useMemo(() => {
    const textura = new THREE.CanvasTexture(folha);
    textura.colorSpace = THREE.SRGBColorSpace;
    return new THREE.ShaderMaterial({ vertexShader: tecidoVert, fragmentShader: tecidoFrag, uniforms: { uFolha: { value: textura }, uTempo: { value: 0 } } });
  }, [folha]);

  useFrame(({ clock }) => {
    const p = plano.current;
    const linha = document.querySelector('.secao-decisoes .titulo-decisoes .linha');
    if (!p || !linha) return;
    p.visible = estado.current.visivel;
    if (!p.visible) return;
    const W = window.innerWidth;
    const H = window.innerHeight;
    const largura = 0.6 * W;
    const altura = (largura * folha.height) / folha.width;
    const yLinha = linha.getBoundingClientRect().top;
    const centro = yLinha - altura / 2 + estado.current.descida * altura;
    p.scale.set(largura, altura, 1);
    p.position.set(0, H / 2 - centro, 0);
    material.uniforms.uTempo.value = clock.elapsedTime;
  });

  return (
    <mesh ref={plano} material={material} visible={false}>
      <planeGeometry args={[1, 1, 20, 24]} />
    </mesh>
  );
}
