// Pagina de nuestros patrocinadores
import React from 'react'
import '../../../public/assets/css/patrocinadores.css'

const Patrocinadores = (props) => {
    return (
        <>
            <main className="section">
                <div className="containerPatrocinadores">
                    <div className="patrocinadoresMensaje">
                        <span className="tituloDocumento">
                            {' '}
                            <h1>
                                Estos son algunos de nuestros patrocinadores
                            </h1>{' '}
                        </span>
                        <ul>
                            <li>Bictia</li>
                        </ul>
                    </div>
                </div>
            </main>
        </>
    )
}

export default Patrocinadores
