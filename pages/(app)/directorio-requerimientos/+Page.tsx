/**
 * Directorio Requerimientos Page
 *
 * Converted to TypeScript.
 * Shows list of project requirements/drafts.
 * SSR-safe: Uses draftService which has Firestore guards.
 */
import { useState, useEffect } from 'react'
import { navigate } from 'vike/client/router'
import { useUserStore } from '@stores/userStore'
import { getAllDrafts } from '@services/drafts'
// Components
import { DraftCard } from '@features/quotes'
// Styles
import styles from '@features/quotes/styles/Requerimientos.module.scss'
// Bootstrap
import { Container, Button } from 'react-bootstrap'

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
    const userId = useUserStore((state) => state.userId)

    const handleApplyClick = () => {
        if (!userId) {
            navigate('/ingreso')
        } else {
            // Logic for logged in users (optional for now)
            console.log('User is logged in')
        }
    }

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
            <div className="p-4">
                <header className={styles['page-header']}>
                    <h1 className="type-hero-title">
                        Directorio de Requerimientos
                    </h1>
                    <Button
                        className="type-body btn-round btn-high"
                        onClick={handleApplyClick}
                    >
                        Aplica a un requerimiento
                    </Button>
                </header>

                <h3 className="type-section-title">
                    Buscar Requerimientos: Obtener o Aplicar con Cotizaciones
                </h3>
                <p className="type-body-sm">Requerimientos activos</p>

                <section className={styles['grid-container']}>
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
                </section>
            </div>
        </Container>
    )
}

