import React from 'react';

const Compromissos = () => {
    const hoje = new Date();
    const opcoes = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const dataFormatada = hoje.toLocaleDateString('pt-BR', opcoes);

    return (
        <div id="compromissos">
            <h3>Bem vinda, <span className="destaque">Dra. Amanda</span></h3>
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
