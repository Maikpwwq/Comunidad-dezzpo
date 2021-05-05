// Pagina de Contactenos
import React from 'react';
import '../../../public/assets/css/iconmoon/style.css';
import '../../../public/assets/css/contactenos.css';

const Contactenos = props => {
    return ( 
        <>
            <main className="section">
                <div className="container">
                    <div className="contactenosTitulo">
                        <span className="mainTitulo"> <h1> CONTÁCTENOS </h1></span>
                    </div>
                    <div className="contactenosMensaje row">
                        <div className="col">
                            <img src="assets/img/ContactenosFranja.png" alt="fondo comunidad dezzpo"/>
                            <img src="assets/img/LogoPNG.png" alt="Logo Comunidad Dezzpo"/>
                        </div>
                        <div className="col">
                            <div className="formContacto">
                                <form action="">
                                    <input type="text" name="name" id="name" placeholder="nombre:" required/><br/>
                                    <input type="text" name="email" id="email" placeholder="Email:" required/><br/>
                                    <input type="text" name="phone" id="phone" placeholder="telefono:" required/><br/>
                                    <textarea name="message" id="message" cols="30" rows="10" required>mensaje:</textarea><br/>
                                    <button>ENVIAR</button>
                                </form>
                            </div>                    
                        </div>
                        <div className="col">
                            <div className="borderBlue">
                                <img src="assets/img/SelectorContactenos.png" alt="datos de contacto"/>
                                {/*Datos de contacto comunidad dezzpo*/} 
                                <div className="datosContacto">
                                    <h1> Consultenos </h1>
                                    <ul className="listaContacto">
                                        <span className="icon-DireccionDomicilioIcono"></span>
                                        <li> Dirección  Cll 159 No. 8c-45 </li>
                                        <li> Piso 5 </li>
                                        <br/>
                                        <span className="icon-TelefonoContactoIcono"></span>
                                        <li> +57 3196138057 - Office </li>
                                        <li> +57 3196138057 - PBX </li>
                                        <br/>
                                        <span className="icon-EmailIcono"></span>
                                        <li><a href="mailto:comunidad.dezzpo@gmail.com" title="Correo Comunidad Dezzpo"> comunidad.dezzpo@gmail.com </a></li>
                                    </ul>
                                </div>
                            </div>                    
                        </div>                
                    </div>
                </div>
            </main>
        </>
    )
};

export default Contactenos;