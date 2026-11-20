import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import Campo from "../../components/Campo";
import TituloPagina from "../../components/TituloPagina";
import { classeBotaoPrimario, classeCampo } from "../../utils/estilos";

type DadosContato = { nome: string; email: string; mensagem: string };

export default function Contato() {
  const [enviado, setEnviado] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DadosContato>();

  // Formulário só visual (a API não tem endpoint de contato)
  function enviar() {
    setEnviado(true);
    reset();
  }

  return (
    <div className="space-y-10">
      <TituloPagina titulo="Contato" subtitulo="Fale com a equipe EcoSmart." />

      <div className="grid gap-6 lg:grid-cols-[1.7fr_1fr] lg:items-start">
        <form onSubmit={handleSubmit(enviar)} noValidate className="space-y-3 rounded-2xl bg-card p-6 shadow-soft">
          <Campo rotulo="Nome" erro={errors.nome?.message}>
            <input
              placeholder="Seu nome"
              className={classeCampo}
              {...register("nome", { required: "Informe o nome.", minLength: { value: 3, message: "Mínimo de 3 letras." } })}
            />
          </Campo>

          <Campo rotulo="E-mail" erro={errors.email?.message}>
            <input
              type="email"
              placeholder="voce@email.com"
              className={classeCampo}
              {...register("email", {
                required: "Informe o e-mail.",
                pattern: { value: /^\S+@\S+\.\S+$/, message: "E-mail inválido." },
              })}
            />
          </Campo>

          <Campo rotulo="Mensagem" erro={errors.mensagem?.message}>
            <textarea
              rows={4}
              placeholder="Escreva sua mensagem..."
              className={classeCampo}
              {...register("mensagem", {
                required: "Escreva a mensagem.",
                minLength: { value: 10, message: "Mínimo de 10 caracteres." },
              })}
            />
          </Campo>

          <button type="submit" className={`${classeBotaoPrimario} w-full`}>
            Enviar mensagem
          </button>

          {enviado && (
            <p role="status" className="rounded-xl bg-soft px-4 py-3 text-sm font-medium text-primary-dark">
              Mensagem enviada! Responderemos em breve.
            </p>
          )}
        </form>

        <aside className="rounded-2xl bg-card p-6 shadow-soft">
          <h2 className="text-lg font-semibold text-primary-dark">Informações</h2>

          <div className="mt-4 flex items-center gap-3 font-semibold text-primary-dark">
            <FaEnvelope className="text-2xl" aria-hidden /> Email
          </div>
          <a href="mailto:rm569336@fiap.com.br" className="mt-2 block text-sm text-primary hover:underline">
            rm569336@fiap.com.br
          </a>

          <div className="mt-5 flex items-center gap-3 font-semibold text-primary-dark">
            <FaMapMarkerAlt className="text-2xl" aria-hidden /> Onde estamos
          </div>
          <p className="mt-2 text-sm text-muted-foreground">São Paulo, SP</p>
        </aside>
      </div>
    </div>
  );
}
