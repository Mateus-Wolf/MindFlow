import './App.css';
import './style/formsInicio.css';
import './style/home.css';
import './style/perfil.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './componentes/telaIncial/home';
import Home from './componentes/telaHome/home';
import Perfil from './componentes/telaPerfil/perfil';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} /> {/* Rota para Home */}
        <Route path="/perfil" element={<Perfil />} /> {/* Rota para Perfil */}
      </Routes>
    </Router>
  );
}

export default App;
