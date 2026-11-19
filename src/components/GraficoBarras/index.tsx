import { numero } from "../../utils/formatar";

type Props = {
  titulo: string;
  dados: Record<string, number>;
  unidade: string;
  corBarra?: string; // classe Tailwind de fundo, ex.: "bg-primary"
  trilho?: boolean; // true: barra sobre uma trilha cinza, valor na ponta direita
};

// Gráfico de barras horizontais feito só com HTML e Tailwind (sem biblioteca)
export default function GraficoBarras({ titulo, dados, unidade, corBarra = "bg-primary", trilho = true }: Props) {
  const itens = Object.entries(dados);
  const maximo = itens.length > 0 ? Math.max(...itens.map(([, valor]) => valor)) : 0;

  return (
    <div className="rounded-2xl bg-card p-6 shadow-soft">
      <h3 className="mb-4 text-base font-semibold text-primary-dark">{titulo}</h3>

      {itens.length === 0 ? (
        <p className="text-sm text-muted-foreground">Sem dados para mostrar.</p>
      ) : (
        <div className="space-y-3">
          {itens.map(([nome, valor]) => {
            const proporcao = maximo > 0 ? Math.max(0.03, valor / maximo) : 0.03;
            return (
              <div key={nome} className="flex items-center gap-3 text-xs">
                <span
                  className={`shrink-0 font-medium ${trilho ? "w-24 text-gray-700" : "w-28 font-semibold text-primary-dark"}`}
                  title={nome}
                >
                  {nome}
                </span>

                {trilho ? (
                  <>
                    <div className="h-3 flex-1 rounded-full bg-gray-100">
                      <div
                        className={`h-3 rounded-full ${corBarra}`}
                        style={{ width: `${Math.round(proporcao * 100)}%` }}
                      />
                    </div>
                    <span className="w-16 shrink-0 text-right font-semibold text-primary-dark">
                      {numero(valor)} {unidade}
                    </span>
                  </>
                ) : (
                  <div className="flex flex-1 items-center gap-3">
                    <div
                      className={`h-3 rounded-full ${corBarra}`}
                      style={{ width: `${Math.round(proporcao * 75)}%` }}
                    />
                    <span className="shrink-0 font-semibold text-primary-dark">
                      {numero(valor)} {unidade}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
