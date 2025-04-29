import React, { useState } from 'react';
import Header from '../telaHome/header';
import axios from 'axios';
import Swal from 'sweetalert2';

const PacienteCadastro = ({ usuarioId }) => {
    const [nome, setNome] = useState('');
    const [idade, setIdade] = useState('');
    const [cpf, setCpf] = useState('');
    const [cep, setCep] = useState('');
    const [genero, setGenero] = useState('masculino');
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState('');
    const [estadoCivil, setEstadoCivil] = useState('casado');

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const usuarioId = localStorage.getItem('usuarioId');
        console.log(usuarioId)
    
        const pacienteData = {
            usuario_ID: usuarioId,
            nome,
            idade,
            cpf,
            cep,
            genero,
            email,
            telefone,
            estado_civil: estadoCivil,
        };
    
        const allFieldsFilled = Object.values(pacienteData).every((value) => value !== undefined && value !== '');
        if (!allFieldsFilled) {
            console.error('Todos os campos devem ser preenchidos.');
            return;
        }
    
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/pacientes`, pacienteData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            console.log('Paciente cadastrado com sucesso:', response.data);
    
            Swal.fire({
                title: 'Sucesso!',
                text: 'Paciente cadastrado com sucesso!',
                icon: 'success',
                confirmButtonText: 'Ok'
            }).then(() => {
                window.location.href = 'telaListar';
            });
    
        } catch (error) {
            console.log("Dados enviados:", JSON.stringify(pacienteData, null, 2));

            console.error('Erro ao cadastrar paciente:', error.response ? error.response.data : error.message);
        }
    };
    
    
    return (
        <div id="tudo">
            <Header />
            <div className="form-container">
                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="nome">Nome</label>
                            <input type="text" id="nome" placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="idade">Idade</label>
                            <input type="number" id="idade" placeholder="Idade" value={idade} onChange={(e) => setIdade(e.target.value)} required />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="cpf">CPF</label>
                            <input type="text" id="cpf" placeholder="CPF" value={cpf} onChange={(e) => setCpf(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="cep">CEP</label>
                            <input type="text" id="cep" placeholder="CEP" value={cep} onChange={(e) => setCep(e.target.value)} required />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="genero">Gênero</label>
                            <select id="genero" value={genero} onChange={(e) => setGenero(e.target.value)}>
                                <option value="masculino">Masculino</option>
                                <option value="feminino">Feminino</option>
                                <option value="nao-binario">Não Binário</option>
                                <option value="outro">Outro</option>
                                <option value="nao-informar">Não Informar</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input type="email" id="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="telefone">Telefone/Celular</label>
                            <input type="tel" id="telefone" placeholder="Telefone/Celular" value={telefone} onChange={(e) => setTelefone(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="estadoCivil">Estado Civil</label>
                            <select id="estadoCivil" value={estadoCivil} onChange={(e) => setEstadoCivil(e.target.value)}>
                                <option value="casado">Casado</option>
                                <option value="solteiro">Solteiro</option>
                                <option value="divorciado">Divorciado</option>
                                <option value="viuvo">Separado</option>
                                <option value="viuvo">Viúvo</option>
                            </select>
                        </div>
                    </div>
                    
                    <button type="submit" className="submit-button">Cadastrar Paciente</button>
                </form>
            </div>
        </div>
    );
};

export default PacienteCadastro;
