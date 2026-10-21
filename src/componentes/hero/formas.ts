import * as THREE from 'three';

// As três peças de vidro do hero, geradas por código (sem modelo 3D externo). Medidas em "unidades do hero":
// a cena multiplica tudo por u = largura da tela / 2,5.

const retanguloArredondado = (l: number, a: number, r: number) => {
  const s = new THREE.Shape();
  s.moveTo(-l / 2 + r, -a / 2);
  s.lineTo(l / 2 - r, -a / 2);
  s.quadraticCurveTo(l / 2, -a / 2, l / 2, -a / 2 + r);
  s.lineTo(l / 2, a / 2 - r);
  s.quadraticCurveTo(l / 2, a / 2, l / 2 - r, a / 2);
  s.lineTo(-l / 2 + r, a / 2);
  s.quadraticCurveTo(-l / 2, a / 2, -l / 2, a / 2 - r);
  s.lineTo(-l / 2, -a / 2 + r);
  s.quadraticCurveTo(-l / 2, -a / 2, -l / 2 + r, -a / 2);
  return s;
};

const extrudar = (forma: THREE.Shape, profundidade: number, chanfro: number) => {
  const g = new THREE.ExtrudeGeometry(forma, {
    depth: profundidade,
    bevelEnabled: true,
    bevelThickness: chanfro,
    bevelSize: chanfro,
    bevelSegments: 8,
    curveSegments: 32,
  });
  g.center();
  g.computeVertexNormals();
  return g;
};

export function criarFormas() {
  // Principal: placa larga de cantos macios com um furo redondo, a peça que mais refrata o logotipo.
  const placa = retanguloArredondado(1.25, 0.75, 0.2);
  const furo = new THREE.Path();
  furo.absarc(0.33, 0.13, 0.12, 0, Math.PI * 2, true);
  placa.holes.push(furo);
  const principal = extrudar(placa, 0.2, 0.07);

  // Laje: peça baixa e comprida que entra por baixo durante a rolagem.
  const laje = extrudar(retanguloArredondado(1.6, 0.42, 0.2), 0.28, 0.06);

  // Pequena: um anel, que dá o reflexo redondo ao lado do logotipo.
  const pequena = new THREE.TorusGeometry(0.34, 0.13, 48, 96);

  return { principal, laje, pequena };
}
