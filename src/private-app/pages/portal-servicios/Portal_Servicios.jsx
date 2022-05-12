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
// import Table from '@mui/material/Table'
// import TableHead from '@mui/material/TableHead'
// import TableBody from '@mui/material/TableBody'
// import TableRow from '@mui/material/TableRow'
// import TableCell from '@mui/material/TableCell'

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
            const queryRef = query(
                usersComCalRef,
                where('userRazonSocial', '==', searchInput)
            )
            const searchUsers = await getDocs(queryRef)
            return searchUsers
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
    }, [searchInput])

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

    console.log(searchData)

    return (
        <>
            <Container fluid className="p-0 h-100">
                <Row className="m-0 w-100 d-flex">
                    <Row>
                        {searchInput ? (
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

                    <Col className="pt-4 pb-4 p-0">
                        <h2 className="headline-xl">
                            Directorio Profesionales
                            <Button
                                className="body-1"
                                onClick={handleNewProject}
                            >
                                Publica un proyecto gratis
                            </Button>
                        </h2>
                        <h3 className="headline-l">
                            Busqueda Local Servicios: Buscar comerciantes
                            Calificados
                        </h3>
                        <p className="body-2"> Comerciantes profesionales </p>

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
            </Container>
        </>
    )
}

export default Portal_Servicios
