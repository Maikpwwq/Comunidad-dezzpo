// Pagina de Usuario - Mensajes
import React from 'react'

const Mensajes = (props) => {
    return (
        <React.Fragment>
            <main>
                <section className="section">
                    <div className="container">
                        <form action="">
                            <button>
                                <select
                                    name="bandejaMensajes"
                                    id="bandejaMensajes"
                                >
                                    {' '}
                                    Categoría
                                    <option value="nuevosMensajes">
                                        Nuevos Mensajes
                                    </option>
                                    <option value="inquietudesPropietarios ">
                                        Consultar inquietudes de los
                                        propietarios{' '}
                                    </option>
                                    <option value="AsesoriaProfesional">
                                        Asesorias con un profesional
                                    </option>
                                </select>
                            </button>
                            {/*Desplegar consuta bandeja de entrada*/}
                            <span>titulos</span>
                        </form>
                        <div className="">
                            {/*Desplegar hilo conversaciones*/}
                            HILO DE CONVERSACIÓN
                            <div>
                                <p>
                                    Publicado el 23/05/2019 a las10:30 am, por
                                    @Nombre usuario{' '}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </React.Fragment>
    )
}

export default Mensajes
