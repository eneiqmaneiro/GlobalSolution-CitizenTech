import { numero } from "../../utils/formatar";

type Props = {
  titulo: string;
  dados: Record<string, number>; // rótulo -> valor (ex.: { Jun: 820, Jul: 760 })
  corBarra?: string; // classe Tailwind de fundo
};

const ALTURA_MAXIMA = 130; // px da maior coluna

// Gráfico de colunas verticais feito só com HTML e Tailwind (sem biblioteca)
export default function GraficoColunas({ titulo, dados, corBarra = "bg-primary" }: Props) {
  const itens = Object.entries(dados);
  const maximo = itens.length > 0 ? Math.max(...itens.map(([, valor]) => valor)) : 0;

  return (
    <div className="rounded-2xl bg-card p-6 shadow-soft">
      <h3 className="mb-4 text-base font-semibold text-primary-dark">{titulo}</h3>

      {itens.length === 0 ? (
        <p className="text-sm text-muted-foreground">Sem dados para mostrar.</p>
      ) : (
        <div className="flex items-end gap-3 overflow-x-auto pb-1">
          {itens.map(([rotulo, valor]) => {
            const altura = maximo > 0 ? Math.max(8, Math.round((valor / maximo) * ALTURA_MAXIMA)) : 8;
            return (
              <div key={rotulo} className="flex w-10 shrink-0 flex-col items-center gap-1">
                <span className="text-[11px] text-muted-foreground">{numero(valor)}</span>
                <div className={`w-full rounded-md ${corBarra}`} style={{ height: `${altura}px` }} />
                <span className="text-[11px] text-muted-foreground">{rotulo}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
