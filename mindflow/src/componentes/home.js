import React, { useState } from "react";
import Login from "./login"; // Ajuste o caminho conforme necessário
import CriarConta from "./criarConta"; // Ajuste o caminho conforme necessário

function Body() {
  // Estado para gerenciar qual tela está ativa
  const [telaAtiva, setTelaAtiva] = useState(null);

  // Funções para definir a tela ativa
  const mostrarLogin = () => setTelaAtiva("login");
  const mostrarCriarConta = () => setTelaAtiva("criarConta");
  const voltar = () => setTelaAtiva(null);

  return (
    <div id="conteudoBody">
      {/* Conteúdo da Esquerda */}
      <div id="conteudoEsquerda">
        <h1 id="tituloPrincipal">MINDFLOW</h1>
      </div>

      {/* Conteúdo da Direita */}
      <div id="conteudoDireita">
        {telaAtiva === null && (
          <>
            <h2 id="textoInicial">
              Entre e administre os sentimentos e emoções de seus pacientes de maneira rápida, fácil e gratuita!
            </h2>
            <hr />
            {/* Botões */}
            <div id="botoes">
              <button className="saibaMais" onClick={mostrarLogin}>
                <span>Entrar</span>
              </button>
              <button className="saibaMais" onClick={mostrarCriarConta}>
                <span>Criar Conta</span>
              </button>
            </div>
          </>
        )}

        {telaAtiva === "login" && (
          <Login voltar={voltar} />
        )}

        {telaAtiva === "criarConta" && (
          <CriarConta voltar={voltar} />
        )}
      </div>
    </div>
  );
}

export default Body;
