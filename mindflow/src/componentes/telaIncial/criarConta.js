import React, { useState } from 'react';

const CriarConta = ({ voltar }) => {
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarRepetirSenha, setMostrarRepetirSenha] = useState(false);

  const alternarVisibilidadeSenha = () => {
    setMostrarSenha(!mostrarSenha);
  };

  const alternarVisibilidadeRepetirSenha = () => {
    setMostrarRepetirSenha(!mostrarRepetirSenha);
  };

  return (
    <div>
      <h2>Crie a sua conta no MindFlow</h2>
      <form>
        <div id='campos'>
          <input className='form' type="text" placeholder="Nome" />
          <input className='form' type="email" placeholder="Email" />
          <input className='form' type='date' placeholder="Data de Nascimento"/>
          
          {/* Campo de senha com botão de exibir/ocultar */}
          <div className='password-container'>
            <input
              className='form password-input'
              type={mostrarSenha ? "text" : "password"}
              placeholder="Senha"
            />
            <button
              type="button"
              className='password-toggle'
              onClick={alternarVisibilidadeSenha}
            >
              <i className={`fa ${mostrarSenha ? 'fa-eye-slash' : 'fa-eye'}`}></i>
            </button>
          </div>
          
          {/* Campo de repetir senha com botão de exibir/ocultar */}
          <div className='password-container'>
            <input
              className='form password-input'
              type={mostrarRepetirSenha ? "text" : "password"}
              placeholder="Repetir a Senha"
            />
            <button
              type="button"
              className='password-toggle'
              onClick={alternarVisibilidadeRepetirSenha}
            >
              <i className={`fa ${mostrarRepetirSenha ? 'fa-eye-slash' : 'fa-eye'}`}></i>
            </button>
          </div>
        </div>
      </form>
      <button className='btns' onClick={voltar}>Voltar</button>
      <button className='btns' type="submit">Criar Conta</button>
    </div>
  );
};

export default CriarConta;
