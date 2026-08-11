import React, { useState, useEffect } from 'react'
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
    Box,
    Typography,
    Alert,
    CircularProgress,
    IconButton,
    Autocomplete,
    Chip,
    Divider,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import StorefrontIcon from '@mui/icons-material/Storefront'
import { ListadoCategoriasTiendas } from '@assets/data/ListadoCategoriasTiendas'
import type { TiendaDocument, CreateTiendaInput, SedeLocation } from '@services/tiendas'
import { SedeManager } from './SedeManager'

interface TiendaFormModalProps {
    open: boolean
    onClose: () => void
    onSave: (data: CreateTiendaInput) => Promise<boolean>
    initialData?: TiendaDocument | null
    isAdminMode?: boolean
}

export const TiendaFormModal: React.FC<TiendaFormModalProps> = ({
    open,
    onClose,
    onSave,
    initialData = null,
    isAdminMode = false,
}) => {
    const [nombre, setNombre] = useState('')
    const [descripcion, setDescripcion] = useState('')
    const [email, setEmail] = useState('')
    const [sitioWeb, setSitioWeb] = useState('')
    const [telefonoPrincipal, setTelefonoPrincipal] = useState('')
    const [whatsappPrincipal, setWhatsappPrincipal] = useState('')
    const [selectedCategoryKeys, setSelectedCategoryKeys] = useState<string[]>([])
    const [sedes, setSedes] = useState<SedeLocation[]>([
        {
            id: 'sede_1',
            nombreSede: 'Sucursal Principal',
            direccion: '',
            ciudad: 'Bogotá, Colombia',
            codigoPostal: '',
            zona: 'bogota',
            telefonos: [''],
            whatsapp: '',
            horario: 'Lun-Vie 8:00 - 17:00',
        },
    ])

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errorMsg, setErrorMsg] = useState<string | null>(null)

    useEffect(() => {
        if (initialData) {
            setNombre(initialData.nombre || '')
            setDescripcion(initialData.descripcion || '')
            setEmail(initialData.email || '')
            setSitioWeb(initialData.sitioWeb || '')
            setTelefonoPrincipal(initialData.telefonoPrincipal || '')
            setWhatsappPrincipal(initialData.whatsappPrincipal || '')
            setSelectedCategoryKeys(initialData.categorias || [])
            setSedes(initialData.sedes && initialData.sedes.length > 0 ? initialData.sedes : [
                {
                    id: 'sede_1',
                    nombreSede: 'Sucursal Principal',
                    direccion: '',
                    ciudad: 'Bogotá, Colombia',
                    codigoPostal: '',
                    zona: 'bogota',
                    telefonos: [''],
                },
            ])
        } else {
            setNombre('')
            setDescripcion('')
            setEmail('')
            setSitioWeb('')
            setTelefonoPrincipal('')
            setWhatsappPrincipal('')
            setSelectedCategoryKeys([])
            setSedes([
                {
                    id: 'sede_1',
                    nombreSede: 'Sucursal Principal',
                    direccion: '',
                    ciudad: 'Bogotá, Colombia',
                    codigoPostal: '',
                    zona: 'bogota',
                    telefonos: [''],
                },
            ])
        }
        setErrorMsg(null)
    }, [initialData, open])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!nombre.trim()) {
            setErrorMsg('Por favor ingresa el nombre del negocio o tienda.')
            return
        }

        if (selectedCategoryKeys.length === 0) {
            setErrorMsg('Por favor selecciona al menos una categoría para la tienda.')
            return
        }

        if (sedes.length === 0 || !sedes[0]?.direccion?.trim()) {
            setErrorMsg('Por favor registra al menos una sede con su dirección exacta.')
            return
        }

        const invalidSede = sedes.find(s => !s.direccion?.trim() || !s.telefonos || s.telefonos.length === 0 || !s.telefonos[0]?.trim())
        if (invalidSede) {
            setErrorMsg('Todas las sedes registradas deben tener una dirección y al menos un teléfono de contacto.')
            return
        }

        setIsSubmitting(true)
        setErrorMsg(null)

        try {
            const payload: CreateTiendaInput = {
                nombre: nombre.trim(),
                descripcion: descripcion.trim(),
                email: email.trim(),
                sitioWeb: sitioWeb.trim(),
                telefonoPrincipal: telefonoPrincipal.trim() || sedes[0].telefonos[0],
                whatsappPrincipal: whatsappPrincipal.trim() || sedes[0].whatsapp,
                categorias: selectedCategoryKeys,
                sedes,
                estado: isAdminMode ? (initialData?.estado || 'aprobado') : 'pendiente',
                origen: isAdminMode ? 'equipo_dezzpo' : 'usuario',
            }

            const success = await onSave(payload)
            if (success) {
                onClose()
            }
        } catch (err: any) {
            setErrorMsg(err.message || 'Error al guardar los datos de la tienda.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <form onSubmit={handleSubmit}>
                <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <StorefrontIcon color="primary" />
                        <Typography variant="h6" fontWeight={700}>
                            {initialData ? 'Editar Tienda / Proveedor' : 'Sugerir / Registrar nueva Tienda'}
                        </Typography>
                    </Box>
                    <IconButton onClick={onClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <Divider />

                <DialogContent sx={{ p: 3 }}>
                    {errorMsg && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {errorMsg}
                        </Alert>
                    )}

                    {!isAdminMode && (
                        <Alert severity="info" sx={{ mb: 2.5 }}>
                            Tu sugerencia de tienda será revisada por nuestro equipo antes de ser publicada oficialmente en el directorio.
                        </Alert>
                    )}

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                        {/* Name & Categories */}
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                            <TextField
                                label="Nombre del Negocio / Tienda *"
                                size="small"
                                required
                                placeholder="Ej: Ferretería y Pinturas El Sol"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                sx={{ flex: 1, minWidth: 260 }}
                            />

                            <Autocomplete
                                multiple
                                size="small"
                                options={ListadoCategoriasTiendas}
                                getOptionLabel={(option) => option.label}
                                value={ListadoCategoriasTiendas.filter((c) => selectedCategoryKeys.includes(c.key))}
                                onChange={(_, newValue) => {
                                    setSelectedCategoryKeys(newValue.map((c) => c.key))
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Categorías *"
                                        placeholder="Seleccionar categorías"
                                    />
                                )}
                                renderTags={(value, getTagProps) =>
                                    value.map((option, index) => (
                                        <Chip
                                            label={option.label}
                                            size="small"
                                            {...getTagProps({ index })}
                                            key={option.key}
                                        />
                                    ))
                                }
                                sx={{ flex: 1, minWidth: 280 }}
                            />
                        </Box>

                        {/* Description / Slogan */}
                        <TextField
                            label="Descripción o Slogan (Opcional)"
                            size="small"
                            multiline
                            rows={2}
                            placeholder="Ej: Especialistas en pinturas arquitectónicas e impermeabilizantes. Entregas a domicilio en Bogotá."
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                        />

                        {/* Contact & Website */}
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                            <TextField
                                label="Sitio Web (Opcional)"
                                size="small"
                                placeholder="Ej: https://mi-tienda.com"
                                value={sitioWeb}
                                onChange={(e) => setSitioWeb(e.target.value)}
                                sx={{ flex: 1, minWidth: 200 }}
                            />
                            <TextField
                                label="Correo Electrónico (Opcional)"
                                size="small"
                                type="email"
                                placeholder="contacto@mitienda.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                sx={{ flex: 1, minWidth: 200 }}
                            />
                        </Box>

                        <Divider />

                        {/* Multi-Sede Manager */}
                        <SedeManager sedes={sedes} onChange={setSedes} />
                    </Box>
                </DialogContent>

                <Divider />

                <DialogActions sx={{ px: 3, py: 2 }}>
                    <Button onClick={onClose} disabled={isSubmitting}>
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        className="btn-primary"
                        disabled={isSubmitting}
                        startIcon={isSubmitting ? <CircularProgress size={18} color="inherit" /> : null}
                    >
                        {isSubmitting ? 'Guardando...' : initialData ? 'Actualizar Tienda' : 'Enviar Registrar'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}
