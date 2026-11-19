export const perguntasFrequentes = [
  {
    pergunta: "Como o status do estoque é calculado?",
    resposta: "A API calcula: VENCIDO se a validade passou, ALERTA se faltam até 3 dias e OK nos demais casos.",
  },
  {
    pergunta: "O que acontece ao registrar um desperdício?",
    resposta: "A quantidade é descontada automaticamente dos lotes em estoque, começando pelos que vencem primeiro.",
  },
  {
    pergunta: "Posso excluir um estabelecimento com dados?",
    resposta:
      "Não. A API retorna conflito (409) se houver alimentos, estoque, desperdícios ou consumos vinculados.",
  },
  {
    pergunta: "Em que formato devo informar as datas?",
    resposta: "No formato ISO, yyyy-MM-dd, por exemplo 2026-11-18.",
  },
  {
    pergunta: "O CNPJ pode se repetir?",
    resposta: "Não. Cada estabelecimento deve ter um CNPJ único.",
  },
];
