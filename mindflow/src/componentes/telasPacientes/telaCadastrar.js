import React from 'react';
import Header from '../telaHome/header';

const PacienteCadastro = () => {
    return (
        <div id="tudo">
            <Header />
            <div className="form-container">
            <form>
                <div className="form-row">
                <div className="form-group">
                    <label htmlFor="nome">Nome</label>
                    <input type="text" id="nome" placeholder="Nome" />
                </div>
                <div className="form-group">
                    <label htmlFor="idade">Idade</label>
                    <input type="number" id="idade" placeholder="Idade" />
                </div>
                </div>
                <div className="form-row">
                <div className="form-group">
                    <label htmlFor="cpf">CPF</label>
                    <input type="text" id="cpf" placeholder="CPF" />
                </div>
                <div className="form-group">
                    <label htmlFor="cep">CEP</label>
                    <input type="text" id="cep" placeholder="CEP" />
                </div>
                </div>
                <div className="form-row">
                <div className="form-group">
                    <label htmlFor="genero">Gênero</label>
                    <select id="genero">
                        <option value="masculino">Masculino</option>
                        <option value="feminino">Feminino</option>
                        <option value="nao-binario">Não Binário</option>
                        <option value="outro">Outro</option>
                        <option value="nao-informar">Não Informar</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" placeholder="Email" />
                </div>
                </div>
                <div className="form-row">
                <div className="form-group">
                    <label htmlFor="telefone">Telefone/Celular</label>
                    <input type="tel" id="telefone" placeholder="Telefone/Celular" />
                </div>
                <div className="form-group">
                    <label htmlFor="estadoCivil">Estado Civil</label>
                    <select id="estadoCivil">
                        <option value="casado">Casado</option>
                        <option value="solteiro">Solteiro</option>
                        <option value="divorciado">Divorciado</option>
                        <option value="viuvo">Viúvo</option>
                    </select>
                </div>
                </div>
                <button type="submit" className="submit-button">Cadastrar Paciente</button>
            </form>
            </div>
        </div>
      );
    }

export default PacienteCadastro;
