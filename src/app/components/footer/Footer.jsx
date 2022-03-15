/* Footer de navegacion de contenidos Grupo Paginas Comunidad */
import React from 'react'
import '../../../../public/assets/css/footer.css'
//import '../../../../public/assets/css/iconmoon/style.css';
import { Link, Redirect } from 'react-router-dom'

import DatosContacto from '../datos_contacto/DatosContacto'

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
                                <h2 className="headline-xl textBlanco">
                                    {' '}
                                    SIGUENOS{' '}
                                </h2>
                                <ul className="listaFooter w-100 body-1">
                                    {/* siguenos Instagram */}
                                    <li className="w-50 d-flex align-items-center">
                                        {' '}
                                        &#10095;
                                        <span
                                            className="icon-IntagramSocialIcono p-1"
                                            style={{
                                                'font-size': '1.5em',
                                            }}
                                        >
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
                                    <li className="w-50 d-flex align-items-center">
                                        {' '}
                                        &#10095;
                                        <span
                                            className="icon-TwitterSocialIcono p-1"
                                            style={{
                                                'font-size': '1.5em',
                                            }}
                                        >
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
                                    <li className="w-50 d-flex align-items-center">
                                        {' '}
                                        &#10095;
                                        <span
                                            className="icon-FacebookSocialIcono p-1"
                                            style={{
                                                'font-size': '1.5em',
                                            }}
                                        >
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
                                    <li className="w-50 d-flex align-items-center">
                                        {' '}
                                        &#10095;
                                        <span
                                            className="icon-LinkedinSocialIcono p-1"
                                            style={{
                                                'font-size': '1.5em',
                                            }}
                                        >
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
                            <DatosContacto></DatosContacto>
                        </Row>
                        {/* parte inferior*/}
                        <Row className="footerInferior pt-3 w-100">
                            <p className="p-description textBlanco">
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
