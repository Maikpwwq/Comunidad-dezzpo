/**
 * Contratar (Contract) Page
 *
 * Converted to TypeScript.
 * Service contract page.
 */

export const documentProps = {
    title: 'Contratar | Comunidad Dezzpo',
    description: 'Contrato de servicios profesionales.',
}

// Bootstrap
import Container from 'react-bootstrap/Container'

interface PageProps {
    draftId?: string
    quotationId?: string
    proponentId?: string
}

export default function Page({ draftId, quotationId, proponentId }: PageProps) {
    return (
        <Container fluid className="p-0">
            <div className="p-4">
                <h2 className="headline-xl">Contrato de servicios</h2>
                {draftId && <p className="body-1">Requerimiento: {draftId}</p>}
                {quotationId && <p className="body-1">Cotización: {quotationId}</p>}
                {proponentId && <p className="body-1">Proponente: {proponentId}</p>}
                <button className="btn btn-high">Pagar</button>
            </div>
        </Container>
    )
}
