import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const CriarConta = ({ voltar, irParaLogin }) => {
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

  const isFormValid = nome.trim() && email.trim() && nascimento.trim() && senha.trim() && senhaRepetida.trim();

  const handleCreateAccount = async (event) => {
    event.preventDefault();

    // Verifica se as senhas inseridas coincidem
    if (senha !== senhaRepetida) {
      setErro('As SENHAS não coincidem, por favor, verifique!');
      return; // Interrompe se as senhas não coincidirem
    }

    console.log('pre-response')

    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/usuarios/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nome, email, nascimento, senha, tipo_usuario }),
    });
    
    const data = await response.json();
    
    console.log('Dados retornados do servidor:', data);

    // Verifica se a resposta da API foi bem-sucedida
    if (!response.ok) {
      setErro(`Erro ao criar conta: ${data.error || 'Erro desconhecido'}`);
    } else {
      // Se a conta for criada com sucesso, armazena as informações no localStorage
      console.log('Conta criada com sucesso:', data);
      localStorage.setItem('nomeUsuario', data.nome);
      localStorage.setItem('usuarioId', data.usuarioId); // Armazena o ID do usuário
      localStorage.setItem('token', data.token);

      Swal.fire({
        icon: 'success',
        title: 'Conta criada com sucesso!',
        text: 'Agora você só precisa fazer login e já pode começar a usar o MindFlow!',
      });
      if (irParaLogin) {
        irParaLogin(); // Verifica se irParaLogin foi passado e então chama a função
      }
    }
  };


  // Função para lidar com o pressionamento de teclas
  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && isFormValid) {
      handleCreateAccount(event);
    }
  };

  // Hook para adicionar e remover o manipulador de evento
  useEffect(() => {
    window.addEventListener('keypress', handleKeyPress);
    return () => {
      window.removeEventListener('keypress', handleKeyPress);
    };
  }, [nome, email, nascimento, senha, senhaRepetida]);

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
          disabled={!isFormValid} // Desabilita o botão se o formulário estiver incompleto
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
