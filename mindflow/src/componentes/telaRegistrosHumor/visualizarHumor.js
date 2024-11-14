import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../telaHome/header';
import estudoIcon from '../../icones/estudo-icone.svg';
import trabalhoIcon from '../../icones/trabalho-icone.svg';
import exercicioIcon from '../../icones/exercicio-icone.svg';
import lazerIcon from '../../icones/lazer-icone.svg';

const VisualizarHumor = () => {
    const { id } = useParams(); 
    const [registro, setRegistro] = useState(null); 
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRegistro = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/agendamentos/${id}`);
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

    if (!registro) return <div>Carregando...</div>;

    const handleAvancar = () => {
        navigate(`/visualizarHumorAvaliacao/${registro.id}`, { state: { dadosHumor: registro } });
    };

    return (
        <div className="tudo">
            <Header />
            <h2>Registro de Humor</h2>
            <h3>Data: {new Date(registro.data_registro).toLocaleDateString()}</h3> {/* Exibe a data do registro */}
            <div className="categories">
                {['Estudos', 'Trabalho', 'Exercício', 'Lazer'].map((category) => (
                    <div className="category" key={category}>
                        <h2>{category}</h2>
                        <img src={getIcon(category)} alt={`${category} Icon`} />
                        <div className="buttons">
                            <button className={`checkstyle ${registro[category.toLowerCase()] ? 'button-checked' : ''}`} disabled>
                                <i className="fas fa-check"></i>
                            </button>
                            <button className={`checkstyle ${!registro[category.toLowerCase()] ? 'button-checked-times' : ''}`} disabled>
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
