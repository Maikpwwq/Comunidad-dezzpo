export { MenuComunidad }

/* Menu de navegacion de contenidos Grupo Paginas Comunidad */
import React, { useState } from 'react'
import { Link } from '#R/Link'
import '#@/assets/css/menu.css'
import { MenuLinks } from '#@/index/components/menu/MenuLinks.ts'

// images
import LogoMenuComunidadDezzpo from '/assets/img/logo/Logo-Comunidad-Dezzpo.png'
import IsoLogoMenuComunidadDezzpo from '/assets/img/logo/IsoLogo-Dezzpo-Verde.png'

// import { Row, Col, Container } from 'react-bootstrap'
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
// import Menu from '@mui/material/Menu'
// import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import MenuIcon from '@mui/icons-material/Menu'
import LoginIcon from '@mui/icons-material/Login'
import StorefrontIcon from '@mui/icons-material/Storefront'
import PriceChangeIcon from '@mui/icons-material/PriceChange'

const MenuComunidad = (props) => {
    /* getLinkClass = (path) => {
        return this.props.location.pathname === path ? 'active' : '';
    }  className= {this.getLinkClass("/")}
    */

    const Close = () => {
        setIsOpen(false)
        // TODO: handle mobile display none
        // const dropdownQuery = document.querySelectorAll('.menuMobile')
        // dropdownQuery.forEach((menuMobile) => {
        //     console.log('dropdownQuery', menuMobile)
        //     // menuMobile.style.display = `none !important`
        //     menuMobile.style.position = `absolute`
        //     menuMobile.style.left = `-9999px`
        // })
        // const dropdownByClass = Array.from(document.getElementsByClassName('dropdownContenidos'))
        // const menuMobileById = document.getElementById('menuMobile')
        // menuMobileById.style.display = `none `
    }
    const [isOpen, setIsOpen] = useState(false)

    const handleOpenMenu = () => {
        setIsOpen(!isOpen)
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
                                    onClick={handleOpenMenu}
                                >
                                    <MenuIcon sx={{ fontSize: '30px' }} />
                                </IconButton>

                                <Link
                                    href="/"
                                    className="activo body-2 p-2 d-flex flex-row"
                                    onClick={Close}
                                >
                                    <img
                                        src={LogoMenuComunidadDezzpo}
                                        alt="Logo Comunidad Dezzpo"
                                        className="logo-comunidad-dezzpo"
                                    />
                                    <img
                                        src={IsoLogoMenuComunidadDezzpo}
                                        alt="IsoLogo Comunidad Dezzpo"
                                        className="isologo-comunidad-dezzpo ps-3"
                                    />
                                </Link>
                            </div>
                            <Row className="w-auto">
                                <Link
                                    href="/app/portal-servicios"
                                    className="body-2 btn-menu-comunidad me-0"
                                >
                                    <StorefrontIcon className="me-1" />
                                    <strong>
                                        Directorio <br /> Comerciantes
                                    </strong>
                                </Link>
                                <Link
                                    href="/ingreso"
                                    className="body-2 btn-menu-comunidad ms-2"
                                    // sx={{ me: {
                                    //     sm: 2, md: 5, lg: 5
                                    // } }}
                                >
                                    <LoginIcon className="me-1" />{' '}
                                    <strong>Ingresar </strong>
                                </Link>
                            </Row>
                        </Row>
                    </Col>
                    <nav className="menuContenedor col-10 pt-2 pb-2">
                        {/* sm="collapseContents" */}
                        <ul className="menuSecciones">
                            {!!MenuLinks &&
                                MenuLinks.map((item, index) => {
                                    const { name, href, dropdownContents } =
                                        item
                                    return (
                                        <div
                                            key={index}
                                            className="dropdown ms-4"
                                            style={{ minWidth: '118px' }}
                                        >
                                            <Link
                                                href={href}
                                                className="botonLink body-2"
                                            >
                                                {name}
                                                <ArrowDropDownIcon />
                                            </Link>
                                            <div className="dropdownContenidos body-1 p-0">
                                                {!!dropdownContents &&
                                                    dropdownContents.map(
                                                        (content, index) => {
                                                            const {
                                                                name,
                                                                href,
                                                            } = content
                                                            return (
                                                                <Link
                                                                    key={index}
                                                                    href={href}
                                                                    className="p-2 pb-0"
                                                                    onClick={
                                                                        Close
                                                                    }
                                                                >
                                                                    {name}
                                                                </Link>
                                                            )
                                                        }
                                                    )}
                                            </div>
                                        </div>
                                    )
                                })}
                            <Link
                                href="/presupuestos"
                                className="botonLink body-2 ms-4"
                            >
                                Presupuestos
                            </Link>
                            <Link
                                href="/asesorias"
                                className="botonLink body-2 ms-4"
                            >
                                Asesorias
                            </Link>
                            <Link
                                href="/apendice-costos"
                                className="botonLink body-2 ms-4"
                                style={{ maxWidth: '150px' }}
                            >
                                Apendice de costos{' '}
                                <PriceChangeIcon className="ms-1" />
                            </Link>
                        </ul>
                    </nav>
                    {isOpen && (
                        <nav className="menuMobile col-12 pt-2 pb-2">
                            {/* sm="collapseContents" */}
                            <ul className="menuMobileSecciones p-3">
                                {!!MenuLinks &&
                                    MenuLinks.map((item, index) => {
                                        const { name, href, dropdownContents } =
                                            item
                                        return (
                                            <div
                                                key={index}
                                                className="dropdown ms-4"
                                                style={{ minWidth: '118px' }}
                                            >
                                                <Link
                                                    href={href}
                                                    className="botonLink body-2"
                                                >
                                                    {name}
                                                    <ArrowDropDownIcon />
                                                </Link>
                                                <div className="dropdownContenidos body-1 p-0">
                                                    {!!dropdownContents &&
                                                        dropdownContents.map(
                                                            (
                                                                content,
                                                                index
                                                            ) => {
                                                                const {
                                                                    name,
                                                                    href,
                                                                } = content
                                                                return (
                                                                    <Link
                                                                        key={
                                                                            index
                                                                        }
                                                                        href={
                                                                            href
                                                                        }
                                                                        className="p-2 pb-0"
                                                                        onClick={
                                                                            Close
                                                                        }
                                                                    >
                                                                        {name}
                                                                    </Link>
                                                                )
                                                            }
                                                        )}
                                                </div>
                                            </div>
                                        )
                                    })}
                                <Link
                                    href="/presupuestos"
                                    className="botonLink body-2 ms-4 mb-2"
                                >
                                    Presupuestos
                                </Link>
                                <Link
                                    href="/asesorias"
                                    className="botonLink body-2 ms-4 mb-2"
                                >
                                    Asesorias
                                </Link>
                                <Link
                                    href="/apendice-costos"
                                    className="botonLink body-2 ms-4 mb-1"
                                    style={{ maxWidth: '150px' }}
                                >
                                    Apendice de costos{' '}
                                    <PriceChangeIcon className="ms-1" />
                                </Link>
                            </ul>
                        </nav>
                    )}
                </Col>
            </Container>
        </>
    )
}
