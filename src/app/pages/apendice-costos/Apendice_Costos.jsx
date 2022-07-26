// Pagina de Apendice de costos
import React, { useState, useEffect } from 'react'
import '../../../../public/assets/css/apendice_costos.css'
import { Link } from 'react-router-dom'
import { collection, doc, getDocs } from 'firebase/firestore'
import { firestore } from '../../../firebase/firebaseClient'
import * as XLSX from 'xlsx/xlsx.mjs'
/* load 'fs' for readFile and writeFile support */
import * as fs from 'fs'
// react-bootrstrap
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import { styled } from '@mui/material/styles'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'

XLSX.set_fs(fs)

const Input = styled('input')({
    // display: 'none',
    // visibility: 'hidden',
    position: 'absolute',
})

const ApendiceCostos = () => {
    const [excelInfo, setExcelInfo] = useState({})
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

    const readExcel = (event) => {
        const target = event.target
        const value = target.type === 'checkbox' ? target.checked : target.value
        const name = target.name
        const file = event.target.files
        setExcelInfo({ ...excelInfo, [name]: value })
        // let hojas = []
        if (file[0] instanceof Blob) {
            const promise = new Promise((resolve, reject) => {
                const fileReader = new FileReader()
                fileReader.readAsArrayBuffer(file[0])

                fileReader.onload = (e) => {
                    const bufferArray = e.target.result

                    const wb = XLSX.read(bufferArray, { type: 'buffer' })

                    const wsname = wb.SheetNames[0]

                    const ws = wb.Sheets[wsname]

                    const data = XLSX.utils.sheet_to_json(ws)

                    resolve(data)

                    setExcelInfo({
                        fileXlsx: data,
                    })

                    // console.log(this.state);
                }

                fileReader.onerror = (error) => {
                    reject(error)
                }
            })

            promise.then((d) => {
                console.log('excelData', d, excelInfo)
            })
        }
    }

    useEffect(() => {
        let subCategoriasData
        let subCategorias = []
        subCategoriasData = categoriasFromFirestore()
        subCategoriasData
            .then((response) => {
                if (response) {
                    subCategorias = response
                    console.log('subCategorias', subCategorias)
                    if (subCategorias.length > 0) {
                        setCategoriaInfo(subCategorias)
                        console.log(categoriaInfo)
                    }
                } else {
                    console.log('No se encontro información de las categorias!')
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }, [])

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
                {/* <Row className="m-0 w-100 d-flex">
                    <Button>
                        UploadExcel
                        <Input
                            required
                            name="icon-button-file"
                            id="icon-button-file"
                            type="file"
                            onClick={readExcel}
                            placeholder="UploadExcel"
                        />
                    </Button>
                </Row> */}
                <Row className="m-0 w-100 d-flex">
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>subCategoria</TableCell>
                                <TableCell>Unidad Medida</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Precio unitario bajo</TableCell>
                                <TableCell>Precio unitario alto</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {categoriaInfo.map(
                                ({
                                    subCategoria,
                                    subCategoriaCantidad,
                                    subCategoriaDescription,
                                    subCategoriaPhotoUrl,
                                    subCategoriaPrecio,
                                }) => {
                                    let precioBajo = subCategoriaPrecio * 1.05
                                    let precioAlto = subCategoriaPrecio * 1.65
                                    return (
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
                                    )
                                }
                            )}
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
