// Pagina de Usuario - Ajustes
import React from 'react'

const Ajustes = (props) => {
    return (
        <>
            <main>
                <div className="section">
                    <div className="container">
                        <div>
                            <form action="">
                                <div>
                                    <span>Datos de contacto</span>
                                </div>
                                <input
                                    type="text"
                                    placeholder="@NOMBRE USUARIO"
                                />
                                <input
                                    type="text"
                                    name=""
                                    id=""
                                    placeholder="Razon social"
                                />
                                <input
                                    type="text"
                                    name=""
                                    id=""
                                    placeholder="Identificación"
                                />
                                <input
                                    type="text"
                                    name=""
                                    id=""
                                    placeholder="Correo"
                                />
                                <input
                                    type="text"
                                    name=""
                                    id=""
                                    placeholder="Celular"
                                />
                                <input
                                    type="text"
                                    name=""
                                    id=""
                                    placeholder="ubicación"
                                />
                                <input type="text" placeholder="Profesión" />
                                <input type="text" placeholder="experiencia" />
                                <input
                                    type="text"
                                    placeholder="certificaciones"
                                />
                                <label for="">Servicios ofrecidos</label>
                                <textarea
                                    name=""
                                    id=""
                                    cols="30"
                                    rows="10"
                                ></textarea>
                                <label for="">Confirmacion de identidad</label>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

export default Ajustes
