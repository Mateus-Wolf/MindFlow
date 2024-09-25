import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa o useNavigate para navegação
import axios from 'axios'; // Importa axios
import Swal from 'sweetalert2'; // Importa SweetAlert

const Login = ({ voltar }) => {
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [telaEsqueciSenha, setTelaEsqueciSenha] = useState(false);
    const [telaAtualizarSenha, setTelaAtualizarSenha] = useState(false);
    const [codigoEnviado, setCodigoEnviado] = useState(false);
    const [email, setEmail] = useState(''); // Estado para o email
    const [senha, setSenha] = useState(''); // Estado para a senha
    const [mensagemErro, setMensagemErro] = useState(''); // Estado para mensagens de erro

    const navigate = useNavigate(); // Hook para navegação

    const alternarVisibilidadeSenha = () => {
        setMostrarSenha(!mostrarSenha);
    };

    const mostrarTelaEsqueciSenha = () => {
        setTelaEsqueciSenha(true);
    };

    const mostrarTelaAtualizarSenha = () => {
        setTelaAtualizarSenha(true);
    };

    const voltarParaLogin = () => {
        setTelaEsqueciSenha(false);
        setTelaAtualizarSenha(false);
        setCodigoEnviado(false); // Resetar o estado ao voltar
    };

    const enviarCodigoEmail = () => {
        setCodigoEnviado(true);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setMensagemErro(''); // Resetar mensagem de erro

        try {
            const response = await axios.post('http://localhost:3000/api/login', { email, senha });
            localStorage.setItem('token', response.data.token); // Armazena o token no localStorage

            // Adicionando mensagem de sucesso usando SweetAlert
            Swal.fire({
                icon: 'success',
                title: 'Login bem-sucedido!',
                text: 'Bem-vindo ao MindFlow.',
                confirmButtonText: 'Continuar'
            }).then(() => {
                navigate('/home'); // Redireciona para a rota /home após login
            });

        } catch (error) {
            setMensagemErro('Usuário ou senha incorretos.'); // Mensagem de erro
        }
    };

    return (
        <div id='conteudo'>
            {!telaEsqueciSenha && !telaAtualizarSenha ? (
                <>
                    <h2>Entrar na sua conta do MindFlow</h2>
                    <form onSubmit={handleLogin}>
                        <input
                            className='form'
                            type="text"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} // Atualiza o estado do email
                            required
                        />
                        <div className='password-container'>
                            <input
                                className='form password-input'
                                type={mostrarSenha ? "text" : "password"}
                                placeholder="Senha"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)} // Atualiza o estado da senha
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
                        <div className='form-group'>
                            <a href="#" className='forgot-password' onClick={mostrarTelaEsqueciSenha}>
                                Esqueci minha senha
                            </a>
                        </div>
                        {mensagemErro && <p className='error-message'>{mensagemErro}</p>} {/* Mensagem de erro */}
                        <button className='btns' onClick={voltar}>Voltar</button>
                        <button className='btns' type="submit">Enviar</button>
                    </form>
                </>
            ) : null}

            {telaEsqueciSenha && !telaAtualizarSenha ? (
                <>
                    <h2>Recuperar Senha</h2>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        mostrarTelaAtualizarSenha();
                    }}>
                        <div className="email-container">
                            <input className='form' type="email" placeholder="Digite seu e-mail" required />
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

                        <input className='form' type="text" placeholder="Digite o código de verificação" required />
                        <button className='btns' onClick={voltarParaLogin}>Voltar</button>
                        <button className='btns' type="submit">Verificar Código</button>
                    </form>
                </>
            ) : null}

            {telaAtualizarSenha ? (
                <>
                    <h2>Atualizar Senha</h2>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        navigate('/home'); // Redireciona ao atualizar a senha
                    }}>
                        <div className='password-container'>
                            <input
                                className='form password-input'
                                type={mostrarSenha ? "text" : "password"}
                                placeholder="Nova Senha"
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
                        <button className='btns' onClick={voltarParaLogin}>Voltar</button>
                        <button className='btns' type="submit">Atualizar Senha e Realizar Login</button>
                    </form>
                </>
            ) : null}
        </div>
    );
};

export default Login;
