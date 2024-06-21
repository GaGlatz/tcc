import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import "./style.css";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

import Agendamentos from "./pages/Agendamentos";
import Clientes from "./pages/Clientes";
import Colaboradores from "./pages/Colaboradores";
import ServicosProdutos from "./pages/ServicosProdutos";
import HorariosAtendimento from "./pages/HorariosAtendimento";

const routes = [
  { path: "/", exact: true, component: Agendamentos },
  { path: "/clientes", exact: true, component: Clientes },
  { path: "/colaboradores", exact: true, component: Colaboradores },
  { path: "/servicos-produtos", exact: true, component: ServicosProdutos },
  {
    path: "/horarios-atendimento",
    exact: true,
    component: HorariosAtendimento,
  },
];

const Routes = () => {
  return (
    <>
      <Header />
      <div className="container-fluid h-100">
        <div className="row h-100">
          <Router>
            <Sidebar />
            <Switch>
              {routes.map((route, index) => (
                <Route key={index} {...route} />
              ))}
            </Switch>
          </Router>
        </div>
      </div>
    </>
  );
};

export default Routes;
