// Pagina de Usuario - Portal_Servicios
import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { firestore } from '../../../firebase/firebaseClient' // storage,
import { collection, getDocs, query, where } from 'firebase/firestore'
// import { ref, getDownloadURL } from 'firebase/storage'
import UserCard from '../../components/UserCard'
// react-bootrstrap
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'

const Portal_Servicios = (props) => {
    const navigate = useNavigate()
    const { state } = useLocation() || {}
    const { searchInput } = state || ' '
    // console.log(state.searchInput)
    // const _storage = storage
    const _firestore = firestore

    // const usersRef = collection(_firestore, 'users')
    const usersComCalRef = collection(
        _firestore,
        'usersComerciantesCalificados'
    )
    const [searchData, setSearchData] = useState({})
    const [usersData, setUsersData] = useState({})

    const searchFromFirestore = async () => {
        try {
            // TODO: Refactor this query to search in categories from users profiles
            const response = []
            const queryRef = query(
                usersComCalRef,
                where('userCategories', 'array-contains-any', searchInput)
            )
            const searchUsers = await getDocs(queryRef)
            searchUsers.forEach((DOC) => {
                response.push(DOC.data())
            })
            return response
        } catch (err) {
            console.log(
                'Error al obtener los datos de busqueda en la colleccion Comerciantes Calificados: ',
                err
            )
        }
    }

    const usersFromFirestore = async () => {
        try {
            const userData = await getDocs(usersComCalRef)
            return userData
        } catch (err) {
            console.log(
                'Error al obtener los datos de la colleccion Comerciantes Calificados: ',
                err
            )
        }
    }

    useEffect(() => {
        if (typeof searchInput !== 'undefined') {
            const multileSearch = searchFromFirestore()
            multileSearch
                .then((docSnap) => {
                    if (docSnap && docSnap.length > 0) {
                        console.log('docSnap', docSnap)
                        setSearchData({
                            docSnap,
                        })
                    } else {
                        console.log(
                            'No se encontro información para la busqueda en la colleccion usuarios!'
                        )
                        setSearchData({
                            docSnap: [],
                        })
                    }
                })
                .catch((error) => {
                    console.log(error)
                })
        }
    }, [searchInput])

    console.log('SearchData', searchData)

    useEffect(() => {
        usersFromFirestore()
            .then((docSnap) => {
                if (docSnap) {
                    const data = docSnap.docs.map((element) => ({
                        ...element.data(),
                    }))
                    setUsersData({
                        data,
                    })
                } else {
                    console.log(
                        'No se encontro información en la colleccion usuarios!'
                    )
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }, [])

    const handleNewProject = () => {
        navigate('/nuevo-proyecto', { state: { auth: true } })
    }

    return (
        <>
            <Container fluid className="p-0 h-100">
                <Row className="m-0 w-100 d-flex">
                    <Col className="pt-4 pb-2 p-0">
                        <h2 className="headline-xl">
                            Directorio Profesionales
                            <Button
                                className="body-1 ms-4"
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
                            {' '}
                            Directorio de comerciantes calificados, contratistas
                            independientes y empresas del sector. <br />
                            Encuentra todo lo mejor en asisitencia técnica!
                        </p>

                        <Row className="m-0 w-100 d-flex">
                            {usersData.data ? (
                                usersData.data.map((user) => (
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

export default Portal_Servicios
