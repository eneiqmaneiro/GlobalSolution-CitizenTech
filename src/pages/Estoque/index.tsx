import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaTrash } from "react-icons/fa";
import AvisoAcao from "../../components/AvisoAcao";
import Campo from "../../components/Campo";
import MensagemEstado from "../../components/MensagemEstado";
import SeloStatus from "../../components/SeloStatus";
import TituloPagina from "../../components/TituloPagina";
import { useAlimentos, useEstabelecimentos, useEstoques } from "../../hooks/useEcoSmart";
import { criarAlimento, criarEstoque, excluirEstoque } from "../../services/ecoSmartService";
import type { ResultadoAcao, StatusEstoque } from "../../types/TipoEcoSmart";
import { classeBotaoPrimario, classeCabecalho, classeCampo, classeChip, classeLinha, classeTabela, classeTd, classeTh } from "../../utils/estilos";
import { dataBR, hojeISO, numero } from "../../utils/formatar";

type FormLote = { codigoEstabelecimento: string; codigoAlimento: string; quantidade: number; dataEntrada: string; dataValidade: string };
type FormAlimento = { nome: string; categoria: string; unidadeMedida: string; codigoEstabelecimento: string };

const filtros: { rotulo: string; valor: "" | StatusEstoque }[] = [
  { rotulo: "Todos", valor: "" },
  { rotulo: "OK", valor: "OK" },
  { rotulo: "ALERTA", valor: "ALERTA" },
  { rotulo: "VENCIDO", valor: "VENCIDO" },
];

const regraData = {
  required: "Informe a data.",
  pattern: { value: /^\d{4}-\d{2}-\d{2}$/, message: "Use o formato yyyy-MM-dd." },
};

function mensagem(e: unknown): string {
  return e instanceof Error ? e.message : "Ocorreu um erro inesperado.";
}

