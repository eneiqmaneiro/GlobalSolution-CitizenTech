import { Link } from "react-router-dom";
import { FaBell, FaBoxOpen, FaChartBar, FaTint } from "react-icons/fa";
import type { IconType } from "react-icons";
import SeloStatus from "../../components/SeloStatus";
import { useAlimentos, useEstoques } from "../../hooks/useEcoSmart";
import { classeBotaoContorno, classeBotaoPrimario } from "../../utils/estilos";

const recursos: { titulo: string; texto: string; Icone: IconType }[] = [
  {
    titulo: "Gestão de estoque",
    texto: "Cadastre alimentos e lotes com data de entrada e validade.",
    Icone: FaBoxOpen,
  },
  {
    titulo: "Alertas inteligentes",
    texto: "Status calculado automaticamente: OK, ALERTA (até 3 dias) ou VENCIDO.",
    Icone: FaBell,
  },
  {
    titulo: "Consumo de água",
    texto: "Registre o consumo em litros por estabelecimento e acompanhe a evolução.",
    Icone: FaTint,
  },
  {
    titulo: "Relatórios",
    texto: "Desperdício em kg e consumo de água para apoiar decisões sustentáveis.",
    Icone: FaChartBar,
  },
];

function textoDias(dias: number): string {
  if (dias < 0) return `Venceu há ${Math.abs(dias)} dia${Math.abs(dias) === 1 ? "" : "s"}`;
  if (dias === 0) return "Vence hoje";
  return `${dias} dia${dias === 1 ? "" : "s"}`;
}

export default function Home() {
  const estoques = useEstoques();
  const alimentos = useAlimentos();

  const nomes = new Map((alimentos.dados ?? []).map((a) => [a.codigo, a.nome]));
  // Os 3 lotes mais urgentes aparecem no cartão "Resumo de hoje"
  const resumo = [...(estoques.dados ?? [])].sort((a, b) => a.diasParaVencer - b.diasParaVencer).slice(0, 3);

  return (
    <div className="space-y-20">
      <section className="grid items-center gap-10 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <h1 className="text-4xl font-bold leading-tight text-primary-dark sm:text-5xl lg:text-6xl lg:leading-[1.25]">
            Transforme dados em ações que reduzem o desperdício.
          </h1>
          <p className="mt-6 max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-base">
            A EcoSmart ajuda restaurantes, mercados e padarias a controlar estoque, validade e consumo de água,
            com alertas inteligentes e relatórios de sustentabilidade.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/dashboard" className={classeBotaoPrimario}>
              Acessar dashboard
            </Link>
            <Link to="/sobre" className={classeBotaoContorno}>
              Conheça o projeto
            </Link>
          </div>
        </div>

        <aside className="rounded-2xl bg-card p-5 shadow-soft lg:ml-auto lg:w-full lg:max-w-sm">
          <h2 className="text-sm font-semibold text-primary-dark">Resumo de hoje</h2>
          {estoques.carregando ? (
            <p className="mt-4 text-xs text-muted-foreground">Carregando...</p>
          ) : estoques.erro ? (
            <p className="mt-4 text-xs text-perigo">Não foi possível carregar o estoque.</p>
          ) : resumo.length === 0 ? (
            <p className="mt-4 text-xs text-muted-foreground">Nenhum lote em estoque.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {resumo.map((lote) => (
                <li key={lote.codigo} className="flex items-center justify-between gap-3 text-xs">
                  <span className="font-medium">{nomes.get(lote.codigoAlimento) ?? `Alimento ${lote.codigoAlimento}`}</span>
                  <span className="flex items-center gap-2 text-muted-foreground">
                    {textoDias(lote.diasParaVencer)}
                    <SeloStatus status={lote.status} />
                  </span>
                </li>
              ))}
            </ul>
          )}
        </aside>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-primary-dark">O que a EcoSmart oferece</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {recursos.map(({ titulo, texto, Icone }) => (
            <article key={titulo} className="rounded-2xl bg-card p-5 shadow-soft">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-soft text-primary">
                <Icone aria-hidden />
              </span>
              <h3 className="mt-3 font-semibold text-primary-dark">{titulo}</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{texto}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="flex flex-wrap items-center justify-between gap-6 rounded-2xl bg-primary px-8 py-10 sm:px-12">
        <h2 className="max-w-md text-2xl font-bold text-white">
          Pronto para reduzir o desperdício do seu estabelecimento?
        </h2>
        <Link
          to="/login"
          className="rounded-full bg-white px-8 py-3 text-sm font-semibold text-primary transition hover:bg-soft"
        >
          Fazer login
        </Link>
      </section>
    </div>
  );
}
