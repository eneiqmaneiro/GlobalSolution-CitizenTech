export interface TipoIntegrantes {
  id: number;
  nome: string;
  rm: string;
  funcao: string;
  foto?: string; // sem foto, a tela mostra as iniciais
  github?: string;
  linkedin?: string;
}
