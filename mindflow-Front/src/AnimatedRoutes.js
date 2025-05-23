import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import Login from './componentes/telaIncial/bemVindo';
import Home from './componentes/telaHome/home';
import Perfil from './componentes/telaPerfil/perfil';
import Agendamentos from './componentes/telaAgendamentos/agendamentos';
import ListarPacientes from './componentes/telasPacientes/telaListar';
import CadastrarPacientes from './componentes/telasPacientes/telaCadastrar';
import DadosPacientes from './componentes/telasPacientes/telaDados';
import VisualizarHumor from './componentes/telaRegistrosHumor/visualizarHumor';
import VisualizarHumorAvaliacao from './componentes/telaRegistrosHumor/visualizarHumorAvaliacao';
import RegistroHumor from './componentes/telaRegistrosHumor/registroHumor';
import RegistroHumorAtividades from './componentes/telaRegistrosHumor/registroHumorAtividades';
import RegistroHumorAvaliacao from './componentes/telaRegistrosHumor/registroHumorAvaliacao';
import HistoricoConsultas from './componentes/telaHistorico/historicoConsultas';

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        layout
        key={location.pathname}
        initial={{ opacity: 50 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 10 }} //alterar para 0 se quiser um fade em branco
        transition={{ duration: 0.1 }}
      >

        <Routes location={location}>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/agendamentos" element={<Agendamentos />} />
          <Route path="/telaCadastrar" element={<CadastrarPacientes />} />
          <Route path="/telaListar" element={<ListarPacientes />} />
          <Route path="/telaDados/:id" element={<DadosPacientes />} />
          <Route path="/registroHumor/:id" element={<RegistroHumor />} />
          <Route path="/visualizarHumor/:id" element={<VisualizarHumor />} />
          <Route path="/visualizarHumorAvaliacao/:id" element={<VisualizarHumorAvaliacao />} />
          <Route path="/registroHumorAtividades/:id" element={<RegistroHumorAtividades />} />
          <Route path="/registroHumorAvaliacao/:id" element={<RegistroHumorAvaliacao />} />
          <Route path="/historicoConsultas/:id" element={<HistoricoConsultas />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

export default AnimatedRoutes;
