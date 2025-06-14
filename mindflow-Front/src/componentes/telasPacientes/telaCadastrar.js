import React, { useState } from 'react';
import Header from '../telaHome/header';
import axios from 'axios';
import Swal from 'sweetalert2';


const PacienteCadastro = ({ usuarioId }) => {
    const [nome, setNome] = useState('');
    const [idade, setIdade] = useState('');
    const [cpf, setCpf] = useState('');
    const [cep, setCep] = useState('');
    const [genero, setGenero] = useState('masculino');
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState('');
    const [estadoCivil, setEstadoCivil] = useState('casado');
    
const handleSubmit = async (e) => {
    e.preventDefault();

    const usuarioId = localStorage.getItem('usuarioId');

    const cpfLimpo = cpf.replace(/\D/g, '');
    const cepLimpo = cep.replace(/\D/g, '');
    const telefoneLimpo = telefone.replace(/\D/g, '');

    const pacienteData = {
        usuario_ID: usuarioId,
        nome,
        idade,
        cpf: cpfLimpo,
        cep: cepLimpo,
        genero,
        email,
        telefone: telefoneLimpo,
        estado_civil: estadoCivil,
    };

    const nomeValidoRegex = /^[A-Za-zÀ-ÿ\s]+$/;
    if (!nome || nome.trim().length < 2 || !nomeValidoRegex.test(nome)) {
        return Swal.fire({
            icon: 'warning',
            title: 'Nome inválido',
            text: 'O nome deve conter apenas letras e não pode conter símbolos ou emojis.',
        });
    }

    // Validações
    if (!nome || nome.trim().length < 2) {
        return Swal.fire({
            icon: 'warning',
            title: 'Nome inválido',
            text: 'O nome deve conter pelo menos 2 caracteres.',
        });
    }

    if (!idade || isNaN(idade) || parseInt(idade) <= 0) {
        return Swal.fire({
            icon: 'warning',
            title: 'Idade inválida',
            text: 'A idade deve ser um número positivo.',
        });
    }

    if (!cpfLimpo || cpfLimpo.length !== 11) {
        return Swal.fire({
            icon: 'warning',
            title: 'CPF inválido',
            text: 'O CPF deve conter exatamente 11 números.',
        });
    }

    if (!cepLimpo || cepLimpo.length !== 8) {
        return Swal.fire({
            icon: 'warning',
            title: 'CEP inválido',
            text: 'O CEP deve conter exatamente 8 números.',
        });
    }

    if (!telefoneLimpo || telefoneLimpo.length < 8) {
        return Swal.fire({
            icon: 'warning',
            title: 'Telefone inválido',
            text: 'O telefone deve conter pelo menos 8 números.',
        });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return Swal.fire({
            icon: 'warning',
            title: 'Email inválido',
            text: 'Digite um email válido no formato: exemplo@email.com',
        });
    }

    try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/pacientes`, pacienteData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });

        Swal.fire({
            title: 'Sucesso!',
            text: 'Paciente cadastrado com sucesso!',
            icon: 'success',
            confirmButtonText: 'Ok'
        }).then(() => {
            window.location.href = 'telaListar';
        });

    } catch (error) {
        console.log("Dados enviados:", JSON.stringify(pacienteData, null, 2));
        console.error('Erro ao cadastrar paciente:', error.response ? error.response.data : error.message);

        Swal.fire({
            title: 'Erro!',
            text: 'Erro ao cadastrar paciente. Verifique os dados e tente novamente.',
            icon: 'error',
            confirmButtonText: 'Ok'
        });
    }
};

    return (
        <div id="tudo">
            <Header />
<div className="form-container">
  <form onSubmit={handleSubmit} className="space-y-4">
    {/* Nome */}
    <div className="form-group">
      <label htmlFor="nome">Nome</label>
      <input
        type="text"
        id="nome"
        className="input w-full"
        placeholder="Nome"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        required
      />
    </div>

    {/* CPF, Idade e CEP */}
    <div className="form-row flex gap-4">
      <div className="form-group flex-1 max-w-[200px]">
        <label htmlFor="cpf">CPF</label>
        <input
          type="text"
          id="cpf"
          className="input w-full"
          placeholder="CPF"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
          required
        />
      </div>
      <div className="form-group flex-1 max-w-[120px]">
        <label htmlFor="idade">Idade</label>
        <input
          type="number"
          id="idade"
          className="input w-full"
          placeholder="Idade"
          value={idade}
          onChange={(e) => setIdade(e.target.value)}
          required
        />
      </div>
      <div className="form-group flex-1 max-w-[180px]">
        <label htmlFor="cep">CEP</label>
        <input
          type="text"
          id="cep"
          className="input w-full"
          placeholder="CEP"
          value={cep}
          onChange={(e) => setCep(e.target.value)}
          required
        />
      </div>
    </div>

    {/* Gênero e Estado Civil */}
    <div className="form-row flex gap-4">
      <div className="form-group flex-1">
        <label htmlFor="genero">Gênero</label>
        <select
          id="genero"
          className="input w-full"
          value={genero}
          onChange={(e) => setGenero(e.target.value)}
        >
          <option value="masculino">Masculino</option>
          <option value="feminino">Feminino</option>
          <option value="nao-binario">Não Binário</option>
          <option value="outro">Outro</option>
          <option value="nao-informar">Não Informar</option>
        </select>
      </div>
      <div className="form-group flex-1">
        <label htmlFor="estadoCivil">Estado Civil</label>
        <select
          id="estadoCivil"
          className="input w-full"
          value={estadoCivil}
          onChange={(e) => setEstadoCivil(e.target.value)}
        >
          <option value="casado">Casado</option>
          <option value="solteiro">Solteiro</option>
          <option value="divorciado">Divorciado</option>
          <option value="separado">Separado</option>
          <option value="viuvo">Viúvo</option>
        </select>
      </div>
    </div>

    {/* Email */}
    <div className="form-group">
      <label htmlFor="email">Email</label>
      <input
        type="email"
        id="email"
        className="input w-full"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
    </div>

    {/* Telefone */}
    <div className="form-group">
      <label htmlFor="telefone">Telefone/Celular</label>
      <input
        type="tel"
        id="telefone"
        className="input w-full"
        placeholder="Telefone/Celular"
        value={telefone}
        onChange={(e) => setTelefone(e.target.value)}
        required
      />
    </div>

    {/* Botão de envio */}
    <div className="form-group">
      <button type="submit" className="enviarBTN">
        Cadastrar Paciente
      </button>
    </div>
  </form>
</div>

        </div>
    );
};

export default PacienteCadastro;