export { Layout } from '#@/app/components/LayoutAppPaperbase'
// Now this page is a Prerender Function, meaning that it will be cached on Edge network for 15 seconds.
// Check official documentation for further details on how it works.
// ISR is not supported when using route function
// export { isr }
// const isr = { expiration: 15 }

// Pagina de Usuario - Portal_Servicios
import React, { useState, useEffect, Suspense } from 'react'
import { navigate } from 'vike/client/router'
import { usePageContext } from '#R/usePageContext'
import SearchBar from '#@/app/components/SearchBar'

import doSearchFromFirestore from '#@/services/doSearchFromFirestore.service'
import readUsersFromFirestore from '#@/services/readUsersFromFirestore.service'
import { sharingInformationService } from '#@/services/sharing-information'

// import { ref, getDownloadURL } from 'firebase/storage'
import UserCard from '#@/app/components/UserCard'
// react-bootrstrap
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import Skeleton from '@mui/material/Skeleton'
import Stack from '@mui/material/Stack'
import { Typography } from '@mui/material'

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

const Page = (props) => {
    const pageContext = usePageContext()
    const searchInput = pageContext?.routeParams.searchInput // ['*']
    const spacedText = searchInput?.replace(/\+/g, ' ')
    // const urlPathname = pageContext?.urlPathname
    const [isLoaded, setIsLoaded] = useState(false)

    const [searchData, setSearchData] = useState({})
    const [usersData, setUsersData] = useState({})

    const FromUsersComerciantes = () => {
        const userSelectedRol = 2 // Solo comerciantes calificados
        readUsersFromFirestore({
            userSelectedRol,
        })
    }

    const userSearch = (searchInput) => {
        doSearchFromFirestore({ searchInput })
    }

    // search reloaded
    useEffect(() => {
        setIsLoaded(false)
    }, [searchInput])

    useEffect(() => {
        if (!isLoaded) {
            console.log('portal-servicios', searchInput, isLoaded)
            if (typeof searchInput === 'string') {
                userSearch(spacedText)
                const consultedData = sharingInformationService.getSubject()
                consultedData.subscribe((docSnap) => {
                    if (docSnap) {
                        const { search } = docSnap
                        if (search?.length > 0) {
                            console.log('docSnapSearch', search)
                            setSearchData({
                                docSnap: search,
                            })
                        } else {
                            console.log(
                                'No se encontro información para la busqueda en la colleccion usuarios!'
                            )
                            setSearchData({
                                docSnap: [],
                            })
                        }
                        setIsLoaded(true)
                    }
                })
                // .catch((error) => {
                //     console.log(error)
                // })
            }
        }
    }, [searchInput, isLoaded])

    // console.log('SearchData', searchData)

    useEffect(() => {
        FromUsersComerciantes()
        const userData = sharingInformationService.getSubject()
        userData.subscribe((data) => {
            if (data) {
                const { users } = data
                if (users) {
                    // console.log('FromUsersComerciantes', users)
                    setUsersData(users)
                }
            } else {
                console.log(
                    'No se encontro información sobre esta collección de usuarios!'
                )
            }
        })
    }, [])

    const handleNewProject = () => {
        navigate('/nuevo-proyecto')
    }

    return (
        <>
            <Container fluid className="p-0 h-100">
                <Row className="m-0 w-100 d-flex">
                    <Col className="pt-4 pb-2 p-0">
                        <h2 className="headline-xl">
                            Directorio Profesionales{'  '}
                            <Button
                                className="body-1 ms-4 btn-round btn-high"
                                onClick={handleNewProject}
                            >
                                Publica un proyecto gratis
                            </Button>
                        </h2>
                        <SearchBar></SearchBar>
                    </Col>
                    {searchInput ? (
                        <Row className="">
                            <Typography className="body-1">
                                {/* Busqueda Local Servicios: <br /> */}
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
                                                key={user.id}
                                                props={user}
                                                className=""
                                            ></UserCard>
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
                    ) : (
                        <></>
                    )}
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
                                            key={user.id}
                                            props={user}
                                            className=""
                                        ></UserCard>
                                    ))}
                            </Suspense>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default Page
