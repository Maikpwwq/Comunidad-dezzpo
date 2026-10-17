import { useState, useEffect, useMemo, Suspense, lazy } from 'react'
import clsx from 'clsx'
import { navigate } from 'vike/client/router'
import { Link } from '@hooks'
import { usePageContext } from '@hooks/usePageContext'
import { useUserStore } from '@stores/userStore'
import { PaginationBar, DirectoryFilterBar, DirectoryZoneFilter, ActiveFiltersBar, type ActiveFilterChip } from '@components/layout'
import { usePagination } from '@hooks/usePagination'
import { getUsers } from '@services/users'
import { searchByCategories } from '@services/search'
import { UserCard } from '@features/profile'
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1'
import HandymanIcon from '@mui/icons-material/Handyman'

const PreRegistrationModal = lazy(() =>
    import('@features/preRegistration').then((m) => ({
        default: m.PreRegistrationModal,
    })),
)
// Matching Domain & Context
import {
    decodeSearchContext,
    evaluateFuzzyMatch,
    type FuzzyMatchResult,
    type SearchContextState,
    type ZoneSignalType,
} from '@services/matching'
import {
    type PropertyTypeId,
    PROPERTY_TYPE_METADATA,
    CATEGORY_FORMALITY_TABLE,
    normalizePropertyType,
    type FormalityLevel,
} from '@config/matching.config'
import { zoneNames } from '@assets/data/ListadoZonas'
import { ListadoCategorias } from '@assets/data/ListadoCategorias'

// UI Libs
import {
    Container,
    Box,
    Skeleton,
    Stack,
    Typography,
    Alert,
    Button,
    Collapse,
    Divider,
} from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined'

// Types
import type { UserFirestoreDocument } from '@services/types'

// Styles
import styles from '@features/profile/styles/ProfessionalDirectory.module.scss'

const PortalSkeleton = () => {
    return (
        <div className={styles['directory-wrapper']}>
            {Array.from(new Array(6)).map((_, index) => (
                <Stack key={index} spacing={1} sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: '16px' }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Skeleton variant="circular" width={40} height={40} />
                        <Skeleton variant="text" width="60%" height={24} />
                    </Stack>
                    <Skeleton variant="text" width="100%" height={20} />
                    <Skeleton variant="text" width="80%" height={20} />
                    <Skeleton variant="rectangular" width="100%" height={40} sx={{ borderRadius: '20px', mt: 2 }} />
                </Stack>
            ))}
        </div>
    )
}

interface SearchDataState {
    docSnap?: UserFirestoreDocument[]
}

interface PublicClassificationFilterOption {
    id: string
    label: string
    matchTerms: string[]
}

const PUBLIC_MERCHANT_FILTERS: PublicClassificationFilterOption[] = [
    {
        id: 'persona-natural',
        label: 'Persona Natural',
        matchTerms: ['persona natural'],
    },
    {
        id: 'micro-empresa',
        label: 'Micro Empresa',
        matchTerms: ['empresa emergente', 'emergente'],
    },
    {
        id: 'pyme-servicios',
        label: 'PyME de Servicios',
        matchTerms: ['pyme de servicios', 'pyme'],
    },
    {
        id: 'empresas',
        label: 'Empresas',
        matchTerms: [
            'empresa gacela',
            'gacela',
            'empresa tractora',
            'tractora',
            'corporativo escalable',
            'escalable',
        ],
    },
]

const PROPERTY_FILTER_OPTIONS: Array<{ id: PropertyTypeId | 'all'; label: string }> = [
    { id: 'all', label: 'Todos los Inmuebles' },
    { id: 'hogar', label: 'Hogar' },
    { id: 'propiedad_horizontal', label: 'Propiedad Horizontal' },
    { id: 'negocio', label: 'Negocio' },
    { id: 'inmobiliaria', label: 'Inmobiliaria' },
    { id: 'aliado_estrategico', label: 'Alianzas' },
]

function resolveCategoryFormalityLevel(categoryQuery?: string | null): FormalityLevel {
    if (!categoryQuery) return 'media'
    const clean = categoryQuery.trim().toLowerCase()
    const found = ListadoCategorias.find(
        (c: { key: number; label: string }) =>
            c.label.toLowerCase() === clean ||
            c.label.toLowerCase().includes(clean) ||
            clean.includes(c.label.toLowerCase())
    )
    if (found && found.key in CATEGORY_FORMALITY_TABLE) {
        return CATEGORY_FORMALITY_TABLE[found.key] ?? 'media'
    }
    return 'media'
}

