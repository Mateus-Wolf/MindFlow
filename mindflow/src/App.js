import './App.css';
import './style/formsInicio.css';
import './style/home.css';
import './style/perfil.css';
import './style/pacientes.css';
import './style/agendamentos.css';
import './style/registrohumor.css';
import './style/historico.css'
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

const userId = localStorage.getItem('userId');

function App() {
  return (
    <Router>
      <Routes>
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
    </Router>
  );
}

export default App;
