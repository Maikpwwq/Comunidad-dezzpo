/**
 * Directorio Requerimientos Page
 *
 * Shows list of project requirements/drafts.
 * For comerciantes:
 * 1. Automatically filters drafts based on merchant structure (userClasification)
 *    assigned by Admin, showing only compatible property types.
 * 2. Highlights "Requerimientos para ti" matching the user's categories.
 * SSR-safe: Uses draftService and userService which have Firestore guards.
 */
import { useState, useEffect, useMemo } from 'react'
import clsx from 'clsx'
import { Link } from '@hooks'
import { navigate } from 'vike/client/router'
import { useUserStore } from '@stores/userStore'
import { useAuth } from '@hooks/useAuth'
import { getAllDrafts } from '@services/drafts/draftService'
import { getUser } from '@services/users'
import { usePageContext } from '@hooks/usePageContext'
import { DirectoryFilterBar, ActiveFiltersBar } from '@components/layout'
import type { ActiveFilterChip } from '@components/layout'
// Matching Domain
import {
    normalizeMerchantStructure,
    normalizePropertyType,
    MERCHANT_STRUCTURE_METADATA,
} from '@config/matching.config'
import { getCompatiblePropertiesForStructure } from '@services/matching'
// Components
import { DraftCard } from '@features/quotes'
// Styles
import styles from '@features/quotes/styles/Requerimientos.module.scss'
// MUI
import {
    Container,
    Typography,
    Chip,
    Box,
    Divider,
    Alert,
} from '@mui/material'
import StarIcon from '@mui/icons-material/Star'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import AssignmentIcon from '@mui/icons-material/Assignment'
import { ListadoCategorias } from '@assets/data/ListadoCategorias'

import { PROPIETARIO_RANKINGS } from '@config/userClassification.config'

interface Draft {
    id?: string
    draftId?: string
    draftName?: string
    draftDescription?: string
    draftCategory?: string
    draftProject?: string
    tipoProyecto?: string
    draftProperty?: string
    tipoInmueble?: string
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
    const [merchantClassification, setMerchantClassification] = useState<string | null>(null)
    const [selectedClassification, setSelectedClassification] = useState<string>('all')
    const [selectedDraftCategory, setSelectedDraftCategory] = useState<string>('')

    const userId = useUserStore((state) => state.userId)
    const { currentUser } = useAuth()
    const isComerciante = currentUser?.role === 2

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

    // Fetch comerciante's categories and classification
    useEffect(() => {
        const fetchUserData = async () => {
            if (!userId || !isComerciante) return
            try {
                const userData = await getUser({ userId, role: 2 })
                if (userData) {
                    if (userData.userCategories && userData.userCategories.length > 0) {
                        setUserCategories(userData.userCategories)
                    }
                    if (userData.userClasification) {
                        setMerchantClassification(userData.userClasification)
                    }
                }
            } catch (err) {
                console.error('Error fetching user data:', err)
            }
        }
        fetchUserData()
    }, [userId, isComerciante])

    // Resolved merchant structure and allowed property types
    const resolvedMerchantStructure = useMemo(() => {
        if (!isComerciante || !merchantClassification) return null
        return normalizeMerchantStructure(merchantClassification)
    }, [isComerciante, merchantClassification])

    const compatibleProperties = useMemo(() => {
        if (!resolvedMerchantStructure) return null
        return getCompatiblePropertiesForStructure(resolvedMerchantStructure, 'mostrar')
    }, [resolvedMerchantStructure])

    const [searchQuery, setSearchQuery] = useState(spacedText)
    useEffect(() => {
        setSearchQuery(spacedText)
    }, [spacedText])

    // 1. Filter drafts by category search term (unified search TextField)
    const filteredByCategory = useMemo(() => {
        return draftsData.filter((draft) => {
            const activeSearch = (searchQuery || spacedText).trim()
            if (!activeSearch) return true
            const term = activeSearch.toLowerCase()
            const cat = (draft.draftCategory || '').toLowerCase()
            const name = (draft.draftName || '').toLowerCase()
            const desc = (draft.draftDescription || '').toLowerCase()
            return cat.includes(term) || name.includes(term) || desc.includes(term)
        })
    }, [draftsData, searchQuery, spacedText])

