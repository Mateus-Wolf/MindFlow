import './App.css';
import './style/formsInicio.css';
import './style/home.css';
import './style/perfil.css';
import './style/pacientes.css';
import './style/agendamentos.css';
import './style/registrohumor.css';
import './style/historico.css';
import './style/animations.css'; // Vamos criar esse já já

import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AnimatedRoutes from './AnimatedRoutes';

function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
