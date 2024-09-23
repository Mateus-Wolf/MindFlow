import React, { useState } from "react";
import Header from '../telaHome/header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

const Perfil = () => {
    const [editable, setEditable] = useState({
        nome: false,
        email: false,
        nascimento: false,
        senha: false,
    });

    const toggleEdit = (field) => {
        setEditable((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    return (
        <div id="conteudoPerfil">
            <Header />
            <div className="perfil-container">
                <div className="avatar-placeholder">
                    {/* Aqui você pode adicionar a imagem do avatar */}
                </div>
                <div className="perfil-opcoes">
                    <label>
                        Nome:
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <input type="text" placeholder="Alterar nome" disabled={!editable.nome} />
                            <FontAwesomeIcon icon={faEdit} onClick={() => toggleEdit('nome')} style={{ cursor: 'pointer', marginLeft: '5px' }} />
                        </div>
                    </label>
                    <label>
                        Email:
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <input type="email" placeholder="Alterar email" disabled={!editable.email} />
                            <FontAwesomeIcon icon={faEdit} onClick={() => toggleEdit('email')} style={{ cursor: 'pointer', marginLeft: '5px' }} />
                        </div>
                    </label>
                    <label>
                        Nascimento:
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <input type="date" disabled={!editable.nascimento} />
                            <FontAwesomeIcon icon={faEdit} onClick={() => toggleEdit('nascimento')} style={{ cursor: 'pointer', marginLeft: '5px' }} />
                        </div>
                    </label>
                    <label>
                        Senha:
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <input type="password" placeholder="Alterar senha" disabled={!editable.senha} />
                            <FontAwesomeIcon icon={faEdit} onClick={() => toggleEdit('senha')} style={{ cursor: 'pointer', marginLeft: '5px' }} />
                        </div>
                    </label>
                </div>

                <div id="botoes">
                    <div className="btn-esquerda">
                        <button className="save-account">Salvar</button>
                    </div>
                    <div className="btn-direita">
                        <button className="delete-account">Sair</button>
                        <button className="delete-account">Excluir conta</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Perfil;
