// Pagina de registro
import React from 'react';

const Registro = props => {
    render ( 
        <React.Fragment>
            <main class="section">
                <div class="container">
                        {/*Seccion de Registro*/} 
                <section id="registrate">
                    <div class="registrateImagen">
                        
                    </div>
                    <div class="registrateformulario">
                        <form id="formularioRegistro" action="">
                            <div>
                                <h1>REGISTRATE</h1> 
                                <p>bienvenido a todos los beneficios de dezzpo</p> 
                                <label for="">Nombre</label><br/>
                                <input type="text" value=""/><br/>
                                <label for="">Nombre de usuario</label><br/>
                                <input type="text" value=""/><br/>
                                <label for="">Email</label><br/>
                                <input type="email" value=""/><br/>
                                <label for="">Contraseña</label><br/>
                                <input type="password" value=""/><br/>
                                <label for="">Confirme la Contraseña</label><br/>
                                <input type="password" value=""/><br/>
                                <label for=""> No soy un robot
                                    <input type="checkbox" checked="checkbox"/> 
                                </label> <br/>
                                <button type="submit">Crear Cuenta</button>
                                <p>Bienvenido</p>
                            </div>
                        </form>
                    </div>
                </section>
                </div>
            </main>
        </React.Fragment>
    )
};

export default Registro;