import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const PacientesRec = () => {
    const [pacientes, setPacientes] = useState([]);

    useEffect(() => {
        const fetchPacientes = async () => {
            const usuarioId = localStorage.getItem('usuarioId');

            if (!usuarioId) {
                console.error('Usuário não está logado.');
                return;
            }

            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/agendamentos/pacientes-recentes`, {
                    params: { usuarioId },
                });
                setPacientes(response.data);
                console.log("Pacientes recebidos:", response.data);
            } catch (error) {
                console.error('Erro ao buscar pacientes recentes:', error);
            }
        };

        fetchPacientes();
    }, []);

    // Função para capitalizar a primeira letra do gênero
    const capitalize = (texto) => {
        if (!texto) return '';
        return texto.charAt(0).toUpperCase() + texto.slice(1);
    };

    return (
        <div id="pacientes-recentes">
            {pacientes.length === 0 ? (
                <p>Os seus pacientes recentes ficarão aqui!</p>
            ) : (
                <>
                    <h3>Pacientes Recentes:</h3>
                    {pacientes.map((paciente) => (
                        <div className="paciente-item" key={paciente.id}>
                            <div className="paciente-info">
                                <h4>{paciente.nome}</h4>
                                <p>
                                    {capitalize(paciente.genero)} • {paciente.idade} anos
                                </p>
                            </div>
                            <div className="paciente-consulta">
                                <Link
                                    to={`/registroHumor/${paciente.id}`}
                                    className="btn-horario secundario"
                                >
                                    {new Date(paciente.dataConsulta).toLocaleDateString()} {paciente.horaConsulta.slice(0, 5)}
                                </Link>
                            </div>
                        </div>
                    ))}
                </>
            )}
        </div>
    );
};

export default PacientesRec;
