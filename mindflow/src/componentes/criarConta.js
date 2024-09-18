import React from 'react';

const CriarConta = ({ voltar }) => (
  <div>
    <h2>Criar Conta</h2>
    <form>
      <input type="text" placeholder="Nome" />
      <input type="email" placeholder="Email" />
      <input type="password" placeholder="Senha" />
      <button type="submit">Criar Conta</button>
    </form>
    <button onClick={voltar}>Voltar</button>
  </div>
);

export default CriarConta;
