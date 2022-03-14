/* Footer de navegacion de contenidos Grupo Paginas Comunidad */
import React from 'react'
import '../../../../public/assets/css/footer.css'
//import '../../../../public/assets/css/iconmoon/style.css';
import { Link, Redirect } from 'react-router-dom'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

const FooterComunidad = (props) => {
    return (
        <>
            <Container fluid className="p-0">
                <footer className="footer">
                    {/* Empieza la seccion del footer */}
                    <Col className="footerContainer pb-0">
                        {/* parte superior */}
                        <Row className="footerSuperior">
                            {/* Mas links */}
                            <Col className="masLinks">
                                <ul className="body-1">
                                    <li>
                                        {' '}
                                        &#10095;{' '}
                                        <Link to="/legal" title="legal">
                                            {' '}
                                            Legal
                                        </Link>
                                    </li>
                                    <li>
                                        {' '}
                                        &#10095;{' '}
                                        <Link to="/ayuda-pqrs" title="Ayuda">
                                            {' '}
                                            Ayuda
                                        </Link>
                                    </li>
                                    <li>
                                        {' '}
                                        &#10095;{' '}
                                        <Link
                                            to="/patrocinadores"
                                            title="Patrocinadores"
                                        >
                                            {' '}
                                            Patrocinadores
                                        </Link>
                                    </li>
                                    <li>
                                        {' '}
                                        &#10095;{' '}
                                        <Link to="/blog" title="Blog">
                                            {' '}
                                            Blog
                                        </Link>
                                    </li>
                                    <li>
                                        {' '}
                                        &#10095;{' '}
                                        <Link
                                            to="/contactenos"
                                            title="Contactenos"
                                        >
                                            {' '}
                                            Contactenos
                                        </Link>
                                    </li>
                                    <li>
                                        {' '}
                                        &#10095;{' '}
                                        <Link
                                            to="/mapa-del-sitio"
                                            title="Mapa del Sitio"
                                        >
                                            {' '}
                                            Mapa del Sitio
                                        </Link>
                                    </li>
                                </ul>
                            </Col>
                            {/* siguenos en redes */}
                            <Col className="siguenosRedes pt-0">
                                <h2 className="headline-xl"> SIGUENOS </h2>
                                <ul className="listaFooter w-100 body-1">
                                    {/* siguenos Instagram */}
                                    <li className="w-50">
                                        {' '}
                                        &#10095;
                                        <span className="icon-IntagramSocialIcono p-1">
                                            <span className="path1"></span>
                                            <span className="path2"></span>
                                            <span className="path3"></span>
                                            <span className="path4"></span>
                                            <span className="path5"></span>
                                        </span>
                                        <a
                                            href="https://www.instagram.com/comunidad_dezzpo/"
                                            title="Instagram"
                                        >
                                            {' '}
                                            Instagram{' '}
                                        </a>
                                    </li>
                                    {/* siguenos Twitter */}
                                    <li className="w-50">
                                        {' '}
                                        &#10095;
                                        <span className="icon-TwitterSocialIcono p-1">
                                            <span className="path1"></span>
                                            <span className="path2"></span>
                                        </span>
                                        <a
                                            href="https://www.twitter.com/"
                                            title="Twitter"
                                        >
                                            {' '}
                                            Twitter{' '}
                                        </a>
                                    </li>
                                    {/* siguenos Facebook */}
                                    <li className="w-50">
                                        {' '}
                                        &#10095;
                                        <span className="icon-FacebookSocialIcono p-1">
                                            <span className="path1"></span>
                                            <span className="path2"></span>
                                        </span>
                                        <a
                                            href="https://www.facebook.com/comunidad.dezzpo"
                                            title="Facebook"
                                        >
                                            {' '}
                                            Facebook{' '}
                                        </a>
                                    </li>
                                    {/* siguenos Linkedin */}
                                    <li className="w-50">
                                        {' '}
                                        &#10095;
                                        <span className="icon-LinkedinSocialIcono p-1">
                                            <span className="path1"></span>
                                            <span className="path2"></span>
                                            <span className="path3"></span>
                                            <span className="path4"></span>
                                        </span>
                                        <a
                                            href="https://www.linkedin.com/company/dezzpo-inc/"
                                            title="LinkedIn"
                                        >
                                            {' '}
                                            LinkedIn{' '}
                                        </a>
                                    </li>
                                </ul>
                            </Col>
                            {/* Datos de contacto comunidad dezzpo */}
                            <Col className="datosContacto pt-0">
                                <h2 className="headline-xl">
                                    {' '}
                                    Ponte en Contacto{' '}
                                </h2>
                                <ul className="listaFooter pt-3 w-100">
                                    <Row className="m-0 w-100 d-flex">
                                        <span
                                            className="icon-DireccionDomicilioIcono"
                                            style={{ width: 'auto' }}
                                        ></span>
                                        <Col className="m-0 p-0 body-1">
                                            <li>
                                                {' '}
                                                Dirección Cll 159 No. 8c-45{' '}
                                            </li>
                                            <li> Piso 5 </li>
                                        </Col>
                                    </Row>
                                    <Row className="m-0 w-100 d-flex">
                                        <span
                                            className="icon-TelefonoContactoIcono"
                                            style={{ width: 'auto' }}
                                        ></span>
                                        <Col className="m-0 p-0 body-1">
                                            <li> +57 3196138057 - Office </li>
                                            <li> +57 3196138057 - PBX </li>
                                        </Col>
                                    </Row>
                                    <Row className="m-0 w-100 d-flex">
                                        <span
                                            className="icon-EmailIcono"
                                            style={{ width: 'auto' }}
                                        ></span>
                                        <Col className="m-0 p-0 body-1">
                                            <li>
                                                <a
                                                    href="mailto:comunidad.dezzpo@gmail.com"
                                                    title="Correo Comunidad Dezzpo"
                                                >
                                                    {' '}
                                                    comunidad.dezzpo@gmail.com{' '}
                                                </a>
                                            </li>
                                        </Col>
                                    </Row>
                                </ul>
                            </Col>
                        </Row>
                        {/* parte inferior*/}
                        <Row className="footerInferior pt-3 w-100">
                            <p className="p-description">
                                {' '}
                                © 2021 - Todos los derechos reservados -
                                COMUNIDAD DEZZPO INC.{' '}
                            </p>
                        </Row>
                    </Col>
                </footer>
            </Container>
        </>
    )
}

export default FooterComunidad
