import React, { useState } from 'react';

const Login = ({ voltar }) => {
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const alternarVisibilidadeSenha = () => {
    setMostrarSenha(!mostrarSenha);
  };

  return (
    <div id='conteudo'>
      <h2 id='titulo'>Entrar na sua conta do MindFlow</h2>
      <form>
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
          <a href="#" className='forgot-password'>Esqueci minha senha</a>
        </div>
        <button className='btns' type="submit">Enviar</button>
        <button className='btns' onClick={voltar}>Voltar</button>
      </form>
    </div>
  );
};

export default Login;
