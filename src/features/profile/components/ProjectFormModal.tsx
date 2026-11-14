import React, { useState } from 'react'
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Typography,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormControlLabel,
    Checkbox,
    Alert,
    CircularProgress,
    IconButton,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import CompareIcon from '@mui/icons-material/Compare'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from '@services/firebase'
import { processImageFile } from '@utils/mediaPipeline'
import { createProject, checkProjectCreationEligibility } from '@services/projects'
import type { ProjectFirestoreDocument, BeforeAfterPair } from '@services/projects'
import { ListadoCategorias } from '@/assets/data/ListadoCategorias'
import { HOME_ZONE_OPTIONS } from '@/assets/data/ListadoZonas'

export interface ProjectFormModalProps {
    open: boolean
    onClose: () => void
    comercianteId: string
    isAnnualMember: boolean
    existingProjectsCount: number
    onProjectCreated?: (project: ProjectFirestoreDocument) => void
}

export const ProjectFormModal: React.FC<ProjectFormModalProps> = ({
    open,
    onClose,
    comercianteId,
    isAnnualMember,
    existingProjectsCount,
    onProjectCreated,
}) => {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [category, setCategory] = useState('')
    const [zone, setZone] = useState('bogota')
    const [consentGranted, setConsentGranted] = useState(false)
    const [beforeFile, setBeforeFile] = useState<File | null>(null)
    const [afterFile, setAfterFile] = useState<File | null>(null)
    const [beforePreview, setBeforePreview] = useState<string | null>(null)
    const [afterPreview, setAfterPreview] = useState<string | null>(null)
    const [pairCaption, setPairCaption] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const eligibility = checkProjectCreationEligibility(
        isAnnualMember,
        existingProjectsCount,
        Boolean(beforeFile || afterFile)
    )

    const handleBeforeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        setBeforeFile(file)
        setBeforePreview(URL.createObjectURL(file))
    }

    const handleAfterChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        setAfterFile(file)
        setAfterPreview(URL.createObjectURL(file))
    }

    const resetForm = () => {
        setTitle('')
        setDescription('')
        setCategory('')
        setZone('bogota')
        setConsentGranted(false)
        setBeforeFile(null)
        setAfterFile(null)
        setBeforePreview(null)
        setAfterPreview(null)
        setPairCaption('')
        setErrorMessage(null)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrorMessage(null)

        if (!title.trim() || !category || !zone) {
            setErrorMessage('Por favor completa el título, oficio y zona del proyecto.')
            return
        }

        if (!consentGranted) {
            setErrorMessage('Debes confirmar la autorización previa del cliente (Habeas Data V1.1) para publicar fotos de la obra.')
            return
        }

        if (!eligibility.allowed) {
            setErrorMessage(eligibility.reason || 'No cumples con las condiciones para publicar este proyecto.')
            return
        }

        setIsSubmitting(true)

        try {
            const beforeAfterPairs: BeforeAfterPair[] = []

            // Upload Before / After pair if present
            if (beforeFile && afterFile && storage) {
                // Process through media pipeline (strips EXIF, resizes, converts to WebP)
                const processedBefore = await processImageFile(beforeFile)
                const processedAfter = await processImageFile(afterFile)

                const timestamp = Date.now()
                const beforeRef = ref(storage, `profiles/${comercianteId}/projects/${timestamp}-before.webp`)
                const afterRef = ref(storage, `profiles/${comercianteId}/projects/${timestamp}-after.webp`)

                await uploadBytes(beforeRef, processedBefore.blob, { contentType: 'image/webp' })
                await uploadBytes(afterRef, processedAfter.blob, { contentType: 'image/webp' })

                const beforeUrl = await getDownloadURL(beforeRef)
                const afterUrl = await getDownloadURL(afterRef)

                beforeAfterPairs.push({
                    id: `pair-${timestamp}`,
                    beforeUrl,
                    afterUrl,
                    ...(pairCaption.trim() ? { caption: pairCaption.trim() } : {}),
                })
            }

            const response = await createProject({
                comercianteId,
                isAnnualMember,
                existingProjectsCount,
                data: {
                    comercianteId,
                    title: title.trim(),
                    description: description.trim(),
                    category,
                    zone,
                    beforeAfterPairs,
                    galleryUrls: [],
                    clientConsent: {
                        granted: true,
                        acceptedAt: new Date().toISOString(),
                        noticeVersion: 'V1.1',
                    },
                    tags: [category, zone],
                },
            })

            if (!response.success || !response.data) {
                throw new Error(response.error?.message || 'Error al crear el proyecto.')
            }

            onProjectCreated?.(response.data)
            resetForm()
            onClose()
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Error inesperado al guardar el proyecto.'
            setErrorMessage(message)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AutoAwesomeIcon color="primary" />
                    <Typography variant="h6" fontWeight="bold">
                        Nuevo Proyecto Estructurado
                    </Typography>
                </Box>
                <IconButton onClick={onClose} size="small" aria-label="Cerrar modal">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <form onSubmit={handleSubmit}>
                <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

                    {!isAnnualMember && (
                        <Alert severity="info" sx={{ fontSize: '0.82rem' }}>
                            <strong>Plan Gratuito:</strong> Puedes publicar hasta 2 proyectos.
                            Pasa a la <strong>Membresía Anual ($150.000 COP)</strong> para proyectos ilimitados y el comparador interactivo <strong>Antes / Después</strong>.
                        </Alert>
                    )}

                    <TextField
                        label="Título del Proyecto"
                        placeholder="Ej. Remodelación integral de cocina moderna"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        fullWidth
                        required
                        size="small"
                    />

                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                        <FormControl fullWidth size="small" required>
                            <InputLabel id="category-select-label">Oficio / Especialidad</InputLabel>
                            <Select
                                labelId="category-select-label"
                                value={category}
                                label="Oficio / Especialidad"
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                {ListadoCategorias.map((cat) => (
                                    <MenuItem key={cat.key} value={cat.label}>
                                        {cat.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth size="small" required>
                            <InputLabel id="zone-select-label">Zona o Localidad</InputLabel>
                            <Select
                                labelId="zone-select-label"
                                value={zone}
                                label="Zona o Localidad"
                                onChange={(e) => setZone(e.target.value)}
                            >
                                {HOME_ZONE_OPTIONS.map((opt) => (
                                    <MenuItem key={opt.slug} value={opt.slug}>
                                        {opt.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>

                    <TextField
                        label="Descripción de la Obra"
                        placeholder="Materiales utilizados, acabados, retos resueltos..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        multiline
                        rows={3}
                        fullWidth
                        size="small"
                    />

                    {/* Comparador Antes / Después */}
                    <Box
                        sx={{
                            border: '1px dashed #cbd5e1',
                            borderRadius: 2,
                            p: 2,
                            bgcolor: isAnnualMember ? '#f8fafc' : '#f1f5f9',
                            opacity: isAnnualMember ? 1 : 0.85,
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                            <CompareIcon color={isAnnualMember ? 'primary' : 'disabled'} />
                            <Typography variant="subtitle2" fontWeight="bold">
                                Comparador Antes / Después {isAnnualMember ? '(Exclusivo Anual)' : '🔒 (Solo Miembros Anuales)'}
                            </Typography>
                        </Box>

                        <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
                            Las fotos se optimizan automáticamente a formato WebP y eliminan datos EXIF/GPS para proteger la privacidad física del inmueble.
                        </Typography>

                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                            {/* Antes */}
                            <Box sx={{ textAlign: 'center' }}>
                                <Button
                                    variant="outlined"
                                    component="label"
                                    size="small"
                                    fullWidth
                                    disabled={!isAnnualMember}
                                    startIcon={<AddPhotoAlternateOutlinedIcon />}
                                    sx={{ textTransform: 'none' }}
                                >
                                    Foto Antes
                                    <input type="file" accept="image/*" hidden onChange={handleBeforeChange} />
                                </Button>
                                {beforePreview && (
                                    <Box
                                        component="img"
                                        src={beforePreview}
                                        alt="Vista previa Antes"
                                        sx={{ mt: 1, width: '100%', height: 90, objectFit: 'cover', borderRadius: 1 }}
                                    />
                                )}
                            </Box>

                            {/* Después */}
                            <Box sx={{ textAlign: 'center' }}>
                                <Button
                                    variant="outlined"
                                    component="label"
                                    size="small"
                                    fullWidth
                                    disabled={!isAnnualMember}
                                    startIcon={<AddPhotoAlternateOutlinedIcon />}
                                    sx={{ textTransform: 'none' }}
                                >
                                    Foto Después
                                    <input type="file" accept="image/*" hidden onChange={handleAfterChange} />
                                </Button>
                                {afterPreview && (
                                    <Box
                                        component="img"
                                        src={afterPreview}
                                        alt="Vista previa Después"
                                        sx={{ mt: 1, width: '100%', height: 90, objectFit: 'cover', borderRadius: 1 }}
                                    />
                                )}
                            </Box>
                        </Box>

                        {isAnnualMember && (beforePreview || afterPreview) && (
                            <TextField
                                label="Pie de foto / Detalle de la transformación"
                                placeholder="Ej. Cambio de azulejos antiguos por porcelanato rectificado"
                                value={pairCaption}
                                onChange={(e) => setPairCaption(e.target.value)}
                                fullWidth
                                size="small"
                                sx={{ mt: 2 }}
                            />
                        )}
                    </Box>

                    {/* Habeas Data Legal Consent */}
                    <Box sx={{ bgcolor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 2, p: 1.5 }}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={consentGranted}
                                    onChange={(e) => setConsentGranted(e.target.checked)}
                                    color="success"
                                />
                            }
                            label={
                                <Typography variant="caption" sx={{ color: '#166534', lineHeight: 1.3, display: 'block' }}>
                                    <strong>Consentimiento Legal (Habeas Data V1.1):</strong> Certifico bajo la gravedad de juramento que cuento con la autorización previa, expresa e informada del propietario del inmueble para publicar estas fotografías y referencias de obra en la Comunidad Dezzpo y Google Search.
                                </Typography>
                            }
                        />
                    </Box>
                </DialogContent>

                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={onClose} disabled={isSubmitting} sx={{ textTransform: 'none' }}>
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={isSubmitting || !consentGranted || !title.trim() || !category}
                        startIcon={isSubmitting ? <CircularProgress size={18} color="inherit" /> : <AutoAwesomeIcon />}
                        sx={{ textTransform: 'none', px: 3 }}
                    >
                        {isSubmitting ? 'Optimizando y Publicando...' : 'Publicar Proyecto'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}

