import React, { useEffect, useState } from 'react';
import Header from '../telaHome/header';
import { useNavigate, useParams } from "react-router-dom";
import { FaStar } from 'react-icons/fa';
import axios from 'axios';

const VisualizarHumorAvaliacao = () => {
    const { id: pacienteId } = useParams();
    const [ratings, setRatings] = useState({
        sleepQuality: 0,
        stressLevel: 0,
        energyLevel: 0,
        generalEvaluation: 0,
    });
    const navigate = useNavigate();

    useEffect(() => {
        console.log(`Buscando avaliações para o paciente ID: ${pacienteId}`);
        const fetchRatings = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/avaliacaoHumor/${pacienteId}`);
                const { humor_sono, humor_estresse, nivel_energia, humor_geral } = response.data;

                setRatings({
                    sleepQuality: humor_sono,
                    stressLevel: humor_estresse,
                    energyLevel: nivel_energia,
                    generalEvaluation: humor_geral,
                });
            } catch (error) {
                console.error('Erro ao buscar avaliações:', error);
            }
        };

        fetchRatings();
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
            <h2>Avaliação de Humor</h2>
            <Avaliacao />
            <div className="footer">
                <button className="btnVoltar" onClick={() => navigate(-1)}>Voltar</button>
            </div>
        </div>
    );
};

export default VisualizarHumorAvaliacao;
