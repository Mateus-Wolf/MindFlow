import React, { useState } from 'react';
import Header from '../telaHome/header';
import { useNavigate, Link, useParams } from "react-router-dom";
import { FaStar } from 'react-icons/fa';
import axios from 'axios';
import Swal from 'sweetalert2';

const RegistroHumorAvaliacao = ({ label, emoji }) => {
    const { id: pacienteId } = useParams();
    const [ratings, setRatings] = useState({
        sleepQuality: 0,
        stressLevel: 0,
        energyLevel: 0,
        generalEvaluation: 0,
    });
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

    const handleSave = async () => {
        // Validação
        if (ratings.sleepQuality === 0 || ratings.stressLevel === 0 || ratings.energyLevel === 0 || ratings.generalEvaluation === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Atenção!',
                text: 'Por favor, preencha todas as avaliações antes de salvar!',
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
            humor_sono: ratings.sleepQuality,
            humor_estresse: ratings.stressLevel,
            nivel_energia: ratings.energyLevel,
            humor_geral: ratings.generalEvaluation,
            estudo,
            trabalho,
            exercicio,
            lazer
        };
    
        console.log('Dados enviados para a API:', data);
    
        try {
            const response = await axios.post('http://localhost:3000/api/avaliacaoHumor/registro-avaliacao', data);
            console.log('Resposta da API:', response.data);
    
            if (response.status === 201) {
                Swal.fire({
                    icon: 'success',
                    title: 'Sucesso!',
                    text: `Avaliação salva com sucesso!`,
                });
                navigate('/telaListar');
            }
        } catch (error) {
            console.error('Erro ao salvar avaliação:', error);
            Swal.fire({
                icon: 'error',
                title: 'Erro!',
                text: 'Ocorreu um erro ao salvar a avaliação. Tente novamente.',
            });
        }
    };
     

    return (
        <div className="tudo">
            <Header />
            <h2>{label}</h2>
            <div>{emoji}</div>
            <Avaliacao />
            <div className="footer">
                <Link to={`/registroHumorAtividades/${pacienteId}`}>
                    <button className="btnVoltar">Voltar</button>
                </Link>
                <button className="btnSalvar" onClick={handleSave}>
                    Salvar
                </button>
            </div>
        </div>
    );
};

export default RegistroHumorAvaliacao;