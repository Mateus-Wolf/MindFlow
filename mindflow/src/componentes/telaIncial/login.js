import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa o useNavigate para navegação

const Login = ({ voltar }) => {
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [telaEsqueciSenha, setTelaEsqueciSenha] = useState(false);
  const [telaAtualizarSenha, setTelaAtualizarSenha] = useState(false);
  const [codigoEnviado, setCodigoEnviado] = useState(false);
  
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

  // Função para redirecionar para a tela Home
  const redirecionarParaHome = () => {
    navigate('/home'); // Redireciona para a rota /home
  };

  return (
    <div id='conteudo'>
      {!telaEsqueciSenha && !telaAtualizarSenha ? (
        <>
          <h2>Entrar na sua conta do MindFlow</h2>
          <form onSubmit={(e) => {
            e.preventDefault();
            redirecionarParaHome(); // Redireciona ao enviar o formulário de login
          }}>
            <input className='form' type="text" placeholder="Email" required />
            <div className='password-container'>
              <input
                className='form password-input'
                type={mostrarSenha ? "text" : "password"}
                placeholder="Senha"
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
            redirecionarParaHome(); // Redireciona ao atualizar a senha
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
