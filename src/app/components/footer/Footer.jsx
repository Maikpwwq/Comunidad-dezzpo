/* Footer de navegacion de contenidos Grupo Paginas Comunidad */
import React from 'react'
import '../../../../public/assets/css/footer.css'
import { Link, Redirect } from 'react-router-dom'
import IcoMoon from 'react-icomoon'
import iconSet from '../../../../public/assets/css/icomoon/selection.json'
// images
import LogoFooterComunidadDezzpo from '../../../../public/assets/img/IsologoFooter.png'

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
                    <Col className="footerContainer p-0">
                        {/* parte superior */}
                        <Row className="footerSuperior">
                            <Row className="mt-2">
                                {/* Mas links */}
                                <Col
                                    className="ps-4 ms-4 align-items-end"
                                    lg={4}
                                    md={4}
                                    sm={6}
                                    xs={12}
                                >
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
                                            <Link
                                                to="/ayuda-pqrs"
                                                title="Ayuda"
                                            >
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
                                <Col
                                    className="siguenosRedes p-0 align-items-start"
                                    lg={4}
                                    md={8}
                                    sm={8}
                                    xs={12}
                                >
                                    <Container className="containerLogo p-0 m-0 mt-4 mb-4 d-flex justify-content-start">
                                        <img
                                            src={LogoFooterComunidadDezzpo}
                                            alt="Logo Comunidad Dezzpo"
                                            // style={{ 'border-radius': '50%' }}
                                            height="80px"
                                            width="210px"
                                        />
                                    </Container>
                                    <h2 className="headline-xl textBlanco ps-4">
                                        {' '}
                                        SIGUENOS{' '}
                                    </h2>
                                    <Container className="p-0 ps-4">
                                        <ul className="listaFooter w-100 body-1 row justify-content-start">
                                            {' '}
                                            &#10095;
                                            {/* siguenos Instagram */}
                                            <li className="w-auto d-flex align-items-center">
                                                <a
                                                    href="https://www.instagram.com/comunidad_dezzpo/"
                                                    title="Instagram"
                                                >
                                                    <IcoMoon
                                                        iconSet={iconSet}
                                                        icon="IntagramSocialIcono"
                                                        style={{
                                                            height: '33px',
                                                        }}
                                                    />
                                                </a>
                                            </li>
                                            {/* siguenos Twitter */}
                                            <li className="w-auto d-flex align-items-center">
                                                <a
                                                    href="https://www.twitter.com/"
                                                    title="Twitter"
                                                >
                                                    <IcoMoon
                                                        iconSet={iconSet}
                                                        icon="TwitterSocialIcono"
                                                        style={{
                                                            height: '33px',
                                                        }}
                                                    />
                                                </a>
                                            </li>
                                            {/* siguenos Facebook */}
                                            <li className="w-auto d-flex align-items-center">
                                                <a
                                                    href="https://www.facebook.com/comunidad.dezzpo"
                                                    title="Facebook"
                                                >
                                                    <IcoMoon
                                                        iconSet={iconSet}
                                                        icon="FacebookSocialIcono"
                                                        style={{
                                                            height: '33px',
                                                        }}
                                                    />
                                                </a>
                                            </li>
                                            {/* siguenos Linkedin */}
                                            <li className="w-auto d-flex align-items-center">
                                                <a
                                                    href="https://www.linkedin.com/company/dezzpo-inc/"
                                                    title="LinkedIn"
                                                >
                                                    <IcoMoon
                                                        iconSet={iconSet}
                                                        icon="LinkedinSocialIcono"
                                                        style={{
                                                            height: '33px',
                                                        }}
                                                    />
                                                </a>
                                            </li>
                                        </ul>
                                    </Container>
                                </Col>
                                {/* Datos de contacto comunidad dezzpo */}
                                <DatosContacto></DatosContacto>
                            </Row>
                        </Row>
                        {/* parte inferior*/}
                        <Row className="footerInferior pt-3 w-100">
                            <p className="p-description textBlanco">
                                {' '}
                                © 2021 - Todos los derechos reservados -{' '}
                                <span className="dezzpo-svg textBlanco">
                                    COMUNIDAD DEZZPO INC.
                                </span>
                            </p>
                        </Row>
                    </Col>
                </footer>
            </Container>
        </>
    )
}

export default FooterComunidad
