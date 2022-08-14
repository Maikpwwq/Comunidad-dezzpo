// Pagina de Apendice de costos
import React, { useState, useEffect } from 'react'
import '../../../../public/assets/css/apendice_costos.css'
import { Link } from 'react-router-dom'
import { collection, doc, getDocs, setDoc } from 'firebase/firestore'
import { firestore } from '../../../firebase/firebaseClient'
// import AdministrarDB from './AdministrarDB' Usar para editar la base de datos firestore desde el XLSX
import ApendiceJson from './apendice-costos.json'

// react-bootrstrap
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'

const ApendiceCostos = () => {
    const [categoriaInfo, setCategoriaInfo] = useState([])
    const _firestore = firestore
    const categoriaRef = collection(_firestore, 'categoriasServicios')
    const subCategoriaRef = doc(categoriaRef, 'aPTAljOeD48FbniBg6Lw')

    const CategoriasA = collection(subCategoriaRef, 'Acabados en muros')
    const CategoriasB = collection(subCategoriaRef, 'Administraciones PH')
    const CategoriasC = collection(subCategoriaRef, 'Aislamiento acústico')
    const CategoriasD = collection(subCategoriaRef, 'Albañilería')
    const CategoriasE = collection(subCategoriaRef, 'Arquitectura')
    const CategoriasF = collection(subCategoriaRef, 'Artesanías y manualidades')
    const CategoriasG = collection(subCategoriaRef, 'Asistencia toderos')
    const CategoriasH = collection(subCategoriaRef, 'Automatización')
    const CategoriasI = collection(subCategoriaRef, 'Carpintería')
    const CategoriasJ = collection(subCategoriaRef, 'Carpintería en aluminio')
    const CategoriasK = collection(subCategoriaRef, 'Carpintería metálica')
    const CategoriasL = collection(subCategoriaRef, 'Cerrajería')
    const CategoriasM = collection(subCategoriaRef, 'Construcción obra')
    const CategoriasN = collection(subCategoriaRef, 'Control de acceso')
    const CategoriasO = collection(subCategoriaRef, 'Control de plagas')
    const CategoriasP = collection(subCategoriaRef, 'Diseño e impresión')
    const CategoriasQ = collection(subCategoriaRef, 'Domótica')
    const CategoriasR = collection(subCategoriaRef, 'Drenajes e inundaciones')
    const CategoriasS = collection(subCategoriaRef, 'Electricidad')
    const CategoriasT = collection(subCategoriaRef, 'Estudios de suelos')
    const CategoriasU = collection(subCategoriaRef, 'Ferreterías')
    const CategoriasV = collection(
        subCategoriaRef,
        'Gasodomésticos y refrigeración'
    )
    const CategoriasW = collection(subCategoriaRef, 'Impermeabilización')
    const CategoriasX = collection(subCategoriaRef, 'Instalación de adoquín')
    const CategoriasY = collection(
        subCategoriaRef,
        'Instalación de cableado estructurado'
    )
    const CategoriasZ = collection(subCategoriaRef, 'Instalación de cerámica')
    const CategoriasAA = collection(subCategoriaRef, 'Instalación de cubiertas')
    const CategoriasAB = collection(subCategoriaRef, 'Instalación de parques')
    const CategoriasAC = collection(subCategoriaRef, 'Instalación de ventanas')
    const CategoriasAD = collection(subCategoriaRef, 'Jardinería')
    const CategoriasAE = collection(subCategoriaRef, 'Lavandería')
    const CategoriasAF = collection(subCategoriaRef, 'Limpiezas técnicas')
    const CategoriasAG = collection(subCategoriaRef, 'Maestro Obra')
    const CategoriasAH = collection(subCategoriaRef, 'Mecánica')
    const CategoriasAI = collection(subCategoriaRef, 'Movilizar pesos')
    const CategoriasAJ = collection(subCategoriaRef, 'Mudanzas')
    const CategoriasAK = collection(subCategoriaRef, 'Paisajismo')
    const CategoriasAL = collection(subCategoriaRef, 'Pintura')
    const CategoriasAM = collection(subCategoriaRef, 'Plomería')
    const CategoriasAN = collection(
        subCategoriaRef,
        'Redes cableado estructurado'
    )
    const CategoriasAO = collection(subCategoriaRef, 'Reformas Baños')
    const CategoriasAP = collection(subCategoriaRef, 'Reformas Cocinas')
    const CategoriasAQ = collection(subCategoriaRef, 'Reformas Piscinas')
    const CategoriasAR = collection(subCategoriaRef, 'Servicio doméstico')
    const CategoriasAS = collection(
        subCategoriaRef,
        'Sistemas de Seguridad y alarmas'
    )
    const CategoriasAT = collection(subCategoriaRef, 'Tanques de agua')
    const CategoriasAU = collection(subCategoriaRef, 'Tapicería')
    const CategoriasAV = collection(subCategoriaRef, 'Trabajos en piedra')

    const categoriasFromFirestore = async () => {
        const collectionCategorias = new Array(
            CategoriasA,
            CategoriasB,
            CategoriasC,
            CategoriasD,
            CategoriasE,
            CategoriasF,
            CategoriasG,
            CategoriasH,
            CategoriasI,
            CategoriasJ,
            CategoriasK,
            CategoriasL,
            CategoriasM,
            CategoriasN,
            CategoriasO,
            CategoriasP,
            CategoriasQ,
            CategoriasR,
            CategoriasS,
            CategoriasT,
            CategoriasU,
            CategoriasV,
            CategoriasW,
            CategoriasX,
            CategoriasY,
            CategoriasZ,
            CategoriasAA,
            CategoriasAB,
            CategoriasAC,
            CategoriasAD,
            CategoriasAE,
            CategoriasAF,
            CategoriasAG,
            CategoriasAH,
            CategoriasAI,
            CategoriasAJ,
            CategoriasAK,
            CategoriasAL,
            CategoriasAM,
            CategoriasAN,
            CategoriasAO,
            CategoriasAP,
            CategoriasAQ,
            CategoriasAR,
            CategoriasAS,
            CategoriasAT,
            CategoriasAU,
            CategoriasAV
        )
        let subCategoriasServicios = []
        try {
            for (let categoria of collectionCategorias) {
                // console.log(product, collectionReceptor)
                let categoryData = await getDocs(categoria)
                categoryData.forEach((DOC) => {
                    subCategoriasServicios.push(DOC.data())
                })
            }
            return subCategoriasServicios
        } catch (err) {
            console.log(
                'Error al obtener los datos de la colleccion categorias: ',
                err
            )
        }
    }

    useEffect(() => {
        let subCategoriasData
        // leyendo desde el archivo local
        if (ApendiceJson) {
            // console.log(ApendiceJson)
            subCategoriasData = ApendiceJson // JSON.stringify()
            setCategoriaInfo(subCategoriasData)
        }
        // leyendo desde firestore
        // let subCategorias = []
        // subCategoriasData = categoriasFromFirestore()
        // subCategoriasData
        //     .then((response) => {
        //         if (response) {
        //             subCategorias = response
        //             console.log('subCategorias', subCategorias)
        //             if (subCategorias.length > 0) {
        //                 setCategoriaInfo(subCategorias)
        //                 console.log(categoriaInfo)
        //             }
        //         } else {
        //             console.log('No se encontro información de las categorias!')
        //         }
        //     })
        //     .catch((error) => {
        //         console.log(error)
        //     })
    }, [ApendiceJson])

    return (
        <>
            <Container fluid className="p-0">
                <Row className="apendiceCostosTitulo m-0 w-100 d-flex justify-content-end">
                    <Col lg={4} md={6} sm={10} xs={12}>
                        <h3 className="titulo headline-xl">
                            Costeo de Servicios
                            <br />
                            Comunes
                        </h3>
                    </Col>
                </Row>
            </Container>
            <Container fluid className="p-0">
                {/* <AdministrarDB /> */}
                <Row className="m-0 w-100 d-flex ps-4 pe-4">
                    <Table
                        className=""
                        sx={{
                            display: { sm: 'grid', xs: 'grid' },
                            overflowX: 'scroll',
                        }}
                    >
                        <TableHead>
                            <TableRow
                                className="w-100"
                                sx={{ display: 'table' }}
                            >
                                <TableCell>subCategoria</TableCell>
                                <TableCell>Unidad Medida</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Precio unitario bajo</TableCell>
                                <TableCell>Precio unitario alto</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {categoriaInfo.map((categoria) => {
                                if (categoria.subCategoria === undefined) {
                                    const { subSistema } = categoria
                                    return (
                                        <>
                                            <TableRow key={subSistema}>
                                                <TableCell className="center headline-l w-100">
                                                    {subSistema}
                                                </TableCell>
                                            </TableRow>
                                        </>
                                    )
                                } else {
                                    const {
                                        subCategoria,
                                        subCategoriaCantidad,
                                        subCategoriaDescription,
                                        subCategoriaPhotoUrl,
                                        subCategoriaPrecio,
                                    } = categoria

                                    let precioBajo = subCategoriaPrecio * 1.05
                                    let precioAlto = subCategoriaPrecio * 1.65
                                    return (
                                        <>
                                            <TableRow key={subCategoria}>
                                                <TableCell>
                                                    {subCategoria}
                                                </TableCell>
                                                <TableCell>
                                                    {subCategoriaCantidad}
                                                </TableCell>
                                                <TableCell>
                                                    {subCategoriaDescription}
                                                </TableCell>
                                                <TableCell>
                                                    {parseInt(
                                                        precioBajo
                                                    ).toLocaleString('es-CO', {
                                                        style: 'currency',
                                                        currency: 'COP',
                                                    })}
                                                </TableCell>
                                                <TableCell>
                                                    {parseInt(
                                                        precioAlto
                                                    ).toLocaleString('es-CO', {
                                                        style: 'currency',
                                                        currency: 'COP',
                                                    })}
                                                </TableCell>
                                            </TableRow>
                                        </>
                                    )
                                }
                            })}
                        </TableBody>
                    </Table>
                </Row>
            </Container>
            <Container fluid className="p-0">
                <Row className="apendiceCostosPreguntas m-0 w-100">
                    <Col>
                        <ul className="body-2">
                            <li>
                                <Link to="/apendice-costos">
                                    ¿Cuánto cuesta instalar nuevas
                                    tomacorrientes?
                                </Link>
                            </li>
                            <li>
                                <Link to="/apendice-costos">
                                    ¿Cuánto cuesta instalar una ducha electrica?
                                </Link>
                            </li>
                            <li>
                                <Link to="/apendice-costos">
                                    ¿Cuánto cuesta diagnosticar un fallo
                                    electrico?
                                </Link>
                            </li>
                            <li>
                                <Link to="/apendice-costos">
                                    ¿Cuánto cuesta remodelar una habitación?
                                </Link>
                            </li>
                            <li>
                                <Link to="/apendice-costos">
                                    ¿Cuánto cuesta instalar nuevas iluminaciones
                                    y lamparas?
                                </Link>
                            </li>
                        </ul>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default ApendiceCostos
