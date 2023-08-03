export { AdministrarDB }

import React, { useState } from 'react'
import { collection, doc, setDoc } from 'firebase/firestore'
import { firestore } from '#@/firebase/firebaseClient'
import Row from 'react-bootstrap/Row'
// import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import { styled } from '@mui/material/styles'

import * as XLSX from 'xlsx/xlsx.mjs'
/* load 'fs' for readFile and writeFile support */
import * as fs from 'fs'

const Input = styled('input')({
    // display: 'none',
    // visibility: 'hidden',
    position: 'absolute',
})

XLSX.set_fs(fs)

export { AdministrarDB }

const AdministrarDB = () => {
    const [excelInfo, setExcelInfo] = useState({})
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

    const categoriasToFirestore = async (data) => {
        const categorias = [
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
            CategoriasAV,
        ]

        for (let i = 0; i < data.length; i++) {
            // console.log(data[i].__rowNum__)
            if (data[i].Subsistema) {
                // console.log('comparar', data[i])
                for (let j = 0; j < categorias.length; j++) {
                    let compararCategoria = categorias[j]._path.segments[2]
                    // console.log(
                    //     'comparar',
                    //     compararCategoria,
                    //     data[i].Subsistema
                    // )
                    if (compararCategoria === data[i].Subsistema) {
                        console.log('Pasa', data[i], compararCategoria)
                        let finalGrupo = 0

                        for (let m = i + 1; m < data.length; m++) {
                            if (data[m].Subsistema && finalGrupo === 0) {
                                finalGrupo = m
                                console.log('finalGrupo', finalGrupo)
                            }
                        }
                        for (let k = i + 1; k < finalGrupo + 1; k++) {
                            if (data[k].Subcategoria) {
                                let updateInfo = {
                                    subCategoria: data[k].Subcategoria || '',
                                    subCategoriaCantidad:
                                        data[k].unidadMedida || '',
                                    subCategoriaDescription:
                                        data[j].descripcion || '',
                                    subCategoriaPrecio: data[k].promedio || '',
                                }
                                await setDoc(
                                    doc(categorias[j], data[k].Subcategoria),
                                    updateInfo,
                                    {
                                        merge: true,
                                    }
                                )
                            }
                        }
                    }
                }
            }
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
                // const finish = (error) => {
                //     if (error) {
                //         console.log(error)
                //         return
                //     }
                // }
                // TODO: This works from a call to a web service
                // fs.writeFile('apendice-costos.json', d, finish)
                // categoriasToFirestore(d)
            })
        }
    }

    return (
        <>
            <Row className="m-0 w-100 d-flex">
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
            </Row>
        </>
    )
}
