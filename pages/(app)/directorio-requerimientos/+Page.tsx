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
import { SearchBar } from '@components/layout'
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
// Bootstrap & MUI
import { Container } from 'react-bootstrap'
import { Typography, Chip, Box, Divider, FormControl, Select, MenuItem, Alert } from '@mui/material'
import StarIcon from '@mui/icons-material/Star'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import FilterListIcon from '@mui/icons-material/FilterList'

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

    // 1. Filter drafts by category search term (from SearchBar)
    const filteredByCategory = useMemo(() => {
        return draftsData.filter((draft) => {
            if (!spacedText) return true
            const term = spacedText.toLowerCase()
            const cat = (draft.draftCategory || '').toLowerCase()
            const name = (draft.draftName || '').toLowerCase()
            const desc = (draft.draftDescription || '').toLowerCase()
            return cat.includes(term) || name.includes(term) || desc.includes(term)
        })
    }, [draftsData, spacedText])

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

    // Filter drafts matching the comerciante's categories
    const matchingDrafts = useMemo(() => {
        if (!isComerciante || userCategories.length === 0) return []
        return filteredByClassification.filter((draft) => {
            const cat = (draft.draftCategory || '').toLowerCase()
            return userCategories.some(
                (uc) => cat.includes(uc.toLowerCase()) || uc.toLowerCase().includes(cat)
            )
        })
    }, [isComerciante, userCategories, filteredByClassification])

    // Remaining drafts (not in matching)
    const otherDrafts = useMemo(() => {
        if (matchingDrafts.length === 0) return filteredByClassification
        const matchingIds = new Set(matchingDrafts.map((d) => d.draftId || d.id))
        return filteredByClassification.filter((d) => !matchingIds.has(d.draftId || d.id))
    }, [matchingDrafts, filteredByClassification])

    return (
        <Container fluid className="p-0 h-100">
            <div className="p-3 p-md-4">
                <header className={styles['page-header']}>
                    <div>
                        <h1 className="type-hero-title mb-1">
                            Directorio de Requerimientos
                        </h1>
                        <p className="type-body text-muted mb-0">
                            ¿Ofreces algún servicio? publícalo en el portal de servicios{' '}
                            <Link
                                href={userId ? '/app/ajustes' : '/ingreso'}
                                className={clsx(styles.Link, styles.Green)}
                                style={{ fontWeight: 700, textDecoration: 'underline' }}
                            >
                                Publica tus servicios
                            </Link>
                        </p>
                    </div>
                </header>

                {/* Comerciante Structure Adaptation Banner */}
                {isComerciante && (
                    <Box sx={{ my: 2 }}>
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
                    {/* Mobile Selector Dropdown */}
                    <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                        <FormControl fullWidth size="small">
                            <Select
                                value={selectedClassification}
                                onChange={(e) => setSelectedClassification(e.target.value)}
                                displayEmpty
                                sx={{
                                    borderRadius: '20px',
                                    bgcolor: '#ffffff',
                                    fontSize: '0.9rem',
                                    fontWeight: 600,
                                }}
                            >
                                <MenuItem value="all">
                                    <em>Todos los Inmuebles</em>
                                </MenuItem>
                                {(PROPIETARIO_RANKINGS.clasificacion?.tiers ?? []).map((tier) => (
                                    <MenuItem key={tier.id} value={tier.id}>
                                        {tier.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                    {/* Desktop Chips */}
                    <Box sx={{ display: { xs: 'none', md: 'flex' }, flexWrap: 'wrap', gap: 1 }}>
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
            </div>
        </Container>
    )
}
