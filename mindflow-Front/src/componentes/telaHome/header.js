import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaUser, FaCalendarAlt, FaUsers, FaHistory, FaChevronDown } from "react-icons/fa";

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const usuarioId = localStorage.getItem("usuarioId");

    const toggleMenu = () => setMenuOpen((prev) => !prev);
    const toggleDropdown = (e) => {
        e.preventDefault();
        setDropdownOpen((prev) => !prev);
    };

    return (
        <div id="header">
            <nav className="navbar navbar-expand-lg">
                <div className="container-fluid">
                    <Link className="navbar-brand" id="tituloHeader" to="/home">
                        MINDFLOW
                    </Link>
                    <button
                        className="navbar-toggler"
                        type="button"
                        onClick={toggleMenu}
                        aria-expanded={menuOpen}
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className={`collapse navbar-collapse ${menuOpen ? "show" : ""}`}>
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <Link className="nav-link" to="/perfil">
                                    <FaUser className="icon-margin-right" />
                                    Perfil
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/agendamentos">
                                    <FaCalendarAlt className="icon-margin-right" />
                                    Agendamentos
                                </Link>
                            </li>

                            <li className="nav-item dropdown" style={{ position: "relative" }}>
                                <a
                                    href="#"
                                    className="nav-link"
                                    role="button"
                                    onClick={toggleDropdown}
                                    aria-expanded={dropdownOpen}
                                    aria-haspopup="true"
                                >
                                    <FaUsers className="icon-margin-right" />
                                    Pacientes <FaChevronDown className="icon-margin-left" size={12} />
                                </a>

                                <AnimatePresence>
                                    {dropdownOpen && (
                                        <motion.ul
                                            className="dropdown-menu show"
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ duration: 0.15 }}
                                            style={{
                                                position: "absolute",
                                                top: "100%",
                                                left: 0,
                                                minWidth: "10rem",
                                                zIndex: 1000,
                                                backgroundColor: "#0c001c",
                                                borderRadius: "0.25rem",
                                                boxShadow: "0 0.5rem 1rem rgb(0 0 0 / 0.15)",
                                                pointerEvents: dropdownOpen ? "auto" : "none",
                                                overflow: "hidden",
                                            }}
                                        >
                                            <li>
                                                <Link className="dropdown-item" to="/telaListar" onClick={() => setDropdownOpen(false)}>
                                                    Todos Pacientes
                                                </Link>
                                            </li>
                                            <li>
                                                <Link className="dropdown-item" to="/telaCadastrar" onClick={() => setDropdownOpen(false)}>
                                                    Cadastrar Paciente
                                                </Link>
                                            </li>
                                        </motion.ul>
                                    )}
                                </AnimatePresence>
                            </li>


                            <li className="nav-item">
                                <Link className="nav-link" to={`/historicoConsultas/${usuarioId}`}>
                                    <FaHistory className="icon-margin-right" />
                                    Histórico de Consultas
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Header;
