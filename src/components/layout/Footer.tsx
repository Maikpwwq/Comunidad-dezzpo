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
import { ContactItem } from '@components/molecules/ContactItem'

// Bootstrap Components (legacy support)
// Bootstrap Components (legacy support)
import { Container, Row, Col } from 'react-bootstrap'

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
                    <div className={clsx(styles.TopSection, "py-5")}>
                        {/* Navigation Links */}
                        <div className={clsx(styles.Column, "d-none d-md-block")}>
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
                        </div>

                        {/* Social Links & Logo (Center) */}
                        <div className={clsx(styles.Column, "align-items-center text-center")}>
                            <Container className={clsx(styles.LogoContainer, "justify-content-center mb-4")}>
                                <img
                                    src={LogoFooterComunidadDezzpo}
                                    alt="Logo Comunidad Dezzpo"
                                    height="80px"
                                    width="210px"
                                />
                            </Container>
                            <h2 className={clsx(styles.Headline, "mb-3")}>
                                Síguenos
                            </h2>
                            <ul className={clsx(styles.SocialList, "justify-content-center")}>
                                {SOCIAL_LINKS.map((social) => (
                                    <li
                                        key={social.id}
                                        className="mx-2"
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
                                                style={{ height: '32px', width: '32px', fill: 'white' }}
                                            />
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Contact Info (Right) */}
                        <h3 className={clsx(styles.Headline, "mb-3")}>Contáctenos</h3>
                        <div className={clsx(styles.TextBody)}>
                            <ContactItem type="email" variant="footer" />
                            <ContactItem type="phone" variant="footer" />
                            <ContactItem type="address" variant="footer" />
                        </div>
                    </div>

                    {/* Lower Section */}
                    <Row className={clsx(styles.BottomSection, "pt-3 pb-3 w-100 m-0")}>
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
