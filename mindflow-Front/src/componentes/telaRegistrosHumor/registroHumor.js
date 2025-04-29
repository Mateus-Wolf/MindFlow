import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../telaHome/header';

const RegistroHumor = () => {
    const { id } = useParams();  // Obtém o ID do paciente via URL
    const [registros, setRegistros] = useState([]);  // Armazena os registros de humor do paciente
    const [nomePaciente, setNomePaciente] = useState('');  // Armazena o nome do paciente
    const [anoAtual, setAnoAtual] = useState(new Date().getFullYear());  // Armazena o ano atual

    // Efeito para buscar registros e dados do paciente
    useEffect(() => {
        const fetchRegistros = async () => {
            try {
                // Busca os registros do paciente no ano selecionado
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/pacientes/${id}/registros?ano=${anoAtual}`);
                console.log('Registros da API:', response.data); // Verifique o formato da data
                
                setRegistros(response.data);  // Atualiza os registros com a resposta da API

                // Busca o nome do paciente
                const pacienteResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/pacientes/${id}`);
                setNomePaciente(pacienteResponse.data.nome);  // Atualiza o nome do paciente
            } catch (error) {
                console.error('Erro ao buscar registros:', error);
            }
        };

        fetchRegistros();
    }, [id, anoAtual]);  // Re-executa quando o ID ou o ano atual muda

    // Função para formatar a data
    const formatarData = (data) => {
        if (!data) return 'Data inválida';
    
        try {
            const dataFormatada = new Date(data);
    
            if (isNaN(dataFormatada.getTime())) {
                return 'Data inválida';
            }
    
            const dia = dataFormatada.getUTCDate().toString().padStart(2, '0');
            const mes = dataFormatada.toLocaleString('pt-BR', { month: 'short' }).toUpperCase();
    
            return `${dia} ${mes}`;
        } catch (error) {
            console.error('Erro ao formatar data:', error);
            return 'Data inválida';
        }
    };
    

    // Função para navegar para o ano anterior
    const handlePrevYear = () => {
        setAnoAtual(anoAtual - 1);
    };

    // Função para navegar para o próximo ano
    const handleNextYear = () => {
        setAnoAtual(anoAtual + 1);
    };

    return (
        <div className="tudo">
            <Header />
            <div id="registros-container">
                <h2 className="titulo">Registros do Paciente</h2>
                <h3 className="nome-paciente">
                    <b>{nomePaciente}</b>
                </h3>
                <div className="ano-navegacao">
                    <button onClick={handlePrevYear}>&lt;</button>
                    <span className="ano">{anoAtual}</span>
                    <button onClick={handleNextYear}>&gt;</button>
                </div>

                <hr />

                <div className="registros-datas">
                    {registros.length > 0 ? (
                        registros.map((registro) => (
                            <Link key={registro.id} to={`/visualizarHumor/${registro.id}`} className="bolinha">
                                <span className="data-registro">
                                    {formatarData(registro.data_registro) !== 'Data inválida' ? (
                                        formatarData(registro.data_registro)
                                    ) : (
                                        'Data inválida'
                                    )}
                                </span>
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
