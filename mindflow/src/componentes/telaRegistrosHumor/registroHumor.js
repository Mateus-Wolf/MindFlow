import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../telaHome/header';

const RegistroHumor = () => {
    const { id } = useParams(); // Obtém o ID do paciente da URL
    const [registros, setRegistros] = useState([]);
    const [nomePaciente, setNomePaciente] = useState('');

    useEffect(() => {
        const fetchRegistros = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/pacientes/${id}/registros`);
                setRegistros(response.data);
            } catch (error) {
                console.error('Erro ao buscar registros:', error);
            }
        };

        fetchRegistros();
    }, [id]);

    // Função para formatar a data
    const formatarData = (data) => {
        // Verifica se a data é válida
        const dataObj = new Date(data);
        if (isNaN(dataObj)) {
            return 'Data inválida'; // Retorna uma mensagem padrão se a data não for válida
        }

        const dia = dataObj.getUTCDate().toString().padStart(2, '0'); // Obtém o dia
        const mes = dataObj.toLocaleString('pt-BR', { month: 'short' }).toUpperCase(); // Obtém o mês abreviado e o transforma em maiúsculas

        return `${dia} ${mes}`;
    };

    return (
        <div className="tudo">
            <Header />
            <div id='registros-container'>
                <h2 className="titulo">Registros Paciente</h2>
                <h3 className="nome-paciente">{nomePaciente}</h3>

                <div className="ano-navegacao">
                    <span className="seta-esquerda">&lt;</span>
                    <span className="ano">2024</span>
                    <span className="seta-direita">&gt;</span>
                </div>

                <div className="registros-datas">
                    {registros.length > 0 ? (
                        registros.map((registro) => (
                            <Link
                                key={registro.id}
                                to={`/registroHumorAtividades/${registro.id}`}
                                className="bolinha"
                            >
                                <span className="data-registro">{formatarData(registro.data_registro)}</span>
                            </Link>

                        ))
                    ) : (
                        <p>Nenhum registro encontrado.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RegistroHumor;
