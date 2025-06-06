import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import AnimatedEye from '../iconesAnimados/AnimatedEye';
import { motion, AnimatePresence } from 'framer-motion';

const Login = ({ voltar }) => {
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [telaEsqueciSenha, setTelaEsqueciSenha] = useState(false);
    const [telaAtualizarSenha, setTelaAtualizarSenha] = useState(false);
    const [codigoEnviado, setCodigoEnviado] = useState(false);
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [codigo, setCodigo] = useState('');
    const [mensagemErro, setMensagemErro] = useState('');
    const [novaSenha, setNovaSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');

    const navigate = useNavigate();

    const alternarVisibilidadeSenha = () => setMostrarSenha(!mostrarSenha);
    const mostrarTelaEsqueciSenha = () => setTelaEsqueciSenha(true);
    const mostrarTelaAtualizarSenha = () => setTelaAtualizarSenha(true);
    const voltarParaLogin = () => {
        setTelaEsqueciSenha(false);
        setTelaAtualizarSenha(false);
        setCodigoEnviado(false);
    };

    const atualizarSenha = async (e) => {
        e.preventDefault();
        if (novaSenha !== confirmarSenha) {
            setMensagemErro('As senhas não coincidem.');
            return;
        }
        try {
            const resposta = await fetch(`${process.env.REACT_APP_API_URL}/api/atualizar-senha`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, novaSenha, codigoRecuperacao: codigo }),
            });

            if (resposta.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Senha Atualizada!',
                    text: 'Sua senha foi atualizada com sucesso! Você já pode usar o MindFlow!',
                }).then(() => navigate('/home'));
            } else {
                const erro = await resposta.json();
                setMensagemErro(erro.message || 'Erro ao atualizar a senha');
            }
        } catch (error) {
            setMensagemErro('Erro ao atualizar a senha. Tente novamente.');
        }
    };

    const enviarCodigoEmail = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/verificar-email`, { email });
            if (response.status === 200) {
                setCodigoEnviado(true);
                Swal.fire({
                    icon: 'success',
                    title: 'Código enviado!',
                    text: 'Verifique seu e-mail para o código de recuperação.',
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Erro ao enviar código',
                text: 'Não foi possível enviar o código. Tente novamente.',
            });
        }
    };

    const verificarCodigo = async (e) => {
        e.preventDefault();
        if (!email || !codigo) {
            setMensagemErro('Por favor, preencha todos os campos.');
            return;
        }

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/verificar-codigo`, { email, codigo });
            if (response.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Código verificado!',
                    text: 'Agora você pode atualizar sua senha.',
                });
                setTelaAtualizarSenha(true);
                setTelaEsqueciSenha(false);
            }
        } catch (error) {
            setMensagemErro('Código inválido ou expirado.');
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setMensagemErro('');
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/login`, { email, senha });
            const { token, nome, id: userId } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('usuarioId', userId);
            localStorage.setItem('nomeUsuario', nome);

            Swal.fire({
                icon: 'success',
                title: 'Login bem-sucedido!',
                text: 'Bem-vindo ao MindFlow.',
                confirmButtonText: 'Continuar'
            }).then(() => navigate('/home'));
        } catch (error) {
            setMensagemErro('Email ou senha incorretos.');
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && email && senha) handleLogin(e);
    };

    return (
        <div id='conteudo'>
            <AnimatePresence mode="wait">
                {!telaEsqueciSenha && !telaAtualizarSenha && (
                    <motion.div
                        key="login"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -30 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h2>Entrar na sua conta do MindFlow</h2>
                        <form onSubmit={handleLogin}>
                            <motion.input
                                className='form'
                                type="text"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onKeyDown={handleKeyDown}
                                required
                                whileFocus={{
                                    scale: 1.03,
                                    borderColor: "#7e22ff",
                                    boxShadow: "0 0 10px rgba(126, 34, 255, 0.3)"
                                }}
                                transition={{ type: "spring", stiffness: 300 }}
                            />

                            <div className='password-container'>
                                <motion.input
                                    className='form password-input'
                                    type={mostrarSenha ? "text" : "password"}
                                    placeholder="Senha"
                                    value={senha}
                                    onChange={(e) => setSenha(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    required
                                    whileFocus={{
                                        scale: 1.03,
                                        borderColor: "#7e22ff",
                                        boxShadow: "0 0 10px rgba(126, 34, 255, 0.3)"
                                    }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                />
                                <button
                                    type="button"
                                    className='password-toggle'
                                    onClick={alternarVisibilidadeSenha}
                                >
                                    <AnimatedEye aberto={mostrarSenha} />
                                </button>
                            </div>

                            <div className='form-group'>
                                <a href="#" className='forgot-password' onClick={mostrarTelaEsqueciSenha}>
                                    Esqueci minha senha
                                </a>
                            </div>

                            {mensagemErro && <p className='error-message'>{mensagemErro}</p>}

                            <button className='btns' onClick={voltar}>Voltar</button>
                            <button
                                className='btns'
                                type="submit"
                                disabled={!email || !senha}
                                style={{
                                    backgroundColor: email && senha ? 'rgb(71, 6, 135)' : 'gray',
                                    cursor: email && senha ? 'pointer' : 'not-allowed',
                                }}
                            >
                                Enviar
                            </button>
                        </form>
                    </motion.div>
                )}

                {telaEsqueciSenha && !telaAtualizarSenha && (
                    <motion.div
                        key="esqueci"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -30 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h2>Recuperar Senha</h2>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            enviarCodigoEmail();
                        }}>
                            <div className="email-container">
                                <input
                                    className='form'
                                    type="email"
                                    placeholder="Digite seu e-mail"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className='email-send-btn'
                                    onClick={enviarCodigoEmail}
                                >
                                    Enviar Código
                                </button>
                            </div>

                            {codigoEnviado && (
                                <p className='codigo-enviado-msg'>O Código de verificação foi enviado para o seu e-mail!</p>
                            )}

                            <input
                                className='form'
                                type="text"
                                placeholder="Digite o código de verificação"
                                value={codigo}
                                onChange={(e) => setCodigo(e.target.value)}
                                required
                            />
                            <button className='btns' onClick={voltarParaLogin}>Voltar</button>
                            <button className='btns' onClick={verificarCodigo}>Verificar Código</button>
                        </form>
                    </motion.div>
                )}

                {telaAtualizarSenha && (
                    <motion.div
                        key="atualizar"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -30 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h2>Atualizar Senha</h2>
                        <form onSubmit={atualizarSenha}>
                            <div className='password-container'>
                                <input
                                    className='form password-input'
                                    type={mostrarSenha ? "text" : "password"}
                                    placeholder="Nova Senha"
                                    value={novaSenha}
                                    onChange={(e) => setNovaSenha(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className='password-toggle'
                                    onClick={alternarVisibilidadeSenha}
                                >
                                    <i className={`fa ${mostrarSenha ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                </button>
                            </div>

                            <div className='password-container'>
                                <input
                                    className='form password-input'
                                    type={mostrarSenha ? "text" : "password"}
                                    placeholder="Confirme a Nova Senha"
                                    value={confirmarSenha}
                                    onChange={(e) => setConfirmarSenha(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className='password-toggle'
                                    onClick={alternarVisibilidadeSenha}
                                >
                                    <i className={`fa ${mostrarSenha ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                </button>
                            </div>

                            {mensagemErro && <p className='error-message'>{mensagemErro}</p>}
                            <button className='btns' onClick={voltarParaLogin}>Voltar</button>
                            <button className='btns' type="submit">Atualizar Senha</button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Login;
