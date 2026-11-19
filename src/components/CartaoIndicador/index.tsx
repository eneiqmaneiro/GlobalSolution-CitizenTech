type Props = {
  titulo: string;
  valor: string | number;
  detalhe?: string;
  cor?: string; // classe Tailwind de cor do texto
};

export default function CartaoIndicador({ titulo, valor, detalhe, cor = "text-primary-dark" }: Props) {
  return (
    <div className="rounded-2xl bg-card p-5 shadow-soft">
      <p className="text-xs font-medium text-muted-foreground">{titulo}</p>
      <p className={`mt-1 text-3xl font-bold ${cor}`}>{valor}</p>
      {detalhe && <p className="mt-1 text-xs text-muted-foreground">{detalhe}</p>}
    </div>
  );
}
