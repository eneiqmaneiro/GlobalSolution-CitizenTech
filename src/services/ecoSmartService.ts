import { api } from "./api";
import type {
  AlimentoEntrada,
  ConsumoAguaEntrada,
  DesperdicioEntrada,
  EstoqueEntrada,
  TipoAlimento,
  TipoConsumoAgua,
  TipoDesperdicio,
  TipoEstabelecimento,
  TipoEstoque,
} from "../types/TipoEcoSmart";

// Endpoints da API Java (um Controller para cada recurso)
const ESTABELECIMENTOS = "/estabelecimentos";
const ALIMENTOS = "/alimentos";
const ESTOQUES = "/estoques";
const DESPERDICIOS = "/desperdicios";
const CONSUMOS = "/consumos-agua";

// GET /estabelecimentos
export const listarEstabelecimentos = () => api.get<TipoEstabelecimento[]>(ESTABELECIMENTOS);

// GET /alimentos  |  POST /alimentos
export const listarAlimentos = () => api.get<TipoAlimento[]>(ALIMENTOS);
export const criarAlimento = (dados: AlimentoEntrada) =>
  api.post<TipoAlimento, AlimentoEntrada>(ALIMENTOS, dados);

// GET /estoques  |  POST /estoques  |  DELETE /estoques/{codigo}
export const listarEstoques = () => api.get<TipoEstoque[]>(ESTOQUES);
export const criarEstoque = (dados: EstoqueEntrada) =>
  api.post<TipoEstoque, EstoqueEntrada>(ESTOQUES, dados);
export const excluirEstoque = (codigo: number) => api.delete<void>(`${ESTOQUES}/${codigo}`);

// GET /desperdicios  |  POST /desperdicios (a API dá baixa no estoque, do lote que vence primeiro)
export const listarDesperdicios = () => api.get<TipoDesperdicio[]>(DESPERDICIOS);
export const criarDesperdicio = (dados: DesperdicioEntrada) =>
  api.post<TipoDesperdicio, DesperdicioEntrada>(DESPERDICIOS, dados);

// GET /consumos-agua  |  POST /consumos-agua  |  DELETE /consumos-agua/{codigo}
export const listarConsumos = () => api.get<TipoConsumoAgua[]>(CONSUMOS);
export const criarConsumo = (dados: ConsumoAguaEntrada) =>
  api.post<TipoConsumoAgua, ConsumoAguaEntrada>(CONSUMOS, dados);
export const excluirConsumo = (codigo: number) => api.delete<void>(`${CONSUMOS}/${codigo}`);
