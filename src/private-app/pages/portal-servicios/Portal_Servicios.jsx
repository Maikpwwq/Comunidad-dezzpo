// Pagina de Usuario - Portal_Servicios
import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { firestore } from '../../../firebase/firebaseClient' // storage,
import { collection, getDocs, query, where } from 'firebase/firestore'
// import { ref, getDownloadURL } from 'firebase/storage'

import DraftCard from '../../components/DraftCard'
import UserCard from '../../components/UserCard'

// react-bootrstrap
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
// import Table from '@mui/material/Table'
// import TableHead from '@mui/material/TableHead'
// import TableBody from '@mui/material/TableBody'
// import TableRow from '@mui/material/TableRow'
// import TableCell from '@mui/material/TableCell'

const Portal_Servicios = (props) => {
    const { state } = useLocation()
    // console.log(state.searchInput)
    // const _storage = storage
    const _firestore = firestore
    const queryRef = query(
        collection(_firestore, 'users'),
        where('userRazonSocial', '==', state.searchInput)
    )
    const draftRef = collection(_firestore, 'drafts')
    const usersRef = collection(_firestore, 'users')
    const [searchData, setSearchData] = useState({})
    const [usersData, setUsersData] = useState({})
    const [draftsData, setDraftsData] = useState({})

    const searchFromFirestore = async () => {
        try {
            const searchUsers = await getDocs(queryRef)
            return searchUsers
        } catch (err) {
            console.log(
                'Error al obtener los datos de busqueda en la colleccion users: ',
                err
            )
        }
    }

    const usersFromFirestore = async () => {
        try {
            const userData = await getDocs(usersRef)
            return userData
        } catch (err) {
            console.log(
                'Error al obtener los datos de la colleccion users: ',
                err
            )
        }
    }

    const draftsFromFirestore = async () => {
        try {
            const draftData = await getDocs(draftRef)
            return draftData
        } catch (err) {
            console.log(
                'Error al obtener los datos de la colleccion users: ',
                err
            )
        }
    }

    useEffect(() => {
        searchFromFirestore()
            .then((docSnap) => {
                if (docSnap) {
                    const data = docSnap.docs.map((element) => ({
                        ...element.data(),
                    }))
                    setSearchData({
                        data,
                    })
                } else {
                    console.log(
                        'No se encontro información para la busqueda en la colleccion usuarios!'
                    )
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }, [state.searchInput])

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
        draftsFromFirestore()
            .then((docSnap) => {
                if (docSnap) {
                    const data = docSnap.docs.map((element) => ({
                        ...element.data(),
                    }))
                    setDraftsData({
                        data,
                    })
                } else {
                    console.log(
                        'No se encontro información en la colleccion proyectos!'
                    )
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }, [])

    console.log(searchData)

    return (
        <>
            <Container fluid className="p-0 h-100">
                <Row className="m-0 w-100 d-flex">
                    <Row>
                        {state.searchInput ? (
                            <Col>
                                {searchData.data ? (
                                    searchData.data.map((user) => (
                                        <UserCard
                                            key={user.id}
                                            props={user}
                                            className=""
                                        ></UserCard>
                                    ))
                                ) : (
                                    <>
                                        No se encontraron resultados de la
                                        busqueda
                                    </>
                                )}
                            </Col>
                        ) : (
                            <></>
                        )}
                    </Row>

                    <Col className="col-10 p-4">
                        <h2 className="headline-xl">
                            Busqueda Local Servicios: Buscar comerciantes
                            Calificados
                        </h2>
                        <p className="body-2"> Comerciantes profesionales </p>
                        <p className="body-1">Publica un proyecto gratis</p>
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
                                <UserCard className=""></UserCard>
                            )}
                        </Row>
                        {/* <Col className="col-10 p-4">
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Miembro</TableCell>
                                        <TableCell>
                                            Oferta de Servicios
                                        </TableCell>
                                        <TableCell>Certificaciones</TableCell>
                                        <TableCell>Calificaciones</TableCell>
                                        <TableCell>Se unio el</TableCell>
                                        <TableCell>Ubicación</TableCell>
                                        <TableCell>Contactar</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>DATA...</TableCell>
                                        <TableCell>DATA...</TableCell>
                                        <TableCell>DATA...</TableCell>
                                        <TableCell>DATA...</TableCell>
                                        <TableCell>DATA...</TableCell>
                                        <TableCell>DATA...</TableCell>
                                        <TableCell>DATA...</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </Col> */}
                    </Col>
                </Row>
                <Row className="m-0 w-100 d-flex">
                    <Col className="p-4">
                        <span>
                            <h2 className="headline-xl">
                                Buscar Requerimientos: Obtener o Aplicar con
                                Cotizaciones
                            </h2>
                        </span>
                        <p className="body-2">Proyectos activos </p>
                        <p className="body-1">Aplica a un Proyecto Gratis</p>
                        <Row className="m-0 w-100 d-flex">
                            {draftsData.data ? (
                                draftsData.data.map((draft) => (
                                    <DraftCard
                                        key={draft.id}
                                        props={draft}
                                        className=""
                                    ></DraftCard>
                                ))
                            ) : (
                                <DraftCard className=""></DraftCard>
                            )}
                        </Row>
                        {/* <Col className="col-10 p-4">
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Imagenes</TableCell>
                                        <TableCell>Descripción</TableCell>
                                        <TableCell>
                                            Fecha de Publicación
                                        </TableCell>
                                        <TableCell>Valor Aproximado</TableCell>
                                        <TableCell>Se unio el</TableCell>
                                        <TableCell>Ubicación</TableCell>
                                        <TableCell>Postular</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>DATA...</TableCell>
                                        <TableCell>DATA...</TableCell>
                                        <TableCell>DATA...</TableCell>
                                        <TableCell>DATA...</TableCell>
                                        <TableCell>DATA...</TableCell>
                                        <TableCell>DATA...</TableCell>
                                        <TableCell>DATA...</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </Col> */}
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default Portal_Servicios
