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
                        <nav className="menuContenedor">
                            <img
                                src={ComunidadDezzpo}
                                alt="Logo Comunidad Dezzpo"
                                height="80px"
                                width="210px"
                            />
                            <ul className="menuSecciones" sm="collapseContents">
                                <li className="botonSeccion">
                                    <NavLink exact to="/" className="activo">
                                        {' '}
                                        Home{' '}
                                    </NavLink>
                                </li>
                                {/* seleccion asi trabajamos*/}
                                <div className="dropdown">
                                    <li className="botonSeccion">
                                        <NavLink
                                            to="/asi-trabajamos"
                                            className="botonNavLink"
                                        >
                                            {' '}
                                            Asi trabajamos{' '}
                                        </NavLink>
                                    </li>
                                    <div className="dropdownContenidos">
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
                                            className="botonNavLink"
                                        >
                                            {' '}
                                            Nosotros{' '}
                                        </NavLink>
                                    </li>
                                    <div className="dropdownContenidos">
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
                                            className="botonNavLink"
                                        >
                                            Comunidad de comerciantes{' '}
                                        </NavLink>
                                    </li>
                                    <div className="dropdownContenidos">
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
                                            className="botonNavLink"
                                        >
                                            Comunidad de propietarios{' '}
                                        </NavLink>
                                    </li>
                                    <div className="dropdownContenidos">
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
                                        className="botonNavLink"
                                    >
                                        {' '}
                                        Presupuestos{' '}
                                    </NavLink>
                                </li>
                                <li className="botonSeccion">
                                    <NavLink
                                        to="/profesionales-servicios"
                                        className="botonNavLink"
                                    >
                                        {' '}
                                        Profesionales y servicios{' '}
                                    </NavLink>
                                </li>
                                <li className="botonSeccion">
                                    <NavLink
                                        to="/asesorias"
                                        className="botonNavLink"
                                    >
                                        {' '}
                                        Asesorias{' '}
                                    </NavLink>
                                </li>
                                <li className="botonSeccion">
                                    <NavLink
                                        to="/apendice-costos"
                                        className="botonNavLink"
                                    >
                                        {' '}
                                        Apendice de costos{' '}
                                    </NavLink>
                                </li>
                                <li className="botonSeccion">
                                    <NavLink
                                        to="/ingreso"
                                        className="botonNavLink"
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
