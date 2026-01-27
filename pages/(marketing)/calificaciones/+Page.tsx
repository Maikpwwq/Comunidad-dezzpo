/**
 * Calificaciones Page (Placeholder)
 *
 * Converted to TypeScript.
 */

export const documentProps = {
    title: 'Calificaciones | Comunidad Dezzpo',
    description: 'Sistema de calificaciones y reseñas de Comunidad Dezzpo.',
}

// Styles
import '@assets/css/calificaciones.css'

// Bootstrap
import Container from 'react-bootstrap/Container'

export default function Page() {
    return (
        <Container fluid className="p-0">
            <div className="p-5">
                <h1 className="headline-xl">Calificaciones</h1>
                <p className="body-1">
                    Sistema de calificaciones - Próximamente
                </p>
            </div>
        </Container>
    )
}
