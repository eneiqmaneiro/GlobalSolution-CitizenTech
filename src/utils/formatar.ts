// 1234.5 -> "1.234,5"
export function numero(valor: number, casas = 1): string {
  return Number(valor).toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: casas });
}

// "2026-11-18" -> "18/11/2026" (sem usar Date, para não ter problema de fuso)
export function dataBR(iso: string | null | undefined): string {
  if (!iso) return "-";
  const [ano, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${ano}`;
}

// Data de hoje no formato da API (yyyy-MM-dd), usando o fuso do computador
export function hojeISO(): string {
  const d = new Date();
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const dia = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mes}-${dia}`;
}

// "2026-11-18" -> "2026-11"
export function chaveMes(iso: string): string {
  return iso ? iso.slice(0, 7) : "";
}

// "2026-11" -> "Nov/2026"
export function nomeMes(chave: string): string {
  const nomes = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  const [ano, mes] = chave.split("-");
  return `${nomes[Number(mes) - 1]}/${ano}`;
}

// Soma valores agrupando por uma chave. Ex.: somarPor(lista, d => d.motivo, d => d.quantidade)
export function somarPor<T>(
  lista: T[],
  pegaChave: (item: T) => string,
  pegaValor: (item: T) => number,
): Record<string, number> {
  const grupos: Record<string, number> = {};
  for (const item of lista) {
    const chave = pegaChave(item);
    grupos[chave] = (grupos[chave] ?? 0) + Number(pegaValor(item));
  }
  return grupos;
}

// Ordena as chaves "2026-09", "2026-10"... e troca por "Set/2026", "Out/2026"...
export function porMesOrdenado(grupos: Record<string, number>): Record<string, number> {
  const resultado: Record<string, number> = {};
  Object.keys(grupos)
    .sort()
    .forEach((chave) => {
      resultado[nomeMes(chave)] = grupos[chave];
    });
  return resultado;
}

// "2026-11" -> "novembro"
export function nomeMesCompleto(chave: string): string {
  const nomes = [
    "janeiro", "fevereiro", "março", "abril", "maio", "junho",
    "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
  ];
  return nomes[Number(chave.split("-")[1]) - 1] ?? "";
}

// "2026-11" -> "novembro/2026"
export function mesAno(chave: string): string {
  return `${nomeMesCompleto(chave)}/${chave.split("-")[0]}`;
}

// "2026-11" -> "2026-10" (mês anterior)
export function mesAnterior(chave: string): string {
  const [ano, mes] = chave.split("-").map(Number);
  return mes === 1 ? `${ano - 1}-12` : `${ano}-${String(mes - 1).padStart(2, "0")}`;
}

// Quantidade de dias de um mês ("2026-11" -> 30)
export function diasNoMes(chave: string): number {
  const [ano, mes] = chave.split("-").map(Number);
  return new Date(ano, mes, 0).getDate();
}

// Mês mais recente entre as datas (yyyy-MM-dd); se não houver datas, o mês de hoje
export function mesRecente(datas: string[]): string {
  const chaves = datas.filter(Boolean).map(chaveMes).sort();
  return chaves.length > 0 ? chaves[chaves.length - 1] : chaveMes(hojeISO());
}

// Variação percentual: (atual - anterior) / anterior. Devolve null se não der para calcular.
export function variacaoPercentual(atual: number, anterior: number): number | null {
  if (anterior <= 0) return null;
  return ((atual - anterior) / anterior) * 100;
}

// -15 -> "-15%" | 8.8 -> "+8,8%"
export function textoVariacao(valor: number | null): string {
  if (valor === null) return "—";
  return `${valor > 0 ? "+" : ""}${numero(valor)}%`;
}

// "vencimento" -> "Vencimento"
export function capitalizar(texto: string): string {
  return texto ? texto.charAt(0).toUpperCase() + texto.slice(1) : texto;
}

// Pega só os últimos N meses de um objeto já ordenado por mês
export function ultimos<T>(grupos: Record<string, T>, quantidade: number): Record<string, T> {
  return Object.fromEntries(Object.entries(grupos).slice(-quantidade));
}

// "2026-11-18" -> "Nov" (usado nas colunas dos gráficos)
export function mesCurto(chave: string): string {
  return nomeMes(chave).split("/")[0];
}
