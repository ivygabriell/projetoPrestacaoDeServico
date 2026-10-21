'use client';

import { OrbitControls } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three-stdlib';
import { cena } from '@/estado/cena';
import { ARESTA_CAIXA, DESLOCAMENTO_Y, LADO_CUBO, criarMundo } from './mundo';

export type EstadoFisica = { ativo: boolean; rodando: boolean };

const auxiliar = new THREE.Object3D();
const gravidade = new THREE.Vector3();

// Cubo de arestas finas com caixas que caem dentro dele. A câmera global vira a câmera do cubo enquanto
// o contato está ativo, e a gravidade acompanha a câmera: as caixas escorregam conforme o cubo gira.
// Atenção: o <UseCanvas> guarda o elemento filho na montagem; o que muda depois (orbitar) chega como prop do próprio UseCanvas.
export function CenaFisica({ qtd, estado, parado, orbitar = false }: { qtd: number; estado: { current: EstadoFisica }; parado: boolean; orbitar?: boolean }) {
  const { camera, gl } = useThree();
  const caixasMesh = useRef<THREE.InstancedMesh>(null);
  const arestas = useRef<THREE.LineSegments>(null);
  const controles = useRef<{ autoRotate: boolean; reset: () => void } | null>(null);
  const { mundo, caixas } = useMemo(() => criarMundo(qtd, !parado), [qtd, parado]);
  const geometria = useMemo(() => new RoundedBoxGeometry(ARESTA_CAIXA, ARESTA_CAIXA, ARESTA_CAIXA, 2, 0.4 * ARESTA_CAIXA), []);
  const geometriaArestas = useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(LADO_CUBO, LADO_CUBO, LADO_CUBO)), []);
  const ativoAntes = useRef(false);

  // Com movimento reduzido, as caixas já começam assentadas no fundo do cubo.
  useEffect(() => {
    if (parado) for (let i = 0; i < 300; i++) mundo.step(1 / 60);
  }, [parado, mundo]);

  useFrame(() => {
    const s = estado.current;
    const malha = caixasMesh.current;
    if (!malha || !arestas.current) return;

    if (s.ativo !== ativoAntes.current) {
      ativoAntes.current = s.ativo;
      cena.contatoAtivo = s.ativo;
      malha.visible = arestas.current.visible = s.ativo;
      if (s.ativo) {
        camera.position.set(0, 1.5, 1.3).multiplyScalar(1000 / window.innerHeight);
      } else {
        controles.current?.reset();
        camera.position.set(0, 0, 600);
      }
      camera.lookAt(0, 0, 0);
      gl.domElement.style.cursor = s.ativo ? 'grab' : 'auto';
    }
    if (!s.ativo) return;
    if (controles.current) controles.current.autoRotate = s.rodando && !parado;

    if (s.rodando && !parado) {
      gravidade.set(0, -10, 0).applyQuaternion(camera.quaternion);
      mundo.gravity.set(gravidade.x, gravidade.y, gravidade.z);
      mundo.fixedStep();
    }
    caixas.forEach((c, i) => {
      auxiliar.position.set(c.position.x, c.position.y, c.position.z);
      auxiliar.quaternion.set(c.quaternion.x, c.quaternion.y, c.quaternion.z, c.quaternion.w);
      auxiliar.updateMatrix();
      malha.setMatrixAt(i, auxiliar.matrix);
    });
    malha.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      <instancedMesh ref={caixasMesh} args={[geometria, undefined, qtd]} visible={false}>
        <meshBasicMaterial color="#121212" />
      </instancedMesh>
      <lineSegments ref={arestas} geometry={geometriaArestas} position={[0, DESLOCAMENTO_Y, 0]} visible={false}>
        <lineBasicMaterial color="#787878" />
      </lineSegments>
      {orbitar && (
        <OrbitControls
          ref={controles as never}
          enableZoom={false}
          enablePan={false}
          minPolarAngle={0.1 * Math.PI}
          maxPolarAngle={0.9 * Math.PI}
          autoRotate={false}
          autoRotateSpeed={10}
          enableDamping
          enabled={!parado}
        />
      )}
    </group>
  );
}
