import { useLista } from "./useLista";
import {
  listarAlimentos,
  listarConsumos,
  listarDesperdicios,
  listarEstabelecimentos,
  listarEstoques,
} from "../services/ecoSmartService";

export const useEstabelecimentos = () => useLista(listarEstabelecimentos);
export const useAlimentos = () => useLista(listarAlimentos);
export const useEstoques = () => useLista(listarEstoques);
export const useDesperdicios = () => useLista(listarDesperdicios);
export const useConsumos = () => useLista(listarConsumos);

// Junta as 5 listas (usado no Dashboard e nos Relatórios)
export function useDadosGerais() {
  const estabelecimentos = useEstabelecimentos();
  const alimentos = useAlimentos();
  const estoques = useEstoques();
  const desperdicios = useDesperdicios();
  const consumos = useConsumos();

  const todos = [estabelecimentos, alimentos, estoques, desperdicios, consumos];

  const recarregar = () => todos.forEach((item) => item.recarregar());

  return {
    estabelecimentos: estabelecimentos.dados ?? [],
    alimentos: alimentos.dados ?? [],
    estoques: estoques.dados ?? [],
    desperdicios: desperdicios.dados ?? [],
    consumos: consumos.dados ?? [],
    carregando: todos.some((item) => item.carregando),
    erro: todos.find((item) => item.erro)?.erro ?? null,
    recarregar,
  };
}
