/**
 * Directorio Requerimientos Page
 *
 * Converted to TypeScript.
 * Shows list of project requirements/drafts.
 * SSR-safe: Uses draftService which has Firestore guards.
 */
import { useState, useEffect } from 'react'
import { getAllDrafts } from '@services/drafts'
// Components
import { DraftCard } from '@features/quotes'
// Bootstrap
import { Row, Col, Container, Button } from 'react-bootstrap'

interface Draft {
    id?: string
    draftId?: string
    draftName?: string
    draftDescription?: string
    draftCategory?: string
    draftTotal?: number
    draftPropietarioResidente?: string
    draftCreated?: string
    draftApply?: string[]
    [key: string]: unknown
}

export default function Page() {
    const [draftsData, setDraftsData] = useState<Draft[]>([])
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        if (!isLoaded) {
            // Use SSR-safe service instead of direct Firestore access
            getAllDrafts()
                .then((drafts) => {
                    if (drafts && drafts.length > 0) {
                        setDraftsData(drafts as Draft[])
                    }
                    setIsLoaded(true)
                })
                .catch((error) => {
                    console.error('Error loading drafts:', error)
                    setIsLoaded(true)
                })
        }
    }, [isLoaded])

    return (
        <Container fluid className="p-0 h-100">
            <Row className="m-0 w-100 d-flex">
                <Col className="p-2" lg={8} md={8} sm={10} xs={12}>
                    <h1 className="type-hero-title">
                        Directorio Requerimientos{'  '}
                        <Button className="body-1 btn-round btn-high">
                            Aplica gratis a un requerimiento
                        </Button>
                    </h1>
                    <h3 className="headline-l">
                        Buscar Requerimientos: Obtener o Aplicar con Cotizaciones
                    </h3>
                    <p className="body-2">Requerimientos activos</p>
                    <Row className="m-0 d-flex">
                        {draftsData.map((draft) => (
                            <DraftCard
                                key={draft.draftId || draft.id}
                                draftId={draft.draftId || draft.id || ''}
                                draftPropietarioResidente={String(draft.draftPropietarioResidente || '')}
                                draftName={draft.draftName || ''}
                                draftDescription={draft.draftDescription || ''}
                                draftTotal={Number(draft.draftTotal) || 0}
                                draftCategory={draft.draftCategory || ''}
                                draftCreated={String(draft.draftCreated || '')}
                                draftApply={draft.draftApply || []}
                            />
                        ))}
                    </Row>
                </Col>
            </Row>
        </Container>
    )
}
