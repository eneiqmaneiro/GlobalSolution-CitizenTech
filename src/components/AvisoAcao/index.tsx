import type { ResultadoAcao } from "../../types/TipoEcoSmart";

// Mensagem de sucesso/erro depois de cadastrar, excluir etc.
export default function AvisoAcao({ resultado }: { resultado: ResultadoAcao | null }) {
  if (!resultado) return null;
  const cor =
    resultado.tipo === "sucesso" ? "bg-soft text-primary-dark" : "bg-red-100 text-perigo";
  return (
    <p role={resultado.tipo === "erro" ? "alert" : "status"} className={`rounded-xl px-4 py-3 text-sm font-medium ${cor}`}>
      {resultado.texto}
    </p>
  );
}
