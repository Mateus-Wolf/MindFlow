import React, { useState, useEffect } from 'react';
import Header from '../telaHome/header';
import { useNavigate, useParams } from "react-router-dom";
import estudoIcon from '../../icones/estudo-icone.svg';
import trabalhoIcon from '../../icones/trabalho-icone.svg';
import exercicioIcon from '../../icones/exercicio-icone.svg';
import lazerIcon from '../../icones/lazer-icone.svg';
import { motion } from 'framer-motion';

function RegistroHumorAtividades() {
  const [selected, setSelected] = useState({});
  const navigate = useNavigate();
  const { id: pacienteId } = useParams();
  const agendamentoId = localStorage.getItem('agendamentoId');

  useEffect(() => {
    console.log('ID do Agendamento:', agendamentoId);
  }, [agendamentoId]);

  const handleCheck = (category) => {
    setSelected((prev) => ({
      ...prev,
      [category]: true,
    }));
  };

  const handleTimes = (category) => {
    setSelected((prev) => ({
      ...prev,
      [category]: false,
    }));
  };

  const handleSave = () => {
    Object.keys(selected).forEach((category) => {
      localStorage.setItem(category, selected[category]);
    });
    navigate(`/registroHumorAvaliacao/${pacienteId}`);
  };

  const handleBack = () => {
    Object.keys(selected).forEach((category) => {
      localStorage.removeItem(category);
    });
    navigate('/home');
  };

  const getButtonClass = (category, type) => {
    if (selected[category] === true && type === 'check') {
      return 'button-checked';
    } else if (selected[category] === false && type === 'times') {
      return 'button-checked-times';
    }
    return '';
  };

  const allCategoriesSelected = () => {
    const categories = ['Estudos', 'Trabalho', 'Exercício', 'Lazer'];
    return categories.every((category) => selected[category] !== undefined);
  };

  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="tudo"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Header />

      <motion.div
        className="categories"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {['Estudos', 'Trabalho', 'Exercício', 'Lazer'].map((category, index) => (
          <motion.div
            className="category"
            key={category}
            variants={itemVariants}
          >
            <h2>{category}</h2>
            <img
              src={
                category === 'Estudos' ? estudoIcon :
                category === 'Trabalho' ? trabalhoIcon :
                category === 'Exercício' ? exercicioIcon :
                lazerIcon
              }
              alt={`${category} Icon`}
            />
            <div className="buttons">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`checkstyle ${getButtonClass(category, 'check')}`}
                onClick={() => handleCheck(category)}
              >
                <i className="fas fa-check"></i>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`checkstyle ${getButtonClass(category, 'times')}`}
                onClick={() => handleTimes(category)}
              >
                <i className="fas fa-times"></i>
              </motion.button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className="footer"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btnVoltar"
          onClick={handleBack}
        >
          Voltar
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btnSalvar"
          onClick={handleSave}
          disabled={!allCategoriesSelected()}
        >
          Salvar
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

export default RegistroHumorAtividades;
