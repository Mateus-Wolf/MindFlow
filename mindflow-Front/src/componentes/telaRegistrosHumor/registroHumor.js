import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../telaHome/header';
import { motion, AnimatePresence } from 'framer-motion';

const RegistroHumor = () => {
    const { id } = useParams();
    const [registros, setRegistros] = useState([]);
    const [nomePaciente, setNomePaciente] = useState('');
    const [anoAtual, setAnoAtual] = useState(new Date().getFullYear());

    useEffect(() => {
        const fetchRegistros = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/pacientes/${id}/registros?ano=${anoAtual}`);
                setRegistros(response.data);

                const pacienteResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/pacientes/${id}`);
                setNomePaciente(pacienteResponse.data.nome);
            } catch (error) {
                console.error('Erro ao buscar registros:', error);
            }
        };

        fetchRegistros();
    }, [id, anoAtual]);

    const formatarData = (data) => {
        if (!data) return 'Data inválida';
        try {
            const dataFormatada = new Date(data);
            if (isNaN(dataFormatada.getTime())) return 'Data inválida';
            const dia = dataFormatada.getUTCDate().toString().padStart(2, '0');
            const mes = dataFormatada.toLocaleString('pt-BR', { month: 'short' }).toUpperCase();
            return `${dia} ${mes}`;
        } catch {
            return 'Data inválida';
        }
    };

    const handlePrevYear = () => setAnoAtual((prev) => prev - 1);
    const handleNextYear = () => setAnoAtual((prev) => prev + 1);

    return (
        <div className="tudo">
            <Header />

            <motion.div
                id="registros-container"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <motion.h2 className="titulo" initial={{ y: -20 }} animate={{ y: 0 }} transition={{ duration: 0.5 }}>
                    Registros do Paciente
                </motion.h2>
                <motion.h3 className="nome-paciente" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                    <b>{nomePaciente}</b>
                </motion.h3>

                <motion.div className="ano-navegacao" initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
                    <motion.button whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.05 }} onClick={handlePrevYear}>
                        &lt;
                    </motion.button>
                    <span className="ano">{anoAtual}</span>
                    <motion.button whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.05 }} onClick={handleNextYear}>
                        &gt;
                    </motion.button>
                </motion.div>

                <hr />

                <div className="registros-datas">
                    <AnimatePresence>
                        {registros.length > 0 ? (
                            registros.map((registro, index) => (
                                <motion.div
                                    key={registro.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                    className="registro-card"
                                >
                                    <Link to={`/visualizarHumor/${registro.id}`} className="bolinha">
                                        <span className="data-registro">
                                            {formatarData(registro.data_registro)}
                                        </span>
                                    </Link>
                                </motion.div>
                            ))
                        ) : (
                            <motion.p
                                className="sem-registro"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.4 }}
                            >
                                Nenhum registro encontrado.
                            </motion.p>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
};

export default RegistroHumor;
