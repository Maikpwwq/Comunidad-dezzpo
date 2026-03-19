/**
 * Directorio Requerimientos Page
 *
 * Shows list of project requirements/drafts.
 * For comerciantes: adds a "Requerimientos para ti" section
 * that filters drafts matching the user's registered categories.
 * SSR-safe: Uses draftService which has Firestore guards.
 */
import { useState, useEffect, useMemo } from 'react'
import { navigate } from 'vike/client/router'
import { useUserStore } from '@stores/userStore'
import { useAuth } from '@hooks/useAuth'
import { getAllDrafts } from '@services/drafts'
import { getUser } from '@services/users'
// Components
import { DraftCard } from '@features/quotes'
// Styles
import styles from '@features/quotes/styles/Requerimientos.module.scss'
// Bootstrap & MUI
import { Container, Button } from 'react-bootstrap'
import { Typography, Chip, Box, Divider } from '@mui/material'
import StarIcon from '@mui/icons-material/Star'

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
    const [userCategories, setUserCategories] = useState<string[]>([])
    const userId = useUserStore((state) => state.userId)
    const { currentUser } = useAuth()
    const isComerciante = currentUser?.role === 2

    const handleApplyClick = () => {
        if (!userId) {
            navigate('/ingreso')
        } else {
            console.log('User is logged in')
        }
    }

    const getDraftTotalValue = (draft: any) => {
        let total = Number(draft.draftTotal) || 0
        if (total === 0 && Array.isArray(draft.draftSubCategory)) {
            total = draft.draftSubCategory.reduce((sum: number, item: any) => sum + (Number(item.subCategoriaPrecioFinal) || 0), 0)
        }
        return total
    }

    // Fetch all drafts
    useEffect(() => {
        if (!isLoaded) {
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

    // Fetch comerciante's categories
    useEffect(() => {
        const fetchUserCategories = async () => {
            if (!userId || !isComerciante) return
            try {
                const userData = await getUser({ userId, role: 2 })
                if (userData?.userCategories && userData.userCategories.length > 0) {
                    setUserCategories(userData.userCategories)
                }
            } catch (err) {
                console.error('Error fetching user categories:', err)
            }
        }
        fetchUserCategories()
    }, [userId, isComerciante])

    // Filter drafts matching the comerciante's categories
    const matchingDrafts = useMemo(() => {
        if (!isComerciante || userCategories.length === 0) return []
        return draftsData.filter((draft) => {
            const cat = (draft.draftCategory || '').toLowerCase()
            return userCategories.some((uc) => cat.includes(uc.toLowerCase()) || uc.toLowerCase().includes(cat))
        })
    }, [draftsData, userCategories, isComerciante])

    // Remaining drafts (not in matching)
    const otherDrafts = useMemo(() => {
        if (matchingDrafts.length === 0) return draftsData
        const matchingIds = new Set(matchingDrafts.map((d) => d.draftId || d.id))
        return draftsData.filter((d) => !matchingIds.has(d.draftId || d.id))
    }, [draftsData, matchingDrafts])

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

                {/* Category-Filtered Section for Comerciantes */}
                {isComerciante && matchingDrafts.length > 0 && (
                    <>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2, mb: 1 }}>
                            <StarIcon sx={{ color: 'var(--primary-green-text-color)' }} />
                            <Typography variant="h6" fontWeight={600}>
                                Requerimientos para ti
                            </Typography>
                            <Chip
                                label={`${matchingDrafts.length} coincidencias`}
                                size="small"
                                color="success"
                                variant="outlined"
                            />
                        </Box>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                            {userCategories.map((cat) => (
                                <Chip key={cat} label={cat} size="small" sx={{ bgcolor: 'var(--background-light-gray-color)' }} />
                            ))}
                        </Box>

                        <section className={styles['grid-container']}>
                            {matchingDrafts.map((draft) => (
                                <DraftCard
                                    key={draft.draftId || draft.id}
                                    draftId={draft.draftId || draft.id || ''}
                                    draftPropietarioResidente={String(draft.draftPropietarioResidente || '')}
                                    draftName={draft.draftName || ''}
                                    draftDescription={draft.draftDescription || ''}
                                    draftTotal={getDraftTotalValue(draft)}
                                    draftCategory={draft.draftCategory || ''}
                                    draftCreated={String(draft.draftCreated || '')}
                                    draftApply={draft.draftApply || []}
                                />
                            ))}
                        </section>

                        <Divider sx={{ my: 3 }} />
                    </>
                )}

                {/* All / Remaining Requirements */}
                {/* TODO: Implementar filtros */}
                <p className="type-body-sm">
                    {isComerciante && matchingDrafts.length > 0
                        ? 'Otros requerimientos activos'
                        : 'Todos los requerimientos activos'}
                </p>

                <section className={styles['grid-container']}>
                    {otherDrafts.map((draft) => (
                        <DraftCard
                            key={draft.draftId || draft.id}
                            draftId={draft.draftId || draft.id || ''}
                            draftPropietarioResidente={String(draft.draftPropietarioResidente || '')}
                            draftName={draft.draftName || ''}
                            draftDescription={draft.draftDescription || ''}
                            draftTotal={getDraftTotalValue(draft)}
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
