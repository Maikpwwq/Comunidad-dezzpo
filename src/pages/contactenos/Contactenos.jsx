// Pagina de Contactenos
import React from 'react';

const Contactenos = props => {
    render ( 
        <React.Fragment>
            <main class="section">
                <div class="container">
                    <div class="contactenosTitulo">
                        <span class="mainTitulo"> <h1> CONTÁCTENOS </h1></span>
                    </div>
                    <div class="contactenosMensaje row">
                        <div class="col">
                            <img src="assets/img/ContactenosFranja.png" alt="fondo comunidad dezzpo"/>
                            <img src="assets/img/LogoPNG.png" alt="Logo Comunidad Dezzpo"/>
                        </div>
                        <div class="col">
                            <div class="formContacto">
                                <form action="">
                                    <input type="text" name="name" id="name" placeholder="nombre:" required/><br/>
                                    <input type="text" name="email" id="email" placeholder="Email:" required/><br/>
                                    <input type="text" name="phone" id="phone" placeholder="telefono:" required/><br/>
                                    <textarea name="message" id="message" cols="30" rows="10" required>mensaje:</textarea><br/>
                                    <button>ENVIAR</button>
                                </form>
                            </div>                    
                        </div>
                        <div class="col">
                            <div class="borderBlue">
                                <img src="assets/img/SelectorContactenos.png" alt="datos de contacto"/>
                                {/*Datos de contacto comunidad dezzpo*/} 
                                <div class="datosContacto">
                                    <h1> Consultenos </h1>
                                    <ul class="listaContacto">
                                        <span class="icon-DireccionDomicilioIcono"></span>
                                        <li> Dirección  Cll 159 No. 8c-45 </li>
                                        <li> Piso 5 </li>
                                        <br/>
                                        <span class="icon-TelefonoContactoIcono"></span>
                                        <li> +57 3196138057 - Office </li>
                                        <li> +57 3196138057 - PBX </li>
                                        <br/>
                                        <span class="icon-EmailIcono"></span>
                                        <li><a href="mailto:comunidad.dezzpo@gmail.com" title="Correo Comunidad Dezzpo"> comunidad.dezzpo@gmail.com </a></li>
                                    </ul>
                                </div>
                            </div>                    
                        </div>                
                    </div>
                </div>
            </main>
        </React.Fragment>
    )
};

export default Contactenos;