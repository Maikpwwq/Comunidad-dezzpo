import React, { useState } from 'react'
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Typography,
    Chip,
    Divider,
    IconButton,
    Alert,
    Paper,
    TextField,
    Grid,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import PrintIcon from '@mui/icons-material/Print'
import ApartmentIcon from '@mui/icons-material/Apartment'
import GavelIcon from '@mui/icons-material/Gavel'
import {
    generatePhB2bContract,
    type PhContractParties,
    type PhContractTerms,
} from '@services/contracts'

export interface PhContractModalProps {
    readonly open: boolean
    readonly onClose: () => void
    readonly initialParties?: Partial<PhContractParties>
    readonly initialTerms?: Partial<PhContractTerms>
}

export const PhContractModal: React.FC<PhContractModalProps> = ({
    open,
    onClose,
    initialParties,
    initialTerms,
}) => {
    const [copropiedadName, setCopropiedadName] = useState(
        initialParties?.copropiedadName || 'Edificio / Conjunto Residencial PH'
    )
    const [copropiedadNit, setCopropiedadNit] = useState(
        initialParties?.copropiedadNit || '900.123.456-8'
    )
    const [adminName, setAdminName] = useState(
        initialParties?.adminName || 'Administrador(a) de la Copropiedad'
    )
    const [adminCedula, setAdminCedula] = useState(initialParties?.adminCedula || '52.000.000')
    const [providerRazonSocial, setProviderRazonSocial] = useState(
        initialParties?.providerRazonSocial || 'Contratista Calificado Dezzpo'
    )
    const [providerNitOrCedula, setProviderNitOrCedula] = useState(
        initialParties?.providerNitOrCedula || '900.000.000-1'
    )
    const [providerRepresentante, setProviderRepresentante] = useState(
        initialParties?.providerRepresentante || 'Representante Legal'
    )

    const parties: PhContractParties = {
        copropiedadName,
        copropiedadNit,
        adminName,
        adminCedula,
        providerRazonSocial,
        providerNitOrCedula,
        providerRepresentante,
        ...(initialParties?.providerMatriculaProfesional
            ? { providerMatriculaProfesional: initialParties.providerMatriculaProfesional }
            : {}),
    }

    const terms: PhContractTerms = {
        agreedAmountCop: initialTerms?.agreedAmountCop || 25000000,
        durationWeeks: initialTerms?.durationWeeks || 4,
        requiresCouncilApproval: initialTerms?.requiresCouncilApproval ?? true,
        insuranceRequired: initialTerms?.insuranceRequired ?? true,
        partidas: initialTerms?.partidas || [
            {
                areaName: 'Mantenimiento e Impermeabilización de Zonas Comunes',
                scopeDescription:
                    'Adecuación técnica, sellado preventivo de juntas y pintura conforme a especificaciones.',
                estimatedBudgetCop: initialTerms?.agreedAmountCop || 25000000,
            },
        ],
    }

    const contract = generatePhB2bContract(parties, terms)

    const handlePrint = () => {
        if (typeof window !== 'undefined') {
            window.print()
        }
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth scroll="paper">
            <DialogTitle
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    bgcolor: '#0f172a',
                    color: '#ffffff',
                    py: 2,
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <ApartmentIcon sx={{ color: '#2dd4bf' }} />
                    <Box>
                        <Typography variant="subtitle1" fontWeight="bold">
                            Contrato Marco B2B · Propiedad Horizontal
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                            Conforme a la Ley 675 de 2001 y Ley 527 de 1999
                        </Typography>
                    </Box>
                </Box>
                <IconButton onClick={onClose} sx={{ color: '#94a3b8', '&:hover': { color: '#ffffff' } }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers sx={{ p: { xs: 2, md: 4 }, bgcolor: '#f8fafc' }}>
                {/* Header Badge */}
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Chip
                        label={contract.headerBadge}
                        color="warning"
                        variant="filled"
                        sx={{ fontWeight: 'bold', letterSpacing: 1, fontSize: '0.8rem', mb: 1.5 }}
                    />
                    <Typography variant="h5" fontWeight="bold" sx={{ color: '#0f172a' }}>
                        CONTRATO DE OBRA Y CONSERVACIÓN EN ÁREAS COMUNES
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {contract.legalFrameworkCitation}
                    </Typography>
                </Box>

                {/* Editable Parties Section */}
                <Paper elevation={0} sx={{ p: 2.5, mb: 3, border: '1px solid #e2e8f0', borderRadius: 2 }}>
                    <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 2, color: '#0f172a' }}>
                        Datos de las Partes Contratantes:
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Nombre de la Copropiedad (PH)"
                                size="small"
                                fullWidth
                                value={copropiedadName}
                                onChange={(e) => setCopropiedadName(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="NIT de la Copropiedad"
                                size="small"
                                fullWidth
                                value={copropiedadNit}
                                onChange={(e) => setCopropiedadNit(e.target.value)}
                                error={!contract.isNitValid}
                                helperText={!contract.isNitValid ? 'NIT o DV no coincide con algoritmo DIAN' : undefined}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Nombre Administrador(a)"
                                size="small"
                                fullWidth
                                value={adminName}
                                onChange={(e) => setAdminName(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Cédula del Administrador"
                                size="small"
                                fullWidth
                                value={adminCedula}
                                onChange={(e) => setAdminCedula(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Razón Social Contratista"
                                size="small"
                                fullWidth
                                value={providerRazonSocial}
                                onChange={(e) => setProviderRazonSocial(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="NIT / Cédula Contratista"
                                size="small"
                                fullWidth
                                value={providerNitOrCedula}
                                onChange={(e) => setProviderNitOrCedula(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Representante Legal Contratista"
                                size="small"
                                fullWidth
                                value={providerRepresentante}
                                onChange={(e) => setProviderRepresentante(e.target.value)}
                            />
                        </Grid>
                    </Grid>
                </Paper>

                {/* Clauses Body */}
                <Paper elevation={0} sx={{ p: 3, border: '1px solid #e2e8f0', borderRadius: 2, bgcolor: '#ffffff' }}>
                    {contract.clauses.map((clause, idx) => (
                        <Box key={idx} sx={{ mb: 2.5 }}>
                            <Typography
                                variant="subtitle2"
                                fontWeight="bold"
                                sx={{ color: '#0f766e', mb: 0.5, fontSize: '0.85rem' }}
                            >
                                {clause.title}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#334155', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                                {clause.content}
                            </Typography>
                            {idx < contract.clauses.length - 1 && <Divider sx={{ my: 2 }} />}
                        </Box>
                    ))}
                </Paper>

                {/* Security and Disclaimer Alert */}
                <Alert
                    icon={<GavelIcon fontSize="inherit" />}
                    severity="info"
                    sx={{ mt: 3, fontSize: '0.8rem', lineHeight: 1.5 }}
                >
                    <strong>Aviso Legal para la Copropiedad:</strong> Este documento constituye una plantilla marco orientativa. De conformidad con el artículo 50 de la Ley 675 de 2001, las obras que excedan las facultades ordinarias de conservación requieren aprobación expresa de la Asamblea de Copropietarios o Consejo de Administración.
                </Alert>
            </DialogContent>

            <DialogActions sx={{ p: 2, bgcolor: '#ffffff', borderTop: '1px solid #e2e8f0' }}>
                <Button onClick={onClose} variant="text" sx={{ color: '#64748b' }}>
                    Cerrar
                </Button>
                <Button
                    onClick={handlePrint}
                    variant="contained"
                    startIcon={<PrintIcon />}
                    sx={{
                        bgcolor: '#0d9488',
                        '&:hover': { bgcolor: '#0f766e' },
                        fontWeight: 'bold',
                        textTransform: 'none',
                    }}
                >
                    Imprimir / Exportar a PDF
                </Button>
            </DialogActions>
        </Dialog>
    )
}
