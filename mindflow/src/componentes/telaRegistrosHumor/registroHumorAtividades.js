import React, { useState } from 'react';
import Header from '../telaHome/header';
import { useNavigate, useParams } from "react-router-dom";
import estudoIcon from '../../icones/estudo-icone.svg';
import trabalhoIcon from '../../icones/trabalho-icone.svg';
import exercicioIcon from '../../icones/exercicio-icone.svg';
import lazerIcon from '../../icones/lazer-icone.svg';

function RegistroHumorAtividades() {
  const [selected, setSelected] = useState({}); // Objeto para armazenar seleções
  const navigate = useNavigate(); // Hook para navegação
  const { id: pacienteId } = useParams(); // Captura o ID do paciente da URL

  const handleCheck = (category) => {
    setSelected((prev) => ({
      ...prev,
      [category]: true, // Armazena como true
    }));
  };

  const handleTimes = (category) => {
    setSelected((prev) => ({
      ...prev,
      [category]: false, // Armazena como false
    }));
  };

  const handleSave = () => {
    // Armazena os valores no localStorage
    Object.keys(selected).forEach((category) => {
      localStorage.setItem(category, selected[category]);
    });

    // Redireciona para a tela de avaliação com o ID do paciente
    navigate(`/registroHumorAvaliacao/${pacienteId}`); // Inclui pacienteId na URL
  };

  const handleBack = () => {
    // Remove os dados do localStorage
    Object.keys(selected).forEach((category) => {
      localStorage.removeItem(category);
    });
    // Redireciona para a tela de listar
    navigate('/telaListar');
  };

  const getButtonClass = (category, type) => {
    if (selected[category] === true && type === 'check') {
      return 'button-checked';
    } else if (selected[category] === false && type === 'times') {
      return 'button-checked-times';
    }
    return '';
  };

  // Função para verificar se todas as categorias foram selecionadas
  const allCategoriesSelected = () => {
    const categories = ['Estudos', 'Trabalho', 'Exercício', 'Lazer'];
    return categories.every((category) => selected[category] !== undefined);
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
              >
                <i className="fas fa-check"></i>
              </button>
              <button
                className={`checkstyle ${getButtonClass(category, 'times')}`}
                onClick={() => handleTimes(category)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="footer">
        <button className="btnVoltar" onClick={handleBack}>Voltar</button>
        <button 
          className="btnSalvar" 
          onClick={handleSave} 
          disabled={!allCategoriesSelected()} // Desabilita se não todas as categorias estiverem preenchidas
        >
          Salvar
        </button>
      </div>
    </div>
  );
}

export default RegistroHumorAtividades;
