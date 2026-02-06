import { useState, useEffect, Suspense } from 'react'
import { navigate } from 'vike/client/router'
import { usePageContext } from '@hooks/usePageContext'
import { SearchBar } from '@components/layout'
import { getUsers } from '@services/users'
import { searchByName } from '@services/search'
import { UserCard } from '@features/profile'
// UI Libs
import { Row, Col, Container, Button } from 'react-bootstrap'
import { Skeleton, Stack, Typography } from '@mui/material'
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
            const results = await searchByName(query);
            if (results && results.length > 0) {
                setSearchData({
                    docSnap: results as UserFirestoreDocument[],
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

    const handleNewProject = () => {
        navigate('/nuevo-proyecto')
    }

    return (
        <Container fluid className="p-0 h-100">
            <Row className="m-0 w-100 d-flex">
                <Col className="pt-4 pb-2 p-0">
                    <h1 className="type-hero-title">
                        Directorio de Profesionales{'  '}
                        <Button
                            className="type-body ms-4 btn-round btn-high"
                            onClick={handleNewProject}
                        >
                            Publica un proyecto
                        </Button>
                    </h1>
                    <SearchBar />
                </Col>
                {searchInput ? (
                    <Row className="">
                        <Typography className="type-body" component="div">
                            Buscar comerciantes Calificados por categoria:{' '}
                            <br />
                            <span className="headline-s">{spacedText}</span>
                        </Typography>

                        <Suspense fallback={<PortalSkeleton />}>
                            <section className={styles['directory-wrapper']}>
                                {searchData?.docSnap &&
                                    searchData?.docSnap.length > 0 ? (
                                    searchData?.docSnap.map((user) => (
                                        <UserCard
                                            key={user.userId || user.uid}
                                            {...user}
                                        />
                                    ))
                                ) : (
                                    <div style={{ gridColumn: '1 / -1' }}>
                                        <Typography
                                            className="type-body"
                                            fontSize={'1.125rem'}
                                        >
                                            No se encontraron resultados de la
                                            busqueda para la categoria!
                                            <br />
                                            {spacedText}
                                        </Typography>
                                    </div>
                                )}
                            </section>
                        </Suspense>
                    </Row>
                ) : null}
            </Row>

            <section className="col-12 pt-4 pb-4 p-0">
                <div className="pb-2 p-0">
                    <h3 className="type-section-title">
                        Todos los profesionales
                    </h3>
                </div>
                <p className="type-body-sm px-2">
                    Directorio de comerciantes calificados, contratistas
                    independientes y empresas del sector. <br />
                    Encuentra todo lo mejor en asisitencia técnica!
                </p>

                <Suspense fallback={<PortalSkeleton />}>
                    <section className={styles['directory-wrapper']}>
                        {usersData &&
                            usersData.length > 0 &&
                            usersData.map((user) => (
                                <UserCard
                                    key={user.userId || user.uid}
                                    {...user}
                                />
                            ))}
                    </section>
                </Suspense>
            </section>
        </Container>
    )
}

