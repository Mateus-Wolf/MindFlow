import React from "react";

const PacientesRec = () => {
    return (
        <div id="pacientes">
            <h3>Pacientes Recentes</h3>
            <div id="pacientes">
                <div className="card" style={{ width: '18rem' }}> {/* Corrigido o style */}
                    <ul className="list-group list-group-flush"> {/* Use className ao invés de class */}
                        <li className="list-group-item">Gabo Gabriel 10:20 <hr></hr>Gabo 24</li> {/* Corrigido class para className */}
                        <li className="list-group-item">Zasryd Griddy 13:40 <hr></hr>Feminino 23</li>
                        <li className="list-group-item">Marcelo Silva 13:23 <hr></hr>Masculino 35</li>
                    </ul>
                    <div className="card-footer"> {/* Corrigido class para className */}
                        Card footer
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PacientesRec;
