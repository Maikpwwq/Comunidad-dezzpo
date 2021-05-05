// Pagina de Apendice de costos
import React from 'react';
import '../../../public/assets/css/apendice_costos.css';
import { Link } from 'react-router-dom';

const ApendiceCostos = () => {
  return (
    <>
      <header className="section">
        <nav className="container nav-bar">
          {/* se importa barra de menu del home */}
        </nav>
      </header>
      <main className="section">
        <div className="container">
          <div className="apendiceCostosTitulo">
            <span className="titulo">
              Costeo de Servicios 
              <br /> 
              Comunes
            </span>
          </div>
          <div className="apendiceCostosPreguntas">
            <ul>
              <li>
                <Link to="/apendice-costos">
                  ¿Cuánto cuesta instalar nuevas tomacorrientes?
                </Link>
              </li>
              <li>
                <Link to="/apendice-costos">
                  ¿Cuánto cuesta instalar una ducha electrica?
                </Link>
              </li>
              <li>
                <Link to="/apendice-costos">
                  ¿Cuánto cuesta diagnosticar un fallo electrico?
                </Link>
              </li>
              <li>
                <Link to="/apendice-costos">
                  ¿Cuánto cuesta remodelar una habitación?
                </Link>
              </li>
              <li>
                <Link to="/apendice-costos">
                  ¿Cuánto cuesta instalar nuevas iluminaciones y lamparas?
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </main>
      <footer className="section">
        <div className="container">{/* se importa el footer del home */}</div>
      </footer>
    </>
  );
};

export default ApendiceCostos;