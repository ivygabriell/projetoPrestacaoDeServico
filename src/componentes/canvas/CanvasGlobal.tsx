'use client';

import { GlobalCanvas } from '@14islands/r3f-scroll-rig';
import { Suspense } from 'react';

// Um único canvas WebGL atrás de todo o DOM; cada seção envia a própria cena com <UseCanvas>.
export function CanvasGlobal() {
  return (
    <GlobalCanvas flat dpr={[1, 2]} gl={{ antialias: true }} camera={{ near: 0.01, far: 10000, position: [0, 0, 600] }}>
      {(filhos) => <Suspense fallback={null}>{filhos}</Suspense>}
    </GlobalCanvas>
  );
}
