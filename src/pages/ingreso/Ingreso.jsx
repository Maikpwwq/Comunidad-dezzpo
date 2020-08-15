// Pagina de Ingreso
import React from 'react';

const Ingreso = props => {
    render ( 
        <React.Fragment>
            <main class="section">
                <div class="container">            
                    <div class="ingresoFormulario">
                        <div class=" row">
                            <div class="imagenIngreso">
                                    
                            </div>
                            <div class="colRight">
                                <div class="ingresarFormulario">
                                    <span class="tituloformulario"><h1>Bienvenido!</h1></span>                        
                                    <p>ERES NUEVO, <br/>
                                        CREA FÁCIL UNA CUENTA!<a href="">, Registrate</a></p>
                                    <br/>
                                    <ul>
                                        <li><a href="">INGRESAR CON FACEBOOK </a></li>
                                        <li><a href="">INGRESAR CON GMAIL </a></li>                            
                                    </ul>                        
                                    <br/>
                                    <form id="formularioIngreso" action="">                                                    
                                        <hr/>
                                        <input type="text" name="" id="" placeholder="correo o número celular"/><br/>
                                        <br/>
                                        <input type="password" name="password" id="password" placeholder="contraseña"/><br/>
                                        <span><a href="">OLVIDASTE LA CONTRASEÑA</a></span><br/>
                                        <input type="checkbox" name="" id="" style="width: 30px;"/><span> Recuérdame </span><br/>
                                        <input type="checkbox" name="" id="" style="width: 30px;" required/><span> NO SOY UN ROBOT </span> <br/>
                                        <br/>
                                        <button>INICIAR SESIÓN</button>
                                        <br/>
                                        <hr/>
                                    </form>
                                    <span class="tituloformulario"><h1>BIENVENIDO</h1></span>
                                </div>                        
                            </div>                    
                        </div>  
                    </div>        
                    <div class="ingresoUbicacion">
                        <div class="row">
                            <div class="colLeft">
                                <span class="tituloformulario"> <h1>Ingresa tu ubicación</h1> </span>
                                <p>
                                    Podras consultar con mejor <br/>
                                    precision los costos y <br/>
                                    tiempos de entrega <br/>
                                </p>
                                <form action="busquedaCiudad">                            
                                    <label for=""> Ciudad </label><br/>
                                    <select name="city" id="city">
                                        <option>seleccionar uno</option>
                                        <option value="Bogota">Bogota</option>
                                    </select><br/>
                                    <label for="">Dirección</label><br/>
                                    <input type="text"/><br/>
                                    <button class="btn">Consultar</button>
                                </form>
                            </div>
                            <div class="imagenUbicacion">
                                    
                            </div>
                        </div>                
                    </div>
                </div>
            </main>
        </React.Fragment>
    )
};

export default Ingreso;