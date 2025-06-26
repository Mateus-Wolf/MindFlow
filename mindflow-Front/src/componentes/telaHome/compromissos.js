import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Compromissos = () => {
    const [nomeUsuario, setNomeUsuario] = useState('');
    const [compromissos, setCompromissos] = useState([]);

    const usuarioId = localStorage.getItem('usuarioId');

    useEffect(() => {
        const capitalizeFirstLetter = (nome) => {
            return nome.charAt(0).toUpperCase() + nome.slice(1).toLowerCase();
        };

        const nome = localStorage.getItem('nomeUsuario');
        if (nome) {
            setNomeUsuario(capitalizeFirstLetter(nome));
        }
    }, []);

    useEffect(() => {
        const fetchCompromissos = async () => {
            const hoje = new Date();
            const dataFormatada = hoje.toISOString().split('T')[0];

            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/agendamentos?data=${dataFormatada}&usuario_id=${usuarioId}`);
                const compromissosFiltrados = response.data.filter(compromisso => compromisso.status_id === 1);
                setCompromissos(compromissosFiltrados);
            } catch (error) {
                console.error('Erro ao buscar compromissos:', error);
            }
        };

        fetchCompromissos();
    }, [usuarioId]);


    const formatarHora = (hora) => {
        return hora.split(':').slice(0, 2).join(':');
    };

    return (
        <div id="compromissos">
            <h3>Olá, Dr(a). <span className="destaque">{nomeUsuario ? nomeUsuario : ''}</span></h3>
            <hr></hr>
            {compromissos.length > 0 ? (
                compromissos.map((compromisso) => (
                    <div className="compromisso-item" key={compromisso.id}>
                        <span className="hora">
                            <span className="indicador red"></span> {formatarHora(compromisso.hora)}
                        </span>
                        <span className="consulta">
                            <Link to={`/registroHumorAtividades/${compromisso.paciente_id}`} className="link-paciente">
                                {compromisso.nome}
                            </Link>
                        </span>
                    </div>
                ))
            ) : (
                <p>Não há consultas agendadas para hoje.</p>
            )}
        </div>
    );
};

export default Compromissos;
