import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';
import AnimatedEye from '../iconesAnimados/AnimatedEye';

const CriarConta = ({ voltar, irParaLogin }) => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [nascimento, setNascimento] = useState('');
  const [senha, setSenha] = useState('');
  const [senhaRepetida, setSenhaRepetida] = useState('');
  const [tipo_usuario, setTipoUsuario] = useState('psicologo'); // Por padrão 'psicologo' pra teste
  const [registroProfissional, setRegistroProfissional] = useState('');
  const [experienciaAnos, setExperienciaAnos] = useState('');
  const [estadoAtuacao, setEstadoAtuacao] = useState('');
  const [telefone, setTelefone] = useState('');
  const [idiomas, setIdiomas] = useState('');

  const [erro, setErro] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarRepetirSenha, setMostrarRepetirSenha] = useState(false);
  const navigate = useNavigate();

  const alternarVisibilidadeSenha = () => setMostrarSenha(!mostrarSenha);
  const alternarVisibilidadeRepetirSenha = () => setMostrarRepetirSenha(!mostrarRepetirSenha);

  const isFormValid =
    nome.trim() &&
    email.trim() &&
    nascimento.trim() &&
    senha.trim() &&
    senhaRepetida.trim() &&
    senha === senhaRepetida;


  const handleCreateAccount = async (event) => {
    event.preventDefault();

    if (senha !== senhaRepetida) {
      setErro('As SENHAS não coincidem, por favor, verifique!');
      return;
    }

    const body = {
      nome,
      email,
      nascimento,
      senha,
      tipo_usuario,
      ...(tipo_usuario === 'psicologo' && {
        registro_profissional: registroProfissional.trim() === '' ? null : registroProfissional,
        experiencia_anos: parseInt(experienciaAnos),
        estado_atuacao: estadoAtuacao,
        telefone,
        idiomas: idiomas.split(',').map(i => i.trim()),
      })
    };


    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/usuarios/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      setErro(`Erro ao criar conta: ${data.error || 'Erro desconhecido'}`);
    } else {
      localStorage.setItem('nomeUsuario', data.nome);
      localStorage.setItem('usuarioId', data.usuarioId);
      localStorage.setItem('token', data.token);

      Swal.fire({
        icon: 'success',
        title: 'Conta criada com sucesso!',
        text: 'Agora você só precisa fazer login e já pode começar a usar o MindFlow!',
      });

      if (irParaLogin) irParaLogin();
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && isFormValid) {
      handleCreateAccount(event);
    }
  };

  useEffect(() => {
    window.addEventListener('keypress', handleKeyPress);
    return () => {
      window.removeEventListener('keypress', handleKeyPress);
    };
  }, [nome, email, nascimento, senha, senhaRepetida]);

  return (
    <motion.div initial={{ opacity: 0, x: 80 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
      <h2>Crie a sua conta no MindFlow</h2>
      <form onSubmit={handleCreateAccount}>
        <div id='campos'>
          <motion.input
            className='form'
            type="text"
            placeholder="Nome"
            value={nome}
            onChange={(e) => {
              const valor = e.target.value;
              const regex = /^[\p{L}\p{N} ]+$/u

              if (valor === '' || regex.test(valor)) {
                setNome(valor);
                setErro('');
              } else {
                setErro('O nome deve conter apenas letras e números.');
              }
            }}
            required
            whileFocus={{ scale: 1.03, borderColor: "#7e22ff", boxShadow: "0 0 10px rgba(126, 34, 255, 0.3)" }}
            transition={{ type: "spring", stiffness: 300 }}
          />
          <motion.input
            className='form'
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            whileFocus={{ scale: 1.03, borderColor: "#7e22ff", boxShadow: "0 0 10px rgba(126, 34, 255, 0.3)" }}
            transition={{ type: "spring", stiffness: 300 }}
          />
          <motion.input
            className='form'
            type="date"
            value={nascimento}
            onChange={(e) => setNascimento(e.target.value)}
            required
            whileFocus={{ scale: 1.03, borderColor: "#7e22ff", boxShadow: "0 0 10px rgba(126, 34, 255, 0.3)" }}
            transition={{ type: "spring", stiffness: 300 }}
          />

          {tipo_usuario === 'psicologo' && (
            <>
              <motion.input
                className='form'
                type="text"
                placeholder="Registro Profissional (CRP/CRM)"
                value={registroProfissional}
                onChange={(e) => setRegistroProfissional(e.target.value)}
              />
              <motion.input
                className='form'
                type="number"
                placeholder="Anos de experiência"
                value={experienciaAnos}
                onChange={(e) => setExperienciaAnos(e.target.value)}
              />
              <motion.input
                className='form'
                type="text"
                placeholder="Estado de atuação (ex: SP)"
                maxLength={2}
                value={estadoAtuacao}
                onChange={(e) => setEstadoAtuacao(e.target.value.toUpperCase())}
              />
              <motion.input
                className='form'
                type="text"
                placeholder="Telefone (opcional)"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
              />
              <motion.input
                className='form'
                type="text"
                placeholder="Idiomas (Separar por vírgula)"
                value={idiomas}
                onChange={(e) => setIdiomas(e.target.value)} />
            </>
          )}

          <div className='password-container'>
            <motion.input
              className='form'
              type={mostrarSenha ? "text" : "password"}
              placeholder="Digite a sua Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              whileFocus={{ scale: 1.03, borderColor: "#7e22ff", boxShadow: "0 0 10px rgba(126, 34, 255, 0.3)" }}
              transition={{ type: "spring", stiffness: 300 }}
            />
            <button type="button" className='password-toggle' onClick={alternarVisibilidadeSenha}>
              <AnimatedEye aberto={mostrarSenha} />
            </button>
          </div>

          <div className='password-container'>
            <motion.input
              className='form'
              type={mostrarRepetirSenha ? "text" : "password"}
              placeholder="Repita a sua Senha"
              value={senhaRepetida}
              onChange={(e) => setSenhaRepetida(e.target.value)}
              required
              whileFocus={{ scale: 1.03, borderColor: "#7e22ff", boxShadow: "0 0 10px rgba(126, 34, 255, 0.3)" }}
              transition={{ type: "spring", stiffness: 300 }}
            />
            <button type="button" className='password-toggle' onClick={alternarVisibilidadeRepetirSenha}>
              <AnimatedEye aberto={mostrarRepetirSenha} />
            </button>
          </div>
        </div>

        {erro && <p className="error-message">{erro}</p>}

        <button className='btns' type="button" onClick={voltar}>Voltar</button>
        <button
          className='btns'
          type="submit"
          disabled={!isFormValid}
          style={{
            backgroundColor: isFormValid ? 'rgb(71, 6, 135)' : 'gray',
            cursor: isFormValid ? 'pointer' : 'not-allowed',
          }}
        >
          Criar Conta
        </button>
      </form>
    </motion.div>
  );
};

export default CriarConta;
