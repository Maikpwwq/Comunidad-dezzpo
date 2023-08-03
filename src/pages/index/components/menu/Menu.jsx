/* Menu de navegacion de contenidos Grupo Paginas Comunidad */
import React from 'react'
import { Link } from '#@/renderer/Link'
import '#@/assets/css/menu.css'

// images
import LogoMenuComunidadDezzpo from '/assets/img/logo/Logo-Comunidad-Dezzpo.png'
import IsoLogoMenuComunidadDezzpo from '/assets/img/logo/IsoLogo-Dezzpo-Verde.png'

import { Row, Col, Container } from 'react-bootstrap'
// import Container from 'react-bootstrap/Container'
// import Col from 'react-bootstrap/Col'
// import Row from 'react-bootstrap/Row'
// import Menu from '@mui/material/Menu'
// import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import MenuIcon from '@mui/icons-material/Menu'
import LoginIcon from '@mui/icons-material/Login'

export { MenuComunidad }

const MenuComunidad = () => {
    /* getLinkClass = (path) => {
        return this.props.location.pathname === path ? 'active' : '';
    }  className= {this.getLinkClass("/")}
    */

    const Close = () => {
        const dropdownQuery = document.querySelectorAll('.menuContenedor')
        dropdownQuery.forEach((menuContenedor) => {
            console.log('dropdownQuery', menuContenedor)
            // menuContenedor.style.display = `none `
            // menuContenedor.style.position = `absolute`
            // menuContenedor.style.left = `-9999px`
        })
        // const dropdownByClass = Array.from(document.getElementsByClassName('dropdownContenidos'))
        // const menuContenedorById = document.getElementById('menuContenedor')
        // menuContenedorById.style.display = `none `
    }

    return (
        <>
            <Container fluid className="p-0">
                <Col className="menuFijo w-100 p-0 m-0">
                    {/* Menu fijo */}
                    <Col className="p-0 pt-2 pb-2 barraMenu">
                        <Row className="m-0 ps-2 pe-4 d-flex w-100 menuVisible">
                            <div className="containerLogo container d-flex w-auto ms-0">
                                <IconButton
                                    aria-label="mobile-more"
                                    className="mobile-menu"
                                >
                                    <MenuIcon sx={{ fontSize: '30px' }} />
                                </IconButton>

                                <Link
                                    href="/"
                                    className="activo body-2 p-2 d-flex flex-row"
                                >
                                    <>
                                        <img
                                            src={LogoMenuComunidadDezzpo}
                                            alt="Logo Comunidad Dezzpo"
                                            className="logo-comunidad-dezzpo me-2"
                                        />
                                        <img
                                            src={IsoLogoMenuComunidadDezzpo}
                                            alt="IsoLogo Comunidad Dezzpo"
                                            className="isologo-comunidad-dezzpo"
                                        />
                                    </>
                                </Link>
                            </div>
                            <Row className="w-auto">
                                <Link
                                    href="/app/portal-servicios"
                                    className="body-2 btn-menu-comunidad"
                                >
                                    <strong>
                                        Directorio <br /> Comerciantes
                                    </strong>
                                </Link>

                                {/* <Link
                                href="/app/apendice-costos"
                                className="botonLink body-2"
                            >
                                
                                Apendice Costos
                            </Link> */}

                                <Link
                                    href="/ingreso"
                                    className="body-2 btn-menu-comunidad"
                                >
                                    <LoginIcon /> <strong>Ingresar </strong>
                                </Link>
                            </Row>
                        </Row>
                    </Col>
                    <nav className="menuContenedor col-10 pt-2 pb-2">
                        {/* sm="collapseContents" */}
                        <ul className="menuSecciones">
                            {/* <li className="botonSeccion">
                                    <Link
                                        exact
                                        href="/"
                                        className="activo body-2"
                                    >
                                        
                                        Home
                                    </Link>
                                </li> */}
                            {/* seleccion asi trabajamos*/}
                            <div className="dropdown">
                                {/* <li className="botonSeccion"></li> */}
                                <Link
                                    href="/asi-trabajamos"
                                    className="botonLink body-2"
                                >
                                    Asi trabajamos
                                    <ArrowDropDownIcon />
                                </Link>
                                <div className="dropdownContenidos body-1 p-0">
                                    <Link
                                        href="/profesionales-servicios"
                                        className="p-2 pb-0"
                                        onClick={Close}
                                    >
                                        Profesionales y servicios
                                    </Link>

                                    <Link
                                        href="/asesorias"
                                        className="p-2 pb-0"
                                        onClick={Close}
                                    >
                                        Asesores en vivo
                                    </Link>
                                    <Link
                                        href="/comunidad-comerciantes"
                                        className="p-2 pb-0"
                                    >
                                        Perfil Comerciante
                                    </Link>
                                    <Link
                                        href="/comunidad-propietarios"
                                        className="p-2 pb-0"
                                    >
                                        Perfil Propietario
                                    </Link>
                                    <Link href="/ingreso" className="p-2 pb-0">
                                        Ingresar
                                    </Link>
                                    <Link href="/registro" className="p-2 pb-0">
                                        Registrarse
                                    </Link>
                                    <Link
                                        href="/asi-trabajamos"
                                        className="p-2"
                                    >
                                        Calificaciones
                                    </Link>
                                </div>
                            </div>
                            {/* seleccion nosotros */}
                            <div className="dropdown">
                                <Link
                                    href="/nosotros"
                                    className="botonLink body-2"
                                >
                                    Nosotros <ArrowDropDownIcon />
                                </Link>
                                <div className="dropdownContenidos body-1 p-0">
                                    <Link
                                        href="/nosotros/#Acerca-de-nosotros"
                                        className="p-2 pb-0"
                                    >
                                        Acerca de nosotros
                                    </Link>
                                    <Link
                                        href="/nosotros/#equipo-dezzpo"
                                        className="p-2 pb-0"
                                    >
                                        Equipo dezzpo
                                    </Link>
                                    <Link href="/blog" className="p-2 pb-0">
                                        Programa de afiliados
                                    </Link>
                                    <Link href="/prensa" className="p-2 pb-0">
                                        Prensa
                                    </Link>
                                    <Link
                                        href="/patrocinadores"
                                        className="p-2 pb-0"
                                    >
                                        Patrocinadores
                                    </Link>
                                    <Link href="/legal" className="p-2">
                                        Legal
                                    </Link>
                                </div>
                            </div>
                            {/* seleccion Comunidad de Comerciantes*/}
                            <div className="dropdown">
                                <Link
                                    href="/comunidad-comerciantes"
                                    className="botonLink body-2"
                                >
                                    Comunidad de comerciantes
                                    <ArrowDropDownIcon />
                                </Link>
                                <div className="dropdownContenidos body-1 p-0">
                                    <Link href="/ingreso" className="p-2 pb-0">
                                        Tu cuenta
                                    </Link>
                                    <Link
                                        href="/asesorias"
                                        className="p-2 pb-0"
                                    >
                                        Asesores en vivo
                                    </Link>
                                    <Link
                                        href="/asi-trabajamos"
                                        className="p-2 pb-0"
                                    >
                                        Asi funciona
                                    </Link>
                                    <Link
                                        href="/profesionales-servicios"
                                        className="p-2 pb-0"
                                    >
                                        Profesionales y servicios
                                    </Link>
                                    <Link
                                        href="/contactenos"
                                        className="p-2 pb-0"
                                    >
                                        contactanos
                                    </Link>
                                    <Link
                                        href="/ayuda-pqrs"
                                        className="p-2 pb-0"
                                    >
                                        Ayuda & Pqrs
                                    </Link>
                                    <Link href="/legal" className="p-2">
                                        Terminos y condiciones
                                    </Link>
                                </div>
                            </div>
                            {/* seleccion Comunidad de Propietarios*/}
                            <div className="dropdown">
                                <Link
                                    href="/comunidad-propietarios"
                                    className="botonLink body-2"
                                >
                                    Comunidad de propietarios
                                    <ArrowDropDownIcon />
                                </Link>
                                <div className="dropdownContenidos body-1 p-0">
                                    <Link
                                        href="/nuevo-proyecto"
                                        className="p-2 pb-0"
                                    >
                                        Crea un nuevo proyecto
                                    </Link>
                                    <Link href="/blog" className="p-2 pb-0">
                                        Testimonio de propietarios
                                    </Link>
                                    <Link
                                        href="/asi-trabajamos"
                                        className="p-2 pb-0"
                                    >
                                        Asi funciona
                                    </Link>
                                    <Link
                                        href="/profesionales-servicios"
                                        className="p-2 pb-0"
                                    >
                                        Profesionales y servicios
                                    </Link>
                                    <Link
                                        href="/contactenos"
                                        className="p-2 pb-0"
                                    >
                                        contactanos
                                    </Link>
                                    <Link
                                        href="/ayuda-pqrs"
                                        className="p-2 pb-0"
                                    >
                                        Ayuda & Pqrs
                                    </Link>
                                    <Link href="/legal" className="p-2">
                                        Terminos y condiciones
                                    </Link>
                                </div>
                            </div>
                            <Link
                                href="/presupuestos"
                                className="botonLink body-2"
                            >
                                Presupuestos
                            </Link>
                            {/* <li className="botonSeccion">
                                    <Link
                                        href="/profesionales-servicios"
                                        className="botonLink body-2"
                                    >
                                        
                                        Profesionales y servicios
                                    </Link>
                                </li> */}
                            <Link
                                href="/asesorias"
                                className="botonLink body-2"
                            >
                                Asesorias
                            </Link>
                            <Link
                                href="/apendice-costos"
                                className="botonLink body-2"
                            >
                                Apendice de costos
                            </Link>
                            {/* <li className="botonSeccion">
                                    <Link
                                        href="/ingreso"
                                        className="botonLink body-2"
                                    >
                                        
                                        Ingresar
                                    </Link>
                                </li> */}
                        </ul>
                    </nav>
                    {/* {false && <Redirect href="/"></Redirect>} */}
                </Col>
            </Container>
        </>
    )
}

// MenuComunidad = withRouter(MenuComunidad);
