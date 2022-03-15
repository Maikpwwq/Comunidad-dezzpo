/* Menu de navegacion de contenidos Grupo Paginas Comunidad */
import React from 'react'
import { NavLink, Redirect } from 'react-router-dom' // withRouter,
import '../../../../public/assets/css/menu.css'
import ComunidadDezzpo from '../../../../public/assets/img/Comunidad-Dezzpo.jpg'

import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

const MenuComunidad = (props) => {
    /* getNavLinkClass = (path) => {
        return this.props.location.pathname === path ? 'active' : '';
    }  className= {this.getNavLinkClass("/")}
    */

    return (
        <>
            <Container fluid className="p-0">
                <Col className="menuFijo w-100 p-0 m-0">
                    {/* Menu fijo */}
                    <Col className="p-0 barraMenu">
                        <div className="containerLogo container d-flex justify-content-center">
                            <img
                                src={ComunidadDezzpo}
                                alt="Logo Comunidad Dezzpo"
                                style={{ 'border-radius': '50%' }}
                                height="80px"
                                width="210px"
                            />
                        </div>
                        <nav className="menuContenedor">
                            <ul className="menuSecciones" sm="collapseContents">
                                <li className="botonSeccion">
                                    <NavLink
                                        exact
                                        to="/"
                                        className="activo body-2"
                                    >
                                        {' '}
                                        Home{' '}
                                    </NavLink>
                                </li>
                                {/* seleccion asi trabajamos*/}
                                <div className="dropdown">
                                    <li className="botonSeccion">
                                        <NavLink
                                            to="asi-trabajamos"
                                            className="botonNavLink body-2"
                                        >
                                            {' '}
                                            Asi trabajamos{' '}
                                        </NavLink>
                                    </li>
                                    <div className="dropdownContenidos body-1">
                                        <NavLink to="/ingreso">
                                            Ingresar
                                        </NavLink>
                                        <NavLink to="/asesorias">
                                            Asesores en vivo
                                        </NavLink>
                                        <NavLink to="/comunidad-comerciantes">
                                            Perfil Comerciante
                                        </NavLink>
                                        <NavLink to="/comunidad-propietarios">
                                            Perfil Propietario
                                        </NavLink>
                                        <NavLink to="/registro">
                                            Registrarse
                                        </NavLink>
                                        <NavLink to="/ingreso">
                                            Calificaciones
                                        </NavLink>
                                    </div>
                                </div>
                                {/* seleccion nosotros */}
                                <div className="dropdown">
                                    <li className="botonSeccion">
                                        <NavLink
                                            to="/nosotros"
                                            className="botonNavLink body-2"
                                        >
                                            {' '}
                                            Nosotros{' '}
                                        </NavLink>
                                    </li>
                                    <div className="dropdownContenidos body-1">
                                        <NavLink to="/nosotros/#Acerca-de-nosotros">
                                            Acerca de nosotros
                                        </NavLink>
                                        <NavLink to="/nosotros/#equipo-dezzpo">
                                            Equipo dezzpo
                                        </NavLink>
                                        <NavLink to="/blog">
                                            Programa de afiliados
                                        </NavLink>
                                        <NavLink to="/prensa">Prensa</NavLink>
                                        <NavLink to="/patrocinadores">
                                            Patrocinadores
                                        </NavLink>
                                        <NavLink to="/legal">Legal</NavLink>
                                    </div>
                                </div>
                                {/* seleccion Comunidad de Comerciantes*/}
                                <div className="dropdown">
                                    <li className="botonSeccion">
                                        <NavLink
                                            to="/comunidad-comerciantes"
                                            className="botonNavLink body-2"
                                        >
                                            Comunidad de comerciantes{' '}
                                        </NavLink>
                                    </li>
                                    <div className="dropdownContenidos body-1">
                                        <NavLink to="/ingreso">
                                            Tu cuenta
                                        </NavLink>
                                        <NavLink to="/asesorias">
                                            Asesores en vivo
                                        </NavLink>
                                        <NavLink to="/asi-trabajamos">
                                            Asi funciona
                                        </NavLink>
                                        <NavLink to="/contactenos">
                                            contactanos
                                        </NavLink>
                                        <NavLink to="/ayuda-pqrs">
                                            Ayuda & Pqrs
                                        </NavLink>
                                        <NavLink to="/legal">
                                            Terminos y condiciones
                                        </NavLink>
                                    </div>
                                </div>
                                {/* seleccion Comunidad de Propietarios*/}
                                <div className="dropdown">
                                    <li className="botonSeccion">
                                        <NavLink
                                            to="/comunidad-propietarios"
                                            className="botonNavLink body-2"
                                        >
                                            Comunidad de propietarios{' '}
                                        </NavLink>
                                    </li>
                                    <div className="dropdownContenidos body-1">
                                        <NavLink to="/nuevo-proyecto">
                                            Crea un nuevo proyecto
                                        </NavLink>
                                        <NavLink to="/blog">
                                            Testimonio de propietarios
                                        </NavLink>
                                        <NavLink to="/asi-trabajamos">
                                            Asi funciona
                                        </NavLink>
                                        <NavLink to="/contactenos">
                                            contactanos
                                        </NavLink>
                                        <NavLink to="/ayuda-pqrs">
                                            Ayuda & Pqrs
                                        </NavLink>
                                        <NavLink to="/legal">
                                            Terminos y condiciones
                                        </NavLink>
                                    </div>
                                </div>
                                <li className="botonSeccion">
                                    <NavLink
                                        to="/presupuestos"
                                        className="botonNavLink body-2"
                                    >
                                        {' '}
                                        Presupuestos{' '}
                                    </NavLink>
                                </li>
                                <li className="botonSeccion">
                                    <NavLink
                                        to="/profesionales-servicios"
                                        className="botonNavLink body-2"
                                    >
                                        {' '}
                                        Profesionales y servicios{' '}
                                    </NavLink>
                                </li>
                                <li className="botonSeccion">
                                    <NavLink
                                        to="/asesorias"
                                        className="botonNavLink body-2"
                                    >
                                        {' '}
                                        Asesorias{' '}
                                    </NavLink>
                                </li>
                                <li className="botonSeccion">
                                    <NavLink
                                        to="/apendice-costos"
                                        className="botonNavLink body-2"
                                    >
                                        {' '}
                                        Apendice de costos{' '}
                                    </NavLink>
                                </li>
                                <li className="botonSeccion">
                                    <NavLink
                                        to="/ingreso"
                                        className="botonNavLink body-2"
                                    >
                                        {' '}
                                        Ingresar{' '}
                                    </NavLink>
                                </li>
                            </ul>
                        </nav>
                    </Col>
                    {false && <Redirect to="/"></Redirect>}
                </Col>
            </Container>
        </>
    )
}

// MenuComunidad = withRouter(MenuComunidad);

export default MenuComunidad
