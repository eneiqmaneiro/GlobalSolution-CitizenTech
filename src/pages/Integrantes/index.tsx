import { FaGithub, FaLinkedin } from "react-icons/fa";
import { Link } from "react-router-dom";
import TituloPagina from "../../components/TituloPagina";
import { DadosIntegrantes } from "../../data/DadosIntegrantes";

function iniciais(nome: string): string {
  const partes = nome.split(" ").filter(Boolean);
  return (partes[0][0] + (partes[partes.length - 1][0] ?? "")).toUpperCase();
}

export default function Integrantes() {
  return (
    <div className="space-y-10">
      <TituloPagina titulo="Integrantes" subtitulo="Conheça a equipe do projeto EcoSmart." />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {DadosIntegrantes.map((pessoa) => (
          <article key={pessoa.id} className="flex flex-col items-center rounded-2xl bg-card p-6 text-center shadow-soft">
            {pessoa.foto ? (
              <img src={pessoa.foto} alt={`Foto de ${pessoa.nome}`} className="h-24 w-24 rounded-full object-cover" />
            ) : (
              <span className="flex h-24 w-24 items-center justify-center rounded-full bg-soft text-2xl font-bold text-primary">
                {iniciais(pessoa.nome)}
              </span>
            )}
            <h2 className="mt-4 font-semibold leading-snug text-primary-dark">{pessoa.nome}</h2>
            <p className="mt-1 text-xs text-muted-foreground">{pessoa.rm}</p>
            <span className="mt-2 rounded-full bg-soft px-3 py-1 text-[11px] font-semibold text-primary">
              {pessoa.funcao}
            </span>
            <Link to={`/integrantes/${pessoa.id}`} className="mt-3 text-xs font-semibold text-primary hover:underline">
              Ver perfil
            </Link>
            {(pessoa.github || pessoa.linkedin) && (
              <div className="mt-3 flex gap-3 text-xl text-primary-dark">
                {pessoa.github && (
                  <a href={pessoa.github} target="_blank" rel="noreferrer" aria-label={`GitHub de ${pessoa.nome}`} className="hover:text-primary">
                    <FaGithub />
                  </a>
                )}
                {pessoa.linkedin && (
                  <a href={pessoa.linkedin} target="_blank" rel="noreferrer" aria-label={`LinkedIn de ${pessoa.nome}`} className="hover:text-primary">
                    <FaLinkedin />
                  </a>
                )}
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
