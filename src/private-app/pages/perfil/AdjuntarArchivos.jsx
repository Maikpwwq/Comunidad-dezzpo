import React, { useState, useEffect } from 'react'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { useNavigate, useLocation } from 'react-router-dom'
import { firestore, auth, storage } from '../../../firebase/firebaseClient'
import { collection, doc, getDocFromServer, setDoc } from 'firebase/firestore'

import { v4 as uuidv4 } from 'uuid'

import Container from 'react-bootstrap/Container'
import Box from '@mui/material/Box'

const AdjuntarArchivos = () => {
    const _storage = storage

    // Recibir por parametros Id de la solicitud y funciones para almacenar los archivos

    const [alert, setAlert] = useState({
        open: false,
        message: '',
        severity: 'success',
    })

    const handleAlert = (message, severity) => {
        setAlert({ ...alert, open: true, message: message, severity: severity })
    }

    const updateGalleryPhoto = (event) => {
        const file = event.target.files
        const fileId = uuidv4()
        const userGalleryRef = ref(
            _storage,
            `profiles/${userConsultId}/${fileId}`
        )
        if (file[0] instanceof Blob) {
            console.log(file[0])
            try {
                uploadBytes(userGalleryRef, file[0]).then((response) => {
                    const { bucket, path_ } = response.ref._location
                    const base = `gs://${bucket}/${path_}`
                    handleAlert(
                        'Se cargo una imagen a la galleria del usuario',
                        'success'
                    )
                    // console.log(
                    //     'Se cargo una imagen a la galleria de usuario del storage',
                    //     base
                    // )
                    const gsReference = ref(_storage, base)
                    getDownloadURL(gsReference)
                        .then((url) => {
                            setUserInfo({
                                ...userInfo,
                                userGalleryUrl: [url],
                            })
                            const photoInfo = { userGalleryUrl: [url] }
                            if (userRol.rol === 1) {
                                const userLoadRol = userProResToFirestore(
                                    photoInfo,
                                    userConsultId
                                )
                                userLoadRol
                                    .then((docSnap) => {
                                        console.log(
                                            'Se actualiza URL de imagen a la galeria de usuario del firestore',
                                            docSnap
                                        )
                                    })
                                    .catch((error) => {
                                        console.log(
                                            'No se pudo actualizar URL de imagen a la galeria de usuario del firestore',
                                            error
                                        )
                                    })
                            } else if (userRol.rol === 2) {
                                const userLoadRol = userComCalToFirestore(
                                    photoInfo,
                                    userConsultId
                                )
                                userLoadRol
                                    .then((docSnap) => {
                                        console.log(
                                            'Se actualiza URL de imagen a la galeria de usuario del firestore',
                                            docSnap
                                        )
                                    })
                                    .catch((error) => {
                                        console.log(
                                            'No se pudo actualizar URL de imagen a la galeria de usuario del firestore',
                                            error
                                        )
                                    })
                            }
                        })
                        .catch((error) => {
                            console.log(
                                'No se encontro una URL en el storage',
                                error
                            )
                        })
                })
            } catch (e) {
                handleAlert(
                    'La imagen de perfil no se cargo al storage',
                    'error'
                )
                console.log('La imagen de perfil no se cargo al storage', e)
            }
        }
    }

    return (
        <>
            <Container fluid className="p-0"></Container>
        </>
    )
}

export default AdjuntarArchivos
