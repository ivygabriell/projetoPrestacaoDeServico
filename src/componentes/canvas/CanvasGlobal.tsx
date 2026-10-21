'use client';

import { GlobalCanvas } from '@14islands/r3f-scroll-rig';
import { Suspense, useEffect, useState } from 'react';
import { temWebgl } from '@/lib/webgl';

// Um único canvas WebGL atrás de todo o DOM; cada seção envia a própria cena com <UseCanvas>.
// Sem WebGL, o canvas não monta e a página usa os fallbacks em DOM (classe js-global-canvas-error).
// Os eventos do ponteiro vêm do <body>, porque o canvas fica atrás do conteúdo.
export function CanvasGlobal() {
  const [suporte, setSuporte] = useState<boolean | null>(null);

  useEffect(() => {
    const ok = temWebgl();
    if (!ok) document.documentElement.classList.add('js-global-canvas-error', 'fundo-por-secao');
    setSuporte(ok);
  }, []);

  if (!suporte) return null;
  return (
    <GlobalCanvas
      flat
      style={{ zIndex: -1 }}
      dpr={[1, 2]}
      gl={{ antialias: true, failIfMajorPerformanceCaveat: false }}
      camera={{ near: 0.01, far: 10000, position: [0, 0, 600] }}
      eventSource={typeof document !== 'undefined' ? document.body : undefined}
      eventPrefix="client"
    >
      {(filhos) => <Suspense fallback={null}>{filhos}</Suspense>}
    </GlobalCanvas>
  );
}
