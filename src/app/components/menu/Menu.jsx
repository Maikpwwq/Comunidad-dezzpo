/* Menu de navegacion de contenidos Grupo Paginas Comunidad */
import React from 'react'
import { NavLink } from 'react-router-dom' // withRouter, Redirect
import '@/assets/css/menu.css'

// images
import LogoMenuComunidadDezzpo from '@/assets/img/IsologoFooter.png'

import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import IconButton from '@mui/material/IconButton'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import MenuIcon from '@mui/icons-material/Menu'
import LoginIcon from '@mui/icons-material/Login'

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
                        <Row className="m-0 ps-2 pe-4 d-flex w-100 menuVisible">
                            <div className="containerLogo container d-flex w-auto ms-0">
                                <IconButton
                                    aria-label="mobile-more"
                                    className="mobile-menu"
                                >
                                    <MenuIcon sx={{ fontSize: '30px' }} />
                                </IconButton>

                                <NavLink to="/" className="activo body-2 p-2">
                                    <img
                                        src={LogoMenuComunidadDezzpo}
                                        alt="Logo Comunidad Dezzpo"
                                        className="logo-comunidad-dezzpo"
                                    />
                                </NavLink>
                            </div>
                            <Row className="w-auto">
                                <NavLink
                                    to="/app/portal-servicios"
                                    className="body-2 btn-menu-comunidad"
                                >
                                    <strong>
                                        Directorio <br /> Comerciantes
                                    </strong>
                                </NavLink>

                                {/* <NavLink
                                to="/app/apendice-costos"
                                className="botonNavLink body-2"
                            >
                                {' '}
                                Apendice Costos{' '}
                            </NavLink> */}

                                <NavLink
                                    to="/ingreso"
                                    className="body-2 btn-menu-comunidad"
                                >
                                    <LoginIcon /> <strong>Ingresar </strong>
                                </NavLink>
                            </Row>
                        </Row>
                    </Col>
                    <nav className="menuContenedor col-10">
                        <ul className="menuSecciones" sm="collapseContents">
                            {/* <li className="botonSeccion">
                                    <NavLink
                                        exact
                                        to="/"
                                        className="activo body-2"
                                    >
                                        {' '}
                                        Home{' '}
                                    </NavLink>
                                </li> */}
                            {/* seleccion asi trabajamos*/}
                            <div className="dropdown">
                                {/* <li className="botonSeccion"></li> */}
                                <NavLink
                                    to="asi-trabajamos"
                                    className="botonNavLink body-2"
                                >
                                    Asi trabajamos
                                    <ArrowDropDownIcon />
                                </NavLink>
                                <div className="dropdownContenidos body-1 p-0">
                                    <NavLink
                                        to="/profesionales-servicios"
                                        className="p-2 pb-0"
                                    >
                                        {' '}
                                        Profesionales y servicios{' '}
                                    </NavLink>
                                    <NavLink
                                        to="/asesorias"
                                        className="p-2 pb-0"
                                    >
                                        Asesores en vivo
                                    </NavLink>
                                    <NavLink
                                        to="/comunidad-comerciantes"
                                        className="p-2 pb-0"
                                    >
                                        Perfil Comerciante
                                    </NavLink>
                                    <NavLink
                                        to="/comunidad-propietarios"
                                        className="p-2 pb-0"
                                    >
                                        Perfil Propietario
                                    </NavLink>
                                    <NavLink to="/ingreso" className="p-2 pb-0">
                                        Ingresar
                                    </NavLink>
                                    <NavLink
                                        to="/registro"
                                        className="p-2 pb-0"
                                    >
                                        Registrarse
                                    </NavLink>
                                    <NavLink
                                        to="/asi-trabajamos"
                                        className="p-2"
                                    >
                                        Calificaciones
                                    </NavLink>
                                </div>
                            </div>
                            {/* seleccion nosotros */}
                            <div className="dropdown">
                                <NavLink
                                    to="/nosotros"
                                    className="botonNavLink body-2"
                                >
                                    Nosotros <ArrowDropDownIcon />
                                </NavLink>
                                <div className="dropdownContenidos body-1 p-0">
                                    <NavLink
                                        to="/nosotros/#Acerca-de-nosotros"
                                        className="p-2 pb-0"
                                    >
                                        Acerca de nosotros
                                    </NavLink>
                                    <NavLink
                                        to="/nosotros/#equipo-dezzpo"
                                        className="p-2 pb-0"
                                    >
                                        Equipo dezzpo
                                    </NavLink>
                                    <NavLink to="/blog" className="p-2 pb-0">
                                        Programa de afiliados
                                    </NavLink>
                                    <NavLink to="/prensa" className="p-2 pb-0">
                                        Prensa
                                    </NavLink>
                                    <NavLink
                                        to="/patrocinadores"
                                        className="p-2 pb-0"
                                    >
                                        Patrocinadores
                                    </NavLink>
                                    <NavLink to="/legal" className="p-2">
                                        Legal
                                    </NavLink>
                                </div>
                            </div>
                            {/* seleccion Comunidad de Comerciantes*/}
                            <div className="dropdown">
                                <NavLink
                                    to="/comunidad-comerciantes"
                                    className="botonNavLink body-2"
                                >
                                    Comunidad de comerciantes{' '}
                                    <ArrowDropDownIcon />
                                </NavLink>
                                <div className="dropdownContenidos body-1 p-0">
                                    <NavLink to="/ingreso" className="p-2 pb-0">
                                        Tu cuenta
                                    </NavLink>
                                    <NavLink
                                        to="/asesorias"
                                        className="p-2 pb-0"
                                    >
                                        Asesores en vivo
                                    </NavLink>
                                    <NavLink
                                        to="/asi-trabajamos"
                                        className="p-2 pb-0"
                                    >
                                        Asi funciona
                                    </NavLink>
                                    <NavLink
                                        to="/profesionales-servicios"
                                        className="p-2 pb-0"
                                    >
                                        {' '}
                                        Profesionales y servicios{' '}
                                    </NavLink>
                                    <NavLink
                                        to="/contactenos"
                                        className="p-2 pb-0"
                                    >
                                        contactanos
                                    </NavLink>
                                    <NavLink
                                        to="/ayuda-pqrs"
                                        className="p-2 pb-0"
                                    >
                                        Ayuda & Pqrs
                                    </NavLink>
                                    <NavLink to="/legal" className="p-2">
                                        Terminos y condiciones
                                    </NavLink>
                                </div>
                            </div>
                            {/* seleccion Comunidad de Propietarios*/}
                            <div className="dropdown">
                                <NavLink
                                    to="/comunidad-propietarios"
                                    className="botonNavLink body-2"
                                >
                                    Comunidad de propietarios
                                    <ArrowDropDownIcon />
                                </NavLink>
                                <div className="dropdownContenidos body-1 p-0">
                                    <NavLink
                                        to="/nuevo-proyecto"
                                        className="p-2 pb-0"
                                    >
                                        Crea un nuevo proyecto
                                    </NavLink>
                                    <NavLink to="/blog" className="p-2 pb-0">
                                        Testimonio de propietarios
                                    </NavLink>
                                    <NavLink
                                        to="/asi-trabajamos"
                                        className="p-2 pb-0"
                                    >
                                        Asi funciona
                                    </NavLink>
                                    <NavLink
                                        to="/profesionales-servicios"
                                        className="p-2 pb-0"
                                    >
                                        {' '}
                                        Profesionales y servicios{' '}
                                    </NavLink>
                                    <NavLink
                                        to="/contactenos"
                                        className="p-2 pb-0"
                                    >
                                        contactanos
                                    </NavLink>
                                    <NavLink
                                        to="/ayuda-pqrs"
                                        className="p-2 pb-0"
                                    >
                                        Ayuda & Pqrs
                                    </NavLink>
                                    <NavLink to="/legal" className="p-2">
                                        Terminos y condiciones
                                    </NavLink>
                                </div>
                            </div>
                            <NavLink
                                to="/presupuestos"
                                className="botonNavLink body-2"
                            >
                                {' '}
                                Presupuestos{' '}
                            </NavLink>
                            {/* <li className="botonSeccion">
                                    <NavLink
                                        to="/profesionales-servicios"
                                        className="botonNavLink body-2"
                                    >
                                        {' '}
                                        Profesionales y servicios{' '}
                                    </NavLink>
                                </li> */}
                            <NavLink
                                to="/asesorias"
                                className="botonNavLink body-2"
                            >
                                {' '}
                                Asesorias{' '}
                            </NavLink>
                            <NavLink
                                to="/apendice-costos"
                                className="botonNavLink body-2"
                            >
                                {' '}
                                Apendice de costos{' '}
                            </NavLink>
                            {/* <li className="botonSeccion">
                                    <NavLink
                                        to="/ingreso"
                                        className="botonNavLink body-2"
                                    >
                                        {' '}
                                        Ingresar{' '}
                                    </NavLink>
                                </li> */}
                        </ul>
                    </nav>
                    {/* {false && <Redirect to="/"></Redirect>} */}
                </Col>
            </Container>
        </>
    )
}

// MenuComunidad = withRouter(MenuComunidad);

export default MenuComunidad
