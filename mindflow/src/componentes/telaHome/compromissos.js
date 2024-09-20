import React from "react";

const Compromissos = () => {
    return (
        <div id="compromissos">
            <h3>Bem Vindo, DR. Gabo</h3>
            <p>Compromissos - Dia 20/09</p>
            <div className="card" style={{ width: '18rem' }}> {/* Corrigido o style */}
                    <ul className="list-group list-group-flush"> {/* Use className ao invés de class */}
                        <li className="list-group-item">An item</li> {/* Corrigido class para className */}
                        <li className="list-group-item">A second item</li>
                        <li className="list-group-item">A third item</li>
                    </ul>
                    <div className="card-footer"> {/* Corrigido class para className */}
                        Card footer
                    </div>
            </div>
        </div>
    )
}

export default Compromissos