export default function Estoque() {
  const estabelecimentos = useEstabelecimentos();
  const alimentos = useAlimentos();
  const estoques = useEstoques();
  const [filtro, setFiltro] = useState<"" | StatusEstoque>("");
  const [resultado, setResultado] = useState<ResultadoAcao | null>(null);

  const lote = useForm<FormLote>({ defaultValues: { dataEntrada: hojeISO() } });
  const alimento = useForm<FormAlimento>({ defaultValues: { unidadeMedida: "kg" } });

  const listaEstab = estabelecimentos.dados ?? [];
  const listaAlimentos = alimentos.dados ?? [];
  const alimentoPorCodigo = new Map(listaAlimentos.map((a) => [a.codigo, a]));

  // O select de alimento só mostra os alimentos do estabelecimento escolhido
  const estabEscolhido = lote.watch("codigoEstabelecimento");
  const alimentosDoEstab = listaAlimentos.filter((a) => String(a.codigoEstabelecimento) === estabEscolhido);

  const lista = (estoques.dados ?? [])
    .filter((e) => !filtro || e.status === filtro)
    .sort((a, b) => a.diasParaVencer - b.diasParaVencer);

  async function salvarLote(dados: FormLote) {
    try {
      await criarEstoque({
        codigoAlimento: Number(dados.codigoAlimento),
        quantidade: Number(dados.quantidade),
        dataEntrada: dados.dataEntrada,
        dataValidade: dados.dataValidade,
      });
      setResultado({ tipo: "sucesso", texto: "Lote salvo com sucesso." });
      lote.reset({ dataEntrada: hojeISO(), codigoEstabelecimento: dados.codigoEstabelecimento });
      estoques.recarregar();
    } catch (e) {
      setResultado({ tipo: "erro", texto: mensagem(e) });
    }
  }

  async function salvarAlimento(dados: FormAlimento) {
    try {
      await criarAlimento({
        nome: dados.nome,
        categoria: dados.categoria,
        unidadeMedida: dados.unidadeMedida,
        codigoEstabelecimento: Number(dados.codigoEstabelecimento),
      });
      setResultado({ tipo: "sucesso", texto: "Alimento cadastrado com sucesso." });
      alimento.reset({ unidadeMedida: "kg" });
      alimentos.recarregar();
    } catch (e) {
      setResultado({ tipo: "erro", texto: mensagem(e) });
    }
  }

  async function excluir(codigo: number) {
    if (!window.confirm("Excluir este lote do estoque?")) return;
    try {
      await excluirEstoque(codigo);
      setResultado({ tipo: "sucesso", texto: "Lote excluído." });
      estoques.recarregar();
    } catch (e) {
      setResultado({ tipo: "erro", texto: mensagem(e) });
    }
  }

  return (
    <div className="space-y-8">
      <TituloPagina
        titulo="Gestão de alimentos e estoque"
        subtitulo="Cadastre alimentos, registre lotes e acompanhe a validade. O status é calculado pela API."
        endpoints={["Alimentos", "Estoques"]}
      />

      <AvisoAcao resultado={resultado} />

      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr] lg:items-start">
        <div className="space-y-6">
          <form onSubmit={lote.handleSubmit(salvarLote)} noValidate className="space-y-3 rounded-2xl bg-card p-6 shadow-soft">
            <h2 className="text-lg font-semibold text-primary-dark">Novo lote em estoque</h2>

            <Campo rotulo="Estabelecimento" erro={lote.formState.errors.codigoEstabelecimento?.message}>
              <select className={classeCampo} {...lote.register("codigoEstabelecimento", { required: "Escolha o estabelecimento." })}>
                <option value="">Selecione...</option>
                {listaEstab.map((e) => (
                  <option key={e.codigo} value={e.codigo}>{e.nome}</option>
                ))}
              </select>
            </Campo>

            <Campo rotulo="Alimento" erro={lote.formState.errors.codigoAlimento?.message}>
              <select className={classeCampo} {...lote.register("codigoAlimento", { required: "Escolha o alimento." })}>
                <option value="">{estabEscolhido ? "Selecione..." : "Escolha o estabelecimento primeiro"}</option>
                {alimentosDoEstab.map((a) => (
                  <option key={a.codigo} value={a.codigo}>{a.nome} ({a.unidadeMedida})</option>
                ))}
              </select>
            </Campo>

            <Campo rotulo="Quantidade" erro={lote.formState.errors.quantidade?.message}>
              <input
                type="number"
                step="0.01"
                placeholder="12"
                className={classeCampo}
                {...lote.register("quantidade", { required: "Informe a quantidade.", min: { value: 0.01, message: "Deve ser maior que zero." }, valueAsNumber: true })}
              />
            </Campo>

            <Campo rotulo="Data de entrada (yyyy-MM-dd)" erro={lote.formState.errors.dataEntrada?.message}>
              <input placeholder="2026-11-10" className={classeCampo} {...lote.register("dataEntrada", regraData)} />
            </Campo>

            <Campo rotulo="Data de validade (yyyy-MM-dd)" erro={lote.formState.errors.dataValidade?.message}>
              <input placeholder="2026-11-20" className={classeCampo} {...lote.register("dataValidade", regraData)} />
            </Campo>

            <button type="submit" disabled={lote.formState.isSubmitting} className={`${classeBotaoPrimario} w-full`}>
              Salvar lote
            </button>
          </form>

          <form onSubmit={alimento.handleSubmit(salvarAlimento)} noValidate className="space-y-3 rounded-2xl bg-card p-6 shadow-soft">
            <h2 className="text-lg font-semibold text-primary-dark">Novo alimento</h2>

            <Campo rotulo="Nome" erro={alimento.formState.errors.nome?.message}>
              <input placeholder="Leite integral" className={classeCampo} {...alimento.register("nome", { required: "Informe o nome." })} />
            </Campo>
            <Campo rotulo="Categoria" erro={alimento.formState.errors.categoria?.message}>
              <input placeholder="Laticínios" className={classeCampo} {...alimento.register("categoria", { required: "Informe a categoria." })} />
            </Campo>
            <Campo rotulo="Unidade de medida">
              <select className={classeCampo} {...alimento.register("unidadeMedida")}>
                <option value="kg">kg</option>
                <option value="L">L</option>
                <option value="un">un</option>
              </select>
            </Campo>
            <Campo rotulo="Estabelecimento" erro={alimento.formState.errors.codigoEstabelecimento?.message}>
              <select className={classeCampo} {...alimento.register("codigoEstabelecimento", { required: "Escolha o estabelecimento." })}>
                <option value="">Selecione...</option>
                {listaEstab.map((e) => (
                  <option key={e.codigo} value={e.codigo}>{e.nome}</option>
                ))}
              </select>
            </Campo>

            <button type="submit" disabled={alimento.formState.isSubmitting} className={`${classeBotaoPrimario} w-full`}>
              Cadastrar alimento
            </button>
          </form>
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {filtros.map((f) => (
              <button key={f.rotulo} type="button" onClick={() => setFiltro(f.valor)} className={classeChip(filtro === f.valor)}>
                {f.rotulo}
              </button>
            ))}
          </div>

          {estoques.carregando ? (
            <MensagemEstado tipo="carregando" />
          ) : estoques.erro ? (
            <MensagemEstado tipo="erro" texto={estoques.erro} />
          ) : (
            <div className="overflow-x-auto rounded-2xl bg-card shadow-soft">
              <table className={classeTabela}>
                <thead className={classeCabecalho}>
                  <tr>
                    {["Alimento", "Qtd", "Entrada", "Validade", "Status", ""].map((t, i) => (
                      <th key={i} className={classeTh}>{t}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {lista.length === 0 ? (
                    <tr><td colSpan={6} className={`${classeTd} text-muted-foreground`}>Nenhum lote encontrado.</td></tr>
                  ) : (
                    lista.map((e) => (
                      <tr key={e.codigo} className={classeLinha}>
                        <td className={classeTd}>{alimentoPorCodigo.get(e.codigoAlimento)?.nome ?? `Alimento ${e.codigoAlimento}`}</td>
                        <td className={classeTd}>{numero(e.quantidade)}</td>
                        <td className={classeTd}>{dataBR(e.dataEntrada)}</td>
                        <td className={classeTd}>{dataBR(e.dataValidade)}</td>
                        <td className={classeTd}><SeloStatus status={e.status} /></td>
                        <td className={classeTd}>
                          <button type="button" onClick={() => excluir(e.codigo)} aria-label="Excluir lote" className="text-muted-foreground transition hover:text-perigo">
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
