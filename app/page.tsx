import { Abertura } from '@/componentes/abertura/Abertura';
import { Hero } from '@/componentes/hero/Hero';
import { Passagem } from '@/componentes/passagem/Passagem';

export default function Pagina() {
  return (
    <main className="conteudo" id="topo">
      <Abertura />
      <Hero />
      <Passagem />
      <div style={{ height: '300vh' }} />
    </main>
  );
}
