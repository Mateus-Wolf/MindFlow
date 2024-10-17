import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom'; // Adicione useNavigate
import Header from '../telaHome/header';
import Swal from 'sweetalert2';

const PacienteDados = () => {
    const { id } = useParams();
    const navigate = useNavigate(); // Crie uma instância do navigate
    const [paciente, setPaciente] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        const fetchPaciente = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/pacientes/${id}`);
                setPaciente(response.data);
                setFormData(response.data);
            } catch (error) {
                console.error('Erro ao obter dados do paciente:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPaciente();
    }, [id]);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setFormData(paciente);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleDelete = async () => {
        const confirmation = await Swal.fire({
            title: 'Tem certeza?',
            text: 'Você não poderá reverter isso!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sim, excluir!',
            cancelButtonText: 'Cancelar',
        });

        if (confirmation.isConfirmed) {
            try {
                const response = await axios.delete(`http://localhost:3000/api/pacientes/${id}`);
                Swal.fire('Excluído!', response.data.message, 'success');
                navigate('/telaListar'); // Redireciona para a tela de listagem
            } catch (error) {
                console.error('Erro ao excluir paciente:', error);
                const errorMessage = error.response?.data?.message || 'Não foi possível excluir o paciente.';
                Swal.fire('Erro!', errorMessage, 'error');
            }
        }
    };

    if (loading) {
        return <div>Carregando...</div>;
    }

    return (
        <div id="tudo">
            <Header />
            <div id="paciente-dados">
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="nome">Nome</label>
                        <input
                            type="text"
                            id="nome"
                            name="nome"
                            value={formData.nome}
                            onChange={handleChange}
                            disabled={!isEditing}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="idade">Idade</label>
                        <input
                            type="number"
                            id="idade"
                            name="idade"
                            value={formData.idade}
                            onChange={handleChange}
                            disabled={!isEditing}
                        />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="cpf">CPF</label>
                        <input
                            type="text"
                            id="cpf"
                            name="cpf"
                            value={formData.cpf}
                            onChange={handleChange}
                            disabled={!isEditing}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="cep">CEP</label>
                        <input
                            type="text"
                            id="cep"
                            name="cep"
                            value={formData.cep}
                            onChange={handleChange}
                            disabled={!isEditing}
                        />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="genero">Gênero</label>
                        <select
                            id="genero"
                            name="genero"
                            value={formData.genero}
                            onChange={handleChange}
                            disabled={!isEditing}
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
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={!isEditing}
                        />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="telefone">Telefone/Celular</label>
                        <input
                            type="tel"
                            id="telefone"
                            name="telefone"
                            value={formData.telefone}
                            onChange={handleChange}
                            disabled={!isEditing}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="estadoCivil">Estado Civil</label>
                        <select
                            id="estadoCivil"
                            name="estado_civil"
                            value={formData.estado_civil}
                            onChange={handleChange}
                            disabled={!isEditing}
                        >
                            <option value="casado">Casado</option>
                            <option value="solteiro">Solteiro</option>
                            <option value="divorciado">Divorciado</option>
                            <option value="separado">Separado</option>
                            <option value="viuvo">Viúvo</option>
                        </select>
                    </div>
                </div>
                <div className="button-group">
                    {isEditing ? (
                        <>
                            <button onClick={handleCancel} className="buttonDados">Cancelar</button>
                            <button onClick={handleEdit} className="buttonDados">Salvar</button>
                        </>
                    ) : (
                        <>
                            <button onClick={handleEdit} className="buttonDados">Editar</button>
                            <button onClick={handleDelete} className="delete-small-button">Excluir</button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PacienteDados;
