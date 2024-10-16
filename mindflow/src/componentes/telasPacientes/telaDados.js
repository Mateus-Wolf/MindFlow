import React, { useState, useEffect } from 'react';
import Header from '../telaHome/header';
import axios from 'axios';
import Swal from 'sweetalert2'; // Importa SweetAlert

const PacienteDetalhes = ({ pacienteId }) => {
    const [nome, setNome] = useState('');
    const [idade, setIdade] = useState('');
    const [cpf, setCpf] = useState('');
    const [cep, setCep] = useState('');
    const [genero, setGenero] = useState('masculino');
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState('');
    const [estadoCivil, setEstadoCivil] = useState('casado');
    const [isEditMode, setIsEditMode] = useState(false);
    const [originalData, setOriginalData] = useState({}); // Para armazenar os dados originais

    useEffect(() => {
        // Carregar os dados do paciente ao montar o componente
        const fetchPacienteData = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/pacientes/${pacienteId}`);
                const { nome, idade, cpf, cep, genero, email, telefone, estado_civil } = response.data;
                setNome(nome);
                setIdade(idade);
                setCpf(cpf);
                setCep(cep);
                setGenero(genero);
                setEmail(email);
                setTelefone(telefone);
                setEstadoCivil(estado_civil);
                setOriginalData(response.data); // Armazena os dados originais
            } catch (error) {
                console.error('Erro ao carregar dados do paciente:', error);
            }
        };

        fetchPacienteData();
    }, [pacienteId]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatedPacienteData = {
            nome,
            idade,
            cpf,
            cep,
            genero,
            email,
            telefone,
            estado_civil: estadoCivil,
        };

        try {
            const response = await axios.put(`http://localhost:3000/api/pacientes/${pacienteId}`, updatedPacienteData);
            console.log('Paciente atualizado com sucesso:', response.data);

            Swal.fire({
                title: 'Sucesso!',
                text: 'Paciente atualizado com sucesso!',
                icon: 'success',
                confirmButtonText: 'Ok',
            }).then(() => {
                setIsEditMode(false); // Sair do modo de edição
            });
        } catch (error) {
            console.error('Erro ao atualizar paciente:', error.response ? error.response.data : error.message);
        }
    };

    const handleDelete = async () => {
        Swal.fire({
            title: 'Tem certeza?',
            text: 'Você não poderá desfazer essa ação!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sim, excluir!',
            cancelButtonText: 'Cancelar',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`http://localhost:3000/api/pacientes/${pacienteId}`);
                    Swal.fire('Excluído!', 'O paciente foi excluído.', 'success').then(() => {
                        window.location.href = 'telaListar'; // Redireciona para a listagem após a exclusão
                    });
                } catch (error) {
                    console.error('Erro ao excluir paciente:', error);
                }
            }
        });
    };

    const handleCancelEdit = () => {
        // Restaura os dados originais e sai do modo de edição
        setNome(originalData.nome);
        setIdade(originalData.idade);
        setCpf(originalData.cpf);
        setCep(originalData.cep);
        setGenero(originalData.genero);
        setEmail(originalData.email);
        setTelefone(originalData.telefone);
        setEstadoCivil(originalData.estado_civil);
        setIsEditMode(false);
    };

    return (
        <div id="tudo">
            <Header />
            <div className="form-container">
                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="nome">Nome</label>
                            <input
                                type="text"
                                id="nome"
                                placeholder="Nome"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                disabled={!isEditMode}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="idade">Idade</label>
                            <input
                                type="number"
                                id="idade"
                                placeholder="Idade"
                                value={idade}
                                onChange={(e) => setIdade(e.target.value)}
                                disabled={!isEditMode}
                                required
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="cpf">CPF</label>
                            <input
                                type="text"
                                id="cpf"
                                placeholder="CPF"
                                value={cpf}
                                onChange={(e) => setCpf(e.target.value)}
                                disabled={!isEditMode}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="cep">CEP</label>
                            <input
                                type="text"
                                id="cep"
                                placeholder="CEP"
                                value={cep}
                                onChange={(e) => setCep(e.target.value)}
                                disabled={!isEditMode}
                                required
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="genero">Gênero</label>
                            <select
                                id="genero"
                                value={genero}
                                onChange={(e) => setGenero(e.target.value)}
                                disabled={!isEditMode}
                            >
                                <option value="masculino">Masculino</option>
                                <option value="feminino">Feminino</option>
                                <option value="nao-binario">Não Binário</option>
                                <option value="outro">Outro</option>
                                <option value="nao-informar">Não Informar</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={!isEditMode}
                                required
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="telefone">Telefone/Celular</label>
                            <input
                                type="tel"
                                id="telefone"
                                placeholder="Telefone/Celular"
                                value={telefone}
                                onChange={(e) => setTelefone(e.target.value)}
                                disabled={!isEditMode}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="estadoCivil">Estado Civil</label>
                            <select
                                id="estadoCivil"
                                value={estadoCivil}
                                onChange={(e) => setEstadoCivil(e.target.value)}
                                disabled={!isEditMode}
                            >
                                <option value="casado">Casado</option>
                                <option value="solteiro">Solteiro</option>
                                <option value="divorciado">Divorciado</option>
                                <option value="separado">Separado</option>
                                <option value="viuvo">Viúvo</option>
                            </select>
                        </div>
                    </div>
                    {isEditMode ? (
                        <>
                                <button type="submit" className="buttonDados">Salvar</button>
                                <button type="button" className="buttonDados" onClick={handleCancelEdit}>Cancelar</button>
                        </>
                    ) : (
                        <button type="button" className="buttonDados" onClick={() => setIsEditMode(true)}>Editar</button>
                    )}
                    <button type="button" className="delete-button" onClick={handleDelete}>Excluir</button>
                </form>
            </div>
        </div>
    );
};

export default PacienteDetalhes;
