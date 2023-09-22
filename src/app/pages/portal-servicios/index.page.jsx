export { Page }
export { LayoutAppPaperbase as Layout} from '#@/app/components/LayoutAppPaperbase'

// Pagina de Usuario - Portal_Servicios
import React, { useState, useEffect } from 'react'
import { navigate } from 'vite-plugin-ssr/client/router'
import { firestore } from '#@/firebase/firebaseClient' // storage,
import { collection } from 'firebase/firestore'
import { usePageContext } from '#R/usePageContext'

import { doSearchFromFirestore } from '#@/services/doSearchFromFirestore.service'
import { readUsersFromFirestore } from '#@/services/readUsersFromFirestore.service'
import { sharingInformationService } from '#@/services/sharing-information'

// import { ref, getDownloadURL } from 'firebase/storage'
import { UserCard } from '#@/app/components/UserCard'
// react-bootrstrap
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'

const Page = (props) => {
    const pageContext = usePageContext()
    const searchInput = pageContext.routeParams.searchInput // ['*']
    const [isLoaded, setIsLoaded] = useState(false)
    console.log('portal-servicios', searchInput)
    
    // const _storage = storage
    const _firestore = firestore

    // const usersRef = collection(_firestore, 'users')
    const usersComCalRef = collection(
        _firestore,
        'usersComerciantesCalificados'
    )
    const [searchData, setSearchData] = useState({})
    const [usersData, setUsersData] = useState({})

    const FromUsersComerciantes = () => {
        const userSelectedRol = 2 // Solo comerciantes calificados
        readUsersFromFirestore({
            userSelectedRol,
        })
    }

    const userSearch = (searchInput) => {
        doSearchFromFirestore({
            searchInput,
        })
    }

    useEffect(() => {
        if (!isLoaded) {
        if (typeof searchInput !== 'undefined') {
            userSearch(searchInput)
            const consultedData = sharingInformationService.getSubject()
            consultedData
                .subscribe((docSnap) => {
                    if (docSnap) {
                        const { search } = docSnap
                        console.log('docSnap', search)
                        setSearchData({
                            docSnap: search,
                        })
                        setIsLoaded(true)
                    } else {
                        console.log(
                            'No se encontro información para la busqueda en la colleccion usuarios!'
                        )
                        setSearchData({
                            docSnap: [],
                        })
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
                // console.log('FromUsersComerciantes', users)
                setUsersData(users)
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
                    </Col>
                    {searchInput ? (
                        <Row className="">
                            <p className="body-1">
                                Busqueda Local Servicios: Buscar comerciantes
                                Calificados
                            </p>
                            <Row className="pt-2 p-0">
                                {searchData.docSnap ? (
                                    searchData.docSnap.map((user) => (
                                        <UserCard
                                            key={user.id}
                                            props={user}
                                            className=""
                                        ></UserCard>
                                    ))
                                ) : (
                                    <>
                                        No se encontraron resultados de la
                                        busqueda!
                                    </>
                                )}
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
                        <p className="body-2">
                            Directorio de comerciantes calificados, contratistas
                            independientes y empresas del sector. <br />
                            Encuentra todo lo mejor en asisitencia técnica!
                        </p>

                        <Row className="m-0 w-100 d-flex">
                            {usersData && usersData.length > 0 ? (
                                usersData.map((user) => (
                                    <UserCard
                                        key={user.id}
                                        props={user}
                                        className=""
                                    ></UserCard>
                                ))
                            ) : (
                                <></>
                            )}
                        </Row>
                    </Col>
                </Row>
            </Container>
        </>
    )
}
