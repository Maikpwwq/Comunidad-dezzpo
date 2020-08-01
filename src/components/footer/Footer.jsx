/* Footer de navegacion de contenidos Grupo Paginas Comunidad */
import React from 'react';
import '../../../css/footer.css';
import "../../../css/iconmoon/style.css";

import {Link, Redirect} from 'react-router-dom';

const FooterComunidad = props => {
    render ( 
    /* Empieza la seccion del footer */
    <React.Fragment>
    <footer id="footer">
        <div id="footerContainer">
            /* parte superior */
            <div className="footerSuperior">
                /* Mas links */
                <div className="masLinks">
                    <ul>
                        <li> &#10095; <a href="#Legal" title="legal"> Legal</a></li>
                        <li> &#10095; <a href="#Ayuda" title="Ayuda"> Ayuda</a></li>
                        <li> &#10095; <a href="#Patrocinadores" title="Patrocinadores"> Patrocinadores</a></li>
                        <li> &#10095; <a href="#Blog" title="Blog"> Blog</a></li>
                        <li> &#10095; <a href="#Contactenos" title="Contactenos"> Contactenos</a></li>
                        <li> &#10095; <a href="#Mapa del Sitio" title="Mapa del Sitio"> Mapa del Sitio</a></li>
                    </ul>
                </div>
                /* siguenos en redes */
                <div className="siguenosRedes">
                    <h1> SIGUENOS </h1>
                    <ul className="listaFooter">
                        /* siguenos Instagram */
                        <li> &#10095;                             
                            <span className="icon-IntagramSocialIcono"><span className="path1"></span><span className="path2"></span><span className="path3"></span><span className="path4"></span><span className="path5"></span></span>
                            <a href="https://www.instagram.com/comunidad_dezzpo/" title="Instagram"> Instagram </a></li>
                        /* siguenos Twitter */
                        <li> &#10095; 
                            <span className="icon-TwitterSocialIcono"><span className="path1"></span><span className="path2"></span></span>
                            <a href="https://www.twitter.com/" title="Twitter"> Twitter </a></li>
                        /* siguenos Facebook */
                        <li> &#10095; 
                            <span className="icon-FacebookSocialIcono"><span className="path1"></span><span className="path2"></span></span>
                            <a href="https://www.facebook.com/comunidad.dezzpo" title="Facebook"> Facebook </a></li>
                        /* siguenos Linkedin */
                        <li> &#10095; 
                            <span className="icon-LinkedinSocialIcono"><span className="path1"></span><span className="path2"></span><span className="path3"></span><span className="path4"></span></span>
                            <a href="https://www.linkedin.com/company/dezzpo-inc/" title="LinkedIn"> LinkedIn </a></li>
                    </ul>
                </div>        
                /* Datos de contacto comunidad dezzpo */
                <div className="datosContacto">
                    <h1> Ponte en Contacto </h1>
                    <ul className="listaFooter">
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
            /* parte inferior*/
            <div className="footerInferior">
                <p> © 2019 - Todos los derechos reservados - COMUNIDAD DEZZPO INC. </p>
            </div>
        </div>
    </footer>    
    </React.Fragment>
)
};

export default FooterComunidad;