# EcoSmart — Front-end

> Global Solution 2 - 2026 · CitizenTech · Front-End Design Engineering

## Objetivo

A **EcoSmart** ajuda restaurantes, mercados e padarias a **reduzir o desperdício de alimentos e o consumo de água**.
O front-end (SPA) consome a API REST Java do projeto para controlar estoque e validade, registrar desperdícios e
consumo de água, exibir alertas inteligentes (OK, ALERTA ou VENCIDO) e gerar relatórios de sustentabilidade.

## Tecnologias

React 19 · TypeScript · Vite · Tailwind CSS v4 · React Router · React Hook Form · React Icons · Fetch API.

## Links

| | |
|---|---|
| GitHub | https://github.com/eneiqmaneiro/GlobalSolution-CitizenTech |
| Vercel (front-end) | `COLE_AQUI_A_URL_DA_VERCEL` |
| API Java (Render) | https://citizentech-jtvb.onrender.com |
| Vídeo no YouTube (até 3 min) | https://youtu.be/Nzi3WKylvS4 |

> O Render gratuito "dorme" quando fica parado; a primeira chamada pode levar cerca de 1 minuto.

## Integrantes

| Nome | RM | Função |
|---|---|---|
| Henrique Tavares Coutinho | 569336 | Back-end Java e Front-end |
| Ludmylla Lins Nogueira | 572999 | Business Model e IA |
| Pedro Nunes Ferreira | 573066 | Python |
| Murilo Gomes Santiago Carnaval | 573067 | Banco de dados |

## Como executar

Requisitos: Node.js 20 ou superior.

```bash
npm install
npm run dev      # abre em http://localhost:5173
```

Outros comandos: `npm run build` (gera a pasta `dist`), `npm run preview`, `npm run lint`.

A URL da API fica no arquivo `.env` (se ele não existir, o projeto usa a API do Render automaticamente):

```
VITE_API_URL=https://citizentech-jtvb.onrender.com
```

## Páginas e rotas

| Rota | Tela | Endpoints da API |
|---|---|---|
| `/` | Início | GET /estoques, /alimentos |
| `/integrantes` | Integrantes | — |
| `/integrantes/:id` | Perfil do integrante (**rota com parâmetro**) | — |
| `/sobre` | Sobre | — |
| `/faq` | Perguntas frequentes | — |
| `/contato` | Contato (formulário validado) | — |
| `/login` | Login (formulário validado, sem endpoint na API) | — |
| `/dashboard` | Dashboard com filtro por estabelecimento | GET nas 5 listas |
| `/estoque` | Alimentos e estoque | GET/POST /alimentos, GET/POST/DELETE /estoques |
| `/agua` | Consumo de água | GET/POST/DELETE /consumos-agua |
| `/alertas` | Alertas inteligentes | GET /estoques, POST /desperdicios |
| `/relatorios` | Relatórios (exporta CSV e PDF) | GET /desperdicios, /consumos-agua, /estoques |

Dashboard, alertas e relatórios são calculados no front a partir dos GETs.

## Estrutura de pastas

```
src/
  components/  Header, CartaoIndicador, GraficoBarras, GraficoColunas, SeloStatus, Campo, AvisoAcao, MensagemEstado...
  pages/       uma pasta por tela
  hooks/       useLista, useEcoSmart (carregando / erro / dados)
  services/    api.ts (Fetch) e ecoSmartService.ts (uma função por endpoint)
  types/       tipos TypeScript espelhando os DTOs da API
  utils/       formatação de datas/números e classes Tailwind reutilizáveis
  data/        integrantes e perguntas do FAQ
```

## Deploy na Vercel

O `vercel.json` já tem o rewrite para SPA (as rotas funcionam ao abrir o link direto). Importe o repositório na
Vercel (preset **Vite**) e, se quiser, defina `VITE_API_URL` nas variáveis de ambiente.

## Contato

rm569336@fiap.com.br
