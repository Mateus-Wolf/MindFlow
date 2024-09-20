import './App.css';
import './style/formsInicio.css'
import './style/home.css'
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './componentes/telaIncial/home';
import Home from './componentes/telaHome/home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} /> {/* Definindo a rota para Home */}
      </Routes>
    </Router>
  );
}

export default App;
