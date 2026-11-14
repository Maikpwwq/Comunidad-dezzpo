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
    Autocomplete,
    Chip,
    Tooltip,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import MapIcon from '@mui/icons-material/Map'
import StarIcon from '@mui/icons-material/Star'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import { getZonesForCity, isBogotaRegion, departamentosColombia } from '@assets/data/ListadoZonas'
import { Ubicacion } from '@features/marketing'
import type { UserLocationItem } from '@services/types'

export interface UserLocationManagerProps {
    locations: UserLocationItem[]
    onChange: (locations: UserLocationItem[]) => void
}

export const UserLocationManager: React.FC<UserLocationManagerProps> = ({
    locations,
    onChange,
}) => {
    const [openMapModal, setOpenMapModal] = useState(false)
    const [activeLocationIdxForMap, setActiveLocationIdxForMap] = useState<number>(0)

    const handleAddLocation = () => {
        const nextIdx = locations.length + 1
        const newLocation: UserLocationItem = {
            id: `loc_${Date.now()}_${nextIdx}`,
            nombre: locations.length === 0 ? 'Sucursal Principal' : `Sede #${nextIdx}`,
            nombreSede: locations.length === 0 ? 'Sucursal Principal' : `Sede #${nextIdx}`,
            direccion: '',
            departamento: 'Bogotá D.C.',
            ciudad: 'Bogotá, Colombia',
            codigoPostal: '',
            zona: 'bogota',
            detallesUbicacion: '',
            isPrimary: locations.length === 0,
            horario: 'Lun-Vie 8:00 - 17:00',
        }
        onChange([...locations, newLocation])
    }

    const handleRemoveLocation = (idx: number) => {
        if (locations.length <= 1) return
        if (locations[idx]?.isPrimary) return

        const updated = locations.filter((_, i) => i !== idx)
        onChange(updated)
    }

    const handleSetPrimary = (idx: number) => {
        const updated = locations.map((loc, i) => ({
            ...loc,
            isPrimary: i === idx,
        }))
        onChange(updated)
    }

    const handleUpdateLocation = (idx: number, field: keyof UserLocationItem, value: unknown) => {
        const updated = [...locations]
        const current = updated[idx]
        if (!current) return

        updated[idx] = {
            ...current,
            [field]: value,
            ...(field === 'nombre' ? { nombreSede: value as string } : {}),
            ...(field === 'nombreSede' ? { nombre: value as string } : {}),
        }
        onChange(updated)
    }

    const handleCityChange = (idx: number, newCity: string) => {
        const updated = [...locations]
        const currentLoc = updated[idx]
        if (!currentLoc) return

        const availableZones = getZonesForCity(newCity)
        const validZoneKeys = Object.keys(availableZones)

        let newZona = currentLoc.zona || ''
        if (!validZoneKeys.includes(newZona)) {
            newZona = validZoneKeys[0] || 'centro'
        }

        updated[idx] = {
            ...currentLoc,
            ciudad: newCity,
            zona: newZona,
        }
        onChange(updated)
    }

    const handleMapLocationSelected = (locInfo: Record<string, unknown>) => {
        if (activeLocationIdxForMap === null || activeLocationIdxForMap === undefined) return

        const updated = [...locations]
        const current = updated[activeLocationIdxForMap]
        if (current) {
            const userDir = (locInfo.userDirection || locInfo.street || current.direccion) as string
            const userCity = (locInfo.userCiudad || locInfo.city || current.ciudad) as string
            const userDept = (locInfo.state || locInfo.department || current.departamento || 'Bogotá D.C.') as string
            const userPostal = (locInfo.userCodigoPostal || locInfo.postalCode || current.codigoPostal || '') as string
            const lat = (locInfo.lat || current.lat) as number | undefined
            const lng = (locInfo.lng || current.lng) as number | undefined

            updated[activeLocationIdxForMap] = {
                ...current,
                direccion: userDir,
                ciudad: userCity,
                departamento: userDept,
                codigoPostal: userPostal,
                lat,
                lng,
            }
            onChange(updated)
        }
        setOpenMapModal(false)
    }

    return (
        <Box sx={{ mt: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle2" fontWeight={700} color="#0A2540">
                    Sedes y Puntos de Atención ({locations.length})
                </Typography>
                <Button
                    variant="outlined"
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={handleAddLocation}
                    sx={{ textTransform: 'none', borderRadius: 2 }}
                >
                    Agregar otra Sede
                </Button>
            </Box>

            <Stack spacing={2.5}>
                {locations.map((loc, idx) => {
                    const currentCityZones = getZonesForCity(loc.ciudad)
                    const isBogota = isBogotaRegion(loc.ciudad)

                    return (
                        <Paper
                            key={loc.id || idx}
                            variant="outlined"
                            sx={{
                                p: 2,
                                borderRadius: 2,
                                backgroundColor: '#fcfcfc',
                                borderColor: loc.isPrimary ? 'primary.main' : 'divider',
                                borderWidth: loc.isPrimary ? 1.5 : 1,
                            }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Typography variant="body2" fontWeight={700} color="primary.main">
                                        Sede #{idx + 1}
                                    </Typography>
                                    {loc.isPrimary ? (
                                        <Chip
                                            label="Principal"
                                            color="primary"
                                            size="small"
                                            icon={<StarIcon sx={{ fontSize: '1rem !important' }} />}
                                            sx={{ fontWeight: 600, height: 24 }}
                                        />
                                    ) : (
                                        <Button
                                            size="small"
                                            variant="text"
                                            startIcon={<StarBorderIcon />}
                                            onClick={() => handleSetPrimary(idx)}
                                            sx={{ textTransform: 'none', fontSize: '0.8rem', py: 0.25 }}
                                        >
                                            Establecer como principal
                                        </Button>
                                    )}
                                </Box>

                                {locations.length > 1 && (
                                    <Tooltip title={loc.isPrimary ? 'No puedes eliminar la sede principal' : 'Eliminar sede'}>
                                        <span>
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => handleRemoveLocation(idx)}
                                                disabled={Boolean(loc.isPrimary)}
                                                aria-label={loc.isPrimary ? 'No puedes eliminar la sede principal' : 'Eliminar sede'}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </span>
                                    </Tooltip>
                                )}
                            </Box>

                            <Stack spacing={2}>
                                {/* Row 1: Nombre, Departamento, Ciudad, Zona */}
                                <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                                    <TextField
                                        label="Nombre de la Sede"
                                        size="small"
                                        placeholder="Ej: Sucursal Principal / Sede Chapinero"
                                        value={loc.nombre || loc.nombreSede || ''}
                                        onChange={(e) => handleUpdateLocation(idx, 'nombre', e.target.value)}
                                        sx={{ flex: 1.5, minWidth: { xs: '100%', sm: 180 } }}
                                    />
                                    <Autocomplete
                                        freeSolo
                                        options={departamentosColombia}
                                        size="small"
                                        value={loc.departamento || 'Bogotá D.C.'}
                                        onChange={(_, newValue) => handleUpdateLocation(idx, 'departamento', newValue || '')}
                                        onInputChange={(_, newInputValue) => handleUpdateLocation(idx, 'departamento', newInputValue)}
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
                                        value={loc.ciudad}
                                        onChange={(e) => handleCityChange(idx, e.target.value)}
                                        sx={{ flex: 1.2, minWidth: { xs: '100%', sm: 160 } }}
                                    />
                                    <TextField
                                        select
                                        label={isBogota ? 'Localidad / Zona' : 'Zona / Sector'}
                                        size="small"
                                        value={loc.zona && Object.keys(currentCityZones).includes(loc.zona) ? loc.zona : Object.keys(currentCityZones)[0] || ''}
                                        onChange={(e) => handleUpdateLocation(idx, 'zona', e.target.value)}
                                        sx={{ flex: 1.2, minWidth: { xs: '100%', sm: 160 } }}
                                    >
                                        {Object.entries(currentCityZones).map(([slug, name]) => (
                                            <MenuItem key={slug} value={slug}>
                                                {name}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Box>

                                {/* Row 2: Dirección exacta, Código Postal, Marcar en mapa */}
                                <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                                    <TextField
                                        label="Dirección exacta"
                                        size="small"
                                        placeholder="Ej: Calle 15 # 85-30"
                                        value={loc.direccion}
                                        onChange={(e) => handleUpdateLocation(idx, 'direccion', e.target.value)}
                                        sx={{ flex: 2, minWidth: { xs: '100%', sm: 240 } }}
                                        helperText="Escribe la dirección en texto libre (no requiere marcar en el mapa)"
                                    />
                                    <TextField
                                        label="Código Postal"
                                        size="small"
                                        placeholder="Ej: 110111"
                                        value={loc.codigoPostal || ''}
                                        onChange={(e) => handleUpdateLocation(idx, 'codigoPostal', e.target.value)}
                                        sx={{ width: { xs: '100%', sm: 140 } }}
                                    />
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        color="secondary"
                                        startIcon={<MapIcon />}
                                        onClick={() => {
                                            setActiveLocationIdxForMap(idx)
                                            setOpenMapModal(true)
                                        }}
                                        sx={{
                                            textTransform: 'none',
                                            height: 40,
                                            whiteSpace: 'nowrap',
                                            mt: { xs: 0.5, sm: 0.2 },
                                            width: { xs: '100%', sm: 'auto' },
                                        }}
                                    >
                                        Marcar en mapa (Opcional)
                                    </Button>
                                </Box>

                                {/* Row 3: Detalles de ubicación física */}
                                <TextField
                                    label="Detalles de ubicación física (Opcional)"
                                    size="small"
                                    placeholder="Ej: Al lado de la panadería La Victoria, local esquinero con fachada verde"
                                    value={loc.detallesUbicacion || ''}
                                    onChange={(e) => handleUpdateLocation(idx, 'detallesUbicacion', e.target.value)}
                                    multiline
                                    rows={2}
                                    fullWidth
                                />

                                {/* Row 4: Contacto en sede */}
                                <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                                    <TextField
                                        label="Nombre de contacto en sede (Opcional)"
                                        size="small"
                                        placeholder="Ej: Pedro Gómez"
                                        value={loc.nombreContacto || ''}
                                        onChange={(e) => handleUpdateLocation(idx, 'nombreContacto', e.target.value)}
                                        sx={{ flex: 1, minWidth: { xs: '100%', sm: 200 } }}
                                    />
                                    <TextField
                                        label="Cargo del contacto (Opcional)"
                                        size="small"
                                        placeholder="Ej: Administrador / Encargado de ventas"
                                        value={loc.cargoContacto || ''}
                                        onChange={(e) => handleUpdateLocation(idx, 'cargoContacto', e.target.value)}
                                        sx={{ flex: 1, minWidth: { xs: '100%', sm: 200 } }}
                                    />
                                </Box>

                                {/* Row 5: Teléfono de la sede y Horario */}
                                <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                                    <TextField
                                        label="Teléfono / WhatsApp de la sede (Opcional)"
                                        size="small"
                                        placeholder="Ej: +57 300 123 4567"
                                        value={loc.telefono || loc.whatsapp || ''}
                                        onChange={(e) => handleUpdateLocation(idx, 'telefono', e.target.value)}
                                        sx={{ flex: 1, minWidth: { xs: '100%', sm: 200 } }}
                                    />
                                    <TextField
                                        label="Horario de Atención (Opcional)"
                                        size="small"
                                        placeholder="Ej: Lun-Vie 8:00 - 17:00, Sáb 8:00 - 13:00"
                                        value={loc.horario || ''}
                                        onChange={(e) => handleUpdateLocation(idx, 'horario', e.target.value)}
                                        sx={{ flex: 1.5, minWidth: { xs: '100%', sm: 240 } }}
                                    />
                                </Box>
                            </Stack>
                        </Paper>
                    )
                })}
            </Stack>

            {/* Map Location Picker Modal */}
            <Modal open={openMapModal} onClose={() => setOpenMapModal(false)}>
                <Box sx={{ p: 2, maxWidth: 700, margin: '50px auto', outline: 'none' }}>
                    <Ubicacion
                        setLocInfo={handleMapLocationSelected as any}
                        locInfo={
                            locations[activeLocationIdxForMap]
                                ? {
                                    userDirection: locations[activeLocationIdxForMap]?.direccion || '',
                                    userCiudad: locations[activeLocationIdxForMap]?.ciudad || '',
                                    userDepartamento: locations[activeLocationIdxForMap]?.departamento || 'Bogotá D.C.',
                                    userCodigoPostal: locations[activeLocationIdxForMap]?.codigoPostal || '',
                                }
                                : {}
                        }
                        setOpen={setOpenMapModal}
                    />
                </Box>
            </Modal>
        </Box>
    )
}

export default UserLocationManager
