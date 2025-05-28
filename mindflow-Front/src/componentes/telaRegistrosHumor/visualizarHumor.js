import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../telaHome/header';
import estudoIcon from '../../icones/estudo-icone.svg';
import trabalhoIcon from '../../icones/trabalho-icone.svg';
import exercicioIcon from '../../icones/exercicio-icone.svg';
import lazerIcon from '../../icones/lazer-icone.svg';
import { parseISO, format } from 'date-fns';
import { motion } from 'framer-motion';

const getTaskKey = (category) => {
    switch (category) {
        case 'Estudos': return 'tarefas_estudo';
        case 'Trabalho': return 'tarefas_trabalho';
        case 'Exercício': return 'tarefas_exercicio';
        case 'Lazer': return 'tarefas_lazer';
        default: return '';
    }
};

const VisualizarHumor = () => {
    const { id } = useParams();
    const [registro, setRegistro] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRegistro = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/agendamentos/${id}`);
                setRegistro(response.data);
            } catch (error) {
                console.error('Erro ao buscar registro:', error);
            }
        };
        fetchRegistro();
    }, [id]);

    const getIcon = (category) => {
        switch (category) {
            case 'Estudos': return estudoIcon;
            case 'Trabalho': return trabalhoIcon;
            case 'Exercício': return exercicioIcon;
            case 'Lazer': return lazerIcon;
            default: return null;
        }
    };

    const formatDate = (dateString) => {
        const date = parseISO(dateString);
        return isNaN(date) ? 'Data Inválida' : format(date, 'dd/MM/yyyy');
    };

    if (!registro) return <div>Carregando...</div>;

    const handleAvancar = () => {
        navigate(`/visualizarHumorAvaliacao/${registro.id}`, { state: { dadosHumor: registro } });
    };

    return (
        <div className="tudo">
            <Header />
            <motion.h2 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                Registro de Humor
            </motion.h2>
            <motion.h3 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                Data: {formatDate(registro.data)}
            </motion.h3>

            <div className="categories">
                {['Estudos', 'Trabalho', 'Exercício', 'Lazer'].map((category, index) => (
                    <motion.div
                        className="category"
                        key={category}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                    >
                        <h2>{category}</h2>
                        <img src={getIcon(category)} alt={`${category} Icon`} />
                        <div className="buttons">
                            <button
                                className={`checkstyle ${registro[getTaskKey(category)] ? 'button-checked' : ''}`}
                                disabled
                            >
                                ✅
                            </button>
                            <button
                                className={`checkstyle ${!registro[getTaskKey(category)] ? 'button-checked' : ''}`}
                                disabled
                            >
                                ❌
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            <motion.div className="footer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                <motion.button
                    className="btnVoltar"
                    onClick={() => navigate(-1)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Voltar
                </motion.button>
                <motion.button
                    className="btnSalvar"
                    onClick={handleAvancar}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Avançar
                </motion.button>
            </motion.div>
        </div>
    );
};

export default VisualizarHumor;
