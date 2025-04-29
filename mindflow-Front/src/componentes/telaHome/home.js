import React from 'react';
import Header from './header'
import PacientesRec from './pacientesRec'
import Compromissos from './compromissos'

const Home = () => {
    return (
        <div id='conteudoPrincipal'>
            <div id='cabecalho'>
                <Header/>
            </div>
            <div id='conteudoPagina'>
                <Compromissos />
                <PacientesRec />
            </div>
        </div>
    );
};

export default Home;
