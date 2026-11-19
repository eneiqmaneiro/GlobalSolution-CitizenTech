import type { StatusEstoque } from "../../types/TipoEcoSmart";

const cores: Record<StatusEstoque, string> = {
  OK: "bg-soft text-primary",
  ALERTA: "bg-amber-100 text-aviso",
  VENCIDO: "bg-red-100 text-perigo",
};

export default function SeloStatus({ status }: { status: StatusEstoque }) {
  return (
    <span className={`rounded-full px-3 py-1 text-[11px] font-bold ${cores[status] ?? cores.OK}`}>
      {status}
    </span>
  );
}
