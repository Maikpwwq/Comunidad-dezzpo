// Pagina de registro
import React from 'react'
import '../../../public/assets/css/registro.css'

const Registro = (props) => {
    return (
        <>
            <main className="section">
                <div className="pageContainer">
                    {/* Seccion de Registro*/}
                    <section id="registrate">
                        <div className="registrateImagen"></div>
                        <div className="registrateformulario">
                            <form id="formularioRegistro" action="">
                                <div>
                                    <h1>REGISTRATE</h1>
                                    <p>
                                        bienvenido a todos los beneficios de
                                        dezzpo
                                    </p>
                                    <label htmlFor="">Nombre</label>
                                    <br />
                                    <input type="text" value="" />
                                    <br />
                                    <label htmlFor="">Nombre de usuario</label>
                                    <br />
                                    <input type="text" value="" />
                                    <br />
                                    <label htmlFor="">Email</label>
                                    <br />
                                    <input type="email" value="" />
                                    <br />
                                    <label htmlFor="">Contraseña</label>
                                    <br />
                                    <input type="password" value="" />
                                    <br />
                                    <label htmlFor="">
                                        Confirme la Contraseña
                                    </label>
                                    <br />
                                    <input type="password" value="" />
                                    <br />
                                    <label htmlFor="">
                                        {' '}
                                        No soy un robot
                                        <input
                                            type="checkbox"
                                            checked="checkbox"
                                        />
                                    </label>{' '}
                                    <br />
                                    <button type="submit">Crear Cuenta</button>
                                    <p>Bienvenido</p>
                                </div>
                            </form>
                        </div>
                    </section>
                </div>
            </main>
        </>
    )
}

export default Registro
