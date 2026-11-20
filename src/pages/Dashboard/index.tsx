import { useEffect, useState } from "react";
import CartaoIndicador from "../../components/CartaoIndicador";
import GraficoBarras from "../../components/GraficoBarras";
import MensagemEstado from "../../components/MensagemEstado";
import SeloStatus from "../../components/SeloStatus";
import TituloPagina from "../../components/TituloPagina";
import { useDadosGerais } from "../../hooks/useEcoSmart";
import type { StatusEstoque } from "../../types/TipoEcoSmart";
import { classeBotaoPrimario, classeCabecalho, classeChip, classeLinha, classeTabela, classeTd, classeTh } from "../../utils/estilos";
import { chaveMes, dataBR, numero, porMesOrdenado, somarPor } from "../../utils/formatar";

const filtros: { rotulo: string; valor: "" | StatusEstoque }[] = [
  { rotulo: "Todos", valor: "" },
  { rotulo: "ALERTA", valor: "ALERTA" },
  { rotulo: "VENCIDO", valor: "VENCIDO" },
  { rotulo: "OK", valor: "OK" },
];

function agora(): string {
  const d = new Date();
  return `${d.toLocaleDateString("pt-BR")} ${d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;
}

export default function Dashboard() {
  const { estabelecimentos, alimentos, estoques, desperdicios, consumos, carregando, erro, recarregar } =
    useDadosGerais();
  const [codigoEstab, setCodigoEstab] = useState("");
  const [filtroStatus, setFiltroStatus] = useState<"" | StatusEstoque>("");
  const [atualizadoEm, setAtualizadoEm] = useState("");

  useEffect(() => {
    if (!carregando && !erro) setAtualizadoEm(agora());
  }, [carregando, erro]);

  // Filtro por estabelecimento: alimentos e consumos ligam direto; estoque e desperdício ligam pelo alimento
  const alimentosFiltrados = alimentos.filter((a) => !codigoEstab || a.codigoEstabelecimento === Number(codigoEstab));
  const codigosAlimentos = new Set(alimentosFiltrados.map((a) => a.codigo));
  const estoquesF = estoques.filter((e) => codigosAlimentos.has(e.codigoAlimento));
  const desperdiciosF = desperdicios.filter((d) => codigosAlimentos.has(d.codigoAlimento));
  const consumosF = consumos.filter((c) => !codigoEstab || c.codigoEstabelecimento === Number(codigoEstab));

  const alimentoPorCodigo = new Map(alimentos.map((a) => [a.codigo, a]));
  const estabPorCodigo = new Map(estabelecimentos.map((e) => [e.codigo, e.nome]));

  const emAlerta = estoquesF.filter((e) => e.status === "ALERTA").length;
  const vencidos = estoquesF.filter((e) => e.status === "VENCIDO").length;
  const totalDesperdicio = desperdiciosF.reduce((soma, d) => soma + Number(d.quantidade), 0);
  const totalAgua = consumosF.reduce((soma, c) => soma + Number(c.litros), 0);

  const desperdicioMes = porMesOrdenado(somarPor(desperdiciosF, (d) => chaveMes(d.dataRegistro), (d) => d.quantidade));
  const desperdicioMotivo = somarPor(desperdiciosF, (d) => d.motivo, (d) => d.quantidade);
  const aguaMes = porMesOrdenado(somarPor(consumosF, (c) => chaveMes(c.dataRegistro), (c) => c.litros));
  const aguaSetor = somarPor(consumosF, (c) => c.setor, (c) => c.litros);

  const estoqueTabela = estoquesF
    .filter((e) => !filtroStatus || e.status === filtroStatus)
    .sort((a, b) => a.diasParaVencer - b.diasParaVencer);
  const ultimosDesperdicios = [...desperdiciosF].sort((a, b) => b.dataRegistro.localeCompare(a.dataRegistro)).slice(0, 5);
  const ultimosConsumos = [...consumosF].sort((a, b) => b.dataRegistro.localeCompare(a.dataRegistro)).slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <TituloPagina titulo="Dashboard" subtitulo="Indicadores de estoque, desperdício e consumo de água, calculados a partir da API.">
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs text-muted-foreground shadow-soft">
              Estabelecimento:
              <select
                value={codigoEstab}
                onChange={(e) => setCodigoEstab(e.target.value)}
                className="bg-transparent font-semibold text-primary-dark focus:outline-none"
              >
                <option value="">Todos</option>
                {estabelecimentos.map((e) => (
                  <option key={e.codigo} value={e.codigo}>
                    {e.nome}
                  </option>
                ))}
              </select>
            </label>
            <button type="button" onClick={recarregar} disabled={carregando} className={`${classeBotaoPrimario} px-6 py-2 text-xs`}>
              Atualizar
            </button>
          </div>
        </TituloPagina>
        {atualizadoEm && <p className="mt-1 text-[11px] text-muted-foreground">Última atualização: {atualizadoEm}</p>}
      </div>

      {erro && <MensagemEstado tipo="erro" texto={erro} />}
      {carregando && estoques.length === 0 && !erro && <MensagemEstado tipo="carregando" />}

      {!erro && (
        <>
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <CartaoIndicador titulo="Lotes em estoque" valor={estoquesF.length} detalhe="registros em estoques" />
            <CartaoIndicador titulo="Em ALERTA" valor={emAlerta} detalhe="vencem em até 3 dias" cor="text-aviso" />
            <CartaoIndicador titulo="VENCIDOS" valor={vencidos} detalhe="retirar do estoque" cor="text-perigo" />
            <CartaoIndicador titulo="Desperdício total" valor={`${numero(totalDesperdicio)} kg`} detalhe="soma de desperdícios" cor="text-primary" />
            <CartaoIndicador titulo="Água consumida" valor={`${numero(totalAgua, 0)} L`} detalhe="soma de consumos de água" cor="text-agua" />
          </section>

          <section className="grid gap-5 lg:grid-cols-2">
            <GraficoBarras titulo="Desperdício por mês (kg)" dados={desperdicioMes} unidade="kg" corBarra="bg-primary" />
            <GraficoBarras titulo="Desperdício por motivo (kg)" dados={desperdicioMotivo} unidade="kg" corBarra="bg-ambar" />
            <GraficoBarras titulo="Consumo de água por mês (litros)" dados={aguaMes} unidade="L" corBarra="bg-agua" />
            <GraficoBarras titulo="Consumo de água por setor (litros)" dados={aguaSetor} unidade="L" corBarra="bg-agua/80" />
          </section>

          <section className="space-y-4">
            <div className="flex flex-wrap items-center gap-4">
              <h2 className="text-xl font-bold text-primary-dark">Estoque e validade</h2>
              <div className="flex flex-wrap gap-2">
                {filtros.map((f) => (
                  <button key={f.rotulo} type="button" onClick={() => setFiltroStatus(f.valor)} className={classeChip(filtroStatus === f.valor)}>
                    {f.rotulo}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl bg-card shadow-soft">
              <table className={classeTabela}>
                <thead className={classeCabecalho}>
                  <tr>
                    {["Alimento", "Quantidade", "Entrada", "Validade", "Dias", "Status"].map((t) => (
                      <th key={t} className={classeTh}>{t}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {estoqueTabela.length === 0 ? (
                    <tr><td colSpan={6} className={`${classeTd} text-muted-foreground`}>Nenhum lote encontrado.</td></tr>
                  ) : (
                    estoqueTabela.map((e) => {
                      const alimento = alimentoPorCodigo.get(e.codigoAlimento);
                      return (
                        <tr key={e.codigo} className={classeLinha}>
                          <td className={classeTd}>{alimento?.nome ?? `Alimento ${e.codigoAlimento}`}</td>
                          <td className={classeTd}>{numero(e.quantidade)} {alimento?.unidadeMedida ?? ""}</td>
                          <td className={classeTd}>{dataBR(e.dataEntrada)}</td>
                          <td className={classeTd}>{dataBR(e.dataValidade)}</td>
                          <td className={classeTd}>{e.diasParaVencer}</td>
                          <td className={classeTd}><SeloStatus status={e.status} /></td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-primary-dark">Últimos desperdícios</h2>
              <div className="overflow-x-auto rounded-2xl bg-card shadow-soft">
                <table className={classeTabela}>
                  <thead className={classeCabecalho}>
                    <tr>{["Alimento", "Qtd", "Motivo", "Data"].map((t) => <th key={t} className={classeTh}>{t}</th>)}</tr>
                  </thead>
                  <tbody>
                    {ultimosDesperdicios.length === 0 ? (
                      <tr><td colSpan={4} className={`${classeTd} text-muted-foreground`}>Sem registros.</td></tr>
                    ) : (
                      ultimosDesperdicios.map((d) => (
                        <tr key={d.codigo} className={classeLinha}>
                          <td className={classeTd}>{alimentoPorCodigo.get(d.codigoAlimento)?.nome ?? d.codigoAlimento}</td>
                          <td className={classeTd}>{numero(d.quantidade)}</td>
                          <td className={classeTd}>{d.motivo}</td>
                          <td className={classeTd}>{dataBR(d.dataRegistro)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-bold text-primary-dark">Últimos consumos de água</h2>
              <div className="overflow-x-auto rounded-2xl bg-card shadow-soft">
                <table className={classeTabela}>
                  <thead className={classeCabecalho}>
                    <tr>{["Estabelecimento", "Setor", "Litros", "Data"].map((t) => <th key={t} className={classeTh}>{t}</th>)}</tr>
                  </thead>
                  <tbody>
                    {ultimosConsumos.length === 0 ? (
                      <tr><td colSpan={4} className={`${classeTd} text-muted-foreground`}>Sem registros.</td></tr>
                    ) : (
                      ultimosConsumos.map((c) => (
                        <tr key={c.codigo} className={classeLinha}>
                          <td className={classeTd}>{estabPorCodigo.get(c.codigoEstabelecimento) ?? c.codigoEstabelecimento}</td>
                          <td className={classeTd}>{c.setor}</td>
                          <td className={classeTd}>{numero(c.litros)}</td>
                          <td className={classeTd}>{dataBR(c.dataRegistro)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
