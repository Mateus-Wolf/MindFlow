import './App.css';
import './style/formsInicio.css';
import './style/home.css';
import './style/perfil.css';
import './style/pacientes.css';
import './style/agendamentos.css'
import './style/registrohumor.css'
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './componentes/telaIncial/bemVindo';
import Home from './componentes/telaHome/home';
import Perfil from './componentes/telaPerfil/perfil';
import Agendamentos from './componentes/telaAgendamentos/agendamentos';
import ListarPacientes from './componentes/telasPacientes/telaListar';
import CadastrarPacientes from './componentes/telasPacientes/telaCadastrar';
import DadosPacientes from './componentes/telasPacientes/telaDados';
import RegistroHumorAtividades from './componentes/telaRegistrosHumor/registroHumorAtividades';
import RegistroHumorAvaliacao from './componentes/telaRegistrosHumor/registroHumorAvaliacao';
const userId = localStorage.getItem('userId');


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} /> {/* Rota para Home */}
        <Route path="/perfil" element={<Perfil />} /> {/* Rota para Perfil */}
        <Route path="/agendamentos" element={<Agendamentos />} /> {/* Rota para Perfil */}
        <Route path="/telaCadastrar" element={<CadastrarPacientes />} /> {/* Rota para Perfil */}
        <Route path="/telaListar" element={<ListarPacientes />} /> {/* Rota para Perfil */}
        <Route path="/telaDados/:id" element={<DadosPacientes />} /> {/* Rota para Perfil */}
        <Route path="/registroHumorAtividades" element={<RegistroHumorAtividades />} /> {/* Rota para Perfil */}
        <Route path="/registroHumorAvaliacao" element={<RegistroHumorAvaliacao />} /> {/* Rota para Perfil */}
      </Routes>
    </Router>
  );
}

export default App;
