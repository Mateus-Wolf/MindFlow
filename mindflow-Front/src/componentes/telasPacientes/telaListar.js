import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Header from '../telaHome/header';
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';

const PacientesLista = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [generoFiltro, setGeneroFiltro] = useState('');
    const [idadeFiltro, setIdadeFiltro] = useState('');
    const [pacientes, setPacientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtrosVisiveis, setFiltrosVisiveis] = useState(false);
    const filtrosRef = useRef(null);

    const navigate = useNavigate();
    const usuarioId = localStorage.getItem('usuarioId');

    const normalizeString = (str) =>
        str
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase();

    const capitalizarPrimeiraLetra = (palavra) => {
        if (!palavra) return '';
        return palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase();
    };

    const capitalizarNome = (nome) => {
        return nome
            .toLowerCase()
            .split(' ')
            .map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1))
            .join(' ');
    };

    const handleClick = (id) => {
        navigate(`/telaDados/${id}`);
    };

    const handleClickRegistro = (id) => {
        navigate(`/registroHumor/${id}`);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const toggleFiltros = () => {
        setFiltrosVisiveis(prev => !prev);
    };

    const limparFiltros = () => {
        setGeneroFiltro('');
        setIdadeFiltro('');
    };

    useEffect(() => {
        const fetchPacientes = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/pacientes`);
                const pacientesFiltrados = response.data.filter(paciente => String(paciente.usuario_id) === String(usuarioId));
                setPacientes(pacientesFiltrados);
            } catch (error) {
                console.error('Erro ao obter pacientes:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPacientes();
    }, [usuarioId]);

    useEffect(() => {
        const handleClickFora = (event) => {
            if (filtrosRef.current && !filtrosRef.current.contains(event.target)) {
                setFiltrosVisiveis(false);
            }
        };
        document.addEventListener('mousedown', handleClickFora);
        return () => {
            document.removeEventListener('mousedown', handleClickFora);
        };
    }, []);

    const filteredPacientes = pacientes.filter((paciente) => {
        const nomeNormalizado = normalizeString(paciente.nome);
        const searchNormalizado = normalizeString(searchTerm);

        const nomeMatch = nomeNormalizado.includes(searchNormalizado);
        const generoMatch = generoFiltro === '' || paciente.genero.toLowerCase() === generoFiltro.toLowerCase();
        const idadeMatch = idadeFiltro === '' || Number(paciente.idade) === Number(idadeFiltro);

        return nomeMatch && generoMatch && idadeMatch;
    });

    return (
        <div id="tudo">
            <Header />
            <motion.div
                id="pacientes-lista"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="search-bar">
                    <motion.input
                        type="text"
                        className="search-input"
                        placeholder="Buscar pelo nome do Paciente"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        whileFocus={{ scale: 1.02 }}
                    />
                    <motion.button
                        className="btn-filtros"
                        onClick={toggleFiltros}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Filtros
                    </motion.button>

                    <AnimatePresence>
                        {filtrosVisiveis && (
                            <motion.div
                                ref={filtrosRef}
                                className="menu-filtros"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <select
                                    value={generoFiltro}
                                    onChange={(e) => setGeneroFiltro(e.target.value)}
                                >
                                    <option value="">Todos os gêneros</option>
                                    <option value="masculino">Masculino</option>
                                    <option value="feminino">Feminino</option>
                                    <option value="não binário">Não Binário</option>
                                    <option value="outro">Outro</option>
                                    <option value="não informar">Não informar</option>
                                </select>

                                <input
                                    type="number"
                                    value={idadeFiltro}
                                    onChange={(e) => setIdadeFiltro(e.target.value)}
                                    placeholder="Idade"
                                />

                                <motion.button
                                    onClick={limparFiltros}
                                    className="btn-limpar"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Limpar
                                </motion.button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {loading ? (
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <p>Carregando pacientes...</p>
                    </div>
                ) : (
                    <>
                        {filteredPacientes.length === 0 ? (
                            <p className="nenhum-paciente">
                                Nenhum paciente encontrado com os filtros selecionados.
                            </p>
                        ) : (
                            <AnimatePresence>
                                {filteredPacientes.map((paciente, index) => (
                                    <motion.div
                                        key={paciente.id}
                                        className="paciente-item"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                    >
                                        <div className="paciente-info">
                                            <h4>{capitalizarNome(paciente.nome)}</h4>
                                            <hr className='divisa-paciente' />
                                            <p>{paciente.idade}</p>
                                            <p>{capitalizarPrimeiraLetra(paciente.genero)}</p>
                                        </div>
                                        <div className="paciente-botoes">
                                            <motion.button
                                                className="btn-opcao"
                                                onClick={() => handleClick(paciente.id)}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                Dados
                                            </motion.button>
                                            <motion.button
                                                className="btn-Registros"
                                                onClick={() => handleClickRegistro(paciente.id)}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                Registros
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        )}
                    </>
                )}
            </motion.div>
        </div>
    );
};

export default PacientesLista;
