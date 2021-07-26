// Pagina de Usuario - HistorialServicios
import React from 'react'

const HistorialServicios = (props) => {
    render(
        <React.Fragment>
            <main>
                <section className="section">
                    <div className="container">
                        <div>
                            <span>Proyectos Publicados</span>
                            <ul>
                                <li>imagenes</li>
                                <li>Descripción</li>
                                <li>fecha de publicación</li>
                                <li>valor aproximado</li>
                                <li>ubicación</li>
                                <li>Postular</li>
                            </ul>
                        </div>
                        <div>
                            <span>Proyectos cerrados</span>
                        </div>
                        <div>
                            <span>Requerimientos guardados</span>
                        </div>
                        <div>
                            <span>Requerimientos solicitados</span>
                        </div>
                    </div>
                </section>
            </main>
        </React.Fragment>
    )
}

export default HistorialServicios
