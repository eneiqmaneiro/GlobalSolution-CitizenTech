import { Link } from "react-router-dom";
import Header from "../../components/Header";
import { classeBotaoPrimario } from "../../utils/estilos";

export default function Erro() {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <h1 className="text-5xl font-bold text-primary-dark">404</h1>
        <p className="mt-3 text-muted-foreground">Página não encontrada.</p>
        <Link to="/" className={`${classeBotaoPrimario} mt-8`}>
          Voltar ao início
        </Link>
      </div>
    </div>
  );
}
