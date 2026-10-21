import { Abertura } from '@/componentes/abertura/Abertura';
import { Capitulos } from '@/componentes/capitulos/Capitulos';
import { Decisoes } from '@/componentes/decisoes/Decisoes';
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
      <Capitulos />
      <Decisoes />
      <div style={{ height: '200vh' }} />
    </main>
  );
}
