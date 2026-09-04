import React, { useState } from 'react'
import {
    Box,
    Button,
    Typography,
    Paper,
    TextField,
    MenuItem,
    IconButton,
    Stack,
    Modal,
    Checkbox,
    FormControlLabel,
    Autocomplete,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import MapIcon from '@mui/icons-material/Map'
import { getZonesForCity, isBogotaRegion, departamentosColombia } from '@assets/data/ListadoZonas'
import { Ubicacion } from '@features/marketing'
import type { SedeLocation } from '@services/tiendas'
import type { ContactoPrincipal } from '@stores/useTiendaFormDraftStore'

interface SedeManagerProps {
    sedes: SedeLocation[]
    onChange: (sedes: SedeLocation[]) => void
    defaultTelefonosPrincipales?: ContactoPrincipal[]
    defaultTelefonoPrincipal?: string
    defaultWhatsappPrincipal?: string
}

export const SedeManager: React.FC<SedeManagerProps> = ({
    sedes,
    onChange,
    defaultTelefonosPrincipales = [],
    defaultTelefonoPrincipal = '',
    defaultWhatsappPrincipal = '',
}) => {
    const [openMapModal, setOpenMapModal] = useState(false)
    const [activeSedeForMap, setActiveSedeForMap] = useState<number>(0)

    const handleAddSede = () => {
        const newSede: SedeLocation = {
            id: `sede_${Date.now()}_${sedes.length + 1}`,
            nombreSede: sedes.length === 0 ? 'Sucursal Principal' : `Sede ${sedes.length + 1}`,
            direccion: '',
            departamento: 'Bogotá D.C.',
            ciudad: 'Bogotá, Colombia',
            codigoPostal: '',
            zona: 'bogota',
            hasCustomPhones: false,
            telefonos: [''],
            whatsapp: '',
            horario: 'Lun-Vie 8:00 - 17:00',
        }
        onChange([...sedes, newSede])
    }

    const handleRemoveSede = (idx: number) => {
        if (sedes.length <= 1) return
        const updated = sedes.filter((_, i) => i !== idx)
        onChange(updated)
    }

    const handleUpdateSede = (idx: number, field: keyof SedeLocation, value: any) => {
        const updated = [...sedes]
        const current = updated[idx]
        if (!current) return
        updated[idx] = {
            ...current,
            [field]: value,
        }
        onChange(updated)
    }

    const handleCityChange = (idx: number, newCity: string) => {
        const updated = [...sedes]
        const currentSede = updated[idx]
        if (!currentSede) return
        const availableZones = getZonesForCity(newCity)
        const validZoneKeys = Object.keys(availableZones)

        let newZona = currentSede.zona
        if (!validZoneKeys.includes(currentSede.zona)) {
            newZona = validZoneKeys[0] || 'centro'
        }

        updated[idx] = {
            ...currentSede,
            ciudad: newCity,
            zona: newZona,
        }
        onChange(updated)
    }

    const handleUpdatePhone = (sedeIdx: number, phoneIdx: number, value: string) => {
        const updated = [...sedes]
        const currentSede = updated[sedeIdx]
        if (!currentSede) return
        const telefonos = [...(currentSede.telefonos || [''])]
        telefonos[phoneIdx] = value
        updated[sedeIdx] = {
            ...currentSede,
            telefonos,
        }
        onChange(updated)
    }

    const handleAddPhone = (sedeIdx: number) => {
        const updated = [...sedes]
        const currentSede = updated[sedeIdx]
        if (!currentSede) return
        const currentTels = currentSede.telefonos || ['']
        updated[sedeIdx] = {
            ...currentSede,
            telefonos: [...currentTels, ''],
        }
        onChange(updated)
    }

    const handleMapLocationSelected = (locInfo: any) => {
        if (activeSedeForMap === null) return

        const updated = [...sedes]
        const current = updated[activeSedeForMap]
        if (current) {
            updated[activeSedeForMap] = {
                ...current,
                direccion: locInfo.userDirection || locInfo.street || current.direccion,
                ciudad: locInfo.userCiudad || locInfo.city || current.ciudad,
                departamento: locInfo.state || locInfo.department || current.departamento || 'Cundinamarca',
                codigoPostal: locInfo.userCodigoPostal || locInfo.postalCode || current.codigoPostal,
                lat: locInfo.lat || current.lat,
                lng: locInfo.lng || current.lng,
            }
            onChange(updated)
        }
        setOpenMapModal(false)
    }

    return (
        <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                <Typography variant="subtitle2" fontWeight={700} color="#0A2540">
                    Sedes y Puntos de Atención ({sedes.length})
                </Typography>
                <Button
                    variant="outlined"
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={handleAddSede}
                    sx={{ textTransform: 'none', borderRadius: 2 }}
                >
                    Agregar otra Sede
                </Button>
            </Box>

            <Stack spacing={2}>
                {sedes.map((sede, idx) => {
                    const currentCityZones = getZonesForCity(sede.ciudad)
                    const isBogota = isBogotaRegion(sede.ciudad)
                    const branchPhones = sede.telefonos && sede.telefonos.length > 0 ? sede.telefonos : ['']

                    return (
                        <Paper
                            key={sede.id || idx}
                            variant="outlined"
                            sx={{ p: 2, borderRadius: 2, backgroundColor: '#fcfcfc', borderColor: 'divider' }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                                <Typography variant="body2" fontWeight={700} color="primary.main">
                                    Sede #{idx + 1}
                                </Typography>
                                {sedes.length > 1 && (
                                    <IconButton
                                        size="small"
                                        color="error"
                                        onClick={() => handleRemoveSede(idx)}
                                        title="Eliminar sede"
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                )}
                            </Box>

                            <Stack spacing={2}>
                                <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                                    <TextField
                                        label="Nombre de la Sede"
                                        size="small"
                                        placeholder="Ej: Sede Chapinero / Sucursal Principal"
                                        value={sede.nombreSede}
                                        onChange={(e) => handleUpdateSede(idx, 'nombreSede', e.target.value)}
                                        sx={{ flex: 1.5, minWidth: { xs: '100%', sm: 180 } }}
                                    />
                                    <Autocomplete
                                        freeSolo
                                        options={departamentosColombia}
                                        size="small"
                                        value={sede.departamento || 'Cundinamarca'}
                                        onChange={(_, newValue) => handleUpdateSede(idx, 'departamento', newValue || '')}
                                        onInputChange={(_, newInputValue) => handleUpdateSede(idx, 'departamento', newInputValue)}
                                        renderInput={(params) => (
                                            <TextField
                                                {...(params as unknown as Record<string, unknown>)}
                                                label="Departamento"
                                                placeholder="Ej: Meta, Huila, Cundinamarca"
                                                size="small"
                                            />
                                        )}
                                        sx={{ flex: 1.2, minWidth: { xs: '100%', sm: 170 } }}
                                    />
                                    <TextField
                                        label="Ciudad / Municipio"
                                        size="small"
                                        placeholder="Ej: Bogotá, Villavicencio, Neiva..."
                                        value={sede.ciudad}
                                        onChange={(e) => handleCityChange(idx, e.target.value)}
                                        sx={{ flex: 1.2, minWidth: { xs: '100%', sm: 160 } }}
                                    />
                                    <TextField
                                        select
                                        label={isBogota ? "Localidad / Zona" : "Zona / Sector"}
                                        size="small"
                                        value={sede.zona && Object.keys(currentCityZones).includes(sede.zona) ? sede.zona : Object.keys(currentCityZones)[0]}
                                        onChange={(e) => handleUpdateSede(idx, 'zona', e.target.value)}
                                        sx={{ flex: 1.2, minWidth: { xs: '100%', sm: 160 } }}
                                    >
                                        {Object.entries(currentCityZones).map(([slug, name]) => (
                                            <MenuItem key={slug} value={slug}>
                                                {name}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Box>

                                <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                                    <TextField
                                        label="Dirección exacta"
                                        size="small"
                                        placeholder="Ej: Calle 15 # 85-30"
                                        value={sede.direccion}
                                        onChange={(e) => handleUpdateSede(idx, 'direccion', e.target.value)}
                                        sx={{ flex: 2, minWidth: { xs: '100%', sm: 240 } }}
                                        helperText="Escribe la dirección en texto libre (no requiere marcar en el mapa)"
                                    />
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        color="secondary"
                                        startIcon={<MapIcon />}
                                        onClick={() => {
                                            setActiveSedeForMap(idx)
                                            setOpenMapModal(true)
                                        }}
                                        sx={{ textTransform: 'none', height: 40, whiteSpace: 'nowrap', mt: { xs: 0.5, sm: 0.2 }, width: { xs: '100%', sm: 'auto' } }}
                                    >
                                        Marcar en mapa (Opcional)
                                    </Button>
                                </Box>

                                <TextField
                                    label="Detalles de ubicación física (Opcional)"
                                    size="small"
                                    placeholder="Ej: Al lado de la panadería La Victoria, local esquinero con fachada verde"
                                    value={sede.detallesUbicacion || ''}
                                    onChange={(e) => handleUpdateSede(idx, 'detallesUbicacion', e.target.value)}
                                    multiline
                                    rows={2}
                                />

                                <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                                    <TextField
                                        label="Nombre de contacto en sede (Opcional)"
                                        size="small"
                                        placeholder="Ej: Pedro Gómez"
                                        value={sede.nombreContacto || ''}
                                        onChange={(e) => handleUpdateSede(idx, 'nombreContacto', e.target.value)}
                                        sx={{ flex: 1, minWidth: { xs: '100%', sm: 200 } }}
                                    />
                                    <TextField
                                        label="Cargo del contacto (Opcional)"
                                        size="small"
                                        placeholder="Ej: Administrador / Encargado de ventas"
                                        value={sede.cargoContacto || ''}
                                        onChange={(e) => handleUpdateSede(idx, 'cargoContacto', e.target.value)}
                                        sx={{ flex: 1, minWidth: { xs: '100%', sm: 200 } }}
                                    />
                                </Box>

                                {/* Contact Numbers Section */}
                                <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                size="small"
                                                checked={!!sede.hasCustomPhones}
                                                onChange={(e) => handleUpdateSede(idx, 'hasCustomPhones', e.target.checked)}
                                            />
                                        }
                                        label={
                                            <Typography variant="body2" fontWeight={600} color="text.primary">
                                                Esta sede tiene teléfonos o WhatsApp diferentes a los principales
                                            </Typography>
                                        }
                                        sx={{ mb: sede.hasCustomPhones ? 1.5 : 0 }}
                                    />

                                    {!sede.hasCustomPhones ? (
                                        <Box sx={{ mt: 1, p: 1.25, borderRadius: 1.5, bgcolor: '#ffffff', border: '1px dashed #cbd5e1' }}>
                                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.25 }}>
                                                ℹ️ <strong>Reutilizando datos de contacto principales del comercio:</strong>
                                            </Typography>
                                            {defaultTelefonosPrincipales.length > 0 ? (
                                                defaultTelefonosPrincipales
                                                    .filter(c => c.telefono.trim() || c.whatsapp.trim())
                                                    .map((c, ci) => (
                                                        <Typography key={ci} variant="body2" color="text.primary">
                                                            📞 Teléfono: <strong>{c.telefono || 'Sin registrar'}</strong> &nbsp;•&nbsp; 💬 WhatsApp: <strong>{c.whatsapp || 'Sin registrar'}</strong>
                                                        </Typography>
                                                    ))
                                            ) : (
                                                <Typography variant="body2" color="text.primary">
                                                    📞 Teléfono: <strong>{defaultTelefonoPrincipal || 'Sin registrar aún'}</strong> &nbsp;•&nbsp; 💬 WhatsApp: <strong>{defaultWhatsappPrincipal || 'Sin registrar aún'}</strong>
                                                </Typography>
                                            )}
                                        </Box>
                                    ) : (
                                        <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                            <Box>
                                                <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                                                    Teléfono(s) exclusivos para esta sede:
                                                </Typography>
                                                <Stack spacing={1}>
                                                    {branchPhones.map((tel, tIdx) => (
                                                        <Box key={tIdx} sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                                                            <TextField
                                                                size="small"
                                                                placeholder="Ej: 6013456789 o 3102345678"
                                                                value={tel}
                                                                onChange={(e) => handleUpdatePhone(idx, tIdx, e.target.value)}
                                                                sx={{ flex: 1, minWidth: { xs: '100%', sm: 200 } }}
                                                            />
                                                            {tIdx === branchPhones.length - 1 && (
                                                                <Button size="small" onClick={() => handleAddPhone(idx)}>
                                                                    + Teléfono
                                                                </Button>
                                                            )}
                                                        </Box>
                                                    ))}
                                                </Stack>
                                            </Box>

                                            <TextField
                                                label="WhatsApp específico de esta Sede (Opcional)"
                                                size="small"
                                                placeholder="Ej: 573102345678"
                                                value={sede.whatsapp || ''}
                                                onChange={(e) => handleUpdateSede(idx, 'whatsapp', e.target.value)}
                                                sx={{ maxWidth: 320 }}
                                            />
                                        </Box>
                                    )}
                                </Box>

                                <TextField
                                    label="Horario de Atención (Opcional)"
                                    size="small"
                                    placeholder="Ej: Lun-Vie 8:00 - 17:00, Sáb 8:00 - 13:00"
                                    value={sede.horario || ''}
                                    onChange={(e) => handleUpdateSede(idx, 'horario', e.target.value)}
                                    fullWidth
                                />
                            </Stack>
                        </Paper>
                    )
                })}
            </Stack>

            {/* Map Location Picker Modal */}
            <Modal open={openMapModal} onClose={() => setOpenMapModal(false)}>
                <Box sx={{ p: 2, maxWidth: 700, margin: '50px auto', outline: 'none' }}>
                    <Ubicacion
                        setLocInfo={handleMapLocationSelected}
                        setOpen={setOpenMapModal}
                    />
                </Box>
            </Modal>
        </Box>
    )
}

