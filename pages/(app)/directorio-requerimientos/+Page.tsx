/**
 * Directorio Requerimientos Page
 *
 * Converted to TypeScript.
 * Shows list of project requirements/drafts.
 */

export const documentProps = {
    title: 'Directorio de Requerimientos | Comunidad Dezzpo',
    description: 'Explora requerimientos de proyectos activos y aplica con cotizaciones.',
}

import { useState, useEffect } from 'react'
import { firestore } from '@firebase/firebaseClient'
import { collection, getDocs } from 'firebase/firestore'

// Components
import { DraftCard } from '@features/quotes'

// Bootstrap
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'

interface Draft {
    id?: string
    draftName?: string
    draftDescription?: string
    draftCategory?: string
    [key: string]: unknown
}

interface DraftsData {
    data?: Draft[]
}

export default function Page() {
    const draftRef = collection(firestore, 'drafts')
    const [draftsData, setDraftsData] = useState<DraftsData>({})
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        if (!isLoaded) {
            const draftsFromFirestore = async () => {
                try {
                    const draftData = await getDocs(draftRef)
                    return draftData
                } catch (err) {
                    console.error('Error fetching drafts:', err)
                }
            }

            draftsFromFirestore()
                .then((docSnap) => {
                    if (docSnap) {
                        const data = docSnap.docs.map((element) => ({
                            id: element.id,
                            ...element.data(),
                        })) as Draft[]

                        if (data) {
                            setDraftsData({ data })
                            setIsLoaded(true)
                        }
                    }
                })
                .catch((error) => {
                    console.error('Error loading drafts:', error)
                })
        }
    }, [draftRef, isLoaded])

    return (
        <Container fluid className="p-0 h-100">
            <Row className="m-0 w-100 d-flex">
                <Col className="p-2" lg={8} md={8} sm={10} xs={12}>
                    <h2 className="headline-xl">
                        Directorio Requerimientos{'  '}
                        <Button className="body-1 btn-round btn-high">
                            Aplica gratis a un requerimiento
                        </Button>
                    </h2>
                    <h3 className="headline-l">
                        Buscar Requerimientos: Obtener o Aplicar con Cotizaciones
                    </h3>
                    <p className="body-2">Requerimientos activos</p>
                    <Row className="m-0 d-flex">
                        {draftsData.data?.map((draft) => (
                            <DraftCard
                                key={draft.id}
                                draftId={draft.id || ''}
                                draftPropietarioResidente={String(draft.draftPropietarioResidente || '')}
                                draftName={draft.draftName || ''}
                                draftDescription={draft.draftDescription || ''}
                                draftTotal={Number(draft.draftTotal) || 0}
                                draftCategory={draft.draftCategory || ''}
                                draftCreated={String(draft.draftCreated || '')}
                                draftApply={draft.draftApply as string[] || []}
                            />
                        ))}
                    </Row>
                </Col>
            </Row>
        </Container>
    )
}
