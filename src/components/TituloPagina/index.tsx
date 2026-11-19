import type { ReactNode } from "react";

type Props = {
  titulo: string;
  subtitulo?: string;
  endpoints?: string[]; // recursos da API usados na página (aparecem como etiquetas escuras)
  children?: ReactNode; // área à direita (ex.: filtro e botão Atualizar)
};

export default function TituloPagina({ titulo, subtitulo, endpoints, children }: Props) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold text-primary-dark sm:text-4xl">{titulo}</h1>
        {subtitulo && <p className="mt-2 max-w-3xl text-muted-foreground">{subtitulo}</p>}
        {endpoints && (
          <div className="mt-3 flex flex-wrap gap-2">
            {endpoints.map((endpoint) => (
              <span key={endpoint} className="rounded-md bg-primary-dark px-3 py-1 text-xs font-medium text-white">
                {endpoint}
              </span>
            ))}
          </div>
        )}
      </div>
      {children}
    </div>
  );
}
