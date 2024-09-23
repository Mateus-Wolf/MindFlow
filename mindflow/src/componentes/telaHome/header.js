import React from "react";

const Header = () => { // Renomeie para 'Header' com letra maiúscula
    return (
        <div id="header">
            <nav className="navbar navbar-expand-lg"> {/* Use className */}
                <div className="container-fluid">
                    <a className="navbar-brand" id="tituloHeader" href="#">MINDFLOW</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNavDropdown">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <a className="nav-link" href="#">Perfil</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">Agendamentos</a>
                            </li>
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Pacientes
                                </a>
                                <ul className="dropdown-menu">
                                    <li><a className="dropdown-item" href="#">Todos Pacientes</a></li>
                                    <li><a className="dropdown-item" href="#">Cadastrar Paciente</a></li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    );
}

export default Header
