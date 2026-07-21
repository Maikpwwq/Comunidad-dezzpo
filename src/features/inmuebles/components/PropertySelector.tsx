import React, { useEffect, useState, useCallback } from 'react'
import {
    Box,
    FormControl,
    FormLabel,
    Select,
    MenuItem,
    Button,
    Typography,
    Chip,
    Skeleton,
    Alert,
    FormHelperText
} from '@mui/material'
import HomeWorkIcon from '@mui/icons-material/HomeWork'
import AddIcon from '@mui/icons-material/Add'
import StarIcon from '@mui/icons-material/Star'
import { getInmuebles, createInmueble, type Inmueble, type CreateInmuebleInput } from '@services/inmuebles'
import { InmuebleFormModal } from './InmuebleFormModal'

interface PropertySelectorProps {
    propietarioId: string | null
    selectedInmuebleId?: string
    onSelectInmueble: (inmueble: Inmueble | null) => void
    label?: string
    allowAddNew?: boolean
    helperText?: string
    error?: boolean
}

export const PropertySelector: React.FC<PropertySelectorProps> = ({
    propietarioId,
    selectedInmuebleId,
    onSelectInmueble,
    label = '¿En cuál de tus inmuebles se requiere el servicio?',
    allowAddNew = true,
    helperText,
    error = false,
}) => {
    const [inmuebles, setInmuebles] = useState<Inmueble[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [currentSelectedId, setCurrentSelectedId] = useState<string>('')
    const [openAddModal, setOpenAddModal] = useState(false)

    const fetchProperties = useCallback(async () => {
        if (!propietarioId) {
            setIsLoading(false)
            return
        }

        setIsLoading(true)
        try {
            const res = await getInmuebles(propietarioId)
            if (res.success && res.data) {
                setInmuebles(res.data)

                // Select logic: prefer provided ID, otherwise preferred item, otherwise first item
                let target: Inmueble | undefined
                if (selectedInmuebleId) {
                    target = res.data.find(i => i.id === selectedInmuebleId)
                }
                if (!target) {
                    target = res.data.find(i => i.isPreferida) || res.data[0]
                }

                if (target) {
                    setCurrentSelectedId(target.id)
                    onSelectInmueble(target)
                } else {
                    setCurrentSelectedId('')
                    onSelectInmueble(null)
                }
            }
        } catch (err) {
            console.error('[PropertySelector] Failed to fetch properties:', err)
        } finally {
            setIsLoading(false)
        }
    }, [propietarioId, selectedInmuebleId, onSelectInmueble])

    useEffect(() => {
        fetchProperties()
    }, [fetchProperties])

    const handleChange = (e: any) => {
        const val = e.target.value
        setCurrentSelectedId(val)
        const selected = inmuebles.find(i => i.id === val) || null
        onSelectInmueble(selected)
    }

    const handleSaveNewProperty = async (data: CreateInmuebleInput): Promise<boolean> => {
        if (!propietarioId) return false
        const res = await createInmueble(propietarioId, data)
        if (res.success && res.data) {
            await fetchProperties()
            setCurrentSelectedId(res.data.id)
            onSelectInmueble(res.data)
            return true
        }
        return false
    }

    if (isLoading) {
        return (
            <Box mb={2}>
                <Skeleton variant="text" width={200} height={24} sx={{ mb: 1 }} />
                <Skeleton variant="rounded" height={44} />
            </Box>
        )
    }

    return (
        <Box mb={2}>
            <FormControl fullWidth error={error}>
                {label && (
                    <FormLabel sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.875rem', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <HomeWorkIcon sx={{ fontSize: 18, color: '#0f766e' }} />
                        {label}
                    </FormLabel>
                )}

                {inmuebles.length > 0 ? (
                    <Box display="flex" gap={1} alignItems="center">
                        <Select
                            value={currentSelectedId}
                            onChange={handleChange}
                            displayEmpty
                            size="small"
                            sx={{ flex: 1, borderRadius: 2 }}
                        >
                            {inmuebles.map((item) => (
                                <MenuItem key={item.id} value={item.id}>
                                    <Box display="flex" alignItems="center" justifyContent="space-between" width="100%" gap={1}>
                                        <Typography variant="body2" fontWeight={600} color="#0f172a">
                                            {item.alias} <Typography component="span" variant="caption" color="text.secondary">({item.direccion}, {item.ciudad})</Typography>
                                        </Typography>
                                        {item.isPreferida && (
                                            <Chip
                                                icon={<StarIcon style={{ color: '#0f766e', fontSize: 12 }} />}
                                                label="Preferida"
                                                size="small"
                                                sx={{ height: 20, fontSize: '0.7rem', bgcolor: '#f0fdfa', color: '#0f766e', fontWeight: 700 }}
                                            />
                                        )}
                                    </Box>
                                </MenuItem>
                            ))}
                        </Select>

                        {allowAddNew && (
                            <Button
                                size="small"
                                variant="outlined"
                                onClick={() => setOpenAddModal(true)}
                                startIcon={<AddIcon />}
                                sx={{
                                    height: 40,
                                    whiteSpace: 'nowrap',
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    color: '#0f766e',
                                    borderColor: '#cbd5e1'
                                }}
                            >
                                Nuevo Inmueble
                            </Button>
                        )}
                    </Box>
                ) : (
                    <Alert
                        severity="info"
                        action={
                            allowAddNew && (
                                <Button
                                    size="small"
                                    color="primary"
                                    onClick={() => setOpenAddModal(true)}
                                    startIcon={<AddIcon />}
                                    sx={{ fontWeight: 700, textTransform: 'none' }}
                                >
                                    Registrar Inmueble
                                </Button>
                            )
                        }
                        sx={{ borderRadius: 2 }}
                    >
                        No tienes inmuebles registrados aún. Registra tu primera edificación para continuar.
                    </Alert>
                )}

                {helperText && <FormHelperText>{helperText}</FormHelperText>}
            </FormControl>

            {allowAddNew && (
                <InmuebleFormModal
                    open={openAddModal}
                    onClose={() => setOpenAddModal(false)}
                    onSave={handleSaveNewProperty}
                    isFirstProperty={inmuebles.length === 0}
                />
            )}
        </Box>
    )
}
