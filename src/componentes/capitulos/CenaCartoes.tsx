'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { asciiFrag } from '@/shaders/ascii';
import { vertUv } from '@/shaders/comum';

export type EstadoCartoes = { progresso: number; hover: number[] };

// Um plano por cartão, posicionado a cada quadro sobre a imagem do DOM (que anda com o pin e com a galeria).
export function CenaCartoes({ cartazes, estado }: { cartazes: HTMLCanvasElement[]; estado: { current: EstadoCartoes } }) {
  const { gl } = useThree();
  const planos = useRef<(THREE.Mesh | null)[]>([]);
  const materiais = useMemo(
    () =>
      cartazes.map((c) => {
        const textura = new THREE.CanvasTexture(c);
        textura.colorSpace = THREE.SRGBColorSpace;
        return new THREE.ShaderMaterial({
          glslVersion: THREE.GLSL3,
          vertexShader: vertUv,
          fragmentShader: asciiFrag,
          uniforms: {
            uImagem: { value: textura },
            uProgresso: { value: 0 },
            uHover: { value: 0 },
            uTempo: { value: 0 },
            uPixelRatio: { value: gl.getPixelRatio() },
            uFundo: { value: new THREE.Color('#121212') },
          },
        });
      }),
    [cartazes, gl],
  );

  useFrame(({ clock }) => {
    const imagens = document.querySelectorAll<HTMLImageElement>('.secao-capitulos .cartao-img img');
    const W = window.innerWidth;
    const H = window.innerHeight;
    imagens.forEach((img, i) => {
      const plano = planos.current[i];
      if (!plano) return;
      const r = img.getBoundingClientRect();
      plano.visible = r.bottom > 0 && r.top < H && r.right > 0 && r.left < W;
      if (!plano.visible) return;
      plano.position.set(r.left + r.width / 2 - W / 2, H / 2 - (r.top + r.height / 2), 0);
      plano.scale.set(r.width, r.height, 1);
      const u = materiais[i].uniforms;
      u.uTempo.value = clock.elapsedTime;
      u.uProgresso.value = estado.current.progresso;
      u.uHover.value = estado.current.hover[i] ?? 0;
    });
  });

  return (
    <group>
      {materiais.map((m, i) => (
        <mesh key={i} ref={(el) => void (planos.current[i] = el)} material={m} visible={false}>
          <planeGeometry args={[1, 1]} />
        </mesh>
      ))}
    </group>
  );
}
