import { useState } from "react";
import { FaBars } from "react-icons/fa";
import { FaX } from "react-icons/fa6";
import { Link, NavLink } from "react-router-dom";
import Logo from "../../assets/logo.svg";

const linksPrincipais = [
  { label: "Início", path: "/" },
  { label: "Dashboard", path: "/dashboard" },
  { label: "Estoque", path: "/estoque" },
  { label: "Água", path: "/agua" },
  { label: "Alertas", path: "/alertas" },
  { label: "Relatórios", path: "/relatorios" },
  { label: "Sobre", path: "/sobre" },
  { label: "Contato", path: "/contato" },
];

// O link da página atual fica verde
const classeLink = ({ isActive }: { isActive: boolean }) =>
  `cursor-pointer transition-colors hover:text-primary ${isActive ? "text-primary" : "text-gray-900"}`;

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between bg-background-secondary px-4 py-4 font-poppins font-semibold shadow-sm print:hidden sm:px-6 lg:px-8 xl:px-16">
      <Link to="/" className="flex items-center gap-3">
        <img src={Logo} alt="Logo EcoSmart" className="h-10 w-10" />
        <span className="text-2xl font-bold text-primary-dark">EcoSmart</span>
      </Link>

      <nav className="hidden items-center gap-6 text-sm xl:flex">
        {linksPrincipais.map((link) => (
          <NavLink key={link.path} to={link.path} end className={classeLink}>
            {link.label}
          </NavLink>
        ))}
        <Link
          to="/login"
          className="rounded-full bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
        >
          Entrar
        </Link>
      </nav>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="xl:hidden"
        aria-label={open ? "Fechar menu" : "Abrir menu"}
        aria-expanded={open}
      >
        {open ? <FaX className="h-7 w-7" /> : <FaBars className="h-7 w-7" />}
      </button>

      {open && (
        <nav className="absolute left-0 top-full z-50 flex max-h-[70vh] w-full flex-col items-center gap-6 overflow-y-auto bg-white py-8 text-base shadow-xl xl:hidden">
          {linksPrincipais.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end
              onClick={() => setOpen(false)}
              className={classeLink}
            >
              {link.label}
            </NavLink>
          ))}
          <Link
            to="/login"
            onClick={() => setOpen(false)}
            className="rounded-full bg-primary px-8 py-2 text-sm font-semibold text-primary-foreground"
          >
            Entrar
          </Link>
        </nav>
      )}
    </header>
  );
}
