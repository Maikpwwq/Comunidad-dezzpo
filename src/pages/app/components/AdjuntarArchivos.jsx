export { AdjuntarArchivos }

import React, { useState, useEffect } from 'react'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { firestore, auth, storage } from '../../../firebase/firebaseClient'
import { collection, doc, getDocFromServer, setDoc } from 'firebase/firestore'
import PropTypes from 'prop-types'
import { v4 as uuidv4 } from 'uuid'
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { SnackBarAlert } from '#@/pages/index/components/SnackBarAlert'
import PermMediaOutlinedIcon from '@mui/icons-material/PhotoSizeSelectActual'

const Input = styled('input')({
    // display: 'none',
    visibility: 'hidden',
    position: 'absolute',
})

export { AdjuntarArchivos }

const AdjuntarArchivos = ({
    name,
    multiple,
    idPerson,
    rol,
    route,
    functionState,
    state,
}) => {
    const _storage = storage
    const _firestore = firestore
    const usersProResRef = collection(_firestore, 'usersPropietariosResidentes')
    const usersComCalRef = collection(
        _firestore,
        'usersComerciantesCalificados'
    )
    // Recibir por parametros Id de la solicitud y funciones para almacenar los archivos

    const [alert, setAlert] = useState({
        open: false,
        message: '',
        severity: 'success',
    })

    const handleAlert = (message, severity) => {
        setAlert({ ...alert, open: true, message: message, severity: severity })
    }

    const userProResToFirestore = async (updateInfo, userID) => {
        await setDoc(doc(usersProResRef, userID), updateInfo, { merge: true })
    }

    const userComCalToFirestore = async (updateInfo, userID) => {
        await setDoc(doc(usersComCalRef, userID), updateInfo, { merge: true })
    }

    const handleCloseAlert = (event, reason) => {
        // console.log(reason, event)
        if (reason === 'clickaway') {
            return
        } else {
            setAlert({ ...alert, open: false, message: '' })
        }
    }

    const updateGalleryPhoto = (event) => {
        const file = event.target.files
        const fileId = uuidv4()
        const fileRoute =
            name == 'profilePhoto' ? `${route}` : `${route}/${fileId}`
        const userGalleryRef = ref(
            _storage,
            fileRoute
            // `${route}/${fileId}`
            // `profiles/${userConsultId}/${fileId}`
        )
        if (file[0] instanceof Blob) {
            console.log(file[0])
            try {
                uploadBytes(userGalleryRef, file[0]).then((response) => {
                    const { bucket, path_ } = response.ref._location
                    const base = `gs://${bucket}/${path_}`
                    const message =
                        name == 'profilePhoto'
                            ? 'Se cargo una imagen de perfil al storage'
                            : 'Se cargo una imagen a la galleria del usuario'
                    handleAlert(message, 'success')
                    const gsReference = ref(_storage, base)
                    getDownloadURL(gsReference)
                        .then((url) => {
                            let photoInfo = undefined
                            if (name == 'profilePhoto') {
                                functionState({
                                    ...state,
                                    userPhotoUrl: [url],
                                })
                                photoInfo = { userPhotoUrl: url }
                            } else {
                                functionState({
                                    ...state,
                                    userGalleryUrl: [url],
                                })
                                photoInfo = { userGalleryUrl: [url] }
                            }
                            if (photoInfo !== undefined && rol === 1) {
                                const userLoadRol = userProResToFirestore(
                                    photoInfo,
                                    idPerson
                                )
                                userLoadRol
                                    .then((docSnap) => {
                                        console.log(
                                            'Se actualiza URL de imagen a la galeria de usuario del firestore',
                                            'Se actualiza URL imagen de perfil a firestore',
                                            docSnap
                                        )
                                    })
                                    .catch((error) => {
                                        console.log(
                                            'No se pudo actualizar URL de imagen a la galeria de usuario del firestore',
                                            'No se pudo actualizar la imagen de perfil en firestore',
                                            error
                                        )
                                    })
                            } else if (rol === 2) {
                                const userLoadRol = userComCalToFirestore(
                                    photoInfo,
                                    idPerson
                                )
                                userLoadRol
                                    .then((docSnap) => {
                                        console.log(
                                            'Se actualiza URL de imagen a la galeria de usuario del firestore',
                                            'Se actualiza URL imagen de perfil a firestore',
                                            docSnap
                                        )
                                    })
                                    .catch((error) => {
                                        console.log(
                                            'No se pudo actualizar URL de imagen a la galeria de usuario del firestore',
                                            'No se pudo actualizar la imagen de perfil en firestore',
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
                const message =
                    name == 'profilePhoto'
                        ? 'La imagen de perfil no se cargo al storage'
                        : 'La imagen no se cargo a la galleria del storage'
                handleAlert(message, 'error')
                console.log('La imagen de perfil no se cargo al storage', e)
            }
        }
    }

    return (
        <>
            <Box fluid className="p-0">
                {alert.open && (
                    <SnackBarAlert
                        message={alert.message}
                        onClose={handleCloseAlert}
                        severity={alert.severity} // success, error, warning, info, default
                        open={alert.open}
                    />
                )}
                <label
                    htmlFor="icon-button-file"
                    style={{
                        position: 'relative',
                        right: '50px',
                        width: 'auto',
                    }}
                >
                    <Input
                        accept={multiple ? 'image/*,.pdf,.docx' : 'image/*'}
                        multiple={multiple}
                        id="icon-button-file"
                        type="file"
                        onClick={updateGalleryPhoto}
                    />
                    <Button
                        type="submit"
                        id={name}
                        name={name}
                        variant="contained"
                        component="span"
                    >
                        <PermMediaOutlinedIcon
                            alt={
                                name == 'profilePhoto'
                                    ? '+ Agregar foto de perfil'
                                    : '+ Agregar foto a la galeria de usuario'
                            }
                        />
                    </Button>
                </label>
            </Box>
        </>
    )
}

AdjuntarArchivos.propTypes = {
    name: PropTypes.string.isRequired,
    multiple: PropTypes.bool.isRequired,
    idPerson: PropTypes.string.isRequired,
    rol: PropTypes.number.isRequired,
    route: PropTypes.string.isRequired,
    functionState: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired,
}
