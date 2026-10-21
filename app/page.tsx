import { Abertura } from '@/componentes/abertura/Abertura';
import { Hero } from '@/componentes/hero/Hero';

export default function Pagina() {
  return (
    <main className="conteudo" id="topo">
      <Abertura />
      <Hero />
      <div style={{ height: '300vh' }} />
    </main>
  );
}
