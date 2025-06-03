import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from '../telaHome/header';
import axios from 'axios';
import Swal from 'sweetalert2';
import InputMask from 'react-input-mask';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import autoTable from 'jspdf-autotable';

const Perfil = () => {
    const [editable, setEditable] = useState(false);
    const [usuario, setUsuario] = useState({
        nome: '',
        email: '',
        nascimento: '',
        registro_profissional: '',
        experiencia_anos: '',
        estado_atuacao: '',
        telefone: '',
        idiomas: [],
        data_criacao: ''
    });
    const [novaSenha, setNovaSenha] = useState('');
    const [imagem, setImagem] = useState(null);
    const [imagemFile, setImagemFile] = useState(null);
    const navigate = useNavigate();
    const doc = new jsPDF();

    const gerarRelatorioPDF = async () => {
        const token = localStorage.getItem('token');
        const usuarioId = localStorage.getItem('usuarioId');
        const nomeUsuario = localStorage.getItem('nomeUsuario');

        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/agendamentos/usuario/${usuarioId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const agendamentos = response.data;

            const doc = new jsPDF();

            // Título personalizado
            doc.setFontSize(16);
            doc.text(`Atendimentos do Dr. ${nomeUsuario}`, 14, 20);

            // Dados da tabela
            const tableData = agendamentos.map((ag) => [
                ag.nome,
                new Date(ag.data).toLocaleDateString('pt-BR'),
                ag.hora ? ag.hora.slice(0, 5) : 'Sem hora',
            ]);

            // Tabela
            autoTable(doc, {
                head: [['Paciente', 'Data', 'Hora']],
                body: tableData,
                startY: 30,
            });

            // Rodapé
            const pageHeight = doc.internal.pageSize.height;
            doc.setFontSize(10);
            doc.text('© 2025 MindFlow - Todos os direitos reservados.', 14, pageHeight - 10);

            // Salvar o PDF
            const pdfBlob = doc.output('blob');
            const pdfUrl = URL.createObjectURL(pdfBlob);
            window.open(pdfUrl);
            doc.save('relatorio_consultas.pdf');
        } catch (error) {
            Swal.fire('Erro', 'Não foi possível gerar o relatório.', 'error');
            console.error('Erro ao gerar relatório:', error);
        }
    };
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

    const displayFormattedDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const saveFormattedDate = (dateString) => {
        const [day, month, year] = dateString.split('/');
        return `${year}-${month}-${day}`;
    };

    useEffect(() => {
        const fetchUsuario = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/');
                return;
            }

            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/usuarios/me`, {
                    headers: {
                        Authorization: token,
                    },
                });

                console.log("Dados do usuário recebidos:", response.data);

                if (response.data.nascimento) {
                    setUsuario({ ...response.data, nascimento: displayFormattedDate(response.data.nascimento) });
                } else {
                    setUsuario(response.data);
                }

                setImagem(response.data.imagem);
            } catch (error) {
                Swal.fire('Erro!', 'Erro ao obter dados do usuário.', 'error');
                navigate('/');
            }
        };

        fetchUsuario();
    }, [navigate]);

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

    const handleRemoveImage = () => {
        Swal.fire({
            title: 'Remover imagem?',
            text: 'Sua foto de perfil será removida.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sim, remover',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                setImagem(null);
                setImagemFile(null);
            }
        });
    };

    const handleSave = async () => {
        const token = localStorage.getItem('token');
        const usuarioToSave = {
            ...usuario,
            nascimento: saveFormattedDate(usuario.nascimento),
        };

        try {
            if (usuario.email !== usuarioToSave.email) {
                const emailCheckResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/usuarios/email/${usuarioToSave.email}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (emailCheckResponse.data.exists) {
                    Swal.fire('Erro!', 'Este e-mail já está em uso por outro usuário.', 'error');
                    return;
                }
            }

            await axios.put(`${process.env.REACT_APP_API_URL}/api/usuarios/me`, usuarioToSave, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (imagemFile) {
                const formData = new FormData();
                formData.append('imagem', imagemFile);

                await axios.put(`${process.env.REACT_APP_API_URL}/api/usuarios/${usuario.id}/imagem`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                });
            } else if (imagem === null) {
                await axios.delete(`${process.env.REACT_APP_API_URL}/api/usuarios/${usuario.id}/imagem`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            }

            if (novaSenha) {
                await axios.put(`${process.env.REACT_APP_API_URL}/api/usuarios/novaSenha`, { novaSenha }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
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

    const capitalizarNome = (nome) => {
        return nome
            .toLowerCase()
            .split(' ')
            .map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1))
            .join(' ');
    };

    return (
        <div id="tudo">
            <Header />
            <div className="perfil-layout">
                <div className="avatar-wrapper">
                    <div className="avatar-placeholder">
                        {imagem ? (
                            <img src={imagem} alt="Imagem do Usuário" className="avatar" />
                        ) : (
                            <img src="mindflow/src/icones/perfil_PlaceHolder.png" className="avatar" />
                        )}
                        {editable && (
                            <label htmlFor="imagem" className="foto-overlay">
                                Trocar Foto
                            </label>
                        )}
                    </div>
                </div>
                <div id="dadosPerfil">
                    <div className="perfil-opcoes">
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="nome">Nome:</label>
                                <input
                                    type="text"
                                    id="nome"
                                    value={editable ? usuario.nome || '' : capitalizarNome(usuario.nome || '')}
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
                                    disabled={!editable}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="telefone">Telefone:</label>
                                <InputMask
                                    mask="(99) 99999-9999"
                                    id="telefone"
                                    value={usuario.telefone || ''}
                                    onChange={(e) => setUsuario({ ...usuario, telefone: e.target.value })}
                                    disabled={!editable}
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="estado_atuacao">Estado de Atuação (UF):</label>
                                <input
                                    type="text"
                                    id="estado_atuacao"
                                    maxLength={2}
                                    value={usuario.estado_atuacao || ''}
                                    onChange={(e) => setUsuario({ ...usuario, estado_atuacao: e.target.value.toUpperCase() })}
                                    disabled={!editable}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="registro_profissional">Registro Profissional:</label>
                                <input
                                    type="text"
                                    id="registro_profissional"
                                    value={usuario.registro_profissional || ''}
                                    onChange={(e) => setUsuario({ ...usuario, registro_profissional: e.target.value })}
                                    disabled={!editable}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="experiencia_anos">Anos de Experiência:</label>
                                <input
                                    type="number"
                                    id="experiencia_anos"
                                    value={usuario.experiencia_anos || ''}
                                    onChange={(e) => setUsuario({ ...usuario, experiencia_anos: e.target.value })}
                                    disabled={!editable}
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="idiomas">Idiomas:</label>
                                <input
                                    type="text"
                                    id="idiomas"
                                    value={(usuario.idiomas || []).join(', ')}
                                    onChange={(e) =>
                                        setUsuario({ ...usuario, idiomas: e.target.value.split(',').map((i) => i.trim()) })
                                    }
                                    disabled={!editable}
                                />
                            </div>
                        </div>

                        <input
                            type="file"
                            id="imagem"
                            onChange={handleImageChange}
                            disabled={!editable}
                            style={{ display: 'none' }}
                        />
                    </div>

                    {/* Botões */}
                    <div className="botoes">
                        <button onClick={gerarRelatorioPDF} className="buttonDados" style={{ marginRight: '10px' }}>
                            Gerar Relatório
                        </button>

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
        </div>
    );
};

export default Perfil;
