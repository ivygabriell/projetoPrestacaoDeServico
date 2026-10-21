import * as CANNON from 'cannon-es';

export const ARESTA_CAIXA = 0.05;
export const LADO_CUBO = 1;
export const DESLOCAMENTO_Y = -0.1;

// Mundo da física do contato: um cubo de lado 1 (seis planos virados para dentro, descido 0,1)
// e caixas que nascem juntas no centro e levam um impulso aleatório.
export function criarMundo(qtd: number, comImpulso = true) {
  const mundo = new CANNON.World({ allowSleep: true, gravity: new CANNON.Vec3(0, -10, 0) });
  mundo.defaultContactMaterial.friction = 0.1;
  mundo.defaultContactMaterial.restitution = 0.9;

  for (let i = 0; i < 6; i++) {
    const parede = new CANNON.Body({ mass: 0, shape: new CANNON.Plane() });
    const lado = i % 2 ? 1 : -1;
    if (i < 2) {
      parede.position.x = 0.5 * lado * LADO_CUBO;
      parede.quaternion.setFromEuler(0, (-lado * Math.PI) / 2, 0);
    } else if (i < 4) {
      parede.position.y = 0.5 * lado * LADO_CUBO;
      parede.quaternion.setFromEuler((lado * Math.PI) / 2, 0, 0);
    } else {
      parede.position.z = 0.5 * lado * LADO_CUBO;
      if (lado > 0) parede.quaternion.setFromEuler(0, Math.PI, 0);
    }
    parede.position.y += DESLOCAMENTO_Y;
    mundo.addBody(parede);
  }

  const meia = 0.6 * ARESTA_CAIXA;
  const caixas = Array.from({ length: qtd }, (_, i) => {
    const caixa = new CANNON.Body({ mass: 1, shape: new CANNON.Box(new CANNON.Vec3(meia, meia, meia)) });
    // Espiral numa esfera de raio 0,03 para não nascerem todas no mesmo ponto.
    const fi = Math.acos(-1 + (2 * i) / qtd);
    const teta = Math.sqrt(qtd * Math.PI) * fi;
    caixa.position.set(Math.cos(teta) * Math.sin(fi) * 0.03, Math.cos(fi) * 0.03, Math.sin(teta) * Math.sin(fi) * 0.03);
    mundo.addBody(caixa);
    if (comImpulso) {
      const s = () => (Math.random() > 0.5 ? 7 : -7);
      caixa.applyImpulse(new CANNON.Vec3(s(), s(), s()));
    }
    return caixa;
  });

  return { mundo, caixas };
}
