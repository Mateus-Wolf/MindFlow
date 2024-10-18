import React, { useState } from 'react';
import Header from '../telaHome/header';
import axios from 'axios';

// Mantém as importações de outros ícones
import estudoIcon from '../../icones/estudo-icone.svg';
import trabalhoIcon from '../../icones/trabalho-icone.svg';
import exercicioIcon from '../../icones/exercicio-icone.svg';
import lazerIcon from '../../icones/lazer-icone.svg';

function RegistroHumorAtividades() {
  const [selected, setSelected] = useState({}); // Objeto para armazenar seleções
  const [hovered, setHovered] = useState({}); // Objeto para armazenar hover

  const handleCheck = (category) => {
    setSelected((prev) => ({
      ...prev,
      [category]: 'check',
    }));
  };

  const handleTimes = (category) => {
    setSelected((prev) => ({
      ...prev,
      [category]: 'times',
    }));
  };

  const handleMouseEnter = (category, type) => {
    setHovered((prev) => ({
      ...prev,
      [`${category}-${type}`]: true,
    }));
  };

  const handleMouseLeave = (category, type) => {
    setHovered((prev) => ({
      ...prev,
      [`${category}-${type}`]: false,
    }));
  };

  const getButtonClass = (category, type) => {
    if (selected[category] === type) {
      return type === 'check' ? 'button-checked' : 'button-checked-times';
    } else if (hovered[`${category}-${type}`]) {
      return type === 'check' ? 'button-hovered' : 'button-hovered-times';
    }
    return '';
  };

  return (
    <div className="tudo">
      <Header />
      <div className="categories">
        {['Estudos', 'Trabalho', 'Exercício', 'Lazer'].map((category) => (
          <div className="category" key={category}>
            <h2>{category}</h2>
            <img src={category === 'Estudos' ? estudoIcon : category === 'Trabalho' ? trabalhoIcon : category === 'Exercício' ? exercicioIcon : lazerIcon} alt={`${category} Icon`} />
            <div className="buttons">
              <button
                className={`checkstyle ${getButtonClass(category, 'check')}`}
                onClick={() => handleCheck(category)}
                onMouseEnter={() => handleMouseEnter(category, 'check')}
                onMouseLeave={() => handleMouseLeave(category, 'check')}
              >
                <i className="fas fa-check"></i>
              </button>
              <button
                className={`checkstyle ${getButtonClass(category, 'times')}`}
                onClick={() => handleTimes(category)}
                onMouseEnter={() => handleMouseEnter(category, 'times')}
                onMouseLeave={() => handleMouseLeave(category, 'times')}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="footer">
        <button className="btnVoltar">Voltar</button>
        <button className="btnSalvar">Salvar</button>
      </div>
    </div>
  );
}

export default RegistroHumorAtividades;
