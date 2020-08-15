// Pagina de Apendice de costos
import React from 'react';
import {Link} from 'react-router-dom';

const ApendiceCostos = props => {
    render ( 
        <React.Fragment>
            <header class="section">
                <nav class="container nav-bar">
                    {/*se importa barra de menu del home */}
                </nav>
            </header>
            <main class="section">
                <div class="container">
                    <div class="apendiceCostosTitulo">
                        <span class="titulo">Costeo de Servicios <br/> Comunes</span>
                    </div>
                    <div class="apendiceCostosPreguntas">
                        <ul>
                            <li><Link to="/apendice-costos">
                                ¿Cuánto cuesta instalar nuevas tomacorrientes?</Link></li>
                            <li><Link to="/apendice-costos">
                                ¿Cuánto cuesta instalar una ducha electrica?</Link></li>
                            <li><Link to="/apendice-costos">
                                ¿Cuánto cuesta diagnosticar un fallo electrico?</Link></li>
                            <li><Link to="/apendice-costos">
                                ¿Cuánto cuesta remodelar una habitación?</Link></li>
                            <li><Link to="/apendice-costos">
                                ¿Cuánto cuesta instalar nuevas iluminaciones y lamparas?</Link></li>
                        </ul>                
                    </div>
                </div>
            </main>
            <footer class="section">
                <div class="container">
                    {/*se importa el footer del home */}
                </div>
            </footer>
        </React.Fragment>
    )
};

export default ApendiceCostos;