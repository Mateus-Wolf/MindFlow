import React, { useState, useEffect } from 'react';
import Header from '../telaHome/header';
import axios from 'axios';

function HistoricoConsultas() {
    const [concluidoOpen, setConcluidoOpen] = useState(false);
    const [canceladoOpen, setCanceladoOpen] = useState(false);
    const [atrasadoOpen, setAtrasadoOpen] = useState(false);
    const [agendamentos, setAgendamentos] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [totalAgendamentos, setTotalAgendamentos] = useState({});

    const usuarioId = localStorage.getItem('usuarioId'); 

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/api/agendamentos/usuario/${usuarioId}`)
        .then(response => {
            setAgendamentos(response.data);
            calcularTotal(response.data);
        })
        .catch(error => {
            console.error("Erro ao carregar agendamentos:", error);
        });
    }, [usuarioId]);

    // Função para calcular total de agendamentos por status
    const calcularTotal = (agendamentos) => {
        const total = {
            concluido: agendamentos.filter(agendamento => agendamento.status_id === 2).length,
            cancelado: agendamentos.filter(agendamento => agendamento.status_id === 3).length,
            atrasado: agendamentos.filter(agendamento => agendamento.status_id === 4).length,
        };
        setTotalAgendamentos(total);
    };

    // Filtra os agendamentos por status e pelo termo de busca
    const agendamentosFiltrados = agendamentos.filter(agendamento => {
        const nomeCompleto = agendamento.nome.toLowerCase();
        return nomeCompleto.includes(searchTerm.toLowerCase());
    });

    const agendamentosConcluidos = agendamentosFiltrados.filter(agendamento => agendamento.status_id === 2);
    const agendamentosCancelados = agendamentosFiltrados.filter(agendamento => agendamento.status_id === 3);
    const agendamentosAtrasados = agendamentosFiltrados.filter(agendamento => agendamento.status_id === 4);

    // Função para selecionar um status
    const handleStatusClick = (status) => {
        setSelectedStatus(status);

        if (status === 'concluido') {
            setConcluidoOpen(!concluidoOpen);
            setCanceladoOpen(false); 
            setAtrasadoOpen(false);
        } else if (status === 'cancelado') {
            setConcluidoOpen(false);
            setCanceladoOpen(!canceladoOpen);
            setAtrasadoOpen(false);
        } else if (status === 'atrasado') {
            setConcluidoOpen(false);
            setCanceladoOpen(false);
            setAtrasadoOpen(!atrasadoOpen);
        }
    };

    // Função para formatar a data para dd/mm/yyyy
    const formatarData = (data) => {
        const dateObj = new Date(data); 
        const dia = String(dateObj.getDate()).padStart(2, '0');
        const mes = String(dateObj.getMonth() + 1).padStart(2, '0');
        const ano = dateObj.getFullYear();
        return `${dia}/${mes}/${ano}`;
    };

    // Função para formatar o nome completo
    const formatarNome = (nome) => {
        return nome
            .split(' ')
            .map(nome => nome.charAt(0).toUpperCase() + nome.slice(1).toLowerCase())
            .join(' ');
    };

    // Função para formatar a hora para apenas horas e minutos
    const formatarHora = (hora) => {
        const partes = hora.split(':');
        return `${partes[0]}:${partes[1]}`;
    };

    return (
        <div className="tudo">
            <Header />
            <div className="historico-container">
                <h2 id='tituloBusca'>Histórico de Consultas</h2>

                <input 
                    type="text" 
                    placeholder="Buscar por nome de paciente" 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                    style={{ marginBottom: '20px', padding: '10px', width: '100%' }}
                />

                <div className="historico-titulos">
                    <h3 
                        onClick={() => handleStatusClick('concluido')}
                        className={selectedStatus === 'concluido' ? 'ativo' : ''}
                    >
                        Concluído ({totalAgendamentos.concluido})
                    </h3>
                    <h3 
                        onClick={() => handleStatusClick('cancelado')}
                        className={selectedStatus === 'cancelado' ? 'ativo' : ''}
                    >
                        Cancelado ({totalAgendamentos.cancelado})
                    </h3>
                    <h3 
                        onClick={() => handleStatusClick('atrasado')}
                        className={selectedStatus === 'atrasado' ? 'ativo' : ''}
                    >
                        Atrasado ({totalAgendamentos.atrasado})
                    </h3>
                </div>

                {/* Lista de Agendamentos Concluídos */}
                {concluidoOpen && (
                    <div className="historico-item">
                        <ul>
                            {agendamentosConcluidos.length > 0 ? (
                                agendamentosConcluidos.map(agendamento => (
                                    <li key={agendamento.id} className="concluido">
                                        {formatarData(agendamento.data)} - {formatarHora(agendamento.hora)} - {formatarNome(agendamento.nome)}
                                    </li>
                                ))
                            ) : (
                                <p>Nenhum agendamento concluído encontrado.</p>
                            )}
                        </ul>
                    </div>
                )}

                {/* Lista de Agendamentos Cancelados */}
                {canceladoOpen && (
                    <div className="historico-item">
                        <ul>
                            {agendamentosCancelados.length > 0 ? (
                                agendamentosCancelados.map(agendamento => (
                                    <li key={agendamento.id} className="cancelado">
                                        {formatarData(agendamento.data)} - {formatarHora(agendamento.hora)} - {formatarNome(agendamento.nome)}
                                    </li>
                                ))
                            ) : (
                                <p>Nenhum agendamento cancelado encontrado.</p>
                            )}
                        </ul>
                    </div>
                )}

                {/* Lista de Agendamentos Atrasados */}
                {atrasadoOpen && (
                    <div className="historico-item">
                        <ul>
                            {agendamentosAtrasados.length > 0 ? (
                                agendamentosAtrasados.map(agendamento => (
                                    <li key={agendamento.id} className="atrasado">
                                        {formatarData(agendamento.data)} - {formatarHora(agendamento.hora)} - {formatarNome(agendamento.nome)}
                                    </li>
                                ))
                            ) : (
                                <p>Nenhum agendamento atrasado encontrado.</p>
                            )}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}

export default HistoricoConsultas;
