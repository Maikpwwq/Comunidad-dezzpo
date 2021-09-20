// Pagina de Legal
import React from 'react'
import '../../../../public/assets/css/legal.css'

const Legal = (props) => {
    return (
        <>
            <main className="section">
                <div className="legalContainer">
                    <div className="legalDocumentos row">
                        <div className="col">
                            <span className="tituloDocumento">
                                <h1>
                                    Terminos y condiciones
                                    <br /> Propietarios
                                </h1>
                            </span>
                            <br />
                            <a
                                href="http://www.google.com"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                .PDF
                            </a>
                        </div>
                        <div className="col">
                            <span className="tituloDocumento">
                                <h1>
                                    Terminos y condiciones
                                    <br /> Comercientes Calificados{' '}
                                </h1>
                            </span>
                            <br />
                            <a
                                href="http://www.google.com"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                .PDF
                            </a>
                        </div>
                        <div className="col">
                            <span className="tituloDocumento">
                                <h1>Terminos de uso</h1>
                            </span>
                            <br />
                            <a
                                href="http://www.google.com"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                .PDF
                            </a>
                        </div>
                        <div className="col">
                            <span className="tituloDocumento">
                                <h1>Politica de privacidad</h1>
                            </span>
                            <br />
                            <a
                                href="http://www.google.com"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                .PDF
                            </a>
                        </div>
                        <div className="col">
                            <span className="tituloDocumento">
                                <h1>Cookies</h1>
                            </span>
                            <br />
                            <a
                                href="http://www.google.com"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                .PDF
                            </a>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

export default Legal
