/**
 * Directorio Requerimientos Page
 *
 * Shows list of project requirements/drafts.
 * For comerciantes: adds a "Requerimientos para ti" section
 * that filters drafts matching the user's registered categories.
 * SSR-safe: Uses draftService which has Firestore guards.
 */
import { useState, useEffect } from 'react'
import { navigate } from 'vike/client/router'
import { useUserStore } from '@stores/userStore'
import { useAuth } from '@hooks/useAuth'
import { getAllDrafts } from '@services/drafts/draftService'
import { getUser } from '@services/users'
import { usePageContext } from '@hooks/usePageContext'
import { SearchBar } from '@components/layout'
// Components
import { DraftCard } from '@features/quotes'
// Styles
import styles from '@features/quotes/styles/Requerimientos.module.scss'
// Bootstrap & MUI
import { Container, Button } from 'react-bootstrap'
import { Typography, Chip, Box, Divider } from '@mui/material'
import StarIcon from '@mui/icons-material/Star'

import { PROPIETARIO_RANKINGS } from '@config/userClassification.config'
import FilterListIcon from '@mui/icons-material/FilterList'

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
    userClasification?: string
    draftPropietarioClassification?: string
    [key: string]: unknown
}

export default function Page() {
    const pageContext = usePageContext()
    const searchInput = pageContext.routeParams?.searchInput || pageContext.routeParams?.category
    const spacedText = searchInput ? decodeURIComponent(String(searchInput)).replace(/\+/g, ' ') : ''

    const [draftsData, setDraftsData] = useState<Draft[]>([])
    const [isLoaded, setIsLoaded] = useState(false)
    const [userCategories, setUserCategories] = useState<string[]>([])
    const [selectedClassification, setSelectedClassification] = useState<string>('all')

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

    // Filter drafts by category search term (from SearchBar)
    const filteredByCategory = draftsData.filter((draft) => {
        if (!spacedText) return true
        const term = spacedText.toLowerCase()
        const cat = (draft.draftCategory || '').toLowerCase()
        const name = (draft.draftName || '').toLowerCase()
        const desc = (draft.draftDescription || '').toLowerCase()
        return cat.includes(term) || name.includes(term) || desc.includes(term)
    })

    // Filter drafts by Propietario Classification tier
    const filteredByClassification = filteredByCategory.filter((draft) => {
        if (selectedClassification === 'all') return true
        const clas = (
            draft.userClasification ||
            draft.draftPropietarioClassification ||
            ''
        ).toLowerCase()
        const tiers = PROPIETARIO_RANKINGS.clasificacion?.tiers || []
        const targetTier = tiers.find(
            (t) => t.id === selectedClassification
        )
        if (!targetTier) return true
        return (
            clas.includes(targetTier.name.toLowerCase()) ||
            clas.includes(targetTier.id.toLowerCase())
        )
    })

    // Filter drafts matching the comerciante's categories
    const getMatchingDrafts = () => {
        if (!isComerciante || userCategories.length === 0) return []
        return filteredByClassification.filter((draft) => {
            const cat = (draft.draftCategory || '').toLowerCase()
            return userCategories.some(
                (uc) => cat.includes(uc.toLowerCase()) || uc.toLowerCase().includes(cat)
            )
        })
    }
    const matchingDrafts = getMatchingDrafts()

    // Remaining drafts (not in matching)
    const getOtherDrafts = () => {
        if (matchingDrafts.length === 0) return filteredByClassification
        const matchingIds = new Set(matchingDrafts.map((d) => d.draftId || d.id))
        return filteredByClassification.filter((d) => !matchingIds.has(d.draftId || d.id))
    }
    const otherDrafts = getOtherDrafts()

    return (
        <Container fluid className="p-0 h-100">
            <div className="p-4">
                <header className={styles['page-header']}>
                    <h1 className="type-hero-title">
                        Directorio de Requerimientos
                    </h1>
                    <Button
                        className="btn-primary-gradient"
                        onClick={handleApplyClick}
                    >
                        Aplica a un requerimiento
                    </Button>
                </header>

                <Box sx={{ my: 2 }}>
                    <SearchBar
                        targetRoutePrefix="/app/directorio-requerimientos"
                        placeholder="Buscar requerimientos por categoría, título o palabra clave..."
                        initialValue={spacedText}
                    />
                </Box>

                {spacedText && (
                    <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" fontWeight={600} color="text.secondary">
                            Filtro de búsqueda:
                        </Typography>
                        <Chip
                            label={spacedText}
                            color="primary"
                            onDelete={() => navigate('/app/directorio-requerimientos')}
                        />
                    </Box>
                )}

                <h3 className="type-section-title">
                    Buscar Requerimientos: Obtener o Aplicar con Cotizaciones
                </h3>

                {/* Classification Tier Filter Bar */}
                <Box
                    sx={{
                        my: 2.5,
                        p: 2,
                        borderRadius: 3,
                        bgcolor: 'var(--background-light-gray-color, #f8fafc)',
                        border: '1px solid #e2e8f0',
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                        <FilterListIcon sx={{ color: 'var(--brand-teal, #00897b)' }} />
                        <Typography variant="subtitle2" fontWeight={700} color="text.primary">
                            Filtrar por Clasificación del Propietario / Tipo de Inmueble:
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        <Chip
                            label="Todos los Inmuebles"
                            onClick={() => setSelectedClassification('all')}
                            color={selectedClassification === 'all' ? 'primary' : 'default'}
                            variant={selectedClassification === 'all' ? 'filled' : 'outlined'}
                            sx={{ fontWeight: 600 }}
                        />
                        {(PROPIETARIO_RANKINGS.clasificacion?.tiers ?? []).map((tier) => (
                            <Chip
                                key={tier.id}
                                label={tier.name}
                                onClick={() => setSelectedClassification(tier.id)}
                                color={selectedClassification === tier.id ? 'primary' : 'default'}
                                variant={selectedClassification === tier.id ? 'filled' : 'outlined'}
                                sx={{
                                    fontWeight: 600,
                                    bgcolor: selectedClassification === tier.id ? tier.color : undefined,
                                    color: selectedClassification === tier.id ? '#ffffff' : undefined,
                                }}
                            />
                        ))}
                    </Box>
                </Box>

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
