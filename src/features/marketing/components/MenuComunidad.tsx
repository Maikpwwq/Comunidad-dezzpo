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
 * - SCSS Module migration
 */

import React, { useState, useCallback } from 'react'
import { Link } from '@hooks'
import clsx from 'clsx'

// Config
import { menuLinks, staticMenuItems } from '../config/menuLinks'

// Styles
import styles from './MenuComunidad.module.scss'

// Images
import LogoMenuComunidadDezzpo from '/assets/img/logo/Logo-Comunidad-Dezzpo.png'
import IsoLogoMenuComunidadDezzpo from '/assets/img/logo/IsoLogo-Dezzpo-Verde.png'

// Bootstrap
import { Container, Col, Row } from 'react-bootstrap'

// MUI
import { IconButton } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import ArrowDropDown from '@mui/icons-material/ArrowDropDown'
import Login from '@mui/icons-material/Login'
import Storefront from '@mui/icons-material/Storefront'
import Store from '@mui/icons-material/Store'
import Search from '@mui/icons-material/Search'
import PriceChange from '@mui/icons-material/PriceChange'
import Person from '@mui/icons-material/Person'

// Stores
import { useUserStore } from '@stores/userStore'

export function MenuComunidad(): React.ReactElement {
    const [isOpen, setIsOpen] = useState(false)
    const isAuth = useUserStore((state) => state.isAuth)
    const displayName = useUserStore((state) => state.displayName)
    const userId = useUserStore((state) => state.userId)

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
                <div key={index} className={clsx(styles.Dropdown, styles.MenuItem)} style={{ minWidth: '118px' }}>
                    <Link
                        href={item.href}
                        className={clsx(styles.NavLink, "body-1")}
                        onClick={handleClose}
                    >
                        {item.name}
                        <ArrowDropDown
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                            }}
                        />
                    </Link>
                    <div className={clsx(styles.DropdownContent)}>
                        {item.dropdownContents?.map((content, idx) => (
                            <Link
                                key={idx}
                                href={content.href}
                                className="body-2"
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
                    className={clsx(styles.NavLink, styles.MenuItem, "body-1", isMobile && "mb-2")}
                    style={item.name === 'Apendice de costos' ? { maxWidth: '150px' } : undefined}
                >
                    {item.name}
                    {item.name === 'Apendice de costos' && <PriceChange className="ms-1" />}
                </Link>
            ))}
        </>
    )

    const profileHref = userId ? `/app/perfil/${userId}` : '/app/perfil'

    return (
        <Container fluid className="p-0" id="menu-comunidad">
            {/* Top Bar (Dark) */}
            <div className={clsx(styles.TopBar, "d-none d-md-block")}>
                <Container>
                    <Row className="justify-content-end align-items-center">
                        <div className="d-flex">
                            <Link href="/app/portal-servicios" className="d-flex align-items-center me-4 text-white hover-underline">
                                <Storefront className="me-2" fontSize="small" />
                                <strong>Directorio de Comerciantes</strong>
                            </Link>
                            <Link href="/app/tiendas" className="d-flex align-items-center me-4 text-white hover-underline">
                                <Search className="me-2" fontSize="small" />
                                <strong>Buscar Tiendas</strong>
                            </Link>
                            {isAuth ? (
                                <Link href={profileHref} className="d-flex align-items-center text-white hover-underline">
                                    <Person className="me-2" fontSize="small" />
                                    <strong>{displayName || 'Mi Cuenta'}</strong>
                                </Link>
                            ) : (
                                <Link href="/ingreso" className="d-flex align-items-center text-white hover-underline">
                                    <Login className="me-2" fontSize="small" />
                                    <strong>Ingresar</strong>
                                </Link>
                            )}
                        </div>
                    </Row>
                </Container>
            </div>

            {/* Main Navbar (White) */}
            <div className={clsx(styles.MainNavbar)}>
                <Container>
                    <Row className="align-items-center m-0">
                        {/* Logo Area */}
                        <Col xs={6} md={3} className="d-flex align-items-center">
                            <Link
                                href="/"
                                className={clsx(styles.NavLink, "p-0 d-flex flex-row justify-content-start bg-transparent")}
                                style={{ minHeight: 'auto', backgroundColor: 'transparent', boxShadow: 'none' }}
                                onClick={handleClose}
                            >
                                <img
                                    src={LogoMenuComunidadDezzpo}
                                    alt="Logo Comunidad Dezzpo"
                                    className={clsx(styles.Logo)}
                                />
                                <img
                                    src={IsoLogoMenuComunidadDezzpo}
                                    alt="IsoLogo Comunidad Dezzpo"
                                    className={clsx(styles.Logo, styles.Isologo)}
                                />
                            </Link>
                        </Col>

                        {/* Mobile Links & Toggle */}
                        <Col xs={6} className="d-flex d-md-none justify-content-end align-items-center">
                            <Link
                                href="/app/portal-servicios"
                                className="d-flex align-items-center me-3"
                                style={{ color: 'var(--primary-green-text-color, #28a745)' }}
                                title="Directorio de Comerciantes"
                                aria-label="Directorio de Comerciantes"
                            >
                                <Storefront sx={{ fontSize: '28px' }} />
                            </Link>
                            <Link
                                href="/app/tiendas"
                                className="d-flex align-items-center me-3"
                                style={{ color: 'var(--primary-green-text-color, #28a745)' }}
                                title="Tiendas y Ferreterias"
                                aria-label="Tiendas y Ferreterias"
                            >
                                <Store sx={{ fontSize: '28px' }} />
                            </Link>
                            <IconButton
                                aria-label="mobile-more"
                                onClick={handleToggleMenu}
                                sx={{ color: 'var(--primary-green-text-color, #28a745)', p: 0 }}
                            >
                                <MenuIcon sx={{ fontSize: '32px' }} />
                            </IconButton>
                        </Col>

                        {/* Desktop Navigation */}
                        <Col md={9} className="d-none d-md-flex justify-content-end">
                            <nav>
                                <ul className="d-flex flex-row align-items-center m-0 list-unstyled">
                                    {renderMenuItems()}
                                </ul>
                            </nav>
                        </Col>
                    </Row>
                </Container>
            </div>

            {/* Mobile Navigation Drawer */}
            {isOpen && (
                <nav className={clsx(styles.MobileNavDrawer, "col-12 pt-2 pb-2")}>
                    <div className="d-flex flex-column p-4">
                        <div className="mb-4 d-flex justify-content-center">
                            {isAuth ? (
                                <Link href={profileHref} className="btn btn-light w-100 rounded-pill fw-bold body-1">
                                    <Person className="me-2" /> {displayName || 'Mi Cuenta'}
                                </Link>
                            ) : (
                                <Link href="/ingreso" className="btn btn-light w-100 rounded-pill fw-bold body-1">
                                    <Login className="me-2" /> Ingresar
                                </Link>
                            )}
                        </div>
                        <ul className="list-unstyled">
                            <div className={clsx(styles.Dropdown, styles.MenuItem, "mb-2")}>
                                <Link
                                    href="/app/portal-servicios"
                                    className={clsx(styles.NavLink, "body-1")}
                                    onClick={handleClose}
                                >
                                    Directorio de comerciantes
                                </Link>
                            </div>
                            <div className={clsx(styles.Dropdown, styles.MenuItem, "mb-2")}>
                                <Link
                                    href="/app/tiendas"
                                    className={clsx(styles.NavLink, "body-1")}
                                    onClick={handleClose}
                                >
                                    Tiendas y ferreterias
                                </Link>
                            </div>
                            {renderMenuItems(true)}
                        </ul>
                    </div>
                </nav>
            )}
        </Container>
    )
}

export default MenuComunidad
