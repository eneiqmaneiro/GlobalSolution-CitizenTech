import { useCallback, useEffect, useState } from "react";
import { ErroApi } from "../services/api";
import type { EstadoRequisicao } from "../types/TipoApi";

const estadoInicial = { dados: null, carregando: true, erro: null, status: null };

function lerErro(e: unknown) {
  return {
    erro: e instanceof Error ? e.message : "Ocorreu um erro inesperado.",
    status: e instanceof ErroApi ? e.status : null,
  };
}

// Hook genérico: recebe uma função de serviço que devolve uma lista (GET) e controla
// os estados de carregando / erro / dados. Use sempre funções declaradas fora do componente.
export function useLista<T>(carregar: () => Promise<T[]>) {
  const [estado, setEstado] = useState<EstadoRequisicao<T[]>>(estadoInicial);
  const [versao, setVersao] = useState(0);

  // Chamado após cadastrar ou excluir para buscar a lista atualizada
  const recarregar = useCallback(() => setVersao((v) => v + 1), []);

  useEffect(() => {
    let ativo = true;
    carregar()
      .then((dados) => {
        if (ativo) setEstado({ dados, carregando: false, erro: null, status: null });
      })
      .catch((e: unknown) => {
        if (ativo) setEstado({ dados: null, carregando: false, ...lerErro(e) });
      });
    return () => {
      ativo = false;
    };
  }, [carregar, versao]);

  return { ...estado, recarregar };
}
