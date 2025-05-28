import React, { useState } from 'react';
import Header from '../telaHome/header';
import { useNavigate, Link, useParams } from "react-router-dom";
import { FaStar } from 'react-icons/fa';
import axios from 'axios';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';

const RegistroHumorAvaliacao = ({ label, emoji }) => {
    const { id: pacienteId } = useParams();
    const [ratings, setRatings] = useState({
        sleepQuality: 0,
        stressLevel: 0,
        energyLevel: 0,
        generalEvaluation: 0,
    });
    const [observacoes, setObservacoes] = useState("");
    const navigate = useNavigate();

    const renderStars = (level, keyPrefix) => (
        <div className="stars-container">
            {[...Array(5)].map((_, index) => {
                const ratingValue = index + 1;
                return (
                    <label key={`${keyPrefix}-${index}`}>
                        <input
                            type="radio"
                            name={keyPrefix}
                            value={ratingValue}
                            onClick={() => setRatings((prev) => ({ ...prev, [keyPrefix]: ratingValue }))}
                            style={{ display: 'none' }}
                        />
                        <motion.div
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            style={{ display: 'inline-block' }}
                        >
                            <FaStar
                                className="star"
                                color={ratingValue <= level ? '#ffc107' : '#e4e5e9'}
                            />
                        </motion.div>
                    </label>
                );
            })}
        </div>
    );

    const handleSave = async () => {
        if (Object.values(ratings).includes(0)) {
            Swal.fire({
                icon: 'warning',
                title: 'Atenção!',
                text: 'Por favor, preencha todas as avaliações antes de salvar!'
            });
            return;
        }

        const estudo = localStorage.getItem('Estudos') === 'true';
        const trabalho = localStorage.getItem('Trabalho') === 'true';
        const exercicio = localStorage.getItem('Exercício') === 'true';
        const lazer = localStorage.getItem('Lazer') === 'true';

        const data = {
            id_paciente: pacienteId,
            data_registro: new Date().toISOString().split('T')[0],
            qualidade_sono: ratings.sleepQuality,
            nivel_estresse: ratings.stressLevel,
            nivel_energia: ratings.energyLevel,
            avaliacao_geral: ratings.generalEvaluation,
            tarefas_estudo: estudo,
            tarefas_trabalho: trabalho,
            tarefas_exercicio: exercicio,
            tarefas_lazer: lazer,
            observacoes
        };

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/avaliacaoHumor/registro-avaliacao`, data);

            if (response.status === 201) {
                Swal.fire({
                    icon: 'success',
                    title: 'Sucesso!',
                    text: `Avaliação salva com sucesso!`,
                });

                const agendamentosResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/agendamentos?paciente_id=${pacienteId}&data=${data.data_registro}`);
                const agendamento = agendamentosResponse.data.find(agenda => agenda.paciente_id === pacienteId && agenda.data === data.data_registro);

                if (agendamento) {
                    await axios.put(`${process.env.REACT_APP_API_URL}/api/agendamentos/${agendamento.id}/concluir`);
                }

                navigate('/telaListar');
            }
        } catch (error) {
            console.error('Erro ao salvar:', error.response?.data || error);
            Swal.fire({
                icon: 'error',
                title: 'Erro!',
                text: 'Ocorreu um erro ao salvar a avaliação. Tente novamente.',
            });
        }
    };

    return (
        <motion.div
            className="tudo"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <Header />
            <motion.h2 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                {label}
            </motion.h2>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                {emoji}
            </motion.div>

            <div className="avaliacao-container">
                <motion.div className="avaliacao-row" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="avaliacao-item">
                        <span className="emoji">😴</span>
                        <p>Qualidade do sono</p>
                        {renderStars(ratings.sleepQuality, 'sleepQuality')}
                    </div>
                    <div className="avaliacao-item">
                        <span className="emoji">😡</span>
                        <p>Nível de estresse</p>
                        {renderStars(ratings.stressLevel, 'stressLevel')}
                    </div>
                </motion.div>
                <motion.div className="avaliacao-row" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <div className="avaliacao-item">
                        <span className="emoji">🔥</span>
                        <p>Nível de energia</p>
                        {renderStars(ratings.energyLevel, 'energyLevel')}
                    </div>
                    <div className="avaliacao-item">
                        <span className="emoji">🤩</span>
                        <p>Avaliação geral</p>
                        {renderStars(ratings.generalEvaluation, 'generalEvaluation')}
                    </div>
                </motion.div>
            </div>

            <motion.div className="observacoes-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                <label htmlFor="observacoes">Observações:</label>
                <textarea
                    id="observacoes"
                    value={observacoes}
                    onChange={(e) => setObservacoes(e.target.value)}
                    placeholder="Eventuais observações sobre o dia do paciente..."
                />
            </motion.div>

            <motion.div className="footer" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <Link to={`/registroHumorAtividades/${pacienteId}`}>
                    <motion.button
                        className="btnVoltar"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Voltar
                    </motion.button>
                </Link>
                <motion.button
                    className="btnSalvar"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSave}
                >
                    Salvar
                </motion.button>
            </motion.div>
        </motion.div>
    );
};

export default RegistroHumorAvaliacao;
