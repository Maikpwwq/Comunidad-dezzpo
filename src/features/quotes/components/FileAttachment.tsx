/**
 * FileAttachment Component
 *
 * File/image upload component for profiles and quotes.
 * Migrated from src/app/components/AdjuntarArchivos.jsx
 */

import React, { useState, useCallback } from 'react'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { collection, doc, setDoc } from 'firebase/firestore'
import { v4 as uuidv4 } from 'uuid'
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import PermMediaOutlinedIcon from '@mui/icons-material/PhotoSizeSelectActual'

import { firestore, storage } from '@services/firebase'
import { SnackBarAlert } from '@components/common'

const HiddenInput = styled('input')({
    visibility: 'hidden',
    position: 'absolute',
})

export interface FileAttachmentState {
    userPhotoUrl?: string[]
    userGalleryUrl?: string[]
    [key: string]: unknown
}

export interface FileAttachmentProps {
    /** Input name identifier */
    name: 'profilePhoto' | 'galleryPhoto'
    /** Allow multiple file selection */
    multiple: boolean
    /** User/person ID */
    idPerson: string
    /** User role (1=PropietarioResidente, 2=ComercianteCalificado) */
    rol: 1 | 2
    /** Storage route path */
    route: string
    /** State update function */
    functionState: (state: FileAttachmentState) => void
    /** Current state */
    state: FileAttachmentState
}

type AlertSeverity = 'success' | 'error' | 'warning' | 'info'

interface AlertState {
    open: boolean
    message: string
    severity: AlertSeverity
}

export function FileAttachment({
    name,
    multiple,
    idPerson,
    rol,
    route,
    functionState,
    state,
}: FileAttachmentProps): React.ReactElement {
    const [alert, setAlert] = useState<AlertState>({
        open: false,
        message: '',
        severity: 'success',
    })

    const usersProResRef = collection(firestore, 'usersPropietariosResidentes')
    const usersComCalRef = collection(firestore, 'usersComerciantesCalificados')

    const showAlert = useCallback((message: string, severity: AlertSeverity) => {
        setAlert({ open: true, message, severity })
    }, [])

    const handleCloseAlert = useCallback((_event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') return
        setAlert(prev => ({ ...prev, open: false, message: '' }))
    }, [])

    const saveToFirestore = useCallback(
        async (photoInfo: Partial<FileAttachmentState>, userID: string) => {
            const collectionRef = rol === 1 ? usersProResRef : usersComCalRef
            try {
                await setDoc(doc(collectionRef, userID), photoInfo, { merge: true })
                console.log('Photo URL saved to Firestore')
            } catch (error) {
                console.error('Failed to save photo URL to Firestore:', error)
            }
        },
        [rol, usersProResRef, usersComCalRef]
    )

    const handleFileUpload = useCallback(
        async (event: React.ChangeEvent<HTMLInputElement>) => {
            const files = event.target.files
            if (!files?.[0]) return

            const file = files[0]
            const fileId = uuidv4()
            const fileRoute = name === 'profilePhoto' ? route : `${route}/${fileId}`
            const storageRef = ref(storage, fileRoute)

            try {
                const uploadResult = await uploadBytes(storageRef, file)
                // Cast to access internal _location property
                const refLocation = (uploadResult.ref as unknown as { _location: { bucket: string; path_: string } })._location
                const { bucket, path_ } = refLocation
                const gsReference = ref(storage, `gs://${bucket}/${path_}`)
                const url = await getDownloadURL(gsReference)

                const isProfilePhoto = name === 'profilePhoto'
                const photoInfo: Partial<FileAttachmentState> = isProfilePhoto
                    ? { userPhotoUrl: [url] }
                    : { userGalleryUrl: [url] }

                functionState({
                    ...state,
                    ...photoInfo,
                })

                await saveToFirestore(photoInfo, idPerson)

                showAlert(
                    isProfilePhoto
                        ? 'Se cargo una imagen de perfil al storage'
                        : 'Se cargo una imagen a la galeria del usuario',
                    'success'
                )
            } catch (error) {
                console.error('Upload error:', error)
                showAlert(
                    name === 'profilePhoto'
                        ? 'La imagen de perfil no se cargo al storage'
                        : 'La imagen no se cargo a la galeria del storage',
                    'error'
                )
            }
        },
        [name, route, functionState, state, idPerson, saveToFirestore, showAlert]
    )

    const tooltipTitle = name === 'profilePhoto'
        ? '+ Agregar foto de perfil'
        : '+ Agregar foto a la galeria de usuario'

    return (
        <Box sx={{ position: 'relative' }}>
            {alert.open && (
                <SnackBarAlert
                    message={alert.message}
                    onClose={handleCloseAlert}
                    severity={alert.severity}
                    open={alert.open}
                />
            )}
            <label htmlFor={`file-upload-${name}`}>
                <HiddenInput
                    accept={multiple ? 'image/*,.pdf,.docx' : 'image/*'}
                    multiple={multiple}
                    id={`file-upload-${name}`}
                    type="file"
                    onChange={handleFileUpload}
                />
                <Tooltip title={tooltipTitle}>
                    <Button
                        variant="contained"
                        component="span"
                        sx={{ minWidth: 'auto', px: 2 }}
                    >
                        <PermMediaOutlinedIcon fontSize="small" />
                    </Button>
                </Tooltip>
            </label>
        </Box>
    )
}

export default FileAttachment
