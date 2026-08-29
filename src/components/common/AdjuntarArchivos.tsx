import React, { useState } from 'react'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { collection, doc, setDoc } from 'firebase/firestore'
import { storage, firestore, isFirebaseAvailable } from '@services/firebase'
import { v4 as uuidv4 } from 'uuid'
import { styled } from '@mui/material/styles'
import { Box, Button, Tooltip, type SxProps, type Theme } from '@mui/material'
import SnackBarAlert from '@components/common/SnackBarAlert'
import PermMediaOutlinedIcon from '@mui/icons-material/PhotoSizeSelectActual'
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined'

const Input = styled('input')({
    visibility: 'hidden',
    position: 'absolute',
})

interface AdjuntarArchivosProps {
    name: 'profilePhoto' | 'galleryPhoto' | 'coverPhoto' | string
    multiple: boolean
    idPerson: string
    rol: number | undefined | null
    route: string
    functionState: (newState: any) => void
    state: any
    variant?: 'icon' | 'button'
    buttonText?: string
    tooltipTitle?: string
    aspectRatioHint?: string
    buttonClassName?: string
    sx?: SxProps<Theme>
}

export const AdjuntarArchivos: React.FC<AdjuntarArchivosProps> = ({
    name,
    multiple,
    idPerson,
    rol,
    route,
    functionState,
    state,
    variant = 'icon',
    buttonText,
    tooltipTitle,
    aspectRatioHint,
    buttonClassName,
    sx,
}) => {
    const [alert, setAlert] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error' | 'warning' | 'info',
    })
    const [isUploading, setIsUploading] = useState(false)

    const handleAlert = (message: string, severity: 'success' | 'error') => {
        setAlert({ open: true, message, severity })
    }

    const userProResToFirestore = async (updateInfo: any, userID: string) => {
        if (!isFirebaseAvailable() || !firestore) {
            console.warn('[SSR] userProResToFirestore skipped')
            return
        }
        const usersProResRef = collection(firestore, 'usersPropietariosResidentes')
        await setDoc(doc(usersProResRef, userID), updateInfo, { merge: true })
    }

    const userComCalToFirestore = async (updateInfo: any, userID: string) => {
        if (!isFirebaseAvailable() || !firestore) {
            console.warn('[SSR] userComCalToFirestore skipped')
            return
        }
        const usersComCalRef = collection(firestore, 'usersComerciantesCalificados')
        await setDoc(doc(usersComCalRef, userID), updateInfo, { merge: true })
    }

    const handleCloseAlert = (_event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') return
        setAlert({ ...alert, open: false, message: '' })
    }

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!isFirebaseAvailable() || !storage) {
            console.warn('[Client-only] Storage not available')
            return
        }

        const files = event.target.files
        if (!files || files.length === 0) return

        const file = files[0]
        if (!file) return

        // Max 10MB limit
        if (file.size > 10 * 1024 * 1024) {
            handleAlert('El archivo no debe superar los 10 MB', 'error')
            return
        }

        const fileExtension = file.name.split('.').pop() || 'jpg'
        let fileRoute: string
        if (name === 'profilePhoto') {
            fileRoute = `${route}`
        } else if (name === 'coverPhoto') {
            fileRoute = `${route}/portada-dezzpo-${Date.now()}.${fileExtension}`
        } else {
            const fileId = uuidv4()
            fileRoute = `${route}/${fileId}`
        }

        const storageTargetRef = ref(storage!, fileRoute)
        setIsUploading(true)

        try {
            const response = await uploadBytes(storageTargetRef, file)
            const { bucket, fullPath } = response.metadata
            const base = `gs://${bucket}/${fullPath}`

            const gsReference = ref(storage!, base)
            const url = await getDownloadURL(gsReference)

            let photoInfo: Record<string, any> | undefined = undefined
            if (name === 'profilePhoto') {
                functionState({
                    ...state,
                    userPhotoUrl: url,
                })
                photoInfo = { userPhotoUrl: url }
                handleAlert('Se actualizó la foto de perfil con éxito', 'success')
            } else if (name === 'coverPhoto') {
                functionState({
                    ...state,
                    userCoverUrl: url,
                })
                photoInfo = { userCoverUrl: url }
                handleAlert('Se actualizó la imagen de portada con éxito', 'success')
            } else {
                // Append to existing gallery
                const currentGallery = state.userGalleryUrl || []
                const newGallery = [...currentGallery, url]
                functionState({
                    ...state,
                    userGalleryUrl: newGallery,
                })
                photoInfo = { userGalleryUrl: newGallery }
                handleAlert('Se cargó una imagen a la galería con éxito', 'success')
            }

            if (photoInfo !== undefined) {
                if (rol === 1) {
                    await userProResToFirestore(photoInfo, idPerson)
                } else if (rol === 2) {
                    await userComCalToFirestore(photoInfo, idPerson)
                }
            }
        } catch (e) {
            console.error('Error uploading file:', e)
            const errorMessage = name === 'profilePhoto'
                ? 'La foto de perfil no se pudo cargar'
                : name === 'coverPhoto'
                ? 'La imagen de portada no se pudo cargar'
                : 'La imagen no se pudo cargar a la galería'
            handleAlert(errorMessage, 'error')
        } finally {
            setIsUploading(false)
            // Reset input value so same file can be re-selected if needed
            event.target.value = ''
        }
    }

    const defaultTooltip = name === 'profilePhoto'
        ? '+ Agregar foto de perfil'
        : name === 'coverPhoto'
        ? (aspectRatioHint ? `Imagen de portada (${aspectRatioHint})` : 'Recomendado: 1584 x 396 px (4:1)')
        : '+ Agregar foto a la galería de usuario'

    const resolvedTooltip = tooltipTitle || defaultTooltip

    return (
        <Box className="p-0" sx={{ display: 'inline-block' }}>
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
                style={
                    variant === 'button'
                        ? { cursor: 'pointer', margin: 0 }
                        : {
                            position: 'relative',
                            right: '21px',
                            bottom: '9px',
                            width: 'auto',
                            cursor: 'pointer',
                        }
                }
            >
                <Input
                    accept={multiple ? 'image/*,.pdf,.docx' : 'image/*'}
                    // @ts-ignore
                    multiple={multiple}
                    id={`icon-button-file-${name}`}
                    type="file"
                    disabled={isUploading}
                    onChange={handleFileChange}
                />
                <Tooltip title={resolvedTooltip}>
                    {variant === 'button' ? (
                        <Button
                            variant="contained"
                            component="span"
                            disabled={isUploading}
                            className={buttonClassName}
                            startIcon={<AddPhotoAlternateOutlinedIcon />}
                            sx={{
                                textTransform: 'none',
                                fontWeight: 600,
                                fontSize: '0.875rem',
                                borderRadius: '24px',
                                boxShadow: '0 4px 14px rgba(0,0,0,0.18)',
                                backdropFilter: 'blur(4px)',
                                ...sx,
                            }}
                        >
                            {buttonText || (name === 'coverPhoto' ? '+ Agregar imagen de portada' : 'Subir archivo')}
                        </Button>
                    ) : (
                        <Button
                            variant="contained"
                            component="span"
                            disabled={isUploading}
                            className="px-2"
                            sx={{ minWidth: 'auto', ...sx }}
                        >
                            <PermMediaOutlinedIcon fontSize="small" />
                        </Button>
                    )}
                </Tooltip>
            </label>
        </Box>
    )
}

export default AdjuntarArchivos
