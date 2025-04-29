import React, { useState, useEffect } from 'react';
import Header from '../telaHome/header';
import { useNavigate, Link, useParams } from "react-router-dom";
import { FaStar } from 'react-icons/fa';
import axios from 'axios';

const RegistroHumorAvaliacao = ({ label, emoji }) => {
    const { id } = useParams();
    const { id: pacienteId } = useParams();
    const [ratings, setRatings] = useState({
        sleepQuality: 0,
        stressLevel: 0,
        energyLevel: 0,
        generalEvaluation: 0,
    });
    const [observacoes, setObservacoes] = useState(''); // Estado para observações
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
                    setObservacoes(response.data.observacoes || ''); // Garante que não seja undefined
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
                    <FaStar
                        key={index}
                        className="star"
                        color={ratingValue <= level ? '#ffc107' : '#e4e5e9'}
                    />
                );
            })}
        </div>
    );

    const Avaliacao = () => {
        return (
            <div className="avaliacao-container">
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
            </div>
        );
    };

    return (
        <div className="tudo">
            <Header />
            <h2>{label}</h2>
            <div>{emoji}</div>
            <Avaliacao />

            {/* Exibição das observações */}
            <div className="observacoes-container">
                <h3>Observações</h3>
                <textarea
                    value={observacoes}
                    readOnly
                    className="observacoes-textarea"
                />
            </div>

            <div className="footer">
                <Link to={`/visualizarHumor/${pacienteId}`}>
                    <button className="btnVoltar">Voltar</button>
                </Link>
                <Link to={`/telaListar`}>
                    <button className="btnSalvar btnProximo">Próximo</button>
                </Link>
            </div>
        </div>
    );
};

export default RegistroHumorAvaliacao;
