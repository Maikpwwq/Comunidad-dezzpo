/**
 * DatosContacto Component
 *
 * Contact information section with phone, address, email.
 * Migrated from src/index/components/datos_contacto/DatosContacto.jsx
 */

import { Col } from 'react-bootstrap'
import { ContactItem } from '@components/molecules/ContactItem'

export function DatosContacto(): React.ReactElement {
    return (
        <Col className="p-4 pb-0">
            <Col className="datos-contacto pt-0">
                <h2 className="headline-l text-blanco">Ponte en Contacto</h2>
                <div className="pt-3 w-100 d-flex flex-column gap-3">
                    <ContactItem type="phone" variant="page" />
                    <ContactItem type="address" variant="page" />
                    <ContactItem type="email" variant="page" />
                </div>
            </Col>
        </Col>
    )
}

export default DatosContacto
