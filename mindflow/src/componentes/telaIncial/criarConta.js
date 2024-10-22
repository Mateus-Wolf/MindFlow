import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const CriarConta = ({ voltar }) => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [nascimento, setNascimento] = useState('');
  const [senha, setSenha] = useState('');
  const [senhaRepetida, setSenhaRepetida] = useState('');
  const [tipo_usuario] = useState('paciente');
  const [erro, setErro] = useState('');

  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarRepetirSenha, setMostrarRepetirSenha] = useState(false);
  const navigate = useNavigate();

  const alternarVisibilidadeSenha = () => {
    setMostrarSenha(!mostrarSenha);
  };

  const alternarVisibilidadeRepetirSenha = () => {
    setMostrarRepetirSenha(!mostrarRepetirSenha);
  };

  const isFormValid = nome && email && nascimento && senha && senhaRepetida;

  const handleCreateAccount = async (event) => {
    event.preventDefault();
  
    if (senha !== senhaRepetida) {
      setErro('As SENHAS não coincidem, por favor, verifique!');
      return;
    }
  
    const response = await fetch('http://localhost:3000/api/usuarios/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nome, email, nascimento, senha, tipo_usuario }),
    });
  
    const data = await response.json();
    console.log('Dados retornados do servidor:', data); // Adicione este log
  
    if (!response.ok) {
      setErro(`Erro ao criar conta: ${data.error || 'Erro desconhecido'}`);
    } else {
      console.log('Conta criada com sucesso:', data);
      localStorage.setItem('nomeUsuario', data.nome);
      localStorage.setItem('token', data.token); // Certifique-se de que data.token está disponível
  
      Swal.fire({
        icon: 'success',
        title: 'Conta criada com sucesso!',
        text: 'Você já pode começar a usar o MindFlow agora!',
      });
      navigate('/home');
    }
  };
  
  

  return (
    <div>
      <h2>Crie a sua conta no MindFlow</h2>
      <form onSubmit={handleCreateAccount}>
        <div id='campos'>
          <input
            className='form'
            type="text"
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
          <input
            className='form'
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className='form'
            type='date'
            placeholder="Data de Nascimento"
            value={nascimento}
            onChange={(e) => setNascimento(e.target.value)}
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

          <div className='password-container'>
            <input
              className='form password-input'
              type={mostrarRepetirSenha ? "text" : "password"}
              placeholder="Repetir a Senha"
              value={senhaRepetida}
              onChange={(e) => setSenhaRepetida(e.target.value)}
              required
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
        {erro && <p className="error-message">{erro}</p>}
        <button className='btns' type="button" onClick={voltar}>Voltar</button>
        <button
          className='btns'
          type="submit"
          disabled={!isFormValid} // Botão desabilitado se o formulário estiver incompleto
          style={{
            backgroundColor: isFormValid ? 'rgb(71, 6, 135)' : 'gray',
            cursor: isFormValid ? 'pointer' : 'not-allowed',
          }}
        >
          Criar Conta
        </button>
      </form>
    </div>
  );
};

export default CriarConta;
