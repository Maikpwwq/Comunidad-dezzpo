/**
 * AddPsePreferenceModal Component
 *
 * Preferred Bank & Billing Details Modal for PSE (ACH Colombia).
 * PSE requires live authentication per transaction at the bank portal,
 * so this modal saves user pre-fill preferences to speed up checkout.
 */

import React, { useState } from 'react'
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    FormControlLabel,
    Checkbox,
    Alert,
    CircularProgress,
    Box,
    Stack,
    Typography,
    Grid,
} from '@mui/material'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { savePaymentMethod } from '@services/paymentService'
import type { PaymentMethodFirestoreDocument } from '@services/types'

interface AddPsePreferenceModalProps {
    open: boolean
    userId: string
    onClose: () => void
    onSuccess: (method: PaymentMethodFirestoreDocument) => void
}

const colombianBanks = [
    { code: '1007', name: 'Bancolombia' },
    { code: '1001', name: 'Banco de Bogotá' },
    { code: '1051', name: 'Daviplata / Davivienda' },
    { code: '1507', name: 'Nequi' },
    { code: '1013', name: 'BBVA Colombia' },
    { code: '1002', name: 'Banco Popular' },
    { code: '1006', name: 'Banco de Occidente' },
    { code: '1019', name: 'Banco Colpatria Scotiabank' },
    { code: '1012', name: 'Banco GNB Sudameris' },
    { code: '1060', name: 'Banco Pichincha' },
    { code: '1062', name: 'Banco Falabella' },
    { code: '1066', name: 'Banco Cooperativo Coopcentral' },
    { code: '1052', name: 'Lulo Bank' },
]

const documentTypes = [
    { value: 'CC', label: 'Cédula de Ciudadanía (CC)' },
    { value: 'CE', label: 'Cédula de Extranjería (CE)' },
    { value: 'NIT', label: 'NIT' },
    { value: 'PP', label: 'Pasaporte (PP)' },
]

export default function AddPsePreferenceModal({ open, userId, onClose, onSuccess }: AddPsePreferenceModalProps) {
    const [bankCode, setBankCode] = useState('1007')
    const [personType, setPersonType] = useState<'N' | 'J'>('N')
    const [docType, setDocType] = useState('CC')
    const [docNumber, setDocNumber] = useState('')
    const [isDefault, setIsDefault] = useState(false)

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        if (!docNumber.trim()) {
            setError('Ingresa el número de documento.')
            return
        }

        setIsSubmitting(true)
        try {
            const selectedBank = colombianBanks.find(b => b.code === bankCode)
            const bankName = selectedBank ? selectedBank.name : 'Banco en Colombia'
            const docNumberMasked = docNumber.length > 4 ? `••••${docNumber.slice(-4)}` : docNumber

            const savedId = await savePaymentMethod({
                userId,
                type: 'pse',
                bankCode,
                bankName,
                personType,
                docType,
                docNumberMasked,
                isDefault,
            })

            if (!savedId) {
                throw new Error('No se pudo guardar la preferencia PSE.')
            }

            const newMethod: PaymentMethodFirestoreDocument = {
                id: savedId,
                userId,
                type: 'pse',
                bankCode,
                bankName,
                personType,
                docType,
                docNumberMasked,
                isDefault,
                createdAt: new Date().toISOString(),
            }

            onSuccess(newMethod)
            handleResetAndClose()
        } catch (err: any) {
            console.error('Error saving PSE preference:', err)
            setError(err.message || 'Error al guardar la preferencia de PSE.')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleResetAndClose = () => {
        setDocNumber('')
        setError(null)
        setIsSubmitting(false)
        onClose()
    }

    return (
        <Dialog open={open} onClose={handleResetAndClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AccountBalanceIcon sx={{ color: 'var(--primary-green-text-color)' }} />
                Preferencia de Banco PSE
            </DialogTitle>

            <form onSubmit={handleSubmit}>
                <DialogContent dividers>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, bgcolor: '#e3f2fd', p: 1.5, borderRadius: 1 }}>
                        <InfoOutlinedIcon sx={{ color: '#0288d1', fontSize: 20 }} />
                        <Typography variant="caption" color="text.secondary">
                            El servicio PSE no guarda claves de banco por seguridad. Al guardar tu banco de preferencia, agilizaremos la selección de datos al pagar tus contratos en ePayco.
                        </Typography>
                    </Box>

                    {error && (
                        <Alert variant="filled" severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Stack spacing={2}>
                        <FormControl fullWidth required>
                            <InputLabel>Banco Habitual</InputLabel>
                            <Select
                                value={bankCode}
                                label="Banco Habitual"
                                onChange={(e) => setBankCode(e.target.value)}
                                disabled={isSubmitting}
                            >
                                {colombianBanks.map((b) => (
                                    <MenuItem key={b.code} value={b.code}>{b.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth required>
                            <InputLabel>Tipo de Persona</InputLabel>
                            <Select
                                value={personType}
                                label="Tipo de Persona"
                                onChange={(e) => setPersonType(e.target.value as 'N' | 'J')}
                                disabled={isSubmitting}
                            >
                                <MenuItem value="N">Persona Natural</MenuItem>
                                <MenuItem value="J">Persona Jurídica</MenuItem>
                            </Select>
                        </FormControl>

                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={4}>
                                <FormControl fullWidth>
                                    <InputLabel>Documento</InputLabel>
                                    <Select
                                        value={docType}
                                        label="Documento"
                                        onChange={(e) => setDocType(e.target.value)}
                                        disabled={isSubmitting}
                                    >
                                        {documentTypes.map((dt) => (
                                            <MenuItem key={dt.value} value={dt.value}>{dt.label}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={8}>
                                <TextField
                                    label="Número de documento del titular"
                                    value={docNumber}
                                    onChange={(e) => setDocNumber(e.target.value)}
                                    fullWidth
                                    required
                                    disabled={isSubmitting}
                                />
                            </Grid>
                        </Grid>

                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={isDefault}
                                    onChange={(e) => setIsDefault(e.target.checked)}
                                    color="success"
                                />
                            }
                            label="Establecer como banco PSE preferido"
                        />
                    </Stack>
                </DialogContent>

                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={handleResetAndClose} disabled={isSubmitting}>
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={isSubmitting}
                        startIcon={isSubmitting ? <CircularProgress size={18} color="inherit" /> : <AccountBalanceIcon />}
                        sx={{
                            bgcolor: 'var(--primary-green-text-color)',
                            color: 'white',
                            '&:hover': { bgcolor: 'var(--secondary-green-text-color)' },
                        }}
                    >
                        {isSubmitting ? 'Guardando...' : 'Guardar Banco Preferido'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}
