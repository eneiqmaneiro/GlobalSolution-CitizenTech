// Tipos que espelham os ResponseDto e RequestDto da API Java (EcoSmart)

export interface TipoEstabelecimento {
  codigo: number;
  nome: string;
  cnpj: string;
  tipo: string;
  cidade: string;
  email: string;
  dataCadastro: string; // yyyy-MM-dd
}

export interface TipoAlimento {
  codigo: number;
  nome: string;
  categoria: string;
  unidadeMedida: string;
  codigoEstabelecimento: number;
}

// Status calculado pela API (Estoque.calcularStatus)
export type StatusEstoque = "OK" | "ALERTA" | "VENCIDO";

export interface TipoEstoque {
  codigo: number;
  codigoAlimento: number;
  quantidade: number;
  dataEntrada: string;
  dataValidade: string;
  diasParaVencer: number;
  status: StatusEstoque;
}

export interface TipoDesperdicio {
  codigo: number;
  codigoAlimento: number;
  quantidade: number;
  dataRegistro: string;
  motivo: string;
}

export interface TipoConsumoAgua {
  codigo: number;
  codigoEstabelecimento: number;
  litros: number;
  dataRegistro: string;
  setor: string;
}

// Dados enviados em POST: o código (e o status do estoque) são gerados pela API
export type AlimentoEntrada = Omit<TipoAlimento, "codigo">;
export type EstoqueEntrada = Omit<TipoEstoque, "codigo" | "diasParaVencer" | "status">;
export type DesperdicioEntrada = Omit<TipoDesperdicio, "codigo">;
export type ConsumoAguaEntrada = Omit<TipoConsumoAgua, "codigo">;

// Resultado de uma ação (cadastrar, excluir...) mostrado em uma mensagem na tela
export type ResultadoAcao =
  | { tipo: "sucesso"; texto: string }
  | { tipo: "erro"; texto: string };
