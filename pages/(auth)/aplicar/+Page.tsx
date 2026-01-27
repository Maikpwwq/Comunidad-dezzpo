/**
 * Aplicar (Apply) Page - Placeholder
 *
 * Converted to TypeScript.
 */

export const documentProps = {
    title: 'Aplicar | Comunidad Dezzpo',
    description: 'Aplica a proyectos como comerciante calificado.',
}

// Styles
import '@assets/css/aplicar.css'

// Bootstrap
import Container from 'react-bootstrap/Container'

export default function Page() {
    return (
        <Container fluid className="p-0">
            <div className="p-5">
                <h1 className="headline-xl">Aplicar</h1>
                <p className="body-1">Formulario de aplicación - Próximamente</p>
            </div>
        </Container>
    )
}
