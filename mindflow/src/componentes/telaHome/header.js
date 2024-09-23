import React from "react";
import { Link } from "react-router-dom"; // Importe o Link

const Header = () => {
    return (
        <div id="header">
            <nav className="navbar navbar-expand-lg">
                <div className="container-fluid">
                    <a className="navbar-brand" id="tituloHeader" href="#">MINDFLOW</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNavDropdown">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <Link className="nav-link" to="/perfil">Perfil</Link> {/* Use Link e defina a rota */}
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/agendamentos">Agendamentos</Link>
                            </li>
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Pacientes
                                </a>
                                <ul className="dropdown-menu">
                                    <li><Link className="dropdown-item" to="/todos-pacientes">Todos Pacientes</Link></li>
                                    <li><Link className="dropdown-item" to="/cadastrar-paciente">Cadastrar Paciente</Link></li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    );
}

export default Header;
