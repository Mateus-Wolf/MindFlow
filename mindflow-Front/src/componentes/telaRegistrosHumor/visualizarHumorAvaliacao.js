import React, { useState, useEffect } from 'react';
import Header from '../telaHome/header';
import { useNavigate, Link, useParams } from "react-router-dom";
import { FaStar } from 'react-icons/fa';
import axios from 'axios';
import { motion } from 'framer-motion';

const starVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (i) => ({
        opacity: 1,
        scale: 1,
        transition: {
            delay: i * 0.05,
        },
    }),
};

const RegistroHumorAvaliacao = ({ label, emoji }) => {
    const { id } = useParams();
    const { id: pacienteId } = useParams();
    const [ratings, setRatings] = useState({
        sleepQuality: 0,
        stressLevel: 0,
        energyLevel: 0,
        generalEvaluation: 0,
    });
    const [observacoes, setObservacoes] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/agendamentos/${id}`);
                if (response.status === 200) {
                    setRatings({
                        sleepQuality: response.data.qualidade_sono,
                        stressLevel: response.data.nivel_estresse,
                        energyLevel: response.data.nivel_energia,
                        generalEvaluation: response.data.avaliacao_geral,
                    });
                    setObservacoes(response.data.observacoes || '');
                }
            } catch (error) {
                console.error('Erro ao buscar os dados:', error);
            }
        };
        fetchData();
    }, [pacienteId]);

    const renderStars = (level) => (
        <div className="stars-container">
            {[...Array(5)].map((_, index) => {
                const ratingValue = index + 1;
                return (
                    <motion.div
                        custom={index}
                        key={index}
                        variants={starVariants}
                        initial="hidden"
                        animate="visible"
                        className="inline-block"
                    >
                        <FaStar
                            className="star"
                            color={ratingValue <= level ? '#ffc107' : '#e4e5e9'}
                        />
                    </motion.div>
                );
            })}
        </div>
    );

    const Avaliacao = () => {
        return (
            <motion.div
                className="avaliacao-container"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div className="avaliacao-row">
                    <div className="avaliacao-item">
                        <span role="img" aria-label="sono" className="emoji">😴</span>
                        <p className="avaliacao-text">Qualidade do sono</p>
                        {renderStars(ratings.sleepQuality)}
                    </div>
                    <div className="avaliacao-item">
                        <span role="img" aria-label="estresse" className="emoji">😡</span>
                        <p className="avaliacao-text">Nível de estresse</p>
                        {renderStars(ratings.stressLevel)}
                    </div>
                </div>
                <div className="avaliacao-row">
                    <div className="avaliacao-item">
                        <span role="img" aria-label="energia" className="emoji">🔥</span>
                        <p className="avaliacao-text">Nível de energia</p>
                        {renderStars(ratings.energyLevel)}
                    </div>
                    <div className="avaliacao-item">
                        <span role="img" aria-label="geral" className="emoji">🤩</span>
                        <p className="avaliacao-text">Avaliação geral</p>
                        {renderStars(ratings.generalEvaluation)}
                    </div>
                </div>
            </motion.div>
        );
    };

    return (
        <div className="tudo">
            <Header />

            <motion.div
                className="cabecalho-avaliacao"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="emoji-grande">{emoji}</div>
                <h2 className="titulo-avaliacao">{label || 'Avaliação do Humor'}</h2>
            </motion.div>

            <Avaliacao />

            <motion.div
                className="observacoes-container"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
            >
                <h3>Observações</h3>
                <textarea
                    value={observacoes}
                    readOnly
                    className="observacoes-textarea"
                />
            </motion.div>

            <motion.div
                className="footer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.4 }}
            >
                <Link to={`/visualizarHumor/${pacienteId}`}>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="btnVoltar"
                    >
                        Voltar
                    </motion.button>
                </Link>
                <Link to={`/telaListar`}>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="btnSalvar btnProximo"
                    >
                        Próximo
                    </motion.button>
                </Link>
            </motion.div>
        </div>
    );
};

export default RegistroHumorAvaliacao;
