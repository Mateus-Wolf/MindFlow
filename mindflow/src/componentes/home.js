import React from "react";

function Body() {
    return (
        <div id="conteudoBody">
            {/* Conteudo da Esquerda */}
            <div id="conteudoEsquerda">
                <h1 id="tituloPrincipal">MINDFLOW</h1>
            </div>
            {/* Conteudo da Direita */}
            <div id="conteudoDireita">
                <h2 id="textoInicial">Entre e administre os sentimentos e emoções de seus pacientes de maneira rápida, fácil e gratuita!</h2>
                <hr></hr>
                {/* Botões */}
                <div id="botões">
                    <button class="saibaMais">
                        <span>Entrar</span>
                    </button>
                    <button class="saibaMais">
                        <span>Criar Conta</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Body;