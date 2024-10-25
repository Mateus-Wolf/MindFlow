import React from 'react';

const PacientesRec = () => {
    return (
        <div id="pacientes-recentes">  
            <div className="paciente-item">
                <img src="/path/to/image1.jpg" alt="Gabo Gabriel" className="paciente-img" />
                <div className="paciente-info">
                    <h4>Gabo Gabriel</h4>
                    <p>Gabo <span className="idade">??</span></p>
                </div>
                <div className="paciente-consulta">
                    <button className="btn-horario">10:20</button>
                    <button className="btn-horario secundario">13/01 10:20</button>
                </div>
            </div>

            <div className="paciente-item">
                <img src="/path/to/image2.jpg" alt="Griddy" className="paciente-img" />
                <div className="paciente-info">
                    <h4>Griddy</h4>
                    <p>Feminino <span className="idade">23</span></p>
                </div>
                <div className="paciente-consulta">
                    <button className="btn-horario">13:40</button>
                    <button className="btn-horario secundario">10/01 11:20</button>
                </div>
            </div>

            <div className="paciente-item">
                <img src="/path/to/image3.jpg" alt="Marcelo Silva" className="paciente-img" />
                <div className="paciente-info">
                    <h4>Marcelo Silva</h4>
                    <p>Masculino <span className="idade">35</span></p>
                </div>
                <div className="paciente-consulta">
                    <button className="btn-horario">13:23</button>
                    <button className="btn-horario secundario">11/02 11:20</button>
                </div>
            </div>
        </div>
    );
};

export default PacientesRec;
