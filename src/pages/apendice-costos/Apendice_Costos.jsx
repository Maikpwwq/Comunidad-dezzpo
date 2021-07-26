// Pagina de Apendice de costos
import React from 'react'
import '../../../public/assets/css/apendice_costos.css'
import { Link } from 'react-router-dom'

const ApendiceCostos = () => {
    return (
        <>            
            <main className="section">
                <div className="pageContainer">
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
                                    ¿Cuánto cuesta instalar nuevas
                                    tomacorrientes?
                                </Link>
                            </li>
                            <li>
                                <Link to="/apendice-costos">
                                    ¿Cuánto cuesta instalar una ducha electrica?
                                </Link>
                            </li>
                            <li>
                                <Link to="/apendice-costos">
                                    ¿Cuánto cuesta diagnosticar un fallo
                                    electrico?
                                </Link>
                            </li>
                            <li>
                                <Link to="/apendice-costos">
                                    ¿Cuánto cuesta remodelar una habitación?
                                </Link>
                            </li>
                            <li>
                                <Link to="/apendice-costos">
                                    ¿Cuánto cuesta instalar nuevas iluminaciones
                                    y lamparas?
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </main>
        </>
    )
}

export default ApendiceCostos
