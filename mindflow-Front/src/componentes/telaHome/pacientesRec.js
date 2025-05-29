import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

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

                const ocultadosRaw = localStorage.getItem('pacientesOcultados');
                const ocultados = ocultadosRaw ? JSON.parse(ocultadosRaw) : [];

                const pacientesFiltrados = response.data.filter((paciente) => {
                    const dataConsulta = new Date(paciente.dataConsulta).toISOString();
                    return !ocultados.some((oculto) => oculto.id === paciente.id && oculto.dataConsulta === dataConsulta);
                });

                setPacientes(pacientesFiltrados);
                console.log("Pacientes visíveis:", pacientesFiltrados);
            } catch (error) {
                console.error('Erro ao buscar pacientes recentes:', error);
            }
        };

        fetchPacientes();
    }, []);

    const capitalize = (texto) => {
        if (!texto) return '';
        return texto.charAt(0).toUpperCase() + texto.slice(1);
    };

    const limparPacientes = () => {
        Swal.fire({
            title: 'Tem certeza?',
            text: 'Isso vai apenas ocultar os pacientes da lista, mas não apagá-los do sistema.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sim, ocultar!',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                const novosOcultados = pacientes.map((p) => ({
                    id: p.id,
                    dataConsulta: new Date(p.dataConsulta).toISOString()
                }));

                const ocultadosExistentes = JSON.parse(localStorage.getItem('pacientesOcultados')) || [];

                // Junta os novos com os antigos, sem duplicar
                const todosOcultados = [
                    ...ocultadosExistentes,
                    ...novosOcultados.filter((novo) =>
                        !ocultadosExistentes.some(
                            (oculto) => oculto.id === novo.id && oculto.dataConsulta === novo.dataConsulta
                        )
                    ),
                ];

                localStorage.setItem('pacientesOcultados', JSON.stringify(todosOcultados));

                setPacientes([]);
                Swal.fire('Feito!', 'Pacientes ocultados com sucesso.', 'success');
            }
        });
    };

    return (
        <div id="pacientes-recentes">
            {pacientes.length === 0 ? (
                <p>Os seus pacientes recentes ficarão aqui!</p>
            ) : (
                <>
                    <h3>Pacientes Recentes:</h3>
                    <button onClick={limparPacientes} className="btn-limpar-pacientes">
                        Limpar lista
                    </button>
                    {pacientes.map((paciente) => (
                        <div className="paciente-item" key={`${paciente.id}-${paciente.dataConsulta}`}>
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
