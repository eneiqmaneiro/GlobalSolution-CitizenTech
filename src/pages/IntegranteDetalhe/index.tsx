import { FaGithub, FaLinkedin } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import { DadosIntegrantes } from "../../data/DadosIntegrantes";
import { classeBotaoContorno } from "../../utils/estilos";

// Rota com parâmetro: /integrantes/:id
export default function IntegranteDetalhe() {
  const { id } = useParams();
  const pessoa = DadosIntegrantes.find((p) => String(p.id) === id);

  if (!pessoa) {
    return (
      <div className="space-y-6 text-center">
        <h1 className="text-3xl font-bold text-primary-dark">Integrante não encontrado</h1>
        <p className="text-muted-foreground">Não existe integrante com o código “{id}”.</p>
        <Link to="/integrantes" className={classeBotaoContorno}>
          Voltar para a equipe
        </Link>
      </div>
    );
  }

  const iniciais = pessoa.nome
    .split(" ")
    .filter(Boolean)
    .map((parte) => parte[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <article className="flex flex-col items-center rounded-2xl bg-card p-8 text-center shadow-soft">
        {pessoa.foto ? (
          <img src={pessoa.foto} alt={`Foto de ${pessoa.nome}`} className="h-36 w-36 rounded-full object-cover" />
        ) : (
          <span className="flex h-36 w-36 items-center justify-center rounded-full bg-soft text-4xl font-bold text-primary">
            {iniciais}
          </span>
        )}
        <h1 className="mt-5 text-2xl font-bold text-primary-dark">{pessoa.nome}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{pessoa.rm}</p>
        <span className="mt-3 rounded-full bg-soft px-4 py-1 text-xs font-semibold text-primary">{pessoa.funcao}</span>

        {(pessoa.github || pessoa.linkedin) && (
          <div className="mt-5 flex gap-4 text-2xl text-primary-dark">
            {pessoa.github && (
              <a href={pessoa.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="hover:text-primary">
                <FaGithub />
              </a>
            )}
            {pessoa.linkedin && (
              <a href={pessoa.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="hover:text-primary">
                <FaLinkedin />
              </a>
            )}
          </div>
        )}
      </article>

      <div className="text-center">
        <Link to="/integrantes" className={classeBotaoContorno}>
          Voltar para a equipe
        </Link>
      </div>
    </div>
  );
}
