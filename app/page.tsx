import { Abertura } from '@/componentes/abertura/Abertura';
import { Hero } from '@/componentes/hero/Hero';
import { Manifesto } from '@/componentes/manifesto/Manifesto';
import { Passagem } from '@/componentes/passagem/Passagem';

export default function Pagina() {
  return (
    <main className="conteudo" id="topo">
      <Abertura />
      <Hero />
      <Passagem />
      <Manifesto />
      <div style={{ height: '200vh' }} />
    </main>
  );
}
