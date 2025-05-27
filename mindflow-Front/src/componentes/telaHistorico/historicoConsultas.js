import React, { useState, useEffect } from 'react';
import Header from '../telaHome/header';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

function HistoricoConsultas() {
    const [concluidoOpen, setConcluidoOpen] = useState(false);
    const [canceladoOpen, setCanceladoOpen] = useState(false);
    const [atrasadoOpen, setAtrasadoOpen] = useState(false);
    const [agendamentos, setAgendamentos] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [totalAgendamentos, setTotalAgendamentos] = useState({});

    const usuarioId = localStorage.getItem('usuarioId'); 

    // Função para normalizar string: remove acento e converte para minúsculo
    const normalizeString = (str) =>
        str
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase();

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

    const calcularTotal = (agendamentos) => {
        const total = {
            concluido: agendamentos.filter(agendamento => agendamento.status_id === 2).length,
            cancelado: agendamentos.filter(agendamento => agendamento.status_id === 3).length,
            atrasado: agendamentos.filter(agendamento => agendamento.status_id === 4).length,
        };
        setTotalAgendamentos(total);
    };

    // Agora o filtro usa a função normalizeString pra comparar
    const agendamentosFiltrados = agendamentos.filter(agendamento => {
        const nomeNormalizado = normalizeString(agendamento.nome);
        const searchNormalizado = normalizeString(searchTerm);
        return nomeNormalizado.includes(searchNormalizado);
    });

    const agendamentosConcluidos = agendamentosFiltrados.filter(agendamento => agendamento.status_id === 2);
    const agendamentosCancelados = agendamentosFiltrados.filter(agendamento => agendamento.status_id === 3);
    const agendamentosAtrasados = agendamentosFiltrados.filter(agendamento => agendamento.status_id === 4);

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

    const formatarData = (data) => {
        const dateObj = new Date(data); 
        const dia = String(dateObj.getDate()).padStart(2, '0');
        const mes = String(dateObj.getMonth() + 1).padStart(2, '0');
        const ano = dateObj.getFullYear();
        return `${dia}/${mes}/${ano}`;
    };

    const formatarNome = (nome) => {
        return nome
            .split(' ')
            .map(nome => nome.charAt(0).toUpperCase() + nome.slice(1).toLowerCase())
            .join(' ');
    };

    const formatarHora = (hora) => {
        const partes = hora.split(':');
        return `${partes[0]}:${partes[1]}`;
    };

    const listaAnimada = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemAnimado = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 }
    };

    return (
        <div className="tudo">
            <Header />
            <motion.div 
                className="historico-container"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h2 id='tituloBusca'>Histórico de Consultas</h2>

                <input 
                    type="text" 
                    placeholder="Buscar por nome de paciente" 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                    style={{ marginBottom: '20px', padding: '10px', width: '100%' }}
                />

                <div className="historico-titulos">
                    {['concluido', 'cancelado', 'atrasado'].map(status => (
                        <motion.h3
                            key={status}
                            onClick={() => handleStatusClick(status)}
                            className={selectedStatus === status ? 'ativo' : ''}
                            whileTap={{ scale: 0.95 }}
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)} ({totalAgendamentos[status] || 0})
                        </motion.h3>
                    ))}
                </div>

                <AnimatePresence>
                    {concluidoOpen && (
                        <motion.div 
                            className="historico-item"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            <motion.ul variants={listaAnimada} initial="hidden" animate="visible">
                                {agendamentosConcluidos.length > 0 ? (
                                    agendamentosConcluidos.map(agendamento => (
                                        <motion.li key={agendamento.id} className="concluido" variants={itemAnimado}>
                                            {formatarData(agendamento.data)} - {formatarHora(agendamento.hora)} - {formatarNome(agendamento.nome)}
                                        </motion.li>
                                    ))
                                ) : (
                                    <p className='mensagemHistorico'>Nenhum agendamento concluído encontrado.</p>
                                )}
                            </motion.ul>
                        </motion.div>
                    )}

                    {canceladoOpen && (
                        <motion.div 
                            className="historico-item"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            <motion.ul variants={listaAnimada} initial="hidden" animate="visible">
                                {agendamentosCancelados.length > 0 ? (
                                    agendamentosCancelados.map(agendamento => (
                                        <motion.li key={agendamento.id} className="cancelado" variants={itemAnimado}>
                                            {formatarData(agendamento.data)} - {formatarHora(agendamento.hora)} - {formatarNome(agendamento.nome)}
                                        </motion.li>
                                    ))
                                ) : (
                                    <p className='mensagemHistorico'>Nenhum agendamento cancelado encontrado.</p>
                                )}
                            </motion.ul>
                        </motion.div>
                    )}

                    {atrasadoOpen && (
                        <motion.div 
                            className="historico-item"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            <motion.ul variants={listaAnimada} initial="hidden" animate="visible">
                                {agendamentosAtrasados.length > 0 ? (
                                    agendamentosAtrasados.map(agendamento => (
                                        <motion.li key={agendamento.id} className="atrasado" variants={itemAnimado}>
                                            {formatarData(agendamento.data)} - {formatarHora(agendamento.hora)} - {formatarNome(agendamento.nome)}
                                        </motion.li>
                                    ))
                                ) : (
                                    <p className='mensagemHistorico'>Nenhum agendamento atrasado encontrado.</p>
                                )}
                            </motion.ul>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}

export default HistoricoConsultas;
