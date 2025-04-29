import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../telaHome/header';
import estudoIcon from '../../icones/estudo-icone.svg';
import trabalhoIcon from '../../icones/trabalho-icone.svg';
import exercicioIcon from '../../icones/exercicio-icone.svg';
import lazerIcon from '../../icones/lazer-icone.svg';
import { parseISO, format } from 'date-fns';

const getTaskKey = (category) => {
    switch (category) {
        case 'Estudos':
            return 'tarefas_estudo';
        case 'Trabalho':
            return 'tarefas_trabalho';
        case 'Exercício':
            return 'tarefas_exercicio';
        case 'Lazer':
            return 'tarefas_lazer';
        default:
            return '';
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
                console.log('Resposta da API:', response.data);
                setRegistro(response.data);
            } catch (error) {
                console.error('Erro ao buscar registro:', error);
            }
        };
        fetchRegistro();
    }, [id]);

    // Função para obter o ícone com base na categoria
    const getIcon = (category) => {
        switch (category) {
            case 'Estudos':
                return estudoIcon;
            case 'Trabalho':
                return trabalhoIcon;
            case 'Exercício':
                return exercicioIcon;
            case 'Lazer':
                return lazerIcon;
            default:
                return null;
        }
    };

    // Verificação para garantir que a data seja válida antes de formatar
    const formatDate = (dateString) => {
        // Parse a data ISO para um objeto Date
        const date = parseISO(dateString);

        // Formata a data no formato desejado, levando em consideração o fuso horário local
        return isNaN(date) ? 'Data Inválida' : format(date, 'dd/MM/yyyy');
    };

    if (!registro) return <div>Carregando...</div>;

    const handleAvancar = () => {
        navigate(`/visualizarHumorAvaliacao/${registro.id}`, { state: { dadosHumor: registro } });
    };

    return (
        <div className="tudo">
            <Header />
            <h2>Registro de Humor</h2>
            <h3>Data: {formatDate(registro.data)}</h3>
            <div className="categories">
                {['Estudos', 'Trabalho', 'Exercício', 'Lazer'].map((category) => (
                    <div className="category" key={category}>
                        <h2>{category}</h2>
                        <img src={getIcon(category)} alt={`${category} Icon`} />
                        <div className="buttons">
                            <button
                                className={`checkstyle ${registro[getTaskKey(category)] ? 'button-checked' : ''}`}
                                disabled
                            >
                                <i className="fas fa-check"></i>
                            </button>
                            <button
                                className={`checkstyle ${!registro[getTaskKey(category)] ? 'button-checked' : ''}`}
                                disabled
                            >
                                <i className="fas fa-times"></i>
                            </button>

                        </div>
                    </div>
                ))}
            </div>
            <div className="footer">
                <button className="btnVoltar" onClick={() => navigate(-1)}>Voltar</button>
                <button className="btnSalvar" onClick={handleAvancar}>
                    Avançar
                </button>
            </div>
        </div>
    );
};

export default VisualizarHumor;
