import React, { useEffect, useState } from 'react';

const Compromissos = () => {
    const [nomeUsuario, setNomeUsuario] = useState('');

    useEffect(() => {
        // Função para capitalizar a primeira letra
        const capitalizeFirstLetter = (nome) => {
            return nome.charAt(0).toUpperCase() + nome.slice(1).toLowerCase();
        };

        // Recupera o nome do usuário do localStorage
        const nome = localStorage.getItem('nomeUsuario');
        if (nome) {
            setNomeUsuario(capitalizeFirstLetter(nome)); // Atualiza o estado com o nome formatado
        }
    }, []);

    const hoje = new Date();
    const opcoes = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const dataFormatada = hoje.toLocaleDateString('pt-BR', opcoes);

    return (
        <div id="compromissos">
            <h3>Olá, Dr(a) <span className="destaque">{nomeUsuario ? nomeUsuario : ''}</span></h3>
            <p id='dataComp'>Compromissos de hoje - Dia {dataFormatada} <span className="ver-todos">Ver todos &gt;</span></p>

            <div className="compromisso-item">
                <span className="hora">
                    <span className="indicador red"></span> 10:20
                </span>
                <span className="consulta"> - Consulta Gabo Gabriel</span>
            </div>

            <div className="compromisso-item">
                <span className="hora">
                    <span className="indicador yellow"></span> 13:40
                </span>
                <span className="consulta"> - Consulta Luana Santos</span>
            </div>
        </div>
    );
};

export default Compromissos;
