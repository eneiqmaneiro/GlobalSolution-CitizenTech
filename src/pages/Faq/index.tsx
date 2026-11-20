import TituloPagina from "../../components/TituloPagina";
import { perguntasFrequentes } from "../../data/DadosFaq";

export default function Faq() {
  return (
    <div className="space-y-10">
      <TituloPagina titulo="Perguntas frequentes" />

      <div className="space-y-4">
        {perguntasFrequentes.map((item) => (
          <article key={item.pergunta} className="rounded-2xl bg-card px-6 py-5 shadow-soft">
            <h2 className="font-semibold text-primary-dark">{item.pergunta}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{item.resposta}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
