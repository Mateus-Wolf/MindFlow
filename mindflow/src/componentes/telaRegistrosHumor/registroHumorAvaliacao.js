import React, { useState } from 'react';
import Header from '../telaHome/header';
import { FaStar } from 'react-icons/fa';

const RegistroHumorAvaliacao = ({ label, emoji }) => {
    const [ratings, setRatings] = useState({
        sleepQuality: 0,
        stressLevel: 0,
        energyLevel: 0,
        generalEvaluation: 0,
    });

    // Função auxiliar para renderizar estrelas com base no nível
    const renderStars = (level, keyPrefix) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
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
                            color={ratingValue <= level ? '#ffc107' : '#e4e5e9'}
                            size={30}
                            style={{ cursor: 'pointer' }}
                        />
                    </label>
                );
            })}
        </div>
    );

    const Avaliacao = () => {
        return (
            <div className="avaliacao-container" style={{ display: 'flex', justifyContent: 'space-between', gap: '20px' }}>
                <div id='avaliacaoEsquerda' style={{ flex: '1' }}>
                    <div className="avaliacao-item">
                        <span role="img" aria-label="sono">😴</span>
                        <p>Qualidade do sono</p>
                        <div className="stars">{renderStars(ratings.sleepQuality, 'sleepQuality')}</div>
                    </div>
                    <div className="avaliacao-item">
                        <span role="img" aria-label="estresse">😡</span>
                        <p>Nível de estresse</p>
                        <div className="stars">{renderStars(ratings.stressLevel, 'stressLevel')}</div>
                    </div>
                </div>
                <div id='avaliacaoDireita' style={{ flex: '1', textAlign: 'right' }}>
                    <div className="avaliacao-item">
                        <span role="img" aria-label="energia">🔥</span>
                        <p>Nível de energia</p>
                        <div className="stars">{renderStars(ratings.energyLevel, 'energyLevel')}</div>
                    </div>
                    <div className="avaliacao-item">
                        <span role="img" aria-label="geral">🤩</span>
                        <p>Avaliação geral</p>
                        <div className="stars">{renderStars(ratings.generalEvaluation, 'generalEvaluation')}</div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div>
            <Header />
            <h2>{label}</h2>
            <div>{emoji}</div>
            <Avaliacao />
        </div>
    );
};

export default RegistroHumorAvaliacao;
