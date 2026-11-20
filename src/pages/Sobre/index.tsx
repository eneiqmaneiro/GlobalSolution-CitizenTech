import { Link } from "react-router-dom";
import TituloPagina from "../../components/TituloPagina";
import { classeBotaoContorno, classeBotaoPrimario } from "../../utils/estilos";

const passos = [
  { titulo: "Cadastre", texto: "Estabelecimentos, alimentos e lotes com validade." },
  { titulo: "Monitore", texto: "Estoque, consumo de água e desperdício em um só lugar." },
  { titulo: "Receba alertas", texto: "Status OK, ALERTA ou VENCIDO calculado pela API." },
  { titulo: "Decida", texto: "Relatórios mostram onde reduzir perdas." },
];

export default function Sobre() {
  return (
    <div className="space-y-10">
      <TituloPagina titulo="Sobre a EcoSmart" subtitulo="Tecnologia a serviço da sustentabilidade no setor de alimentos." />

      <section className="grid gap-5 md:grid-cols-2">
        <article className="rounded-2xl bg-card p-7 shadow-soft">
          <h2 className="text-lg font-semibold text-primary-dark">O problema</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Toneladas de alimentos são descartadas todos os dias por vencimento, e o consumo de água raramente é
            monitorado de forma contínua em restaurantes e mercados.
          </p>
        </article>
        <article className="rounded-2xl bg-card p-7 shadow-soft">
          <h2 className="text-lg font-semibold text-primary-dark">A solução</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Uma plataforma que registra estoque, validade, desperdício e consumo de água, gera alertas e relatórios
            e ajuda a tomar decisões mais sustentáveis.
          </p>
        </article>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-primary-dark">Como funciona</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {passos.map((passo, indice) => (
            <article key={passo.titulo} className="rounded-2xl bg-card p-5 shadow-soft">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-bold text-white">
                {indice + 1}
              </span>
              <h3 className="mt-3 font-semibold text-primary-dark">{passo.titulo}</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{passo.texto}</p>
            </article>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap gap-3">
        <Link to="/faq" className={classeBotaoPrimario}>
          Perguntas frequentes
        </Link>
        <Link to="/integrantes" className={classeBotaoContorno}>
          Integrantes
        </Link>
      </div>
    </div>
  );
}
