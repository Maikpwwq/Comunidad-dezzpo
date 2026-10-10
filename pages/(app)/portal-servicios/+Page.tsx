import { useState, useEffect, useMemo, Suspense } from 'react'
import clsx from 'clsx'
import { Link } from '@hooks'
import { usePageContext } from '@hooks/usePageContext'
import { SearchBar, PaginationBar } from '@components/layout'
import { usePagination } from '@hooks/usePagination'
import { getUsers } from '@services/users'
import { searchByCategories } from '@services/search'
import { UserCard } from '@features/profile'
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
import { Row, Col, Container } from 'react-bootstrap'
import {
    Box,
    Chip,
    Skeleton,
    Stack,
    Typography,
    FormControl,
    Select,
    MenuItem,
    Alert,
    Button,
    Collapse,
    Divider,
} from '@mui/material'
import FilterListIcon from '@mui/icons-material/FilterList'
import HomeWorkIcon from '@mui/icons-material/HomeWork'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import CloseIcon from '@mui/icons-material/Close'
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
    targetMunicipioCode?: string | null
): ZoneSignalType {
    if (!targetZone && !targetMunicipioCode) return 'no_zone_specified'
    if (!userLocation) return 'no_zone_specified'

    const cleanUser = userLocation.toLowerCase()
    if (targetZone === 'otra-zona' || targetMunicipioCode) {
        if (targetMunicipioCode && cleanUser.includes(targetMunicipioCode)) return 'same_zone'
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
    const [showComplementary, setShowComplementary] = useState(false)

    const effectiveKeyword = useMemo(() => {
        return (initialQueryContext.category || routeSpacedText).trim()
    }, [initialQueryContext.category, routeSpacedText])

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
        if (effectiveKeyword) {
            const term = effectiveKeyword.toLowerCase()
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

        return result
    }, [combinedUsers, effectiveKeyword, selectedMerchantClassification])

    // Fuzzy compatibility evaluation & partitioning
    const { primaryRankedUsers, complementaryUsers } = useMemo(() => {
        const resolvedProp = selectedPropertyType === 'all' ? null : normalizePropertyType(selectedPropertyType)
        const categoryFormality = resolveCategoryFormalityLevel(effectiveKeyword)

        const evaluated: RankedMerchant[] = prefilteredUsers.map((user) => {
            const userLoc = user.userCiudad || user.userDirection || ''
            const zoneSignal = resolveZoneProximitySignal(userLoc, activeZone, activeMpioCode)

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
        resetKey: `${effectiveKeyword}-${selectedMerchantClassification}-${selectedPropertyType}-${activeZone || ''}`,
    })

    const hasActiveFilters =
        selectedPropertyType !== 'all' ||
        selectedMerchantClassification !== 'all' ||
        activeZone !== null ||
        effectiveKeyword !== ''

    const handleClearAllFilters = () => {
        setSelectedPropertyType('all')
        setSelectedMerchantClassification('all')
        setActiveZone(null)
        setActiveMpioCode(null)
        setActiveMpioName(null)
    }

    const isHighFormalityProperty =
        selectedPropertyType === 'propiedad_horizontal' ||
        selectedPropertyType === 'inmobiliaria' ||
        selectedPropertyType === 'aliado_estrategico'

    return (
        <Container fluid className="p-0 h-100" style={{ overflowX: 'hidden' }}>
            <Row className="m-0 d-flex">
                <Col className="pt-4 pb-2 p-0">
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3 px-3">
                        <div>
                            <h1 className="type-hero-title mb-1">Directorio de Profesionales</h1>
                            <p className="type-body text-muted mb-0">
                                ¿Buscas una cotización? publícala en el directorio de requerimientos{' '}
                                <Link
                                    href="/nuevo-proyecto"
                                    className={clsx(styles.Link, styles.Green)}
                                    style={{ fontWeight: 700, textDecoration: 'underline' }}
                                >
                                    Publica un proyecto
                                </Link>
                            </p>
                        </div>
                    </div>

                    <SearchBar initialValue={effectiveKeyword} />

                    {/* Active Search Context Summary Bar */}
                    {hasActiveFilters && (
                        <Box
                            sx={{
                                mt: 2,
                                mx: 2,
                                p: 1.5,
                                borderRadius: 2.5,
                                bgcolor: '#ffffff',
                                border: '1px solid #e2e8f0',
                                display: 'flex',
                                flexWrap: 'wrap',
                                alignItems: 'center',
                                gap: 1,
                            }}
                        >
                            <Typography variant="caption" fontWeight={700} color="text.secondary">
                                Filtros activos:
                            </Typography>
                            {selectedPropertyType !== 'all' && (
                                <Chip
                                    size="small"
                                    label={`Inmueble: ${PROPERTY_TYPE_METADATA[selectedPropertyType]?.label || selectedPropertyType}`}
                                    onDelete={() => setSelectedPropertyType('all')}
                                    color="primary"
                                    variant="outlined"
                                    sx={{ fontWeight: 600 }}
                                />
                            )}
                            {activeZone && (
                                <Chip
                                    size="small"
                                    label={`Zona: ${activeMpioName || (zoneNames[activeZone] ?? activeZone)}`}
                                    onDelete={() => {
                                        setActiveZone(null)
                                        setActiveMpioCode(null)
                                        setActiveMpioName(null)
                                    }}
                                    color="info"
                                    variant="outlined"
                                    sx={{ fontWeight: 600 }}
                                />
                            )}
                            {selectedMerchantClassification !== 'all' && (
                                <Chip
                                    size="small"
                                    label={`Estructura: ${
                                        PUBLIC_MERCHANT_FILTERS.find((f) => f.id === selectedMerchantClassification)
                                            ?.label || selectedMerchantClassification
                                    }`}
                                    onDelete={() => setSelectedMerchantClassification('all')}
                                    color="secondary"
                                    variant="outlined"
                                    sx={{ fontWeight: 600 }}
                                />
                            )}
                            <Button
                                size="small"
                                onClick={handleClearAllFilters}
                                startIcon={<CloseIcon fontSize="small" />}
                                sx={{
                                    textTransform: 'none',
                                    fontSize: '0.78rem',
                                    ml: 'auto',
                                    color: '#dc2626',
                                    fontWeight: 600,
                                }}
                            >
                                Restablecer filtros
                            </Button>
                        </Box>
                    )}

                    {/* Property Type Selector Bar */}
                    <Box
                        sx={{
                            mt: 2,
                            mx: 2,
                            p: 2,
                            borderRadius: 3,
                            bgcolor: '#f1f5f9',
                            border: '1px solid #cbd5e1',
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                            <HomeWorkIcon sx={{ color: 'var(--brand-teal, #00897b)' }} />
                            <Typography variant="subtitle2" fontWeight={700} color="text.primary">
                                Filtrar por Tipo de Inmueble (Afinidad Operativa):
                            </Typography>
                        </Box>
                        {/* Mobile Property Type Selector */}
                        <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                            <FormControl fullWidth size="small">
                                <Select
                                    value={selectedPropertyType}
                                    onChange={(e) => setSelectedPropertyType(e.target.value as PropertyTypeId | 'all')}
                                    sx={{
                                        borderRadius: '20px',
                                        bgcolor: '#ffffff',
                                        fontSize: '0.9rem',
                                        fontWeight: 600,
                                    }}
                                >
                                    {PROPERTY_FILTER_OPTIONS.map((opt) => (
                                        <MenuItem key={opt.id} value={opt.id}>
                                            {opt.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                        {/* Desktop Property Type Chips */}
                        <Box sx={{ display: { xs: 'none', md: 'flex' }, flexWrap: 'wrap', gap: 1 }}>
                            {PROPERTY_FILTER_OPTIONS.map((opt) => {
                                const isSelected = selectedPropertyType === opt.id
                                return (
                                    <Chip
                                        key={opt.id}
                                        label={opt.label}
                                        onClick={() => setSelectedPropertyType(opt.id)}
                                        color={isSelected ? 'primary' : 'default'}
                                        variant={isSelected ? 'filled' : 'outlined'}
                                        sx={{
                                            fontWeight: 600,
                                            bgcolor: isSelected ? 'var(--brand-teal, #00897b)' : '#ffffff',
                                            color: isSelected ? '#ffffff' : 'text.primary',
                                        }}
                                    />
                                )
                            })}
                        </Box>
                    </Box>

                    {/* Merchant Classification Filter Bar */}
                    <Box
                        sx={{
                            mt: 2,
                            mx: 2,
                            p: 2,
                            borderRadius: 3,
                            bgcolor: 'var(--background-light-gray-color, #f8fafc)',
                            border: '1px solid #e2e8f0',
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                            <FilterListIcon sx={{ color: 'var(--brand-teal, #00897b)' }} />
                            <Typography variant="subtitle2" fontWeight={700} color="text.primary">
                                Filtrar por Tamaño de Operación / Estructura del Comerciante:
                            </Typography>
                        </Box>
                        {/* Mobile Selector Dropdown */}
                        <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                            <FormControl fullWidth size="small">
                                <Select
                                    value={selectedMerchantClassification}
                                    onChange={(e) => setSelectedMerchantClassification(e.target.value)}
                                    displayEmpty
                                    sx={{
                                        borderRadius: '20px',
                                        bgcolor: '#ffffff',
                                        fontSize: '0.9rem',
                                        fontWeight: 600,
                                    }}
                                >
                                    <MenuItem value="all">
                                        <em>Todos los Perfiles</em>
                                    </MenuItem>
                                    {PUBLIC_MERCHANT_FILTERS.map((filter) => (
                                        <MenuItem key={filter.id} value={filter.id}>
                                            {filter.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                        {/* Desktop Chips */}
                        <Box sx={{ display: { xs: 'none', md: 'flex' }, flexWrap: 'wrap', gap: 1 }}>
                            <Chip
                                label="Todos los Perfiles"
                                onClick={() => setSelectedMerchantClassification('all')}
                                color={selectedMerchantClassification === 'all' ? 'primary' : 'default'}
                                variant={selectedMerchantClassification === 'all' ? 'filled' : 'outlined'}
                                sx={{ fontWeight: 600 }}
                            />
                            {PUBLIC_MERCHANT_FILTERS.map((filter) => (
                                <Chip
                                    key={filter.id}
                                    label={filter.label}
                                    onClick={() => setSelectedMerchantClassification(filter.id)}
                                    color={selectedMerchantClassification === filter.id ? 'primary' : 'default'}
                                    variant={selectedMerchantClassification === filter.id ? 'filled' : 'outlined'}
                                    sx={{ fontWeight: 600 }}
                                />
                            ))}
                        </Box>
                    </Box>

                    {/* High Formality Property Legal / Accounting Advisory */}
                    {isHighFormalityProperty && (
                        <Box sx={{ mt: 2, mx: 2 }}>
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
                </Col>
            </Row>

            <Row className="m-0 w-100 pt-4 pb-4" style={{ overflow: 'hidden' }}>
                <Col xs={12} className="p-0">
                    <div className="pb-2 p-0 px-3">
                        <h3 className="type-section-title">
                            {effectiveKeyword
                                ? `Resultados de búsqueda para: "${effectiveKeyword}"`
                                : selectedPropertyType !== 'all'
                                  ? `Profesionales afines a ${PROPERTY_TYPE_METADATA[selectedPropertyType]?.label || selectedPropertyType}`
                                  : 'Todos los profesionales'}
                        </h3>
                    </div>
                    <p className="type-caption px-3">
                        Directorio de comerciantes calificados, contratistas independientes y empresas del sector.{' '}
                        <br />
                        Encuentra todo lo mejor en asistencia técnica con afinidad a tu tipo de proyecto.
                    </p>

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
                </Col>
            </Row>
        </Container>
    )
}
