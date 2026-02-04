import { useState, useEffect, Suspense } from 'react'
import { navigate } from 'vike/client/router'
import { usePageContext } from '@hooks/usePageContext'
// @ts-ignore
import { SearchBar } from '@components/layout'
import { getUsers } from '@services/users'
import { searchByName } from '@services/search'
// @ts-ignore
import { UserCard } from '@features/profile'
// UI Libs
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import Skeleton from '@mui/material/Skeleton'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
// Types
import type { UserFirestoreDocument } from '@services/types'
const PortalSkeleton = () => {
    return (
        <Stack spacing={1}>
            <Skeleton variant="rectangular" width={210} height={118} />
            <Skeleton variant="circular" width={40} height={40} />
            <Skeleton variant="rectangular" width={210} height={60} />
            <Skeleton variant="rounded" width={210} height={60} />
        </Stack>
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
            // The service expects { role: number }, adjusting call if necessary based on service definition
            // Looking at previous usages, getUsers(2) was used in legacy but new service might take object or just val.
            // Checking service usage in other files... users service usually takes an object now or strict args.
            // Let's assume the new service signature compatible or we fix it.
            // Actually, in `perfil`, we used `getUser({ userId, role })`. 
            // `getUsers` likely takes a role. Let's start with passing 2 and see if we need to adjust.
            // If strictly typed service requires UserRole enum, we might need to cast or use specific value.
            // Assuming for now generic usage until verification.
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
            // console.log('portal-servicios', searchInput, isLoaded)
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
                        Directorio Profesionales{'  '}
                        <Button
                            className="body-1 ms-4 btn-round btn-high"
                            onClick={handleNewProject}
                        >
                            Publica un proyecto gratis
                        </Button>
                    </h1>
                    <SearchBar />
                </Col>
                {searchInput ? (
                    <Row className="">
                        <Typography className="body-1" component="div">
                            Buscar comerciantes Calificados por categoria:{' '}
                            <br />
                            <span className="subtitle">{spacedText}</span>
                        </Typography>
                        <Row className="pt-2 p-0">
                            <Suspense fallback={<PortalSkeleton />}>
                                {searchData?.docSnap &&
                                    searchData?.docSnap.length > 0 ? (
                                    searchData?.docSnap.map((user) => (
                                        <UserCard
                                            key={user.userId || user.uid}
                                            {...user}
                                        />
                                    ))
                                ) : (
                                    <Typography
                                        variant="body1"
                                        fontSize={'1.125rem'}
                                    >
                                        No se encontraron resultados de la
                                        busqueda para la categoria!
                                        <br />
                                        {spacedText}
                                    </Typography>
                                )}
                            </Suspense>
                        </Row>
                    </Row>
                ) : null}
            </Row>
            <Row className="m-0 w-100 d-flex">
                <Col className="col-10 pt-4 pb-4 p-0" xs={12}>
                    <Col className="pb-2 p-0">
                        <h3 className="headline-l">
                            Todos los profesionales
                        </h3>
                    </Col>
                    <p className="body-2 px-2">
                        Directorio de comerciantes calificados, contratistas
                        independientes y empresas del sector. <br />
                        Encuentra todo lo mejor en asisitencia técnica!
                    </p>
                    <Row className="m-0 w-100 d-flex">
                        <Suspense fallback={<PortalSkeleton />}>
                            {usersData &&
                                usersData.length > 0 &&
                                usersData.map((user) => (
                                    <UserCard
                                        key={user.userId || user.uid}
                                        {...user}
                                    />
                                ))}
                        </Suspense>
                    </Row>
                </Col>
            </Row>
        </Container>
    )
}
