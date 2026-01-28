/**
 * MenuComunidad Component
 *
 * Main navigation menu for marketing/public pages.
 * Migrated from src/index/components/menu/MenuComunidad.jsx (259L → 170L)
 *
 * Changes:
 * - TypeScript conversion
 * - Extracted menu config to config/menuLinks.ts
 * - Using @hooks/Link
 * - Removed redundant mobile menu duplication
 */

import React, { useState, useCallback } from 'react'
import { Link } from '@hooks'

// Config
import { menuLinks, staticMenuItems } from '../config/menuLinks'

// Styles

// Images
import LogoMenuComunidadDezzpo from '/assets/img/logo/Logo-Comunidad-Dezzpo.png'
import IsoLogoMenuComunidadDezzpo from '/assets/img/logo/IsoLogo-Dezzpo-Verde.png'

// Bootstrap
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

// MUI
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import ArrowDropDown from '@mui/icons-material/ArrowDropDown'
import Login from '@mui/icons-material/Login'
import Storefront from '@mui/icons-material/Storefront'
import PriceChange from '@mui/icons-material/PriceChange'

export function MenuComunidad(): React.ReactElement {
    const [isOpen, setIsOpen] = useState(false)

    const handleClose = useCallback(() => {
        setIsOpen(false)
    }, [])

    const handleToggleMenu = useCallback(() => {
        setIsOpen((prev) => !prev)
    }, [])

    // Render dropdown menu items
    const renderMenuItems = (isMobile = false) => (
        <>
            {menuLinks.map((item, index) => (
                <div key={index} className="dropdown ms-4" style={{ minWidth: '118px' }}>
                    <Link href={item.href} className="botonLink body-2">
                        {item.name}
                        <ArrowDropDown />
                    </Link>
                    <div className="dropdownContenidos body-1 p-0">
                        {item.dropdownContents?.map((content, idx) => (
                            <Link
                                key={idx}
                                href={content.href}
                                className="p-2 pb-0"
                                onClick={handleClose}
                            >
                                {content.name}
                            </Link>
                        ))}
                    </div>
                </div>
            ))}

            {staticMenuItems.map((item, index) => (
                <Link
                    key={`static-${index}`}
                    href={item.href}
                    className={`botonLink body-2 ms-4${isMobile ? ' mb-2' : ''}`}
                    style={item.name === 'Apendice de costos' ? { maxWidth: '150px' } : undefined}
                >
                    {item.name}
                    {item.name === 'Apendice de costos' && <PriceChange className="ms-1" />}
                </Link>
            ))}
        </>
    )

    return (
        <Container fluid className="p-0">
            <Col className="menuFijo w-100 p-0 m-0">
                {/* Fixed Header Bar */}
                <Col className="p-0 pt-2 pb-2 barraMenu">
                    <Row className="m-0 ps-2 pe-4 d-flex w-100 menuVisible">
                        <div className="containerLogo container d-flex w-auto ms-0">
                            <IconButton
                                aria-label="mobile-more"
                                className="mobile-menu"
                                onClick={handleToggleMenu}
                            >
                                <MenuIcon sx={{ fontSize: '30px' }} />
                            </IconButton>

                            <Link
                                href="/"
                                className="activo body-2 p-2 d-flex flex-row"
                                onClick={handleClose}
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
                            <Link href="/app/portal-servicios" className="body-2 btn-menu-comunidad me-0">
                                <Storefront className="me-1" />
                                <strong>
                                    Directorio <br /> Comerciantes
                                </strong>
                            </Link>
                            <Link href="/ingreso" className="body-2 btn-menu-comunidad ms-2">
                                <Login className="me-1" /> <strong>Ingresar</strong>
                            </Link>
                        </Row>
                    </Row>
                </Col>

                {/* Desktop Navigation */}
                <nav className="menuContenedor col-10 pt-2 pb-2">
                    <ul className="menuSecciones">{renderMenuItems()}</ul>
                </nav>

                {/* Mobile Navigation */}
                {isOpen && (
                    <nav className="menuMobile col-12 pt-2 pb-2">
                        <ul className="menuMobileSecciones p-3">{renderMenuItems(true)}</ul>
                    </nav>
                )}
            </Col>
        </Container>
    )
}

export default MenuComunidad
