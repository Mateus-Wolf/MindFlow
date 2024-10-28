import React, { useState } from "react";
import Login from "./login";
import CriarConta from "./criarConta";

function Body() {
  const [telaAtiva, setTelaAtiva] = useState(null);

  const mostrarLogin = () => setTelaAtiva("login");
  const mostrarCriarConta = () => setTelaAtiva("criarConta");
  const voltar = () => setTelaAtiva(null);

  return (
    <div id="conteudoBody">
      <div id="conteudoEsquerda">
        <h1 id="tituloPrincipal">MINDFLOW</h1>
      </div>

      <div id="conteudoDireita">
        {telaAtiva === null && (
          <>
            <h2 id="textoInicial">
              Entre e administre os sentimentos e emoções de seus pacientes de maneira rápida, fácil e gratuita!
            </h2>
            <hr />
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

        {telaAtiva === "login" && <Login voltar={voltar} />}
        {telaAtiva === "criarConta" && <CriarConta voltar={voltar} irParaLogin={mostrarLogin} />}
      </div>
    </div>
  );
}

export default Body;