function resolveZoneProximitySignal(
    userLocation?: string | null,
    targetZone?: string | null,
    targetMunicipioCode?: string | null,
    targetMunicipioName?: string | null
): ZoneSignalType {
    if (!targetZone && !targetMunicipioCode && !targetMunicipioName) return 'no_zone_specified'
    if (!userLocation) return 'no_zone_specified'

    const cleanUser = userLocation.toLowerCase()
    if (targetZone === 'otra-zona' || targetMunicipioCode || targetMunicipioName) {
        if (targetMunicipioCode && cleanUser.includes(targetMunicipioCode)) return 'same_zone'
        if (targetMunicipioName) {
            const cleanMpio = targetMunicipioName.toLowerCase().split('(')[0]?.trim() || ''
            if (cleanMpio && cleanUser.includes(cleanMpio)) return 'same_zone'
        }
        return 'other_zone'
    }

    const cleanTarget = (targetZone || '').toLowerCase()
    if (cleanUser.includes(cleanTarget) || cleanTarget.includes(cleanUser)) {
        return 'same_zone'
    }

    if (cleanUser.includes('bogot') || cleanUser.includes('cundinamarca')) {
        return 'citywide_coverage'
    }

    return 'other_zone'
}

interface RankedMerchant {
    user: UserFirestoreDocument
    match: FuzzyMatchResult
}

