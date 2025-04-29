import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);

    const usuarioId = localStorage.getItem('usuarioId');

    const toggleDropdown = (e) => {
        e.preventDefault();
        setIsOpen(prev => !prev);
    };

    return (
        <div id="header">
            <nav className="navbar navbar-expand-lg">
                <div className="container-fluid">
                    <Link className="navbar-brand" id="tituloHeader" to="/home">MINDFLOW</Link>
                    <button
                        className="navbar-toggler"
                        type="button"
                        onClick={() => setIsOpen(prev => !prev)}
                        aria-expanded={isOpen}
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}>
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <Link className="nav-link" to="/perfil">Perfil</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/agendamentos">Agendamentos</Link>
                            </li>
                            <li className="nav-item dropdown">
                                <a
                                    className="nav-link dropdown-toggle"
                                    href="#"
                                    role="button"
                                    onClick={toggleDropdown}
                                    aria-expanded={isOpen}
                                >
                                    Pacientes
                                </a>
                                <motion.ul
                                    className={`dropdown-menu ${isOpen ? 'show' : ''}`}
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: isOpen ? 1 : 0, height: isOpen ? "auto" : 0 }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                    style={{ overflow: 'hidden' }}
                                >
                                    <li><Link className="dropdown-item" to="/telaListar">Todos Pacientes</Link></li>
                                    <li><Link className="dropdown-item" to="/telaCadastrar">Cadastrar Paciente</Link></li>
                                </motion.ul>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to={`/historicoConsultas/${usuarioId}`}>Histórico de Consultas</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    );
}

export default Header;
