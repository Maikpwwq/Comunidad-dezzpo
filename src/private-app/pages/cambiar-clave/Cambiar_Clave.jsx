// Pagina de Usuario - CambiarClave
import React from 'react'

const CambiarClave = (props) => {
    return (
        <React.Fragment>
            <main>
                <section className="section">
                    <div className="container">
                        <span>
                            <h2>Asigna una nueva contrasena</h2>
                        </span>
                        <form action="">
                            <input
                                type="text"
                                name=""
                                id=""
                                placeholder="Nueva cLave"
                                required
                            />
                            <input
                                type="text"
                                name=""
                                id=""
                                placeholder="repite la Nueva clave"
                                required
                            />
                            <button>Establecer</button>
                        </form>
                    </div>
                </section>
            </main>
        </React.Fragment>
    )
}

export default CambiarClave
