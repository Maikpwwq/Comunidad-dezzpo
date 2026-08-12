import React, { useState, useEffect, useCallback } from 'react'
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
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { ListadoCategoriasTiendas } from '@assets/data/ListadoCategoriasTiendas'
import type { TiendaDocument, CreateTiendaInput, SedeLocation } from '@services/tiendas'
import { useTiendaFormDraftStore, EMPTY_SEDE } from '@stores/useTiendaFormDraftStore'
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
    // ── Zustand draft store (sessionStorage-persisted) ──
    const draft = useTiendaFormDraftStore((s) => s.draft)
    const updateDraft = useTiendaFormDraftStore((s) => s.updateDraft)
    const clearDraft = useTiendaFormDraftStore((s) => s.clearDraft)

    // ── Determine if we're in "create" mode (use draft) or "edit" mode (use initialData) ──
    const isEditMode = !!initialData

    // ── Local state sourced from either draft store or initialData ──
    const [nombre, setNombre] = useState('')
    const [razonSocial, setRazonSocial] = useState('')
    const [nit, setNit] = useState('')
    const [descripcion, setDescripcion] = useState('')
    const [emails, setEmails] = useState<string[]>([''])
    const [sitioWeb, setSitioWeb] = useState('')
    const [telefonoPrincipal, setTelefonoPrincipal] = useState('')
    const [whatsappPrincipal, setWhatsappPrincipal] = useState('')
    const [selectedCategoryKeys, setSelectedCategoryKeys] = useState<string[]>([])
    const [sedes, setSedes] = useState<SedeLocation[]>([EMPTY_SEDE])

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errorMsg, setErrorMsg] = useState<string | null>(null)

    const handleEmailChange = (index: number, value: string) => {
        const updated = [...emails]
        updated[index] = value
        setEmails(updated)
    }

    const handleAddEmail = () => {
        setEmails([...emails, ''])
    }

    const handleRemoveEmail = (index: number) => {
        if (emails.length === 1) {
            setEmails([''])
        } else {
            setEmails(emails.filter((_, i) => i !== index))
        }
    }

    // ── Hydrate local state from draft (create) or initialData (edit) ──
    useEffect(() => {
        if (!open) return

        if (isEditMode) {
            // Edit mode: load from initialData
            setNombre(initialData.nombre || '')
            setRazonSocial(initialData.razonSocial || '')
            setNit(initialData.nit || '')
            setDescripcion(initialData.descripcion || '')
            if (initialData.emails && initialData.emails.length > 0) {
                setEmails(initialData.emails)
            } else if (initialData.email) {
                setEmails(initialData.email.split(',').map((e) => e.trim()).filter(Boolean))
            } else {
                setEmails([''])
            }
            setSitioWeb(initialData.sitioWeb || '')
            setTelefonoPrincipal(initialData.telefonoPrincipal || '')
            setWhatsappPrincipal(initialData.whatsappPrincipal || '')
            setSelectedCategoryKeys(initialData.categorias || [])
            setSedes(initialData.sedes && initialData.sedes.length > 0 ? initialData.sedes : [EMPTY_SEDE])
        } else {
            // Create mode: restore from sessionStorage draft
            setNombre(draft.nombre)
            setRazonSocial(draft.razonSocial)
            setNit(draft.nit)
            setDescripcion(draft.descripcion)
            setEmails(draft.emails.length > 0 ? draft.emails : [''])
            setSitioWeb(draft.sitioWeb)
            setTelefonoPrincipal(draft.telefonoPrincipal)
            setWhatsappPrincipal(draft.whatsappPrincipal)
            setSelectedCategoryKeys(draft.selectedCategoryKeys)
            setSedes(draft.sedes.length > 0 ? draft.sedes : [EMPTY_SEDE])
        }
        setErrorMsg(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialData, open])

    // ── Persist local state changes to Zustand draft (create mode only) ──
    const syncDraft = useCallback(() => {
        if (isEditMode) return
        updateDraft({
            nombre, razonSocial, nit, descripcion, emails,
            sitioWeb, telefonoPrincipal, whatsappPrincipal,
            selectedCategoryKeys, sedes,
        })
    }, [isEditMode, updateDraft, nombre, razonSocial, nit, descripcion, emails, sitioWeb, telefonoPrincipal, whatsappPrincipal, selectedCategoryKeys, sedes])

    useEffect(() => {
        if (!open || isEditMode) return
        syncDraft()
    }, [open, isEditMode, syncDraft])

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
            const cleanEmails = emails.map((e) => e.trim()).filter(Boolean)

            const payload: CreateTiendaInput = {
                nombre: nombre.trim(),
                razonSocial: razonSocial.trim(),
                nit: nit.trim(),
                descripcion: descripcion.trim(),
                emails: cleanEmails,
                email: cleanEmails.join(', ') || undefined,
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
                        {/* Name & Razón Social / NIT */}
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                            <TextField
                                label="Nombre del Negocio / Tienda *"
                                size="small"
                                required
                                placeholder="Ej: Ferretería y Pinturas El Sol"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                sx={{ flex: 2, minWidth: 240 }}
                            />
                            <TextField
                                label="Razón Social (Opcional)"
                                size="small"
                                placeholder="Ej: Distribuidora El Sol S.A.S."
                                value={razonSocial}
                                onChange={(e) => setRazonSocial(e.target.value)}
                                sx={{ flex: 1.5, minWidth: 180 }}
                            />
                            <TextField
                                label="NIT (Opcional)"
                                size="small"
                                placeholder="Ej: 900.123.456-7"
                                value={nit}
                                onChange={(e) => setNit(e.target.value)}
                                sx={{ flex: 1, minWidth: 140 }}
                            />
                        </Box>

                        {/* Categories */}
                        <Autocomplete
                            multiple
                            size="small"
                            options={ListadoCategoriasTiendas}
                            getOptionLabel={(option) => option.label}
                            getOptionDisabled={() => selectedCategoryKeys.length >= 4}
                            filterOptions={(options, state) => {
                                const query = state.inputValue
                                    .trim()
                                    .toLowerCase()
                                    .normalize('NFD')
                                    .replace(/[\u0300-\u036f]/g, '')
                                if (!query) return options
                                return options.filter((option) => {
                                    const labelNorm = option.label
                                        .toLowerCase()
                                        .normalize('NFD')
                                        .replace(/[\u0300-\u036f]/g, '')
                                    const descNorm = (option.description || '')
                                        .toLowerCase()
                                        .normalize('NFD')
                                        .replace(/[\u0300-\u036f]/g, '')
                                    const synonymMatch = (option.synonyms || []).some((syn) => {
                                        const synNorm = syn
                                            .toLowerCase()
                                            .normalize('NFD')
                                            .replace(/[\u0300-\u036f]/g, '')
                                        return synNorm.includes(query) || query.includes(synNorm)
                                    })
                                    return labelNorm.includes(query) || descNorm.includes(query) || synonymMatch
                                })
                            }}
                            value={ListadoCategoriasTiendas.filter((c) => selectedCategoryKeys.includes(c.key))}
                            onChange={(_, newValue) => {
                                if (newValue.length <= 4) {
                                    setSelectedCategoryKeys(newValue.map((c) => c.key))
                                }
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Categorías *"
                                    placeholder={selectedCategoryKeys.length >= 4 ? '' : 'Seleccionar categorías'}
                                    helperText={
                                        selectedCategoryKeys.length >= 4
                                            ? 'Máximo 4 categorías permitidas'
                                            : `${selectedCategoryKeys.length}/4 categorías seleccionadas`
                                    }
                                    FormHelperTextProps={{
                                        sx: { color: selectedCategoryKeys.length >= 4 ? 'warning.main' : 'text.secondary' },
                                    }}
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
                        />

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

                        {/* Contact Website */}
                        <TextField
                            label="Sitio Web (Opcional)"
                            size="small"
                            placeholder="Ej: https://mi-tienda.com"
                            value={sitioWeb}
                            onChange={(e) => setSitioWeb(e.target.value)}
                            fullWidth
                        />

                        {/* Dynamic Emails Section */}
                        <Box sx={{ p: 2, borderRadius: 2, bgcolor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                            <Typography variant="subtitle2" fontWeight={700} color="text.primary" sx={{ mb: 1.5 }}>
                                Correos Electrónicos de Contacto (Opcional)
                            </Typography>
                            {emails.map((emailVal, idx) => (
                                <Box key={idx} sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1.5 }}>
                                    <TextField
                                        label={idx === 0 ? "Correo Electrónico Principal" : `Correo Secundario #${idx + 1}`}
                                        size="small"
                                        type="email"
                                        placeholder="contacto@mitienda.com"
                                        value={emailVal}
                                        onChange={(e) => handleEmailChange(idx, e.target.value)}
                                        sx={{ flex: 1 }}
                                    />
                                    <IconButton
                                        size="small"
                                        color="default"
                                        onClick={() => handleRemoveEmail(idx)}
                                        disabled={emails.length === 1 && !emails[0]}
                                        title="Eliminar correo"
                                    >
                                        <DeleteOutlineIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                            ))}
                            <Button
                                variant="outlined"
                                size="small"
                                startIcon={<AddCircleOutlineIcon />}
                                onClick={handleAddEmail}
                                sx={{ textTransform: 'none', borderRadius: 2, fontWeight: 600 }}
                            >
                                Agregar otro correo
                            </Button>
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
                        {isSubmitting ? 'Guardando...' : initialData ? 'Actualizar Tienda' : 'Enviar Registro'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}
