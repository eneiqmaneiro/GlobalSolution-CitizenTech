import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaTrash } from "react-icons/fa";
import AvisoAcao from "../../components/AvisoAcao";
import Campo from "../../components/Campo";
import CartaoIndicador from "../../components/CartaoIndicador";
import GraficoColunas from "../../components/GraficoColunas";
import MensagemEstado from "../../components/MensagemEstado";
import TituloPagina from "../../components/TituloPagina";
import { useConsumos, useEstabelecimentos } from "../../hooks/useEcoSmart";
import { criarConsumo, excluirConsumo } from "../../services/ecoSmartService";
import type { ResultadoAcao } from "../../types/TipoEcoSmart";
import { classeBotaoPrimario, classeCabecalho, classeCampo, classeLinha, classeTabela, classeTd, classeTh } from "../../utils/estilos";
import { chaveMes, dataBR, diasNoMes, hojeISO, mesAnterior, mesCurto, mesRecente, nomeMesCompleto, numero, somarPor, textoVariacao, ultimos, variacaoPercentual } from "../../utils/formatar";

type FormConsumo = { codigoEstabelecimento: string; setor: string; litros: number; dataRegistro: string };

export default function Agua() {
  const estabelecimentos = useEstabelecimentos();
  const consumos = useConsumos();
  const [resultado, setResultado] = useState<ResultadoAcao | null>(null);
  const form = useForm<FormConsumo>({ defaultValues: { dataRegistro: hojeISO() } });

  const listaEstab = estabelecimentos.dados ?? [];
  const lista = consumos.dados ?? [];
  const nomeEstab = new Map(listaEstab.map((e) => [e.codigo, e.nome]));

  // Mês de referência: o mais recente com registros (ou o mês de hoje, se não houver nada)
  const porMes = somarPor(lista, (c) => chaveMes(c.dataRegistro), (c) => c.litros);
  const mesRef = mesRecente(lista.map((c) => c.dataRegistro));
  const totalMes = porMes[mesRef] ?? 0;
  const totalAnterior = porMes[mesAnterior(mesRef)] ?? 0;
  const variacao = variacaoPercentual(totalMes, totalAnterior);
  const mediaDiaria = totalMes / diasNoMes(mesRef);

  const colunas = Object.fromEntries(
    Object.entries(ultimos(Object.fromEntries(Object.entries(porMes).sort(([a], [b]) => a.localeCompare(b))), 6)).map(
      ([chave, valor]) => [mesCurto(chave), valor],
    ),
  );

  const recentes = [...lista].sort((a, b) => b.dataRegistro.localeCompare(a.dataRegistro) || b.codigo - a.codigo).slice(0, 10);

  async function registrar(dados: FormConsumo) {
    try {
      await criarConsumo({
        codigoEstabelecimento: Number(dados.codigoEstabelecimento),
        setor: dados.setor,
        litros: Number(dados.litros),
        dataRegistro: dados.dataRegistro,
      });
      setResultado({ tipo: "sucesso", texto: "Consumo registrado com sucesso." });
      form.reset({ dataRegistro: hojeISO(), codigoEstabelecimento: dados.codigoEstabelecimento });
      consumos.recarregar();
    } catch (e) {
      setResultado({ tipo: "erro", texto: e instanceof Error ? e.message : "Ocorreu um erro inesperado." });
    }
  }

  async function excluir(codigo: number) {
    if (!window.confirm("Excluir este registro de consumo?")) return;
    try {
      await excluirConsumo(codigo);
      setResultado({ tipo: "sucesso", texto: "Registro excluído." });
      consumos.recarregar();
    } catch (e) {
      setResultado({ tipo: "erro", texto: e instanceof Error ? e.message : "Ocorreu um erro inesperado." });
    }
  }

  return (
    <div className="space-y-8">
      <TituloPagina
        titulo="Monitoramento do consumo de água"
        subtitulo="Registre o consumo em litros por estabelecimento e acompanhe a evolução."
        endpoints={["Consumo de água"]}
      />

      <AvisoAcao resultado={resultado} />

      {consumos.erro ? (
        <MensagemEstado tipo="erro" texto={consumos.erro} />
      ) : (
        <>
          <section className="grid gap-5 sm:grid-cols-3">
            <CartaoIndicador titulo="Consumo no mês" valor={`${numero(totalMes)} L`} detalhe={`Registro em ${nomeMesCompleto(mesRef)}`} />
            <CartaoIndicador titulo="Média diária" valor={`${numero(mediaDiaria)} L`} cor="text-primary" />
            <CartaoIndicador
              titulo="Variação"
              valor={textoVariacao(variacao)}
              detalhe={`em relação a ${nomeMesCompleto(mesAnterior(mesRef))}`}
              cor={variacao !== null && variacao > 0 ? "text-perigo" : "text-primary"}
            />
          </section>

          <section className="grid gap-5 lg:grid-cols-[1.7fr_1fr] lg:items-start">
            <GraficoColunas titulo="Evolução mensal (litros)" dados={colunas} corBarra="bg-agua/80" />

            <form onSubmit={form.handleSubmit(registrar)} noValidate className="space-y-3 rounded-2xl bg-card p-6 shadow-soft">
              <h2 className="text-lg font-semibold text-primary-dark">Registrar consumo</h2>

              <Campo rotulo="Estabelecimento" erro={form.formState.errors.codigoEstabelecimento?.message}>
                <select className={classeCampo} {...form.register("codigoEstabelecimento", { required: "Escolha o estabelecimento." })}>
                  <option value="">Selecione...</option>
                  {listaEstab.map((e) => (
                    <option key={e.codigo} value={e.codigo}>{e.nome}</option>
                  ))}
                </select>
              </Campo>

              <Campo rotulo="Setor" erro={form.formState.errors.setor?.message}>
                <input placeholder="cozinha" className={classeCampo} {...form.register("setor", { required: "Informe o setor." })} />
              </Campo>

              <Campo rotulo="Litros consumidos" erro={form.formState.errors.litros?.message}>
                <input
                  type="number"
                  step="0.1"
                  placeholder="25,5"
                  className={classeCampo}
                  {...form.register("litros", { required: "Informe os litros.", min: { value: 0.1, message: "Deve ser maior que zero." }, valueAsNumber: true })}
                />
              </Campo>

              <Campo rotulo="Data de registro (yyyy-MM-dd)" erro={form.formState.errors.dataRegistro?.message}>
                <input
                  placeholder="2026-11-18"
                  className={classeCampo}
                  {...form.register("dataRegistro", {
                    required: "Informe a data.",
                    pattern: { value: /^\d{4}-\d{2}-\d{2}$/, message: "Use o formato yyyy-MM-dd." },
                  })}
                />
              </Campo>

              <button type="submit" disabled={form.formState.isSubmitting} className={`${classeBotaoPrimario} w-full`}>
                Registrar
              </button>
            </form>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-primary-dark">Registros recentes</h2>
            <div className="overflow-x-auto rounded-2xl bg-card shadow-soft">
              <table className={classeTabela}>
                <thead className={classeCabecalho}>
                  <tr>
                    {["Código", "Estabelecimento", "Setor", "Litros", "Data de registro", ""].map((t, i) => (
                      <th key={i} className={classeTh}>{t}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {consumos.carregando ? (
                    <tr><td colSpan={6} className={`${classeTd} text-muted-foreground`}>Carregando...</td></tr>
                  ) : recentes.length === 0 ? (
                    <tr><td colSpan={6} className={`${classeTd} text-muted-foreground`}>Nenhum registro.</td></tr>
                  ) : (
                    recentes.map((c) => (
                      <tr key={c.codigo} className={classeLinha}>
                        <td className={classeTd}>{c.codigo}</td>
                        <td className={classeTd}>{nomeEstab.get(c.codigoEstabelecimento) ?? c.codigoEstabelecimento}</td>
                        <td className={classeTd}>{c.setor}</td>
                        <td className={classeTd}>{numero(c.litros)}</td>
                        <td className={classeTd}>{dataBR(c.dataRegistro)}</td>
                        <td className={classeTd}>
                          <button type="button" onClick={() => excluir(c.codigo)} aria-label="Excluir registro" className="text-muted-foreground transition hover:text-perigo">
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
