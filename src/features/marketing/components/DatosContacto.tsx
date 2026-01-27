/**
 * DatosContacto Component
 *
 * Contact information section with phone, address, email.
 * Migrated from src/index/components/datos_contacto/DatosContacto.jsx
 */

import React from 'react'
import '@assets/css/datos_contacto.css'
import IcoMoon from 'react-icomoon'
import iconSet from '@assets/css/icomoon/selection.json'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

// Contact data configuration
const contactData = {
    phone: {
        icon: 'TelefonoContactoIcono',
        number: '+57 319 6138057',
        whatsappLink: 'https://wa.me/573196138057?text=Hola%20estoy%20interesado%20en%20saber%20acerca%20de%20como%20Dezzpo%20...',
        label: 'Office',
    },
    address: {
        icon: 'DireccionDomicilioIcono',
        lines: ['Dirección Cll 159 No. 8c-45', 'Piso 5'],
    },
    email: {
        icon: 'EmailIcono',
        address: 'comunidad.dezzpo@gmail.com',
    },
}

export function DatosContacto(): React.ReactElement {
    return (
        <Col className="p-4 pb-0">
            <Col className="datosContacto pt-0">
                <h2 className="headline-l textBlanco">Ponte en Contacto</h2>
                <ul className="listaContacto pt-3 w-100 align-items-end">
                    {/* Phone */}
                    <Row className="border-top m-0 w-100 d-flex">
                        <IcoMoon
                            iconSet={iconSet as any}
                            icon={contactData.phone.icon}
                            style={{ height: '21px', marginRight: '8px', width: 'auto' }}
                        />
                        <Col className="m-0 p-0 body-1 align-items-end pt-2 pb-2">
                            <li>
                                +57{' '}
                                <a
                                    className="chat-with-us body-1"
                                    href={contactData.phone.whatsappLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    319 6138057
                                </a>
                                - {contactData.phone.label}
                            </li>
                        </Col>
                    </Row>

                    {/* Address */}
                    <Row className="border-top m-0 w-100 d-flex">
                        <IcoMoon
                            iconSet={iconSet as any}
                            icon={contactData.address.icon}
                            style={{ height: '21px', marginRight: '8px', width: 'auto' }}
                        />
                        <Col className="m-0 p-0 body-1 align-items-end pt-2 pb-2">
                            {contactData.address.lines.map((line, idx) => (
                                <li key={idx}>{line}</li>
                            ))}
                        </Col>
                    </Row>

                    {/* Email */}
                    <Row className="border-top m-0 w-100 d-flex">
                        <Col className="m-0 p-0 pt-2 pb-2 body-1 align-items-end">
                            <li>
                                <IcoMoon
                                    iconSet={iconSet as any}
                                    icon={contactData.email.icon}
                                    style={{ height: '21px', marginRight: '8px', width: 'auto' }}
                                />
                                <a
                                    className="chat-with-us"
                                    href={`mailto:${contactData.email.address}`}
                                    title="Correo Comunidad Dezzpo"
                                >
                                    {contactData.email.address}
                                </a>
                            </li>
                        </Col>
                    </Row>
                </ul>
            </Col>
        </Col>
    )
}

export default DatosContacto
