import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./globals.css";
import App from "./App";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Estoque from "./pages/Estoque";
import Agua from "./pages/Agua";
import Alertas from "./pages/Alertas";
import Relatorios from "./pages/Relatorios";
import Sobre from "./pages/Sobre";
import Integrantes from "./pages/Integrantes";
import IntegranteDetalhe from "./pages/IntegranteDetalhe";
import Faq from "./pages/Faq";
import Contato from "./pages/Contato";
import Erro from "./pages/Erro";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <Erro />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "estoque", element: <Estoque /> },
      { path: "agua", element: <Agua /> },
      { path: "alertas", element: <Alertas /> },
      { path: "relatorios", element: <Relatorios /> },
      { path: "sobre", element: <Sobre /> },
      { path: "integrantes", element: <Integrantes /> },
      { path: "integrantes/:id", element: <IntegranteDetalhe /> }, // rota com parâmetro
      { path: "faq", element: <Faq /> },
      { path: "contato", element: <Contato /> },
      { path: "*", element: <Erro /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
