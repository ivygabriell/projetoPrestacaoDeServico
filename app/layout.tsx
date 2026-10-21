import type { Metadata } from 'next';
import { Azeret_Mono, Instrument_Serif, Inter_Tight } from 'next/font/google';
import type { ReactNode } from 'react';
import '@14islands/r3f-scroll-rig/css';
import './globals.css';
import { CabecalhoDaPagina } from '@/componentes/cabecalho/Cabecalho';
import { SeloLateral } from '@/componentes/cabecalho/SeloLateral';
import { CanvasGlobal } from '@/componentes/canvas/CanvasGlobal';
import { RecarregarAoRedimensionar } from '@/componentes/canvas/RecarregarAoRedimensionar';
import { Rolagem } from '@/componentes/canvas/Rolagem';
import { ProvedorAbertura } from '@/estado/abertura';

const sans = Inter_Tight({ subsets: ['latin'], weight: ['400', '500', '700', '800'], variable: '--sans' });
const mono = Azeret_Mono({ subsets: ['latin'], weight: ['400'], variable: '--mono' });
const serif = Instrument_Serif({ subsets: ['latin'], weight: ['400'], style: ['normal', 'italic'], variable: '--serif' });

const SCRIPT_ABERTURA = "try{if(sessionStorage.getItem('abertura-tocou')==='1')document.documentElement.classList.add('sem-abertura')}catch(e){}";

export const metadata: Metadata = {
  title: 'Identidade da marca',
  description: 'Rascunho v0.1 da identidade de um laboratório de sites B2B.',
  robots: { index: false, follow: false }, // rascunho: fora dos buscadores até a identidade ser decidida
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className={`${sans.variable} ${mono.variable} ${serif.variable}`} suppressHydrationWarning>
      <head>
        {/* Antes de pintar: se a abertura já tocou nesta sessão, ela não aparece nem por um quadro. */}
        <script dangerouslySetInnerHTML={{ __html: SCRIPT_ABERTURA }} />
        <noscript>
          <style>{'.abertura { display: none; }'}</style>
        </noscript>
      </head>
      <body>
        <ProvedorAbertura>
          <Rolagem />
          <RecarregarAoRedimensionar />
          <CabecalhoDaPagina />
          <SeloLateral />
          {children}
          <CanvasGlobal />
        </ProvedorAbertura>
      </body>
    </html>
  );
}
