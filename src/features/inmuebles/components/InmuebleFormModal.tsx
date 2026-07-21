import React, { useState, useEffect } from 'react'
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    FormControlLabel,
    Switch,
    MenuItem,
    Grid,
    Box,
    Typography,
    Alert,
    CircularProgress,
    IconButton
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import HomeWorkIcon from '@mui/icons-material/HomeWork'
import MapIcon from '@mui/icons-material/Map'
import { zoneNames } from '@assets/data/ListadoZonas'
import type { Inmueble, CreateInmuebleInput } from '@services/inmuebles'
import { Ubicacion } from '@features/marketing'

interface InmuebleFormModalProps {
    open: boolean
    onClose: () => void
    onSave: (data: CreateInmuebleInput) => Promise<boolean>
    initialData?: Inmueble | null
    isFirstProperty?: boolean
}

export const InmuebleFormModal: React.FC<InmuebleFormModalProps> = ({
    open,
    onClose,
    onSave,
    initialData = null,
    isFirstProperty = false,
}) => {
    const [alias, setAlias] = useState('')
    const [direccion, setDireccion] = useState('')
    const [ciudad, setCiudad] = useState('Bogotá, Colombia')
    const [codigoPostal, setCodigoPostal] = useState('')
    const [zona, setZona] = useState('')
    const [isPreferida, setIsPreferida] = useState(false)
    const [lat, setLat] = useState<number | undefined>(undefined)
    const [lng, setLng] = useState<number | undefined>(undefined)

    const [openMapPicker, setOpenMapPicker] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errorMsg, setErrorMsg] = useState<string | null>(null)

    useEffect(() => {
        if (initialData) {
            setAlias(initialData.alias || '')
            setDireccion(initialData.direccion || '')
            setCiudad(initialData.ciudad || 'Bogotá, Colombia')
            setCodigoPostal(initialData.codigoPostal || '')
            setZona(initialData.zona || '')
            setIsPreferida(initialData.isPreferida || false)
            setLat(initialData.lat)
            setLng(initialData.lng)
        } else {
            setAlias('')
            setDireccion('')
            setCiudad('Bogotá, Colombia')
            setCodigoPostal('')
            setZona('')
            setIsPreferida(isFirstProperty)
            setLat(undefined)
            setLng(undefined)
        }
        setErrorMsg(null)
    }, [initialData, open, isFirstProperty])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!alias.trim()) {
            setErrorMsg('Por favor ingresa un nombre o alias para el inmueble (ej. "Apartamento 502").')
            return
        }
        if (!direccion.trim()) {
            setErrorMsg('Por favor ingresa la dirección exacta del inmueble.')
            return
        }
        if (!ciudad.trim()) {
            setErrorMsg('Por favor ingresa la ciudad.')
            return
        }

        setIsSubmitting(true)
        setErrorMsg(null)

        try {
            const payload: CreateInmuebleInput = {
                alias: alias.trim(),
                direccion: direccion.trim(),
                ciudad: ciudad.trim(),
                codigoPostal: codigoPostal.trim(),
                zona: zona || undefined,
                isPreferida: isFirstProperty ? true : isPreferida,
                lat,
                lng,
            }

            const success = await onSave(payload)
            if (success) {
                onClose()
            }
        } catch (err: any) {
            setErrorMsg(err.message || 'Ocurrió un error al guardar el inmueble.')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleLocationFromMap = (locInfo: any) => {
        if (locInfo.street) setDireccion(locInfo.street)
        if (locInfo.city) setCiudad(locInfo.city)
        if (locInfo.postalCode) setCodigoPostal(locInfo.postalCode)
        if (locInfo.lat) setLat(locInfo.lat)
        if (locInfo.lng) setLng(locInfo.lng)
        setOpenMapPicker(false)
    }

    return (
        <Dialog
            open={open}
            onClose={isSubmitting ? undefined : onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: { borderRadius: 3, p: 1 }
            }}
        >
            <form onSubmit={handleSubmit}>
                <DialogTitle display="flex" justifyContent="space-between" alignItems="center" sx={{ pb: 1 }}>
                    <Box display="flex" alignItems="center" gap={1.5}>
                        <Box
                            sx={{
                                width: 38,
                                height: 38,
                                borderRadius: '10px',
                                bgcolor: '#f0fdfa',
                                color: '#0f766e',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <HomeWorkIcon />
                        </Box>
                        <Typography variant="h6" fontWeight={700} color="#0f172a">
                            {initialData ? 'Editar Inmueble' : 'Registrar Nuevo Inmueble'}
                        </Typography>
                    </Box>
                    <IconButton size="small" onClick={onClose} disabled={isSubmitting}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </DialogTitle>

                <DialogContent dividers sx={{ borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9', py: 2.5 }}>
                    {errorMsg && (
                        <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>
                            {errorMsg}
                        </Alert>
                    )}

                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Nombre / Alias del Inmueble *"
                                placeholder='Ej. "Casa Principal", "Apto 502 Colina", "Local Comercial"'
                                value={alias}
                                onChange={(e) => setAlias(e.target.value)}
                                required
                                size="small"
                                helperText="Identifica fácilmente tu inmueble cuando selecciones servicios."
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Box display="flex" gap={1} alignItems="flex-start">
                                <TextField
                                    fullWidth
                                    label="Dirección *"
                                    placeholder="Ej. Cl. 19a #12-2 Apto 301"
                                    value={direccion}
                                    onChange={(e) => setDireccion(e.target.value)}
                                    required
                                    size="small"
                                    InputProps={{
                                        startAdornment: <LocationOnIcon sx={{ color: '#64748b', mr: 1, fontSize: 20 }} />
                                    }}
                                />
                                <Button
                                    variant="outlined"
                                    onClick={() => setOpenMapPicker(!openMapPicker)}
                                    sx={{
                                        whiteSpace: 'nowrap',
                                        minWidth: 'auto',
                                        px: 2,
                                        height: 40,
                                        borderColor: '#cbd5e1',
                                        color: '#0f766e',
                                        fontWeight: 600,
                                        textTransform: 'none'
                                    }}
                                    startIcon={<MapIcon />}
                                >
                                    Mapa
                                </Button>
                            </Box>
                        </Grid>

                        {openMapPicker && (
                            <Grid item xs={12}>
                                <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0' }}>
                                    <Typography variant="subtitle2" fontWeight={600} mb={1} color="#0f766e">
                                        Seleccionar ubicación en el mapa
                                    </Typography>
                                    <Ubicacion
                                        setLocInfo={handleLocationFromMap}
                                        locInfo={{
                                            street: direccion,
                                            city: ciudad,
                                            postalCode: codigoPostal,
                                        }}
                                        setOpen={setOpenMapPicker}
                                    />
                                </Box>
                            </Grid>
                        )}

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Ciudad *"
                                value={ciudad}
                                onChange={(e) => setCiudad(e.target.value)}
                                required
                                size="small"
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Código Postal (Opcional)"
                                placeholder="Ej. 110111"
                                value={codigoPostal}
                                onChange={(e) => setCodigoPostal(e.target.value)}
                                size="small"
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                select
                                fullWidth
                                label="Localidad / Zona (Opcional)"
                                value={zona}
                                onChange={(e) => setZona(e.target.value)}
                                size="small"
                                helperText="Ayuda a conectar con comerciantes y profesionales de tu zona."
                            >
                                <MenuItem value="">
                                    <em>Sin especificar zona</em>
                                </MenuItem>
                                {Object.entries(zoneNames).map(([slug, label]) => (
                                    <MenuItem key={slug} value={slug}>
                                        {label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        <Grid item xs={12}>
                            <Box
                                sx={{
                                    p: 2,
                                    bgcolor: isPreferida ? '#f0fdfa' : '#f8fafc',
                                    borderRadius: 2,
                                    border: isPreferida ? '1px solid #99f6e4' : '1px solid #e2e8f0'
                                }}
                            >
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={isPreferida}
                                            onChange={(e) => setIsPreferida(e.target.checked)}
                                            disabled={isFirstProperty} // First property is always preferida
                                            color="primary"
                                        />
                                    }
                                    label={
                                        <Box>
                                            <Typography variant="body2" fontWeight={600} color="#0f172a">
                                                Establecer como propiedad preferida
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                Esta propiedad se seleccionará automáticamente por defecto al publicar proyectos o solicitar servicios.
                                            </Typography>
                                        </Box>
                                    }
                                />
                            </Box>
                        </Grid>
                    </Grid>
                </DialogContent>

                <DialogActions sx={{ p: 2.5, pt: 2 }}>
                    <Button onClick={onClose} disabled={isSubmitting} variant="outlined" color="inherit" sx={{ textTransform: 'none', borderRadius: 2 }}>
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        variant="contained"
                        sx={{
                            bgcolor: '#0f766e',
                            '&:hover': { bgcolor: '#0d9488' },
                            textTransform: 'none',
                            fontWeight: 700,
                            borderRadius: 2,
                            px: 3
                        }}
                        startIcon={isSubmitting ? <CircularProgress size={18} color="inherit" /> : null}
                    >
                        {isSubmitting ? 'Guardando...' : initialData ? 'Guardar Cambios' : 'Registrar Inmueble'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}
