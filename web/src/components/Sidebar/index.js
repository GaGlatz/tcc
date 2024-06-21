import { Link, withRouter } from "react-router-dom";
import logo from "../../assets/logo.png";

const routes = [
  { path: "/", icon: "mdi mdi-calendar-check", text: "Agendamentos" },
  { path: "/clientes", icon: "mdi mdi-account-multiple", text: "Clientes" },
  {
    path: "/colaboradores",
    icon: "mdi mdi-card-account-details-outline",
    text: "Colaboradores",
  },
  { path: "/servicos-produtos", icon: "mdi mdi-auto-fix", text: "Serviços" },
  {
    path: "/horarios-atendimento",
    icon: "mdi mdi-clock-check-outline",
    text: "Horarios",
  },
];

const Sidebar = (props) => {
  return (
    <sidebar class="col-2 h-100">
      <img src={logo} alt="Logo" class="img-fluid px-3 py-4" />
      <ul>
        {routes.map((route) => (
          <li key={route.path}>
            <Link
              to={route.path}
              className={props.location.pathname === route.path ? "active" : ""}
            >
              <span class={route.icon}></span>
              <text>{route.text}</text>
            </Link>
          </li>
        ))}
      </ul>
    </sidebar>
  );
};

export default withRouter(Sidebar);
