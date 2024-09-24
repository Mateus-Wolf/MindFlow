import React, { useState } from 'react';
import Header from '../telaHome/header';

const PacientesLista = () => {
    const [searchTerm, setSearchTerm] = useState(''); // Estado para o termo de pesquisa

    // Lista de pacientes simulada
    const pacientes = [
        { id: 1, nome: 'Gabo Gabriel', img: '/path/to/image.jpg' },
        { id: 2, nome: 'Ana Silva', img: '/path/to/image.jpg' },
        { id: 3, nome: 'Lucas Lima', img: '/path/to/image.jpg' },
    ];

    // Função para atualizar o estado conforme o usuário digita
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

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
                        <img src={paciente.img} alt={paciente.nome} className="paciente-img" />
                        <div className="paciente-info">
                            <h4>{paciente.nome}</h4>
                        </div>
                        <div className="paciente-botoes">
                            <button className="btn-opcao">Dados</button>
                            <button className="btn-opcao">Registros</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PacientesLista;
