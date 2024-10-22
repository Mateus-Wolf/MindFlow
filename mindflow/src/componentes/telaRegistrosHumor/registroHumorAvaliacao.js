import React, { useState } from 'react';
import Header from '../telaHome/header';
import { Link } from "react-router-dom";
import { FaStar } from 'react-icons/fa';

const RegistroHumorAvaliacao = ({ label, emoji }) => {
    const [ratings, setRatings] = useState({
        sleepQuality: 0,
        stressLevel: 0,
        energyLevel: 0,
        generalEvaluation: 0,
    });

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
                        <FaStar
                            className="star"
                            color={ratingValue <= level ? '#ffc107' : '#e4e5e9'}
                        />
                    </label>
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
                        {renderStars(ratings.sleepQuality, 'sleepQuality')}
                    </div>
                    <div className="avaliacao-item">
                        <span role="img" aria-label="estresse" className="emoji">😡</span>
                        <p className="avaliacao-text">Nível de estresse</p>
                        {renderStars(ratings.stressLevel, 'stressLevel')}
                    </div>
                </div>
                <div className="avaliacao-row">
                    <div className="avaliacao-item">
                        <span role="img" aria-label="energia" className="emoji">🔥</span>
                        <p className="avaliacao-text">Nível de energia</p>
                        {renderStars(ratings.energyLevel, 'energyLevel')}
                    </div>
                    <div className="avaliacao-item">
                        <span role="img" aria-label="geral" className="emoji">🤩</span>
                        <p className="avaliacao-text">Avaliação geral</p>
                        {renderStars(ratings.generalEvaluation, 'generalEvaluation')}
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
            <div className="footer">
                <Link to="/registroHumorAtividades">
                    <button className="btnVoltar">Voltar</button>
                </Link>
                <Link to="/registroHumorAvaliacao">
                    <button className="btnSalvar">Salvar</button>
                </Link>
            </div>
        </div>
    );
};

export default RegistroHumorAvaliacao;
