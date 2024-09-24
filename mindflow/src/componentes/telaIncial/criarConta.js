import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa o useNavigate para navegação

const CriarConta = ({ voltar }) => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [nascimento, setNascimento] = useState('');
  const [senha, setSenha] = useState('');
  const [senhaRepetida, setSenhaRepetida] = useState(''); // Novo estado para a senha repetida
  const [tipo_usuario] = useState('paciente'); // Define um tipo de usuário padrão ou pode ser um campo de entrada
  const [erro, setErro] = useState('');
  
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarRepetirSenha, setMostrarRepetirSenha] = useState(false);

  const alternarVisibilidadeSenha = () => {
    setMostrarSenha(!mostrarSenha);
  };

  const alternarVisibilidadeRepetirSenha = () => {
    setMostrarRepetirSenha(!mostrarRepetirSenha);
  };

  const handleCreateAccount = async (event) => {
    event.preventDefault(); // Evita o comportamento padrão do formulário

    if (senha !== senhaRepetida) {
      setErro('As SENHAS não coincidem, por favor, verifique!'); // Define a mensagem de erro se as senhas não forem iguais
      return; // Impede o envio do formulário
    }

    const response = await fetch('http://localhost:3000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nome, email, nascimento, senha, tipo_usuario }),
    });

    const data = await response.json();

    if (!response.ok) {
      setErro(`Erro ao criar conta: ${data.error || 'Erro desconhecido'}`);
    } else {
      // Redirecione ou faça outra ação após criar a conta
      console.log('Conta criada com sucesso:', data);
      // Redirecionar para a tela de home
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
            onChange={(e) => setNome(e.target.value)} // Atualiza o nome
            required
          />
          <input
            className='form'
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Atualiza o email
            required
          />
          <input
            className='form'
            type='date'
            placeholder="Data de Nascimento"
            value={nascimento}
            onChange={(e) => setNascimento(e.target.value)} // Atualiza a data de nascimento
            required
          />
          
          {/* Campo de senha com botão de exibir/ocultar */}
          <div className='password-container'>
            <input
              className='form password-input'
              type={mostrarSenha ? "text" : "password"}
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)} // Atualiza a senha
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
          
          {/* Campo de repetir senha com botão de exibir/ocultar */}
          <div className='password-container'>
            <input
              className='form password-input'
              type={mostrarRepetirSenha ? "text" : "password"}
              placeholder="Repetir a Senha"
              value={senhaRepetida} // Atualiza a senha repetida
              onChange={(e) => setSenhaRepetida(e.target.value)} // Atualiza a senha repetida
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
        {erro && <p className="error-message">{erro}</p>} {/* Exibe a mensagem de erro */}
        <button className='btns' type="button" onClick={voltar}>Voltar</button>
        <button className='btns' type="submit">Criar Conta</button>
      </form>
    </div>
  );
};

export default CriarConta;
