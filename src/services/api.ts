// Camada única de comunicação com a API (fetch nativo, sem bibliotecas externas)
// Se a variável VITE_API_URL não estiver definida (ex.: deploy sem .env), usa a API publicada no Render
const API_PADRAO = "https://citizentech-jtvb.onrender.com";
// Só aceita a variável se for uma URL completa (https://...). Valor vazio ou digitado errado na Vercel
// faria o fetch chamar o próprio site e receber HTML, então nesses casos usa a API do Render.
const URL_ENV = ((import.meta.env.VITE_API_URL as string | undefined) ?? "").trim().replace(/^["']|["']$/g, "");
const API_URL = (/^https?:\/\//.test(URL_ENV) ? URL_ENV : API_PADRAO).replace(/\/$/, "");

const MSG_API_ACORDANDO =
  "A API está iniciando (o servidor gratuito do Render demora cerca de 1 minuto para acordar). Aguarde e clique em Atualizar.";
const TENTATIVAS = 6; // quantas vezes tenta de novo enquanto a API acorda
const ESPERA_MS = 8000; // espera entre as tentativas

const esperar = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export class ErroApi extends Error {
  status: number;

  constructor(mensagem: string, status: number) {
    super(mensagem);
    this.name = "ErroApi";
    this.status = status;
  }
}

// A API Java devolve { erro, detalhes } (404/500) ou { campo: mensagem } (400 de validação)
function extrairMensagem(corpo: unknown): string {
  if (typeof corpo !== "object" || corpo === null) return "";
  const objeto = corpo as Record<string, unknown>;
  if (typeof objeto.detalhes === "string") return objeto.detalhes;
  return Object.entries(objeto)
    .filter((par): par is [string, string] => typeof par[1] === "string")
    .map(([campo, mensagem]) => `${campo}: ${mensagem}`)
    .join("; ");
}

async function requisicao<T>(caminho: string, opcoes: RequestInit = {}): Promise<T> {
  if (!API_URL) {
    throw new ErroApi("URL da API não configurada (variável VITE_API_URL).", 0);
  }

  let resposta: Response;
  try {
    resposta = await fetch(`${API_URL}${caminho}`, {
      ...opcoes,
      headers: { "Content-Type": "application/json", ...opcoes.headers },
    });
  } catch {
    throw new ErroApi("Não foi possível conectar ao servidor. Tente novamente.", 0);
  }

  if (!resposta.ok) {
    let detalhe = "";
    try {
      detalhe = extrairMensagem(await resposta.json());
    } catch {
      // corpo vazio ou não-JSON: usa a mensagem padrão
    }
    if (resposta.status === 503) throw new ErroApi(MSG_API_ACORDANDO, 503);
    throw new ErroApi(detalhe || `Erro ${resposta.status} ao acessar a API.`, resposta.status);
  }

  // 204 No Content ou corpo vazio (comum em DELETE/PUT)
  const texto = await resposta.text();
  if (!texto) return undefined as T;
  try {
    return JSON.parse(texto) as T;
  } catch {
    // Resposta em HTML em vez de JSON: é a página de "servidor iniciando" do Render
    throw new ErroApi(MSG_API_ACORDANDO, 503);
  }
}

export const api = {
  // GET tenta de novo sozinho enquanto a API do Render está acordando
  get: async <T>(caminho: string): Promise<T> => {
    for (let tentativa = 1; ; tentativa++) {
      try {
        return await requisicao<T>(caminho);
      } catch (e) {
        const acordando = e instanceof ErroApi && e.status === 503;
        if (!acordando || tentativa >= TENTATIVAS) throw e;
        await esperar(ESPERA_MS);
      }
    }
  },
  post: <T, B>(caminho: string, corpo: B) =>
    requisicao<T>(caminho, { method: "POST", body: JSON.stringify(corpo) }),
  put: <T, B>(caminho: string, corpo: B) =>
    requisicao<T>(caminho, { method: "PUT", body: JSON.stringify(corpo) }),
  delete: <T>(caminho: string) => requisicao<T>(caminho, { method: "DELETE" }),
};
