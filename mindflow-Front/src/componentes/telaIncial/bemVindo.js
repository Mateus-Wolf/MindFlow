import React, { useState } from "react";
import Login from "./login";
import CriarConta from "./criarConta";

function Body() {
  const [telaAtiva, setTelaAtiva] = useState(null);

  const mostrarLogin = () => setTelaAtiva("login");
  const mostrarCriarConta = () => setTelaAtiva("criarConta");
  const voltar = () => setTelaAtiva(null);

  const frases = [
    {
      autor: "Sócrates",
      texto: "Conhece-te a ti mesmo e conhecerás o universo e os deuses."
    },
    {
      autor: "Carl Rogers",
      texto: "A curiosa paradoxo é que quando me aceito como sou, então posso mudar."
    },
    {
      autor: "Erich Fromm",
      texto: "A principal tarefa do ser humano na vida é dar à luz a si mesmo."
    },
    {
      autor: "Mahatma Gandhi",
      texto: "A felicidade é quando o que você pensa, o que você diz e o que você faz estão em harmonia."
    },
    {
      autor: "Carl Jung",
      texto: "O que não enfrentamos em nosso interior, encontraremos como destino."
    },
    {
      autor: "Viktor Frankl",
      texto: "Entre o estímulo e a resposta há um espaço. Nesse espaço está o nosso poder de escolher a resposta."
    },
    {
      autor: "Sigmund Freud",
      texto: "As emoções não expressadas nunca morrem. Elas são enterradas vivas e saem depois de piores formas."
    },
    {
      autor: "Aaron Beck",
      texto: "A saúde mental precisa ser cultivada com o mesmo cuidado que a saúde física."
    },
    {
      autor: "Haruki Murakami",
      texto: "A dor é inevitável. O sofrimento é opcional."
    },
    {
      autor: "Ernest Hemingway",
      texto: "Todos nós estamos um pouco quebrados. É assim que a luz entra."
    }
  ];

  const hoje = new Date();
  const diaDoAno = Math.floor(
    (hoje - new Date(hoje.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24)
  );
  const fraseDoDia = frases[diaDoAno % frases.length];

  return (
    <div id="conteudoBody">
      <div id="conteudoEsquerda">
        <h1 id="tituloPrincipal">MINDFLOW</h1>
        <h3 id="slogan">Porque cada dia conta uma história</h3>

        <div id="frasesDiarias">
         <p id="textoFrase">"{fraseDoDia.texto}"</p>
          <p id="nomeAutor">- {fraseDoDia.autor}</p>
        </div>
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
