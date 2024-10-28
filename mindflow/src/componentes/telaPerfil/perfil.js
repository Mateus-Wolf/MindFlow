import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from '../telaHome/header';
import axios from 'axios';
import Swal from 'sweetalert2';
import InputMask from 'react-input-mask';

const Perfil = () => {
    const [editable, setEditable] = useState(false);
    const [usuario, setUsuario] = useState({});
    const [novaSenha, setNovaSenha] = useState('');
    const [imagem, setImagem] = useState(null);
    const [imagemFile, setImagemFile] = useState(null);
    const navigate = useNavigate();

    const toggleEdit = () => {
        setEditable(prev => !prev);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('usuarioId');
        localStorage.removeItem('nomeUsuario');
        Swal.fire('Logout realizado!', 'Você foi deslogado com sucesso.', 'success');
        navigate('/');
    };

    useEffect(() => {
        const fetchUsuario = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/');
                return;
            }

            try {
                const response = await axios.get('http://localhost:3000/api/usuarios/me', {
                    headers: {
                        Authorization: token,
                    },
                });
                setUsuario(response.data);
                setImagem(response.data.imagem);
            } catch (error) {
                Swal.fire('Erro!', 'Erro ao obter dados do usuário.', 'error');
                navigate('/');
            }
        };

        fetchUsuario();
    }, [navigate]);

    const formatDate = (dateString) => {
        const dateParts = dateString.split('/');
        if (dateParts.length === 3) {
            const day = String(dateParts[0]).padStart(2, '0');
            const month = String(dateParts[1]).padStart(2, '0');
            const year = dateParts[2];
            return `${year}-${month}-${day}`;
        }
        return dateString;
    };

    const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            if (file.size > MAX_IMAGE_SIZE) {
                Swal.fire('Imagem muito grande!', 'Por favor, selecione uma imagem com tamanho menor que 2MB.', 'error');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setImagem(reader.result);
                setImagemFile(file);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        const token = localStorage.getItem('token');
        const usuarioToSave = {
            ...usuario,
            nascimento: formatDate(usuario.nascimento),
        };
    
        try {
            // Verificar se o novo e-mail já está em uso por outro usuário
            const emailCheckResponse = await axios.get(`http://localhost:3000/api/usuarios/email/${usuario.email}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
    
            if (emailCheckResponse.data.exists) {
                Swal.fire('Erro!', 'Este e-mail já está em uso por outro usuário.', 'error');
                return; // Impedir que o código prossiga caso o e-mail já exista
            }
    
            // Continuar com a atualização do usuário
            await axios.put('http://localhost:3000/api/usuarios/me', usuarioToSave, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
    
            if (imagemFile) {
                if (!usuario.id) {
                    throw new Error('ID do usuário não encontrado');
                }
    
                const formData = new FormData();
                formData.append('imagem', imagemFile);
    
                await axios.put(`http://localhost:3000/api/usuarios/${usuario.id}/imagem`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                });
            }
    
            if (novaSenha) {
                await axios.put('http://localhost:3000/api/usuarios/me/senha', { novaSenha }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                Swal.fire('Sucesso!', 'Senha atualizada com sucesso.', 'success');
            }
    
            Swal.fire('Sucesso!', 'Dados atualizados com sucesso.', 'success');
        } catch (error) {
            Swal.fire('Erro!', 'Não foi possível atualizar os dados.', 'error');
        }
        toggleEdit();
    };    

    const handleDateChange = (value) => {
        setUsuario({ ...usuario, nascimento: value });
    };

    const handleDateBlur = () => {
        const { nascimento } = usuario;
        const dateParts = nascimento.split('/');

        if (dateParts.length === 3) {
            const day = dateParts[0];
            const month = dateParts[1];
            const year = dateParts[2];

            const isValidDate = (d, m, y) => {
                const date = new Date(`${y}-${m}-${d}`);
                return date && (date.getMonth() + 1) == m && date.getDate() == d && date.getFullYear() == y;
            };

            if (isValidDate(day, month, year)) {
                setUsuario({ ...usuario, nascimento: `${year}-${month}-${day}` });
            }
        }
    };

    return (
        <div id="conteudoPerfil">
            <Header />
            <div className="perfil-container">
                <div className="avatar-placeholder">
                    {imagem ? (
                        <img src={imagem} alt="Imagem do Usuário" className="avatar" />
                    ) : (
                        <div className="avatar-placeholder">Imagem não disponível</div>
                    )}
                </div>
                <div className="perfil-opcoes">
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="nome">Nome:</label>
                            <input
                                type="text"
                                id="nome"
                                value={usuario.nome || ''}
                                onChange={(e) => setUsuario({ ...usuario, nome: e.target.value })}
                                disabled={!editable}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email:</label>
                            <input
                                type="email"
                                id="email"
                                value={usuario.email || ''}
                                onChange={(e) => setUsuario({ ...usuario, email: e.target.value })}
                                disabled={!editable}
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="nascimento">Nascimento:</label>
                            <InputMask
                                mask="99/99/9999"
                                id="nascimento"
                                value={usuario.nascimento || ''}
                                onChange={(e) => handleDateChange(e.target.value)}
                                onBlur={handleDateBlur}
                                disabled={!editable}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="senha">Senha:</label>
                            <input
                                type="password"
                                id="senha"
                                placeholder="Alterar senha"
                                onChange={(e) => setNovaSenha(e.target.value)}
                                disabled={!editable}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="imagem">Foto de Perfil:</label>
                        <input
                            type="file"
                            id="imagem"
                            onChange={handleImageChange}
                            disabled={!editable}
                        />
                    </div>
                </div>
                <div className="botoes">
                    {editable ? (
                        <>
                            <button onClick={handleSave} className="buttonDados">Salvar</button>
                            <button onClick={toggleEdit} className="buttonDados">Cancelar</button>
                        </>
                    ) : (
                        <button onClick={toggleEdit} className="buttonDados">Editar</button>
                    )}
                    <button className="delete-account" onClick={handleLogout}>Sair</button>
                </div>
            </div>
        </div>
    );
};

export default Perfil;
