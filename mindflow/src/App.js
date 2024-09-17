import logo from './logo.svg';
import './App.css';
import React, {Component} from 'react';
import Home from './componentes/home'

class App extends Component {
  render() {
    return (
      // Render da Aplicação / O que vai ser exibido
      <div className="App">
        <Home/>
      </div>
    );
  }
}

export default App;