import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../telaHome/header';
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

const PacientesLista = () => {
    const [searchTerm, setSearchTerm] = useState(''); // Estado para o termo de pesquisa
    const [pacientes, setPacientes] = useState([]); // Estado para armazenar a lista de pacientes
    const [loading, setLoading] = useState(true); // Estado para controle de loading

    const navigate = useNavigate();

    const handleClick = (id) => {
        navigate(`/telaDados/${id}`);  // Substitua pela rota que leva à página de dados do paciente
    };

    // Função para atualizar o estado conforme o usuário digita
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Obtenha o ID do usuário logado do localStorage e converta para número
    const usuarioId = localStorage.getItem('usuarioId');
    console.log('ID do usuário logado:', usuarioId); // Verifique se o ID do usuário está sendo obtido corretamente

    // useEffect para buscar pacientes da API e filtrar por usuarioId
    useEffect(() => {
        const fetchPacientes = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/pacientes');
                const pacientesFiltrados = response.data.filter(paciente => String(paciente.usuario_id) === String(usuarioId));
                setPacientes(pacientesFiltrados); // Filtra os pacientes pelo usuarioId
            } catch (error) {
                console.error('Erro ao obter pacientes:', error);
            } finally {
                setLoading(false); // Finaliza o loading
            }
        };

        fetchPacientes();
    }, [usuarioId]);

    if (loading) {
        return <div>Carregando...</div>; // Exibe loading enquanto os dados estão sendo carregados
    }

    // Filtra os pacientes com base no termo de pesquisa
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
                        onChange={handleSearchChange} // Atualiza o termo de pesquisa
                    />
                </div>

                {filteredPacientes.map((paciente) => (
                    <div key={paciente.id} className="paciente-item">
                        <img src={paciente.img || '/path/to/image.jpg'} alt={paciente.nome} className="paciente-img" />
                        <div className="paciente-info">
                            <h4>{paciente.nome}</h4>
                        </div>
                        <div className="paciente-botoes">
                            <button className="btn-opcao" onClick={() => handleClick(paciente.id)}>Dados</button>
                            <Link to="/registroHumorAtividades">
                                <button className="btn-Registros">Registros</button>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PacientesLista;
