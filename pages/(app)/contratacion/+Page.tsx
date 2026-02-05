/**
 * Contratación (Hiring) Page
 *
 * Converted to TypeScript.
 * Service contract management page.
 */
// Bootstrap
import { Container } from 'react-bootstrap'
interface PageProps {
    draftId?: string
    quotationId?: string
    proponentId?: string
}
export default function Page({ draftId, quotationId, proponentId }: PageProps) {
    return (
        <Container fluid className="p-0">
            <div className="p-4">
                <h1 className="type-hero-title">Contrato de servicios</h1>
                {draftId && <p className="body-1">Requerimiento: {draftId}</p>}
                {quotationId && <p className="body-1">Cotización: {quotationId}</p>}
                {proponentId && <p className="body-1">Proponente: {proponentId}</p>}
                <button className="btn btn-high">Pagar</button>
            </div>
        </Container>
    )
}
