import { useState, useEffect, Suspense } from 'react'
import clsx from 'clsx'
import { Link } from '@hooks'
import { usePageContext } from '@hooks/usePageContext'
import { SearchBar } from '@components/layout'
import { getUsers } from '@services/users' // Assuming this is correct
import { searchByCategories } from '@services/search' // Changed import
import { UserCard } from '@features/profile'
// UI Libs
import { Row, Col, Container } from 'react-bootstrap'
import { Box, Chip, Skeleton, Stack, Typography, FormControl, Select, MenuItem } from '@mui/material'
import FilterListIcon from '@mui/icons-material/FilterList'
// Types
import type { UserFirestoreDocument } from '@services/types'

// Styles
import styles from '@features/profile/styles/ProfessionalDirectory.module.scss'

const PortalSkeleton = () => {
    // Render a grid of skeletons to match the layout
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

export default function Page() {
    const pageContext = usePageContext()
    const searchInput = pageContext.routeParams?.searchInput
    const spacedText = searchInput?.replace(/\+/g, ' ')
    const [isLoaded, setIsLoaded] = useState(false)
    const [searchData, setSearchData] = useState<SearchDataState>({})
    const [usersData, setUsersData] = useState<UserFirestoreDocument[]>([])
    const [selectedMerchantClassification, setSelectedMerchantClassification] = useState<string>('all')

    const fetchInitialUsers = async () => {
        try {
            // Role 2: Comerciantes Calificados based on legacy 'userSelectedRol = 2'
            const users = await getUsers(2 as any);
            if (users) {
                setUsersData(users as UserFirestoreDocument[]);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const fetchSearchResults = async (query: string) => {
        try {
            // Use searchByCategories to search in 'userCategories' array
            const results = await searchByCategories({
                query: '',
                categories: [query], // Pass the category as an array
            });

            if (results && results.users && results.users.length > 0) {
                setSearchData({
                    docSnap: results.users,
                });
            } else {
                console.log('No matching users found in search.');
                setSearchData({
                    docSnap: [],
                });
            }
            setIsLoaded(true);
        } catch (error) {
            console.error('Error searching users:', error);
            setIsLoaded(true);
        }
    }

    // search reloaded
    useEffect(() => {
        setIsLoaded(false)
    }, [searchInput])

    useEffect(() => {
        if (!isLoaded) {
            if (typeof searchInput === 'string' && spacedText) {
                fetchSearchResults(spacedText);
            }
        }
    }, [searchInput, isLoaded, spacedText])

    useEffect(() => {
        fetchInitialUsers();
    }, [])


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

    // Comprehensive search filter (Name, Company/Razón Social, Profession/Slogan, Description, Categories)
    const filterUserListByKeywordAndClassification = (list: UserFirestoreDocument[]) => {
        let result = list

        // 1. Keyword search (from SearchBar URL parameter)
        if (spacedText && spacedText.trim()) {
            const term = spacedText.trim().toLowerCase()
            result = result.filter((u) => {
                const name = (u.userName || '').toLowerCase()
                const razon = (u.userRazonSocial || '').toLowerCase()
                const prof = ((u as any).userProfession || '').toLowerCase()
                const desc = ((u as any).userDescription || '').toLowerCase()
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
            const selectedFilter = PUBLIC_MERCHANT_FILTERS.find(
                (f) => f.id === selectedMerchantClassification
            )
            if (selectedFilter) {
                result = result.filter((u) => {
                    const clas = (u.userClasification || '').toLowerCase()
                    return selectedFilter.matchTerms.some((t) => clas.includes(t))
                })
            }
        }

        return result
    }

    // Combine usersData and searchData.docSnap deduplicated by userId/uid
    const combinedUsers = Array.from(
        new Map(
            [...usersData, ...(searchData.docSnap || [])].map((u) => [u.userId || (u as any).uid || u.userMail, u])
        ).values()
    )

    const filteredUsersData = filterUserListByKeywordAndClassification(combinedUsers)

    return (
        <Container fluid className="p-0 h-100" style={{ overflowX: 'hidden' }}>
            <Row className="m-0 d-flex">
                <Col className="pt-4 pb-2 p-0">
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3 px-3">
                        <div>
                            <h1 className="type-hero-title mb-1">
                                Directorio de Profesionales
                            </h1>
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

                    <SearchBar initialValue={spacedText} />

                    {/* Comerciante Classification Filter Bar */}
                    <Box
                        sx={{
                            mt: 2.5,
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
                </Col>
            </Row>

            <Row className="m-0 w-100 pt-4 pb-4" style={{ overflow: 'hidden' }}>
                <Col xs={12} className="p-0">
                    <div className="pb-2 p-0 px-3">
                        <h3 className="type-section-title">
                            {spacedText
                                ? `Resultados de búsqueda para: "${spacedText}"`
                                : 'Todos los profesionales'}
                        </h3>
                    </div>
                    <p className="type-caption px-3">
                        Directorio de comerciantes calificados, contratistas
                        independientes y empresas del sector. <br />
                        Encuentra todo lo mejor en asistencia técnica!
                    </p>

                    <Suspense fallback={<PortalSkeleton />}>
                        <section className={styles['directory-wrapper']}>
                            {filteredUsersData && filteredUsersData.length > 0 ? (
                                filteredUsersData.map((user) => (
                                    <UserCard
                                        key={user.userId || user.uid}
                                        {...user}
                                    />
                                ))
                            ) : (
                                <div style={{ gridColumn: '1 / -1', padding: '2rem 1rem' }}>
                                    <Typography className="type-body" fontSize={'1.1rem'} color="text.secondary">
                                        {spacedText
                                            ? `No se encontraron comerciantes o empresas que coincidan con "${spacedText}".`
                                            : 'No se encontraron profesionales para el nivel de clasificación seleccionado.'}
                                    </Typography>
                                </div>
                            )}
                        </section>
                    </Suspense>
                </Col>
            </Row>
        </Container>
    )
}

