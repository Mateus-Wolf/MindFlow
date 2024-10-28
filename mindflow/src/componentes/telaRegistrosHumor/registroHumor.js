import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../telaHome/header';

const RegistroHumor = () => {
    const { id } = useParams();
    const [registros, setRegistros] = useState([]);
    const [nomePaciente, setNomePaciente] = useState('');
    const [anoAtual, setAnoAtual] = useState(new Date().getFullYear()); // Adicionando estado para o ano atual

    useEffect(() => {
        const fetchRegistros = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/pacientes/${id}/registros?ano=${anoAtual}`); // Passando o ano na requisição
                setRegistros(response.data);

                // Se você precisar do nome do paciente, pode obter aqui
                const pacienteResponse = await axios.get(`http://localhost:3000/api/pacientes/${id}`);
                setNomePaciente(pacienteResponse.data.nome);
            } catch (error) {
                console.error('Erro ao buscar registros:', error);
            }
        };

        fetchRegistros();
    }, [id, anoAtual]); // Incluindo anoAtual nas dependências

    // Função que formata a data
    const formatarData = (data) => {
        const dataObj = new Date(data);
        if (isNaN(dataObj)) {
            return 'Data inválida';
        }

        const dia = dataObj.getUTCDate().toString().padStart(2, '0');
        const mes = dataObj.toLocaleString('pt-BR', { month: 'short' }).toUpperCase();

        return `${dia} ${mes}`;
    };

    // Função para alterar o ano
    const handlePrevYear = () => {
        setAnoAtual(anoAtual - 1);
    };

    const handleNextYear = () => {
        setAnoAtual(anoAtual + 1);
    };

    return (
        <div className="tudo">
            <Header />
            <div id='registros-container'>
                <h2 className="titulo">Registros do Paciente</h2>
                <h3 className="nome-paciente"><b>{nomePaciente}</b></h3>
                <div className="ano-navegacao">
                    <button onClick={handlePrevYear}>&lt;</button>
                    <span className="ano">{anoAtual}</span>
                    <button onClick={handleNextYear}>&gt;</button> 
                </div>

                <hr></hr>

                <div className="registros-datas">
                    {registros.length > 0 ? (
                        registros.map((registro) => (
                            <Link
                                key={registro.id}
                                to={`/visualizarHumor/${registro.id}`} // Acesse o ID do registro específico
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
