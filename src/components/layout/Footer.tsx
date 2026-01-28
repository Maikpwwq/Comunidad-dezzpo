/**
 * Footer Component
 *
 * Shared footer for marketing and app pages.
 * Refactored from legacy Footer.jsx (192 lines -> modular component).
 */

import React from 'react'
import { Link } from '@hooks'
import IcoMoon from 'react-icomoon'
import { FOOTER_LINKS, SOCIAL_LINKS } from './navigation.config'

// Bootstrap Components (legacy support)
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

// Branding
import LogoFooterComunidadDezzpo from '@assets/img/IsologoFooter.png'

// Styles
import clsx from 'clsx'
import styles from './Footer.module.scss'

// Types
import type { FooterProps } from './types'

// IcoMoon icon set - loaded via require to handle JSON import
// The iconSet must conform to { icons: Array<...>, ... } shape expected by IcoMoon
// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-explicit-any
import iconSet from '@assets/icomoon/selection.json'

/** Contact data component - extracted for reuse */
function ContactInfo(): React.ReactElement {
    return (
        <Col className="px-4" lg={4} md={12}>
            <h3 className={clsx(styles.Headline, "mb-3")}>Contáctenos</h3>
            <ul className={clsx(styles.TextBody)}>
                <li>📧 contacto@dezzpo.com</li>
                <li>📱 +57 300 123 4567</li>
                <li>📍 Bogotá, Colombia</li>
            </ul>
        </Col>
    )
}

function Footer({ variant = 'marketing' }: FooterProps): React.ReactElement {
    const currentYear = new Date().getFullYear()

    // App variant uses minimal footer
    if (variant === 'app') {
        return (
            <footer className={clsx(styles.Footer, "py-3")} style={{ backgroundColor: '#333' }}>
                <Container>
                    <p className={clsx(styles.TextBody, "mb-0 text-center")}>
                        © {currentYear} - Comunidad Dezzpo Inc.
                    </p>
                </Container>
            </footer>
        )
    }

    // Marketing variant uses full footer
    return (
        <Container fluid className="p-0">
            <footer className={clsx(styles.Footer)}>
                <Col className={clsx(styles.Container, "p-0")}>
                    {/* Upper Section */}
                    <Row className={clsx(styles.TopSection)}>
                        <Row className="mt-2">
                            {/* Navigation Links */}
                            <Col
                                className="ps-4 ms-4 align-items-end"
                                lg={4}
                                md={4}
                                sm={6}
                                xs={12}
                            >
                                <ul className={clsx(styles.LinkList)}>
                                    {FOOTER_LINKS.map((link) => (
                                        <li key={link.id}>
                                            &#10095;
                                            <Link href={link.href} title={link.label}>
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </Col>

                            {/* Social Links */}
                            <Col
                                className={clsx(styles.SocialSection, "p-0 align-items-start")}
                                lg={4}
                                md={8}
                                sm={8}
                                xs={12}
                            >
                                <Container className={clsx(styles.LogoContainer)}>
                                    <img
                                        src={LogoFooterComunidadDezzpo}
                                        alt="Logo Comunidad Dezzpo"
                                        height="80px"
                                        width="210px"
                                    />
                                </Container>
                                <h2 className={clsx(styles.Headline, "ps-4")}>
                                    Síguenos
                                </h2>
                                <Container className="p-0 ps-4">
                                    <ul className={clsx(styles.SocialList, "w-100 row justify-content-start")}>
                                        &#10095;
                                        {SOCIAL_LINKS.map((social) => (
                                            <li
                                                key={social.id}
                                                className="w-auto d-flex align-items-center"
                                            >
                                                <a
                                                    href={social.href}
                                                    title={social.label}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <IcoMoon
                                                        iconSet={iconSet}
                                                        icon={social.icon}
                                                        style={{ height: '33px' }}
                                                    />
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </Container>
                            </Col>

                            {/* Contact Info */}
                            <ContactInfo />
                        </Row>
                    </Row>

                    {/* Lower Section */}
                    <Row className={clsx(styles.BottomSection, "pt-2 w-100")}>
                        <p className="mb-2">
                            © {currentYear} - Todos los derechos reservados -
                            <span className="dezzpo-svg">
                                Comunidad Dezzpo Inc.
                            </span>
                        </p>
                    </Row>
                </Col>
            </footer>
        </Container>
    )
}

export default Footer