    // 2. Filter drafts by Merchant Operational Structure (Invariants I1-I7 & AC-6)
    const filteredByStructure = useMemo(() => {
        if (!isComerciante || !compatibleProperties) {
            return filteredByCategory
        }

        return filteredByCategory.filter((draft) => {
            const rawProp = draft.draftProject || draft.tipoProyecto || draft.draftProperty || draft.tipoInmueble
            const normProp = normalizePropertyType(rawProp)

            // Invariant I5: Unknown property type is always shown, never hidden
            if (!normProp) return true

            // Show if it belongs to compatible properties for this structure
            return compatibleProperties.includes(normProp)
        })
    }, [filteredByCategory, isComerciante, compatibleProperties])

    // 3. Filter drafts by Propietario Classification tier / Property type
    const filteredByClassification = useMemo(() => {
        return filteredByStructure.filter((draft) => {
            if (selectedClassification === 'all') return true

            const rawProp = draft.draftProject || draft.tipoProyecto || draft.draftProperty || draft.tipoInmueble
            const normProp = normalizePropertyType(rawProp)
            if (normProp && normProp === selectedClassification) return true

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
    }, [filteredByStructure, selectedClassification])

    // 4. Category chip filter
    const filteredByDraftCategory = useMemo(() => {
        if (!selectedDraftCategory) return filteredByClassification
        const catLabel = ListadoCategorias.find(
            (c: { key: number; label: string }) => String(c.key) === selectedDraftCategory
        )?.label?.toLowerCase()
        if (!catLabel) return filteredByClassification
        return filteredByClassification.filter((draft) => {
            const cat = (draft.draftCategory || '').toLowerCase()
            return cat.includes(catLabel) || catLabel.includes(cat)
        })
    }, [filteredByClassification, selectedDraftCategory])

    // Filter drafts matching the comerciante's categories
    const matchingDrafts = useMemo(() => {
        if (!isComerciante || userCategories.length === 0) return []
        return filteredByDraftCategory.filter((draft) => {
            const cat = (draft.draftCategory || '').toLowerCase()
            return userCategories.some(
                (uc) => cat.includes(uc.toLowerCase()) || uc.toLowerCase().includes(cat)
            )
        })
    }, [isComerciante, userCategories, filteredByDraftCategory])

    // Remaining drafts (not in matching)
    const otherDrafts = useMemo(() => {
        if (matchingDrafts.length === 0) return filteredByDraftCategory
        const matchingIds = new Set(matchingDrafts.map((d) => d.draftId || d.id))
        return filteredByDraftCategory.filter((d) => !matchingIds.has(d.draftId || d.id))
    }, [matchingDrafts, filteredByDraftCategory])

    const hasActiveFilters =
        selectedClassification !== 'all' ||
        selectedDraftCategory !== '' ||
        !!searchQuery.trim() ||
        !!spacedText

    const handleClearAllFilters = () => {
        setSelectedClassification('all')
        setSelectedDraftCategory('')
        setSearchQuery('')
        // Limpiar búsqueda URL-driven navegando a la ruta base
        if (spacedText) {
            navigate('/app/directorio-requerimientos')
        }
    }

    return (
        <Container maxWidth="xl" sx={{ py: 3, px: { xs: 2, md: 4 } }}>
            {/* Top Bar / Header — matching tiendas pattern */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    justifyContent: 'space-between',
                    alignItems: { xs: 'flex-start', md: 'center' },
                    gap: 2,
                    mb: 3,
                }}
            >
                <Box sx={{ textAlign: 'left' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                        <AssignmentIcon sx={{ fontSize: 32, color: 'primary.main' }} />
                        <Typography variant="h4" fontWeight={800} sx={{ color: '#0A2540' }}>
                            Directorio de Requerimientos
                        </Typography>
                    </Box>
                    <Typography variant="body1" color="text.secondary">
                        ¿Ofreces algún servicio? publícalo en el portal de servicios{' '}
                        <Link
                            href={userId ? '/app/ajustes' : '/ingreso'}
                            className={clsx(styles.Link, styles.Green)}
                            style={{ fontWeight: 700, textDecoration: 'underline' }}
                        >
                            Publica tus servicios
                        </Link>
                    </Typography>
                </Box>
            </Box>

            {/* Comerciante Structure Adaptation Banner */}
            {isComerciante && (
                <Box sx={{ mb: 3 }}>
                    {resolvedMerchantStructure ? (
                        <Alert
                            severity="info"
                            icon={<InfoOutlinedIcon />}
                            sx={{
                                borderRadius: 3,
                                border: '1px solid #bae6fd',
                                bgcolor: '#f0f9ff',
                                color: '#0369a1',
                                fontSize: '0.85rem',
                            }}
                        >
                            <strong>Filtro por estructura operativa:</strong> Estás viendo los proyectos compatibles
                            con tu estructura de{' '}
                            <strong>{MERCHANT_STRUCTURE_METADATA[resolvedMerchantStructure].label}</strong> (asignada
                            y verificada por el Administrador).
                        </Alert>
                    ) : (
                        <Alert
                            severity="warning"
                            sx={{
                                borderRadius: 3,
                                border: '1px solid #fed7aa',
                                bgcolor: '#fffbeb',
                                color: '#9a3412',
                                fontSize: '0.85rem',
                            }}
                        >
                            Si eres un comerciante nuevo, el Administrador asignará tu clasificación operativa
                            para optimizar los requerimientos visibles para tu perfil.
                        </Alert>
                    )}
                </Box>
            )}

            {/* Unified Filter Bar (matching tiendas pattern) */}
            <DirectoryFilterBar
                searchQuery={searchQuery}
                onSearchChange={(val) => setSearchQuery(val)}
                searchPlaceholder="Buscar requerimientos por categoría, título o palabra clave..."
                searchGridMd={4}
                dropdowns={[
                    {
                        label: 'Tipo de Inmueble',
                        value: selectedClassification,
                        onChange: setSelectedClassification,
                        options: (PROPIETARIO_RANKINGS.clasificacion?.tiers ?? []).map((t) => ({
                            id: t.id,
                            label: t.name,
                        })),
                        allLabel: 'Todos los Inmuebles',
                        gridMd: 3,
                    },
                ]}
                categoryChips={{
                    categories: ListadoCategorias,
                    selectedKey: selectedDraftCategory,
                    onSelect: setSelectedDraftCategory,
                }}
                hasActiveFilters={hasActiveFilters}
                onClearAll={handleClearAllFilters}
                sx={{ mb: 3 }}
            />

            {/* Active Filters Summary Bar */}
            <ActiveFiltersBar
                visible={hasActiveFilters}
                chips={[
                    ...(searchQuery.trim()
                        ? [{
                            label: `Búsqueda: ${searchQuery.trim()}`,
                            color: 'primary' as const,
                            onDelete: () => {
                                setSearchQuery('')
                                if (spacedText) {
                                    navigate('/app/directorio-requerimientos')
                                }
                            },
                        }]
                        : []),
                    ...(selectedClassification !== 'all'
                        ? [{
                            label: `Inmueble: ${
                                (PROPIETARIO_RANKINGS.clasificacion?.tiers ?? []).find(
                                    (t) => t.id === selectedClassification
                                )?.name || selectedClassification
                            }`,
                            color: 'secondary' as const,
                            onDelete: () => setSelectedClassification('all'),
                        }]
                        : []),
                    ...(selectedDraftCategory
                        ? [{
                            label: `Categoría: ${
                                ListadoCategorias.find(
                                    (c: { key: number; label: string }) =>
                                        String(c.key) === selectedDraftCategory
                                )?.label || selectedDraftCategory
                            }`,
                            color: 'info' as const,
                            onDelete: () => setSelectedDraftCategory(''),
                        }]
                        : []),
                ] satisfies ActiveFilterChip[]}
                onResetAll={handleClearAllFilters}
                sx={{ mb: 3 }}
            />

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
                <div className="pb-2 p-0">
                    <h3 className="type-section-title">
                        {spacedText
                            ? `Resultados de búsqueda para: "${spacedText}"`
                            : isComerciante && matchingDrafts.length > 0
                                ? 'Otros requerimientos activos'
                                : 'Todos los requerimientos activos'}
                    </h3>
                </div>
                <p className="type-caption">
                    Directorio de solicitudes activas y cotizaciones de proyectos. <br />
                    ¡Aplica a los requerimientos de tu especialidad!
                </p>

                <section className={styles['grid-container']}>
                    {otherDrafts.length > 0 ? (
                        otherDrafts.map((draft) => (
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
                        ))
                    ) : (
                        <div style={{ gridColumn: '1 / -1', padding: '2rem 1rem', textAlign: 'center' }}>
                            <Typography className="type-body" color="text.secondary">
                                No hay requerimientos activos disponibles con los filtros actuales.
                            </Typography>
                        </div>
                    )}
                </section>
        </Container>
    )
}
