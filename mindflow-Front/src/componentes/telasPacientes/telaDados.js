import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../telaHome/header';
import Swal from 'sweetalert2';

const PacienteDados = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [paciente, setPaciente] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        const fetchPaciente = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/pacientes/${id}`);
                setPaciente(response.data);
                setFormData(response.data);
            } catch (error) {
                console.error('Erro ao obter dados do paciente:', error);
                Swal.fire('Erro!', 'Não foi possível obter os dados do paciente.', 'error');
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

    const formatCPF = (cpf) => {
        return cpf
            .replace(/\D/g, '') 
            .replace(/(\d{3})(\d)/, '$1.$2') 
            .replace(/(\d{3})(\d)/, '$1.$2') 
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2'); 
    };

    const formatCEP = (cep) => {
        return cep
            .replace(/\D/g, '')
            .replace(/(\d{5})(\d)/, '$1-$2'); 
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
                const response = await axios.delete(`${process.env.REACT_APP_API_URL}/api/pacientes/${id}`);
                Swal.fire('Excluído!', response.data.message, 'success');
                navigate('/telaListar');
            } catch (error) {
                console.error('Erro ao excluir paciente:', error);
                const errorMessage = error.response?.data?.message || 'Não foi possível excluir o paciente.';
                Swal.fire('Erro!', errorMessage, 'error');
            }
        }
    };

    const handleSave = async () => {
        try {
            // Verificar se o CPF já existe, mas não verificar se é o mesmo do paciente que está sendo editado
            const cpfResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/pacientes/cpf/${formData.cpf}`);
            if (cpfResponse.data.exists && formData.cpf !== paciente.cpf) {
                return Swal.fire('Erro!', 'Este CPF já está em uso.', 'error');
            }
    
            // Se o CPF não existe ou é o mesmo do paciente, prosseguir com a atualização
            const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/pacientes/${id}`, formData);
            setPaciente(response.data);
            setIsEditing(false);
            Swal.fire('Sucesso!', 'Dados do paciente atualizados com sucesso.', 'success');
        } catch (error) {
            console.error('Erro ao salvar dados do paciente:', error);
            Swal.fire('Erro!', 'Não foi possível salvar os dados do paciente.', 'error');
        }
    };

    const formattedCPF = formData.cpf ? formatCPF(formData.cpf) : '';
    const formattedCEP = formData.cep ? formatCEP(formData.cep) : '';

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
                            value={isEditing ? formData.cpf : formattedCPF}
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
                            value={isEditing ? formData.cep : formattedCEP}
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
                            <button onClick={handleSave} className="buttonDados">Salvar</button>
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
