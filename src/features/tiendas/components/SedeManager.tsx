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
    Divider,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import MapIcon from '@mui/icons-material/Map'
import PhoneIcon from '@mui/icons-material/Phone'
import { zoneNames } from '@assets/data/ListadoZonas'
import { Ubicacion } from '@features/marketing'
import type { SedeLocation } from '@services/tiendas'

interface SedeManagerProps {
    sedes: SedeLocation[]
    onChange: (sedes: SedeLocation[]) => void
}

export const SedeManager: React.FC<SedeManagerProps> = ({ sedes, onChange }) => {
    const [editingIdx, setEditingIdx] = useState<number | null>(null)
    const [openMapModal, setOpenMapModal] = useState(false)
    const [activeSedeForMap, setActiveSedeForMap] = useState<number>(0)

    const handleAddSede = () => {
        const newSede: SedeLocation = {
            id: `sede_${Date.now()}_${sedes.length + 1}`,
            nombreSede: sedes.length === 0 ? 'Sucursal Principal' : `Sede ${sedes.length + 1}`,
            direccion: '',
            ciudad: 'Bogotá, Colombia',
            codigoPostal: '',
            zona: 'bogota',
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
        updated[idx] = {
            ...updated[idx],
            [field]: value,
        }
        onChange(updated)
    }

    const handleUpdatePhone = (sedeIdx: number, phoneIdx: number, value: string) => {
        const updated = [...sedes]
        const telefonos = [...updated[sedeIdx].telefonos]
        telefonos[phoneIdx] = value
        updated[sedeIdx] = {
            ...updated[sedeIdx],
            telefonos,
        }
        onChange(updated)
    }

    const handleAddPhone = (sedeIdx: number) => {
        const updated = [...sedes]
        updated[sedeIdx] = {
            ...updated[sedeIdx],
            telefonos: [...updated[sedeIdx].telefonos, ''],
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
                {sedes.map((sede, idx) => (
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
                                    placeholder="Ej: Sede Chapinero"
                                    value={sede.nombreSede}
                                    onChange={(e) => handleUpdateSede(idx, 'nombreSede', e.target.value)}
                                    sx={{ flex: 1, minWidth: 200 }}
                                />
                                <TextField
                                    select
                                    label="Zona de Bogotá"
                                    size="small"
                                    value={sede.zona || 'bogota'}
                                    onChange={(e) => handleUpdateSede(idx, 'zona', e.target.value)}
                                    sx={{ minWidth: 180 }}
                                >
                                    {Object.entries(zoneNames).map(([slug, name]) => (
                                        <MenuItem key={slug} value={slug}>
                                            {name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Box>

                            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
                                <TextField
                                    label="Dirección exacta"
                                    size="small"
                                    placeholder="Ej: Calle 15 # 85-30"
                                    value={sede.direccion}
                                    onChange={(e) => handleUpdateSede(idx, 'direccion', e.target.value)}
                                    sx={{ flex: 2, minWidth: 220 }}
                                />
                                <TextField
                                    label="Ciudad"
                                    size="small"
                                    value={sede.ciudad}
                                    onChange={(e) => handleUpdateSede(idx, 'ciudad', e.target.value)}
                                    sx={{ flex: 1, minWidth: 150 }}
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
                                    sx={{ textTransform: 'none', height: 40 }}
                                >
                                    Registrar en mapa
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
                                    sx={{ flex: 1, minWidth: 200 }}
                                />
                                <TextField
                                    label="Cargo del contacto (Opcional)"
                                    size="small"
                                    placeholder="Ej: Administrador / Encargado de ventas"
                                    value={sede.cargoContacto || ''}
                                    onChange={(e) => handleUpdateSede(idx, 'cargoContacto', e.target.value)}
                                    sx={{ flex: 1, minWidth: 200 }}
                                />
                            </Box>

                            {/* Phone numbers for this branch */}
                            <Box>
                                <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                                    Teléfono(s) de contacto para esta sede:
                                </Typography>
                                <Stack spacing={1}>
                                    {sede.telefonos.map((tel, tIdx) => (
                                        <Box key={tIdx} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                            <TextField
                                                size="small"
                                                placeholder="Ej: 6013456789 o 3102345678"
                                                value={tel}
                                                onChange={(e) => handleUpdatePhone(idx, tIdx, e.target.value)}
                                                sx={{ width: 240 }}
                                            />
                                            {tIdx === sede.telefonos.length - 1 && (
                                                <Button size="small" onClick={() => handleAddPhone(idx)}>
                                                    + Teléfono
                                                </Button>
                                            )}
                                        </Box>
                                    ))}
                                </Stack>
                            </Box>

                            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                                <TextField
                                    label="WhatsApp Sede (Opcional)"
                                    size="small"
                                    placeholder="Ej: 573102345678"
                                    value={sede.whatsapp || ''}
                                    onChange={(e) => handleUpdateSede(idx, 'whatsapp', e.target.value)}
                                    sx={{ flex: 1, minWidth: 180 }}
                                />
                                <TextField
                                    label="Horario de Atención (Opcional)"
                                    size="small"
                                    placeholder="Ej: Lun-Vie 8:00 - 17:00"
                                    value={sede.horario || ''}
                                    onChange={(e) => handleUpdateSede(idx, 'horario', e.target.value)}
                                    sx={{ flex: 1, minWidth: 200 }}
                                />
                            </Box>
                        </Stack>
                    </Paper>
                ))}
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
