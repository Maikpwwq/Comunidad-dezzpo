// Pagina de Usuario - Biblioteca
import React from 'react'

const Biblioteca = (props) => {
    return (
        <React.Fragment>
            <main>
                <section className="section">
                    <div className="container">
                        <span>
                            <h2>Descargar documentos</h2>
                        </span>
                        <p>
                            Encuentra aqui, plantillas para redactar tus
                            documentos, material de consulta, enlaces utiles y
                            más.
                        </p>
                        <p>
                            Al ejecutar un nuevo proyecto siempre edite e
                            imprima prímero los documentos anexos, <br />
                            como lo son cotizaciones y contratos{' '}
                        </p>
                        <span>Titulo</span>
                        <ul>
                            <li>CONTRATO DE ADQUISICION DE SERVICIO</li>
                            <li>FORMATO DE REQUERIMIENTOS DEL CLIENTE</li>
                            <li>FORMATO DE COTIZACIÓN DE SERVICIOS</li>
                        </ul>
                    </div>
                </section>
                <section className="section">
                    <div className="container">
                        <span>
                            <h2>Material de consulta</h2>
                        </span>
                        <span>Titulo</span>
                        <ul>
                            <li>
                                Patologías y sistemas de mantenimiento en los
                                inmuebles
                            </li>
                            <li>
                                MANUAL DE PROCEDIMIENTOS DE MANTENIMIENTO
                                CORRECTIVO Y PREVENTIVO
                            </li>
                            <li>
                                Reglamentaciones del Sistema de salud y
                                seguridad en el trabajo
                            </li>
                        </ul>
                    </div>
                </section>
                <section className="section">
                    <div className="container">
                        <span>
                            <h2>Canal de youtube</h2>
                        </span>
                        <p>
                            Hemos recopilado unas listas de videos, las cuales
                            pueden ser de gran utilidad, <br />
                            para especificar los detalles y acabados del
                            servicio
                        </p>
                    </div>
                </section>
                <section className="section">
                    <div className="container">
                        <span>
                            <h2> Libreta de direcciones </h2>
                        </span>
                        <span>Tiendas</span>
                    </div>
                </section>
            </main>
        </React.Fragment>
    )
}

export default Biblioteca
