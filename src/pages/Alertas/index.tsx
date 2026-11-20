import { useState } from "react";
import { Link } from "react-router-dom";
import AvisoAcao from "../../components/AvisoAcao";
import MensagemEstado from "../../components/MensagemEstado";
import SeloStatus from "../../components/SeloStatus";
import TituloPagina from "../../components/TituloPagina";
import { useAlimentos, useEstoques } from "../../hooks/useEcoSmart";
import { criarDesperdicio } from "../../services/ecoSmartService";
import type { ResultadoAcao, TipoEstoque } from "../../types/TipoEcoSmart";
import { classeBotaoContorno, classeBotaoPrimario } from "../../utils/estilos";
import { dataBR, hojeISO, numero } from "../../utils/formatar";

function descricao(lote: TipoEstoque, unidade: string): string {
  const data = dataBR(lote.dataValidade);
  const qtd = `${numero(lote.quantidade)} ${unidade}`.trim();
  if (lote.diasParaVencer < 0) return `Venceu em ${data} · ${qtd}`;
  if (lote.diasParaVencer === 0) return `Vence hoje (${data}) · ${qtd}`;
  const dias = lote.diasParaVencer;
  return `Vence em ${dias} dia${dias === 1 ? "" : "s"} (${data}) · ${qtd}`;
}

function dica(lote: TipoEstoque): string {
  if (lote.status === "VENCIDO") return "Retire do estoque e registre o desperdício.";
  if (lote.diasParaVencer === 0) return "Use hoje ou venda com desconto.";
  if (lote.diasParaVencer <= 2) return "Priorize nas próximas vendas.";
  return "Reorganize a exposição.";
}

export default function Alertas() {
  const estoques = useEstoques();
  const alimentos = useAlimentos();
  const [resultado, setResultado] = useState<ResultadoAcao | null>(null);
  const [registrando, setRegistrando] = useState<number | null>(null);

  const alimentoPorCodigo = new Map((alimentos.dados ?? []).map((a) => [a.codigo, a]));
  const alertas = (estoques.dados ?? [])
    .filter((e) => e.status !== "OK")
    .sort((a, b) => a.diasParaVencer - b.diasParaVencer);

  // A API dá baixa no estoque (lote que vence primeiro) ao registrar o desperdício
  async function registrarDesperdicio(lote: TipoEstoque) {
    setRegistrando(lote.codigo);
    try {
      await criarDesperdicio({
        codigoAlimento: lote.codigoAlimento,
        quantidade: lote.quantidade,
        dataRegistro: hojeISO(),
        motivo: "vencimento",
      });
      setResultado({ tipo: "sucesso", texto: "Desperdício registrado e estoque atualizado." });
      estoques.recarregar();
    } catch (e) {
      setResultado({ tipo: "erro", texto: e instanceof Error ? e.message : "Ocorreu um erro inesperado." });
    } finally {
      setRegistrando(null);
    }
  }

  return (
    <div className="space-y-8">
      <TituloPagina
        titulo="Alertas inteligentes"
        subtitulo="Lotes com status ALERTA (vencem em até 3 dias) ou VENCIDO."
        endpoints={["Estoques", "Desperdicios"]}
      />

      <AvisoAcao resultado={resultado} />

      {estoques.carregando ? (
        <MensagemEstado tipo="carregando" />
      ) : estoques.erro ? (
        <MensagemEstado tipo="erro" texto={estoques.erro} />
      ) : alertas.length === 0 ? (
        <MensagemEstado tipo="vazio" texto="Nenhum lote em alerta. Tudo certo por aqui!" />
      ) : (
        <ul className="space-y-4">
          {alertas.map((lote) => {
            const alimento = alimentoPorCodigo.get(lote.codigoAlimento);
            const vencido = lote.status === "VENCIDO";
            return (
              <li key={lote.codigo} className="flex flex-wrap items-center gap-4 rounded-2xl bg-card p-5 shadow-soft">
                <span className={`h-11 w-11 shrink-0 rounded-full ${vencido ? "bg-red-100" : "bg-amber-100"}`} aria-hidden />
                <div className="min-w-0 flex-1">
                  <h2 className="font-semibold text-primary-dark">{alimento?.nome ?? `Alimento ${lote.codigoAlimento}`}</h2>
                  <p className="text-xs text-muted-foreground">{descricao(lote, alimento?.unidadeMedida ?? "")}</p>
                  <p className="mt-1 text-xs">{dica(lote)}</p>
                </div>
                <SeloStatus status={lote.status} />
                {vencido ? (
                  <button
                    type="button"
                    onClick={() => registrarDesperdicio(lote)}
                    disabled={registrando === lote.codigo}
                    className={`${classeBotaoPrimario} px-5 py-2 text-xs`}
                  >
                    Registrar desperdício
                  </button>
                ) : (
                  <Link to="/estoque" className={`${classeBotaoContorno} px-5 py-2 text-xs`}>
                    Ver lote
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
