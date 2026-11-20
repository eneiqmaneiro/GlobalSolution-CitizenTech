import CartaoIndicador from "../../components/CartaoIndicador";
import GraficoBarras from "../../components/GraficoBarras";
import GraficoColunas from "../../components/GraficoColunas";
import MensagemEstado from "../../components/MensagemEstado";
import TituloPagina from "../../components/TituloPagina";
import { useDadosGerais } from "../../hooks/useEcoSmart";
import { classeBotaoContorno, classeBotaoPrimario, classeCabecalho, classeLinha, classeTabela, classeTd, classeTh } from "../../utils/estilos";
import { capitalizar, chaveMes, dataBR, mesAnterior, mesAno, mesCurto, mesRecente, numero, somarPor, textoVariacao, ultimos, variacaoPercentual } from "../../utils/formatar";

export default function Relatorios() {
  const { alimentos, estoques, desperdicios, consumos, carregando, erro } = useDadosGerais();
  const alimentoPorCodigo = new Map(alimentos.map((a) => [a.codigo, a]));

  const desperdicioPorMes = somarPor(desperdicios, (d) => chaveMes(d.dataRegistro), (d) => d.quantidade);
  const aguaPorMes = somarPor(consumos, (c) => chaveMes(c.dataRegistro), (c) => c.litros);

  const mesDesperdicio = mesRecente(desperdicios.map((d) => d.dataRegistro));
  const mesAgua = mesRecente(consumos.map((c) => c.dataRegistro));
  const totalDesperdicio = desperdicioPorMes[mesDesperdicio] ?? 0;
  const variacao = variacaoPercentual(totalDesperdicio, desperdicioPorMes[mesAnterior(mesDesperdicio)] ?? 0);
  const vencidos = estoques.filter((e) => e.status === "VENCIDO").length;

  const colunas = Object.fromEntries(
    Object.entries(ultimos(Object.fromEntries(Object.entries(desperdicioPorMes).sort(([a], [b]) => a.localeCompare(b))), 6)).map(
      ([chave, valor]) => [mesCurto(chave), valor],
    ),
  );

  const porMotivo = Object.fromEntries(
    Object.entries(somarPor(desperdicios, (d) => d.motivo, (d) => d.quantidade))
      .sort(([, a], [, b]) => b - a)
      .map(([motivo, valor]) => [capitalizar(motivo), valor]),
  );

  const registros = [...desperdicios].sort((a, b) => b.dataRegistro.localeCompare(a.dataRegistro));

  // Exporta a tabela para CSV (separador ";" e BOM para abrir certo no Excel em português)
  function exportarCsv() {
    const linhas = [
      ["Alimento", "Quantidade", "Unidade", "Motivo", "Data de registro"],
      ...registros.map((d) => {
        const alimento = alimentoPorCodigo.get(d.codigoAlimento);
        return [alimento?.nome ?? String(d.codigoAlimento), String(d.quantidade).replace(".", ","), alimento?.unidadeMedida ?? "", d.motivo, dataBR(d.dataRegistro)];
      }),
    ];
    const texto = linhas.map((l) => l.map((c) => `"${c.replace(/"/g, '""')}"`).join(";")).join("\r\n");
    const arquivo = new Blob(["﻿" + texto], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(arquivo);
    const link = document.createElement("a");
    link.href = url;
    link.download = "relatorio-desperdicio.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-8">
      <TituloPagina
        titulo="Relatórios de sustentabilidade"
        subtitulo="Indicadores de desperdício e consumo de água."
        endpoints={["Desperdicios", "Consumos-agua", "Estabelecimentos"]}
      />

      {erro && <MensagemEstado tipo="erro" texto={erro} />}
      {carregando && desperdicios.length === 0 && !erro && <MensagemEstado tipo="carregando" />}

      {!erro && (
        <>
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <CartaoIndicador titulo="Desperdício total" valor={`${numero(totalDesperdicio)} kg`} detalhe={mesAno(mesDesperdicio)} cor="text-primary" />
            <CartaoIndicador
              titulo="Redução vs. mês anterior"
              valor={textoVariacao(variacao)}
              detalhe="em kg desperdiçados"
              cor={variacao !== null && variacao > 0 ? "text-perigo" : "text-primary"}
            />
            <CartaoIndicador titulo="Água consumida" valor={`${numero(aguaPorMes[mesAgua] ?? 0)} L`} detalhe={mesAno(mesAgua)} />
            <CartaoIndicador titulo="Lotes vencidos" valor={vencidos} detalhe="status VENCIDO em estoques" />
          </section>

          <section className="grid gap-5 lg:grid-cols-2 lg:items-start">
            <GraficoColunas titulo="Desperdício por mês (kg)" dados={colunas} />
            <GraficoBarras titulo="Desperdício por motivo" dados={porMotivo} unidade="kg" trilho={false} />
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-primary-dark">Registros de desperdício</h2>
            <div className="overflow-x-auto rounded-2xl bg-card shadow-soft">
              <table className={classeTabela}>
                <thead className={classeCabecalho}>
                  <tr>
                    {["Alimento", "Quantidade", "Motivo", "Data de registro"].map((t) => (
                      <th key={t} className={classeTh}>{t}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {registros.length === 0 ? (
                    <tr><td colSpan={4} className={`${classeTd} text-muted-foreground`}>Nenhum registro.</td></tr>
                  ) : (
                    registros.map((d) => {
                      const alimento = alimentoPorCodigo.get(d.codigoAlimento);
                      return (
                        <tr key={d.codigo} className={classeLinha}>
                          <td className={classeTd}>{alimento?.nome ?? d.codigoAlimento}</td>
                          <td className={classeTd}>{numero(d.quantidade)} {alimento?.unidadeMedida ?? ""}</td>
                          <td className={classeTd}>{capitalizar(d.motivo)}</td>
                          <td className={classeTd}>{dataBR(d.dataRegistro)}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex flex-wrap gap-3 pt-2 print:hidden">
              <button type="button" onClick={() => window.print()} className={classeBotaoPrimario}>
                Exportar PDF
              </button>
              <button type="button" onClick={exportarCsv} className={classeBotaoContorno}>
                Exportar CSV
              </button>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
