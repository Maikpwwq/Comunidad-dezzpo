import React, { useState } from 'react'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { collection, doc, setDoc } from 'firebase/firestore'
import { storage, firestore, isFirebaseAvailable } from '@services/firebase'
import { v4 as uuidv4 } from 'uuid'
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import SnackBarAlert from '@components/common/SnackBarAlert'
import PermMediaOutlinedIcon from '@mui/icons-material/PhotoSizeSelectActual'

const Input = styled('input')({
    visibility: 'hidden',
    position: 'absolute',
})

interface AdjuntarArchivosProps {
    name: string
    multiple: boolean
    idPerson: string
    rol: number | undefined | null
    route: string
    functionState: (newState: any) => void
    state: any
}

export const AdjuntarArchivos: React.FC<AdjuntarArchivosProps> = ({
    name,
    multiple,
    idPerson,
    rol,
    route,
    functionState,
    state,
}) => {
    const [alert, setAlert] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error' | 'warning' | 'info',
    })

    const handleAlert = (message: string, severity: 'success' | 'error') => {
        setAlert({ ...alert, open: true, message: message, severity: severity })
    }

    const userProResToFirestore = async (updateInfo: any, userID: string) => {
        // SSR guard
        if (!isFirebaseAvailable() || !firestore) {
            console.warn('[SSR] userProResToFirestore skipped')
            return
        }
        const usersProResRef = collection(firestore, 'usersPropietariosResidentes')
        await setDoc(doc(usersProResRef, userID), updateInfo, { merge: true })
    }

    const userComCalToFirestore = async (updateInfo: any, userID: string) => {
        // SSR guard
        if (!isFirebaseAvailable() || !firestore) {
            console.warn('[SSR] userComCalToFirestore skipped')
            return
        }
        const usersComCalRef = collection(firestore, 'usersComerciantesCalificados')
        await setDoc(doc(usersComCalRef, userID), updateInfo, { merge: true })
    }

    const handleCloseAlert = (_event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return
        }
        setAlert({ ...alert, open: false, message: '' })
    }

    const updateGalleryPhoto = (event: React.ChangeEvent<HTMLInputElement>) => {
        // SSR guard - storage operations only on client
        if (!isFirebaseAvailable() || !storage) {
            console.warn('[Client-only] Storage not available')
            return
        }

        const files = event.target.files
        if (!files || files.length === 0) return

        const file = files[0]
        if (!file) return

        const fileId = uuidv4()
        const fileRoute = name === 'profilePhoto' ? `${route}` : `${route}/${fileId}`

        const userGalleryRef = ref(storage!, fileRoute)

        console.log(file)
        try {
            uploadBytes(userGalleryRef, file).then((response) => {
                const { bucket, fullPath } = response.metadata
                const base = `gs://${bucket}/${fullPath}`

                const message = name === 'profilePhoto'
                    ? 'Se cargo una imagen de perfil al storage'
                    : 'Se cargo una imagen a la galleria del usuario'

                handleAlert(message, 'success')

                const gsReference = ref(storage!, base)
                getDownloadURL(gsReference)
                    .then((url) => {
                        let photoInfo = undefined
                        if (name === 'profilePhoto') {
                            functionState({
                                ...state,
                                userPhotoUrl: url,
                            })
                            photoInfo = { userPhotoUrl: url }
                        } else {
                            // Append to existing gallery
                            const currentGallery = state.userGalleryUrl || []
                            const newGallery = [...currentGallery, url]
                            functionState({
                                ...state,
                                userGalleryUrl: newGallery,
                            })
                            photoInfo = { userGalleryUrl: newGallery }
                        }

                        if (photoInfo !== undefined && rol === 1) {
                            userProResToFirestore(photoInfo, idPerson)
                                .then(() => console.log('Updated user profile/gallery in firestore (Rol 1)'))
                                .catch((err) => console.log('Error updating firestore (Rol 1)', err))
                        } else if (rol === 2) {
                            userComCalToFirestore(photoInfo, idPerson)
                                .then(() => console.log('Updated user profile/gallery in firestore (Rol 2)'))
                                .catch((err) => console.log('Error updating firestore (Rol 2)', err))
                        }
                    })
                    .catch((error) => {
                        console.log('No se encontro una URL en el storage', error)
                    })
            })
        } catch (e) {
            const message = name === 'profilePhoto'
                ? 'La imagen de perfil no se cargo al storage'
                : 'La imagen no se cargo a la galleria del storage'
            handleAlert(message, 'error')
            console.log('Error uploading image', e)
        }
    }

    return (
        <Box className="p-0">
            {alert.open && (
                <SnackBarAlert
                    message={alert.message}
                    onClose={handleCloseAlert}
                    severity={alert.severity}
                    open={alert.open}
                />
            )}
            <label
                htmlFor={`icon-button-file-${name}`}
                style={{
                    position: 'relative',
                    right: '21px',
                    bottom: '9px',
                    width: 'auto',
                }}
            >
                <Input
                    accept={multiple ? 'image/*,.pdf,.docx' : 'image/*'}
                    // @ts-ignore
                    multiple={multiple}
                    id={`icon-button-file-${name}`}
                    type="file"
                    onChange={updateGalleryPhoto}
                />
                <Tooltip
                    title={
                        name === 'profilePhoto'
                            ? '+ Agregar foto de perfil'
                            : '+ Agregar foto a la galeria de usuario'
                    }
                >
                    <Button
                        variant="contained"
                        component="span"
                        className="px-2"
                        sx={{ minWidth: 'auto' }}
                    >
                        <PermMediaOutlinedIcon fontSize="small" />
                    </Button>
                </Tooltip>
            </label>
        </Box>
    )
}

export default AdjuntarArchivos
