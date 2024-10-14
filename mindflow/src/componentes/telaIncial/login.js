import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

const Login = ({ voltar }) => {
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [telaEsqueciSenha, setTelaEsqueciSenha] = useState(false);
    const [telaAtualizarSenha, setTelaAtualizarSenha] = useState(false);
    const [codigoEnviado, setCodigoEnviado] = useState(false);
    const [email, setEmail] = useState(''); 
    const [senha, setSenha] = useState('');
    const [mensagemErro, setMensagemErro] = useState('');

    const navigate = useNavigate();

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
        setCodigoEnviado(false);
    };

    const enviarCodigoEmail = () => {
        setCodigoEnviado(true);
    };

    const isFormValid = email && senha;

    const handleLogin = async (e) => {
        e.preventDefault();
        setMensagemErro('');
    
        try {
            const response = await axios.post('http://localhost:3000/api/login', { email, senha });
            localStorage.setItem('token', response.data.token);
    
            // Aqui vamos salvar o nome do usuário no localStorage
            const { nome } = response.data;
            localStorage.setItem('nomeUsuario', nome); // Armazena o nome no localStorage
    
            // mensagem do SweetAlert
            Swal.fire({
                icon: 'success',
                title: 'Login bem-sucedido!',
                text: 'Bem-vindo ao MindFlow.',
                confirmButtonText: 'Continuar'
            }).then(() => {
                navigate('/home'); // Redirecionar para a rota /home caso os dados estejam corretos
            });
    
        } catch (error) {
            setMensagemErro('Usuário ou senha incorretos.'); 
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
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <div className='password-container'>
                            <input
                                className='form password-input'
                                type={mostrarSenha ? "text" : "password"}
                                placeholder="Senha"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
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
                        <button
                            className='btns'
                            type="submit"
                            disabled={!isFormValid}
                            style={{
                                backgroundColor: isFormValid ? 'rgb(71, 6, 135)' : 'gray', 
                                cursor: isFormValid ? 'pointer' : 'not-allowed', 
                            }}
                        >
                            Enviar
                        </button>
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
                        navigate('/home'); // Redirecionar ao atualizar a senha
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
