import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
    return (
        <div id="header">
            <nav className="navbar navbar-expand-lg">
                <div className="container-fluid">
                    <Link className="navbar-brand" id="tituloHeader" to="/home">MINDFLOW</Link>
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
                                    <li><Link className="dropdown-item" to="/telaListar">Todos Pacientes</Link></li>
                                    <li><Link className="dropdown-item" to="/telaCadastrar">Cadastrar Paciente</Link></li>
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
