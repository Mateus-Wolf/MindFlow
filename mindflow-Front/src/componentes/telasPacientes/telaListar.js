import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../telaHome/header';
import { Link, useNavigate } from "react-router-dom";

const PacientesLista = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [pacientes, setPacientes] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const handleClick = (id) => {
        navigate(`/telaDados/${id}`);
    };

    const handleClickRegistro = (id) => {
        navigate(`/registroHumor/${id}`);
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        const formattedValue = value.charAt(0).toUpperCase() + value.slice(1);
        setSearchTerm(formattedValue);
    };

    const usuarioId = localStorage.getItem('usuarioId');

    const capitalizarNome = (nome) => {
        return nome
            .toLowerCase()
            .split(' ')
            .map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1))
            .join(' ');
    };
    
    useEffect(() => {
        const fetchPacientes = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/pacientes`);
                const pacientesFiltrados = response.data.filter(paciente => String(paciente.usuario_id) === String(usuarioId));
                setPacientes(pacientesFiltrados);
            } catch (error) {
                console.error('Erro ao obter pacientes:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPacientes();
    }, [usuarioId]);

    if (loading) {
        return <div>Carregando...</div>;
    }

    const filteredPacientes = pacientes.filter((paciente) =>
        paciente.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div id="tudo">
            <Header />
            <div id="pacientes-lista">
                <div className="search-bar">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Pesquisar..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </div>

                {filteredPacientes.map((paciente) => (
                    <div key={paciente.id} className="paciente-item">
                        <div className="paciente-info">
                        <h4>{capitalizarNome(paciente.nome)}</h4>
                            <p>Idade: {paciente.idade}</p>
                        </div>
                        <div className="paciente-botoes">
                            <button className="btn-opcao" onClick={() => handleClick(paciente.id)}>Dados</button>
                            <button className="btn-Registros" onClick={() => handleClickRegistro(paciente.id)}>Registros</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PacientesLista;
