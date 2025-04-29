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
                        <FaStar
                            className="star"
                            color={ratingValue <= level ? '#ffc107' : '#e4e5e9'}
                        />
                    </label>
                );
            })}
        </div>
    );

    const handleSave = async () => {
        if (ratings.sleepQuality === 0 || ratings.stressLevel === 0 || ratings.energyLevel === 0 || ratings.generalEvaluation === 0) {
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
    
        console.log('Dados enviados para a API:', data);
    
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/avaliacaoHumor/registro-avaliacao`, data);
            console.log('Resposta da API:', response.data);
    
            if (response.status === 201) {
                Swal.fire({
                    icon: 'success',
                    title: 'Sucesso!',
                    text: `Avaliação salva com sucesso!`,
                });
    
                // Buscar o agendamento para o paciente na mesma data
                const agendamentosResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/agendamentos?paciente_id=${pacienteId}&data=${data.data_registro}`);
                const agendamento = agendamentosResponse.data.find(agenda => agenda.paciente_id === pacienteId && agenda.data === data.data_registro);
    
                if (agendamento) {
                    console.log(`Atualizando agendamento com ID: ${agendamento.id}`);
    
                    // Requisição PUT para concluir o agendamento
                    const concluirResponse = await axios.put(`${process.env.REACT_APP_API_URL}/api/agendamentos/${agendamento.id}/concluir`);
                    console.log('Resposta ao concluir agendamento:', concluirResponse.data);
    
                    if (concluirResponse.status === 200) {
                        console.log('Agendamento concluído com sucesso!');
                    } else {
                        console.error('Erro ao concluir agendamento', concluirResponse);
                    }
                } else {
                    console.error('Nenhum agendamento encontrado para o paciente nesta data.');
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
        <div className="tudo">
            <Header />
            <h2>{label}</h2>
            <div>{emoji}</div>
            <div className="avaliacao-container">
                <div className="avaliacao-row">
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
                </div>
                <div className="avaliacao-row">
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
                </div>
            </div>
            <div className="observacoes-container">
                <label htmlFor="observacoes">Observações:</label>
                <textarea
                    id="observacoes"
                    value={observacoes}
                    onChange={(e) => setObservacoes(e.target.value)}
                    placeholder="Eventuais observações sobre o dia do paciente..."
                />
            </div>
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
