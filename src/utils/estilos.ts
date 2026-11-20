// Classes Tailwind reaproveitadas em formulários, botões e filtros
export const classeCampo =
  "mt-1 w-full rounded-xl border border-border bg-campo px-4 py-3 text-sm placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/40";

export const classeBotaoPrimario =
  "inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60";

export const classeBotaoContorno =
  "inline-flex items-center justify-center gap-2 rounded-full border border-primary bg-white px-8 py-3 text-sm font-semibold text-primary transition hover:bg-soft";

// Botão de filtro (Todos / OK / ALERTA / VENCIDO)
export const classeChip = (ativo: boolean) =>
  `cursor-pointer rounded-full border px-4 py-1.5 text-xs font-semibold transition ${
    ativo
      ? "border-primary bg-primary text-primary-foreground"
      : "border-border bg-white text-primary-dark hover:bg-soft"
  }`;

// Tabelas
export const classeTabela = "w-full text-left text-sm";
export const classeCabecalho = "bg-soft text-primary-dark";
export const classeTh = "px-5 py-3 text-xs font-semibold";
export const classeTd = "px-5 py-3";
export const classeLinha = "border-b border-border/60 last:border-0";
