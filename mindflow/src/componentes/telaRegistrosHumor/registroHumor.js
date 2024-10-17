import React from 'react';
import Header from '../telaHome/header';
import axios from 'axios';
import Swal from 'sweetalert2';

// Corrigindo os ícones, sem espaços nos nomes
import checkIcon from '../../icones/yes-icone.png';
import crossIcon from '../../icones/no-icone.svg';
import estudoIcon from '../../icones/estudo-icone.svg';
import trabalhoIcon from '../../icones/trabalho-icone.svg';
import exercicioIcon from '../../icones/exercicio-icone.svg';
import lazerIcon from '../../icones/lazer-icone.svg';

function RegistroHumor() {
  return (
    <div className="tudo">
      <Header />
      <div className="categories">
        <div className="category">
          <h2>Estudos</h2>
          <img src={estudoIcon} alt="Estudos Icon" />
          <div className="buttons">
            <button className="check">
              <img src={checkIcon} alt="Check Icon" />
            </button>
            <button className="cross">
              <img src={crossIcon} alt="Cross Icon" />
            </button>
          </div>
        </div>
        <div className="category">
          <h2>Trabalho</h2>
          <img src={trabalhoIcon} alt="Trabalho Icon" />
          <div className="buttons">
            <button className="check">
              <img src={checkIcon} alt="Check Icon" />
            </button>
            <button className="cross">
              <img src={crossIcon} alt="Cross Icon" />
            </button>
          </div>
        </div>
        <div className="category">
          <h2>Exercício</h2>
          <img src={exercicioIcon} alt="Exercício Icon" />
          <div className="buttons">
            <button className="check">
              <img src={checkIcon} alt="Check Icon" />
            </button>
            <button className="cross">
              <img src={crossIcon} alt="Cross Icon" />
            </button>
          </div>
        </div>
        <div className="category">
          <h2>Lazer</h2>
          <img src={lazerIcon} alt="Lazer Icon" />
          <div className="buttons">
            <button className="check">
              <img src={checkIcon} alt="Check Icon" />
            </button>
            <button className="cross">
              <img src={crossIcon} alt="Cross Icon" />
            </button>
          </div>
        </div>
      </div>
      <div className="footer">
        <button className="btnVoltar">Voltar</button>
        <button className="btnSalvar">Salvar</button>
      </div>
    </div>
  );
}

export default RegistroHumor;