export default function Page() {
    const pageContext = usePageContext()
    const routeSearchInput = pageContext.routeParams?.searchInput
    const routeSpacedText = routeSearchInput ? String(routeSearchInput).replace(/\+/g, ' ') : ''

    // SSR-safe query context decoding
    const initialQueryContext = useMemo<SearchContextState>(() => {
        const queryStr =
            typeof window !== 'undefined'
                ? window.location.search
                : ((pageContext.urlParsed as unknown as { searchOriginal?: string })?.searchOriginal || '')
        return decodeSearchContext(queryStr)
    }, [pageContext.urlParsed])

    const [isLoaded, setIsLoaded] = useState(false)
    const [searchData, setSearchData] = useState<SearchDataState>({})
    const [usersData, setUsersData] = useState<UserFirestoreDocument[]>([])

    // Active Filters
    const [selectedPropertyType, setSelectedPropertyType] = useState<PropertyTypeId | 'all'>(() => {
        return initialQueryContext.propertyType || 'all'
    })
    const [activeZone, setActiveZone] = useState<string | null>(initialQueryContext.zone)
    const [activeMpioCode, setActiveMpioCode] = useState<string | null>(initialQueryContext.municipioCode)
    const [activeMpioName, setActiveMpioName] = useState<string | null>(initialQueryContext.municipioName || null)
    const [selectedMerchantClassification, setSelectedMerchantClassification] = useState<string>('all')
    const [selectedCategory, setSelectedCategory] = useState<string>('')
    const [showComplementary, setShowComplementary] = useState(false)
    const [recommendModalOpen, setRecommendModalOpen] = useState(false)
    const isAuth = useUserStore((state) => state.isAuth)

    const handleOpenRecommendModal = () => {
        if (!isAuth) {
            window.location.href = '/ingreso?returnTo=/app/portal-servicios'
            return
        }
        setRecommendModalOpen(true)
    }

    const effectiveKeyword = useMemo(() => {
        return (initialQueryContext.category || routeSpacedText).trim()
    }, [initialQueryContext.category, routeSpacedText])

    const [searchQuery, setSearchQuery] = useState(effectiveKeyword)

    useEffect(() => {
        setSearchQuery(effectiveKeyword)
    }, [effectiveKeyword])

    const fetchInitialUsers = async () => {
        try {
            // Role 2: Comerciantes Calificados based on legacy 'userSelectedRol = 2'
            const users = await getUsers(2 as any)
            if (users) {
                setUsersData(users as UserFirestoreDocument[])
            }
        } catch (error) {
            console.error('Error fetching users:', error)
        }
    }

    const fetchSearchResults = async (query: string) => {
        try {
            const results = await searchByCategories({
                query: '',
                categories: [query],
            })

            if (results && results.users && results.users.length > 0) {
                setSearchData({
                    docSnap: results.users,
                })
            } else {
                setSearchData({
                    docSnap: [],
                })
            }
            setIsLoaded(true)
        } catch (error) {
            console.error('Error searching users:', error)
            setIsLoaded(true)
        }
    }

    useEffect(() => {
        setIsLoaded(false)
    }, [effectiveKeyword])

    useEffect(() => {
        if (!isLoaded) {
            if (effectiveKeyword) {
                fetchSearchResults(effectiveKeyword)
            }
        }
    }, [effectiveKeyword, isLoaded])

    useEffect(() => {
        fetchInitialUsers()
    }, [])

    // Combine usersData and searchData.docSnap deduplicated by userId/uid
    const combinedUsers = useMemo(() => {
        return Array.from(
            new Map(
                [...usersData, ...(searchData.docSnap || [])].map((u) => [
                    u.userId || (u as unknown as { uid?: string }).uid || u.userMail,
                    u,
                ])
            ).values()
        )
    }, [usersData, searchData.docSnap])

    // Keyword & Merchant Classification filtering
    const prefilteredUsers = useMemo(() => {
        let result = combinedUsers

        // 1. Keyword search (Name, Razón Social, Profession, Description, Categories)
        const activeSearch = (searchQuery || effectiveKeyword).trim()
        if (activeSearch) {
            const term = activeSearch.toLowerCase()
            result = result.filter((u) => {
                const name = (u.userName || '').toLowerCase()
                const razon = (u.userRazonSocial || '').toLowerCase()
                const prof = ((u as unknown as { userProfession?: string }).userProfession || '').toLowerCase()
                const desc = ((u as unknown as { userDescription?: string }).userDescription || '').toLowerCase()
                const cats = (u.userCategories || []).map((c) => String(c).toLowerCase())

                return (
                    name.includes(term) ||
                    razon.includes(term) ||
                    prof.includes(term) ||
                    desc.includes(term) ||
                    cats.some((c) => c.includes(term) || term.includes(c))
                )
            })
        }

        // 2. Comerciante Classification filter
        if (selectedMerchantClassification !== 'all') {
            const selectedFilter = PUBLIC_MERCHANT_FILTERS.find((f) => f.id === selectedMerchantClassification)
            if (selectedFilter) {
                result = result.filter((u) => {
                    const clas = (u.userClasification || '').toLowerCase()
                    return selectedFilter.matchTerms.some((t) => clas.includes(t))
                })
            }
        }

        // 3. Category chip filter
        if (selectedCategory) {
            const catLabel = ListadoCategorias.find(
                (c: { key: number; label: string }) => String(c.key) === selectedCategory
            )?.label?.toLowerCase()
            if (catLabel) {
                result = result.filter((u) => {
                    const cats = (u.userCategories || []).map((c) => String(c).toLowerCase())
                    return cats.some((c) => c.includes(catLabel) || catLabel.includes(c))
                })
            }
        }

        return result
    }, [combinedUsers, searchQuery, effectiveKeyword, selectedMerchantClassification, selectedCategory])

    // Fuzzy compatibility evaluation & partitioning
    const { primaryRankedUsers, complementaryUsers } = useMemo(() => {
        const resolvedProp = selectedPropertyType === 'all' ? null : normalizePropertyType(selectedPropertyType)
        const categoryFormality = resolveCategoryFormalityLevel(effectiveKeyword)

        const evaluated: RankedMerchant[] = prefilteredUsers.map((user) => {
            const userLoc = user.userCiudad || user.userDirection || ''
            const zoneSignal = resolveZoneProximitySignal(userLoc, activeZone, activeMpioCode, activeMpioName)

            const match = evaluateFuzzyMatch({
                propertyType: resolvedProp,
                merchantStructure: user.userClasification,
                categoryFormality,
                zoneSignal,
            })

            return { user, match }
        })

        if (!resolvedProp) {
            // Invariant I5: When no property is specified, all profiles are shown without degradation
            evaluated.sort((a, b) => {
                if (b.match.score !== a.match.score) return b.match.score - a.match.score
                return (a.user.userName || '').localeCompare(b.user.userName || '')
            })
            return {
                primaryRankedUsers: evaluated,
                complementaryUsers: [],
            }
        }

        const primary: RankedMerchant[] = []
        const degraded: RankedMerchant[] = []

        evaluated.forEach((item) => {
            if (item.match.decision === 'mostrar') {
                primary.push(item)
            } else {
                degraded.push(item)
            }
        })

        // Sort both buckets by score descending, then by name
        primary.sort((a, b) => {
            if (b.match.score !== a.match.score) return b.match.score - a.match.score
            return (a.user.userName || '').localeCompare(b.user.userName || '')
        })

        degraded.sort((a, b) => {
            if (b.match.score !== a.match.score) return b.match.score - a.match.score
            return (a.user.userName || '').localeCompare(b.user.userName || '')
        })

        return {
            primaryRankedUsers: primary,
            complementaryUsers: degraded,
        }
    }, [prefilteredUsers, selectedPropertyType, effectiveKeyword, activeZone, activeMpioCode])

    const primaryUsersToRender = useMemo(() => {
        return primaryRankedUsers.map((item) => item.user)
    }, [primaryRankedUsers])

    const usersPagination = usePagination({
        items: primaryUsersToRender,
        pageSize: 12,
        resetKey: `${searchQuery}-${selectedMerchantClassification}-${selectedPropertyType}-${selectedCategory}-${activeZone || ''}`,
    })

    const hasActiveFilters =
        selectedPropertyType !== 'all' ||
        selectedMerchantClassification !== 'all' ||
        selectedCategory !== '' ||
        activeZone !== null ||
        !!searchQuery.trim()

    const handleClearAllFilters = () => {
        setSelectedPropertyType('all')
        setSelectedMerchantClassification('all')
        setSelectedCategory('')
        setActiveZone(null)
        setActiveMpioCode(null)
        setActiveMpioName(null)
        setSearchQuery('')
        // Limpiar búsqueda URL-driven navegando a la ruta base
        if (effectiveKeyword) {
            navigate('/app/portal-servicios')
        }
    }

    const activeFilterChips = useMemo(() => {
        const chips: ActiveFilterChip[] = []
        if (searchQuery.trim()) {
            chips.push({
                label: `Búsqueda: ${searchQuery.trim()}`,
                color: 'primary',
                onDelete: () => {
                    setSearchQuery('')
                    if (effectiveKeyword) {
                        navigate('/app/portal-servicios')
                    }
                },
            })
        }
        if (selectedPropertyType !== 'all') {
            chips.push({
                label: `Inmueble: ${PROPERTY_TYPE_METADATA[selectedPropertyType]?.label || selectedPropertyType}`,
                color: 'primary',
                onDelete: () => setSelectedPropertyType('all'),
            })
        }
        if (selectedMerchantClassification !== 'all') {
            chips.push({
                label: `Estructura: ${
                    PUBLIC_MERCHANT_FILTERS.find((f) => f.id === selectedMerchantClassification)?.label ||
                    selectedMerchantClassification
                }`,
                color: 'secondary',
                onDelete: () => setSelectedMerchantClassification('all'),
            })
        }
        if (selectedCategory) {
            chips.push({
                label: `Categoría: ${
                    ListadoCategorias.find((c: { key: number; label: string }) => String(c.key) === selectedCategory)
                        ?.label || selectedCategory
                }`,
                color: 'info',
                onDelete: () => setSelectedCategory(''),
            })
        }
        if (activeZone) {
            chips.push({
                label: `Zona: ${activeMpioName || (zoneNames[activeZone] ?? activeZone)}`,
                color: 'default',
                onDelete: () => {
                    setActiveZone(null)
                    setActiveMpioCode(null)
                    setActiveMpioName(null)
                },
            })
        }
        return chips
    }, [searchQuery, effectiveKeyword, selectedPropertyType, selectedMerchantClassification, selectedCategory, activeZone, activeMpioName])

    const isHighFormalityProperty =
        selectedPropertyType === 'propiedad_horizontal' ||
        selectedPropertyType === 'inmobiliaria' ||
        selectedPropertyType === 'aliado_estrategico'

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
                        <HandymanIcon sx={{ fontSize: 32, color: 'primary.main' }} />
                        <Typography variant="h4" fontWeight={800} sx={{ color: '#0A2540' }}>
                            Directorio de Profesionales
                        </Typography>
                    </Box>
                    <Typography variant="body1" color="text.secondary">
                        ¿Buscas una cotización? publícala en el directorio de requerimientos{' '}
                        <Link
                            href="/nuevo-proyecto"
                            className={clsx(styles.Link, styles.Green)}
                            style={{ fontWeight: 700, textDecoration: 'underline' }}
                        >
                            Publica un proyecto
                        </Link>
                    </Typography>
                </Box>

                <Button
                    variant="contained"
                    className="btn-primary"
                    startIcon={<PersonAddAlt1Icon />}
                    onClick={handleOpenRecommendModal}
                    sx={{
                        textTransform: 'none',
                        borderRadius: 2,
                        px: 2.5,
                        py: 1.2,
                        fontWeight: 700,
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                    }}
                >
                    Recomendar un profesional
                </Button>
            </Box>

            {/* Filter & View Controls (unified Paper matching tiendas pattern) */}
            <DirectoryFilterBar
                searchQuery={searchQuery}
                onSearchChange={(val) => setSearchQuery(val)}
                searchPlaceholder="Buscar categoría, comerciante o palabra clave..."
                searchGridMd={3.5}
                dropdowns={[
                    {
                        label: 'Tipo de Inmueble',
                        value: selectedPropertyType,
                        onChange: (val) => setSelectedPropertyType(val as PropertyTypeId | 'all'),
                        options: PROPERTY_FILTER_OPTIONS.map((opt) => ({
                            id: opt.id,
                            label: opt.label,
                        })),
                        allLabel: 'Todos los Inmuebles',
                        allValue: 'all',
                        gridMd: 2.5,
                    },
                    {
                        label: 'Tamaño de Operación',
                        value: selectedMerchantClassification,
                        onChange: setSelectedMerchantClassification,
                        options: PUBLIC_MERCHANT_FILTERS.map((filter) => ({
                            id: filter.id,
                            label: filter.label,
                        })),
                        allLabel: 'Todos los Perfiles',
                        allValue: 'all',
                        gridMd: 2.5,
                    },
                    {
                        label: 'Filtrar por Zona',
                        value: activeZone || '',
                        onChange: () => {},
                        options: [],
                        gridMd: 2.5,
                        customRender: () => (
                            <DirectoryZoneFilter
                                activeZone={activeZone}
                                activeMpioCode={activeMpioCode}
                                activeMpioName={activeMpioName}
                                onChange={(zone, code, name) => {
                                    setActiveZone(zone)
                                    setActiveMpioCode(code || null)
                                    setActiveMpioName(name || null)
                                }}
                            />
                        ),
                    },
                ]}
                categoryChips={{
                    categories: ListadoCategorias,
                    selectedKey: selectedCategory,
                    onSelect: setSelectedCategory,
                }}
                hasActiveFilters={hasActiveFilters}
                onClearAll={handleClearAllFilters}
                sx={{ mb: 3 }}
            />

            {/* Active Search Context Summary Bar */}
            <ActiveFiltersBar
                visible={hasActiveFilters}
                chips={activeFilterChips}
                onResetAll={handleClearAllFilters}
                sx={{ mb: 3 }}
            />

            {/* High Formality Property Legal / Accounting Advisory */}
            {isHighFormalityProperty && (
                <Box sx={{ mb: 3 }}>
                    <Alert
                        severity="info"
                        icon={<InfoOutlinedIcon />}
                        sx={{
                            borderRadius: 3,
                            fontSize: '0.85rem',
                            border: '1px solid #bae6fd',
                            bgcolor: '#f0f9ff',
                            color: '#0369a1',
                        }}
                    >
                        <strong>Aviso informativo:</strong> Los profesionales independientes suelen trabajar
                        bajo cuenta de cobro, mientras que muchas propiedades horizontales y empresas requieren
                        factura electrónica y pólizas. Puedes contactarlos y acordar las condiciones directamente.
                    </Alert>
                </Box>
            )}

            <Box sx={{ mb: 2 }}>
                <Typography variant="h5" fontWeight={800} sx={{ color: '#0A2540', mb: 0.5 }}>
                    {searchQuery.trim()
                        ? `Resultados de búsqueda para: "${searchQuery.trim()}"`
                        : effectiveKeyword
                          ? `Resultados de búsqueda para: "${effectiveKeyword}"`
                          : selectedPropertyType !== 'all'
                            ? `Profesionales afines a ${PROPERTY_TYPE_METADATA[selectedPropertyType]?.label || selectedPropertyType}`
                            : 'Todos los profesionales'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Directorio de comerciantes calificados, contratistas independientes y empresas del sector.
                    <br />
                    Encuentra todo lo mejor en asistencia técnica con afinidad a tu tipo de proyecto.
                </Typography>
            </Box>

            <Suspense fallback={<PortalSkeleton />}>
                        <section className={styles['directory-wrapper']}>
                            {primaryUsersToRender && primaryUsersToRender.length > 0 ? (
                                usersPagination.pageItems.map((user) => {
                                    const ranked = primaryRankedUsers.find(
                                        (r) =>
                                            (r.user.userId || (r.user as unknown as { uid?: string }).uid) ===
                                            (user.userId || (user as unknown as { uid?: string }).uid)
                                    )
                                    return (
                                        <UserCard
                                            key={user.userId || (user as unknown as { uid?: string }).uid}
                                            {...user}
                                            compatibilityBadge={ranked?.match.badgeText}
                                            compatibilityExplanation={ranked?.match.explanation}
                                        />
                                    )
                                })
                            ) : (
                                <div style={{ gridColumn: '1 / -1', padding: '2rem 1rem', textAlign: 'center' }}>
                                    <Typography className="type-body" fontSize={'1.1rem'} color="text.secondary">
                                        {effectiveKeyword
                                            ? `No se encontraron comerciantes o empresas que coincidan con "${effectiveKeyword}".`
                                            : 'No se encontraron profesionales con afinidad prioritaria para los filtros seleccionados.'}
                                    </Typography>
                                    {complementaryUsers.length > 0 && (
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => setShowComplementary(true)}
                                            sx={{ mt: 2, borderRadius: 20, textTransform: 'none' }}
                                        >
                                            Ver {complementaryUsers.length} perfiles de otras estructuras operativas
                                        </Button>
                                    )}
                                    <Box sx={{ mt: 2.5 }}>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            startIcon={<PersonAddAlt1Icon />}
                                            onClick={handleOpenRecommendModal}
                                            sx={{
                                                borderRadius: '50px',
                                                textTransform: 'none',
                                                fontWeight: 700,
                                            }}
                                        >
                                            ¿No encuentras a tu maestro o profesional de confianza? Recomiéndalo
                                        </Button>
                                    </Box>
                                </div>
                            )}
                        </section>

                        {/* Pagination Bar for Primary Profiles */}
                        <Box sx={{ px: 3 }}>
                            <PaginationBar
                                page={usersPagination.page}
                                totalPages={usersPagination.totalPages}
                                totalItems={usersPagination.totalItems}
                                onPageChange={usersPagination.goToPage}
                                itemLabel="profesionales"
                            />
                        </Box>

                        {/* Complementary Profiles Section ("También podrían atenderte") */}
                        {complementaryUsers.length > 0 && (
                            <Box
                                sx={{
                                    mt: 4,
                                    mx: 2,
                                    p: 2.5,
                                    borderRadius: 3,
                                    border: '1px dashed #cbd5e1',
                                    bgcolor: '#fafafa',
                                }}
                            >
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        gap: 2,
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                        <PeopleAltOutlinedIcon sx={{ color: 'text.secondary' }} />
                                        <div>
                                            <Typography variant="subtitle1" fontWeight={700}>
                                                También podrían atenderte ({complementaryUsers.length} perfiles
                                                disponibles)
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                Profesionales con estructura operativa alternativa para este tipo de
                                                inmueble que están dispuestos a cotizar.
                                            </Typography>
                                        </div>
                                    </Box>

                                    <Button
                                        variant="outlined"
                                        size="small"
                                        onClick={() => setShowComplementary((prev) => !prev)}
                                        endIcon={
                                            showComplementary ? (
                                                <KeyboardArrowUpIcon />
                                            ) : (
                                                <KeyboardArrowDownIcon />
                                            )
                                        }
                                        sx={{
                                            borderRadius: 20,
                                            textTransform: 'none',
                                            fontWeight: 600,
                                        }}
                                    >
                                        {showComplementary ? 'Ocultar perfiles complementarios' : 'Ver perfiles'}
                                    </Button>
                                </Box>

                                <Collapse in={showComplementary}>
                                    <Divider sx={{ my: 2 }} />
                                    <div className={styles['directory-wrapper']} style={{ marginTop: '1rem' }}>
                                        {complementaryUsers.map((item) => (
                                            <UserCard
                                                key={
                                                    item.user.userId ||
                                                    (item.user as unknown as { uid?: string }).uid
                                                }
                                                {...item.user}
                                                compatibilityBadge={item.match.badgeText}
                                                compatibilityExplanation={item.match.explanation}
                                            />
                                        ))}
                                    </div>
                                </Collapse>
                            </Box>
                        )}
                    </Suspense>

            {recommendModalOpen && (
                <Suspense fallback={null}>
                    <PreRegistrationModal
                        open={recommendModalOpen}
                        onClose={() => setRecommendModalOpen(false)}
                        initialCategoryKey={effectiveKeyword || null}
                    />
                </Suspense>
            )}
        </Container>
    )
}
