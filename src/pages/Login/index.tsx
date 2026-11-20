import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import Campo from "../../components/Campo";
import { classeBotaoPrimario, classeCampo } from "../../utils/estilos";

type DadosLogin = { email: string; senha: string };

export default function Login() {
  const navegar = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<DadosLogin>();

  // A API ainda não tem autenticação: o login é só visual (guarda o e-mail no navegador)
  function entrar(dados: DadosLogin) {
    try {
      localStorage.setItem("ecosmart:usuario", dados.email);
    } catch {
      // navegador sem localStorage: segue mesmo assim
    }
    navegar("/dashboard");
  }

  return (
    <div className="mx-auto max-w-md pt-6">
      <form
        onSubmit={handleSubmit(entrar)}
        noValidate
        className="space-y-4 rounded-2xl bg-card p-8 shadow-soft"
      >
        <h1 className="text-2xl font-bold text-primary-dark">Entrar na EcoSmart</h1>
        <p className="text-sm text-muted-foreground">Acesse com o e-mail do seu estabelecimento.</p>

        <Campo rotulo="E-mail" erro={errors.email?.message}>
          <input
            type="email"
            placeholder="nome@estabelecimento.com.br"
            className={classeCampo}
            {...register("email", {
              required: "Informe o e-mail.",
              pattern: { value: /^\S+@\S+\.\S+$/, message: "E-mail inválido." },
            })}
          />
        </Campo>

        <Campo rotulo="Senha" erro={errors.senha?.message}>
          <input
            type="password"
            placeholder="••••••••"
            className={classeCampo}
            {...register("senha", {
              required: "Informe a senha.",
              minLength: { value: 6, message: "A senha deve ter ao menos 6 caracteres." },
            })}
          />
        </Campo>

        <button type="submit" disabled={isSubmitting} className={`${classeBotaoPrimario} w-full py-4`}>
          Entrar
        </button>

        <p className="text-center text-xs text-primary">
          <Link to="/contato" className="hover:underline">
            Ainda não tem conta? Cadastre seu estabelecimento
          </Link>
        </p>
      </form>
    </div>
  );
}
