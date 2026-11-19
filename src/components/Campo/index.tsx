import type { ReactNode } from "react";

type Props = {
  rotulo: string;
  erro?: string;
  children: ReactNode;
};

// Rótulo + campo + mensagem de erro de validação
export default function Campo({ rotulo, erro, children }: Props) {
  return (
    <label className="block text-xs font-medium text-gray-900">
      {rotulo}
      {children}
      {erro && <span className="mt-1 block text-xs font-normal text-perigo">{erro}</span>}
    </label>
  );
}
