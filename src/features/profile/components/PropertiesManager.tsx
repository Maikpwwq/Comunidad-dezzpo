import React, { useState, useEffect } from 'react'
import {
    Box,
    Typography,
    Button,
    Grid,
    Card,
    CardContent,
    CardActions,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    CircularProgress,
    FormControlLabel,
    Checkbox
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import type { Property } from '@services/types'
import { addProperty, updateProperty, deleteProperty } from '@services/users'
import { v4 as uuidv4 } from 'uuid'

interface PropertiesManagerProps {
    userId: string
    initialProperties: Property[]
}

export default function PropertiesManager({ userId, initialProperties }: PropertiesManagerProps) {
    const [properties, setProperties] = useState<Property[]>(initialProperties || [])
    
    // Create / Edit Modal State
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingProperty, setEditingProperty] = useState<Property | null>(null)
    const [formData, setFormData] = useState<Partial<Property>>({})
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Delete Confirmation State
    const [deleteCandidate, setDeleteCandidate] = useState<Property | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)

    // Sync with upstream props if needed
    useEffect(() => {
        if (initialProperties) setProperties(initialProperties)
    }, [initialProperties])

    const handleOpenForm = (property?: Property) => {
        if (property) {
            setEditingProperty(property)
            setFormData({ ...property })
        } else {
            setEditingProperty(null)
            setFormData({ isMain: false })
        }
        setIsFormOpen(true)
    }

    const handleCloseForm = () => {
        setIsFormOpen(false)
        setEditingProperty(null)
        setFormData({})
    }

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    const handleSaveProperty = async () => {
        if (!formData.name || !formData.address || !formData.city) return

        setIsSubmitting(true)
        try {
            if (editingProperty) {
                // Update
                const updatedProp = { ...editingProperty, ...formData } as Property
                
                // Optimistic UI update
                setProperties(prev => prev.map(p => p.id === updatedProp.id ? updatedProp : p))
                
                // Firebase Sync
                await updateProperty(userId, updatedProp)
            } else {
                // Create
                const newProp: Property = {
                    id: uuidv4(),
                    name: formData.name,
                    address: formData.address,
                    city: formData.city,
                    postalCode: formData.postalCode || '',
                    isMain: formData.isMain || false
                }
                
                // Optimistic UI update
                setProperties(prev => [...prev, newProp])
                
                // Firebase Sync
                await addProperty(userId, newProp)
            }
            handleCloseForm()
        } catch (error) {
            console.error('Error saving property:', error)
            // Revert optimistic update here if necessary (requires storing previous state)
        } finally {
            setIsSubmitting(false)
        }
    }

    const confirmDelete = (property: Property) => {
        setDeleteCandidate(property)
    }

    const handleDeleteProperty = async () => {
        if (!deleteCandidate) return

        setIsDeleting(true)
        try {
            // Optimistic UI update
            setProperties(prev => prev.filter(p => p.id !== deleteCandidate.id))
            
            // Firebase Sync
            await deleteProperty(userId, deleteCandidate)
            setDeleteCandidate(null)
        } catch (error) {
            console.error('Error deleting property:', error)
            // Revert optimistic update
            setProperties(prev => [...prev, deleteCandidate])
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <Box sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'var(--primary-titles-text-color)' }}>
                    Mis Propiedades / Edificaciones
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddCircleOutlineIcon />}
                    onClick={() => handleOpenForm()}
                    sx={{
                        borderRadius: '50px',
                        backgroundColor: 'var(--background-main-green-color, #4caf50)',
                        textTransform: 'none',
                        fontWeight: 600,
                        '&:hover': {
                            backgroundColor: 'var(--primary-green-text-color, #388e3c)',
                        }
                    }}
                >
                    Agregar Propiedad
                </Button>
            </Box>

            {properties.length === 0 ? (
                <Typography variant="body1" color="text.secondary">
                    No tienes edificaciones o propiedades registradas.
                </Typography>
            ) : (
                <Grid container spacing={3}>
                    {properties.map(property => (
                        <Grid item xs={12} sm={6} md={4} key={property.id}>
                            <Card sx={{ 
                                borderRadius: '20px', 
                                boxShadow: 3, 
                                height: '100%', 
                                display: 'flex', 
                                flexDirection: 'column' 
                            }}>
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                            {property.name}
                                        </Typography>
                                        {property.isMain && (
                                            <CheckCircleIcon color="success" fontSize="small" titleAccess="Propiedad Principal" />
                                        )}
                                    </Box>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                        {property.address}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {property.city} {property.postalCode ? `, ${property.postalCode}` : ''}
                                    </Typography>
                                </CardContent>
                                <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 2 }}>
                                    <IconButton color="primary" onClick={() => handleOpenForm(property)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton color="error" onClick={() => confirmDelete(property)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Create/Edit Form Dialog */}
            <Dialog open={isFormOpen} onClose={!isSubmitting ? handleCloseForm : undefined} fullWidth maxWidth="sm">
                <DialogTitle sx={{ fontWeight: 'bold' }}>
                    {editingProperty ? 'Editar Propiedad' : 'Agregar Propiedad'}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Nombre (Ej. Edificio Central)"
                        name="name"
                        value={formData.name || ''}
                        onChange={handleFormChange}
                        fullWidth
                        required
                        disabled={isSubmitting}
                    />
                    <TextField
                        margin="dense"
                        label="Dirección"
                        name="address"
                        value={formData.address || ''}
                        onChange={handleFormChange}
                        fullWidth
                        required
                        disabled={isSubmitting}
                    />
                    <TextField
                        margin="dense"
                        label="Ciudad"
                        name="city"
                        value={formData.city || ''}
                        onChange={handleFormChange}
                        fullWidth
                        required
                        disabled={isSubmitting}
                    />
                    <TextField
                        margin="dense"
                        label="Código Postal (Opcional)"
                        name="postalCode"
                        value={formData.postalCode || ''}
                        onChange={handleFormChange}
                        fullWidth
                        disabled={isSubmitting}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox 
                                checked={formData.isMain || false}
                                onChange={handleFormChange}
                                name="isMain"
                                color="success"
                                disabled={isSubmitting}
                            />
                        }
                        label="Definir como propiedad principal"
                        sx={{ mt: 1 }}
                    />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button 
                        onClick={handleCloseForm} 
                        color="inherit" 
                        disabled={isSubmitting}
                        sx={{ textTransform: 'none' }}
                    >
                        Cancelar
                    </Button>
                    <Button 
                        onClick={handleSaveProperty} 
                        variant="contained"
                        disabled={!formData.name || !formData.address || !formData.city || isSubmitting}
                        sx={{
                            borderRadius: '50px',
                            backgroundColor: 'var(--background-main-green-color, #4caf50)',
                            textTransform: 'none',
                            '&:hover': {
                                backgroundColor: 'var(--primary-green-text-color, #388e3c)',
                            }
                        }}
                    >
                        {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Guardar Propiedad'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={!!deleteCandidate} onClose={!isDeleting ? () => setDeleteCandidate(null) : undefined}>
                <DialogTitle sx={{ fontWeight: 'bold', color: 'error.main' }}>
                    Eliminar Propiedad
                </DialogTitle>
                <DialogContent>
                    <Typography>
                        ¿Estás seguro que deseas eliminar la edificación/propiedad <strong>{deleteCandidate?.name}</strong>?
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Esta acción no se puede deshacer.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button 
                        onClick={() => setDeleteCandidate(null)} 
                        color="inherit" 
                        disabled={isDeleting}
                    >
                        Cancelar
                    </Button>
                    <Button 
                        onClick={handleDeleteProperty} 
                        color="error" 
                        variant="contained"
                        disabled={isDeleting}
                        sx={{ borderRadius: '50px' }}
                    >
                        {isDeleting ? <CircularProgress size={24} color="inherit" /> : 'Sí, Eliminar'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}
