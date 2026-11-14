/**
 * Smart Estimator Wizard (T-I7.2)
 *
 * Interactive conversational wizard calculating non-binding budget ranges in COP
 * and providing handoff to /nuevo-proyecto with pre-filled scope.
 */

import React, { useState } from 'react'
import {
    Box,
    Paper,
    Typography,
    Grid,
    Slider,
    Button,
    RadioGroup,
    FormControlLabel,
    Radio,
    Alert,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Chip,
} from '@mui/material'
import CalculateIcon from '@mui/icons-material/Calculate'
import KitchenIcon from '@mui/icons-material/Kitchen'
import BathtubIcon from '@mui/icons-material/Bathtub'
import FormatPaintIcon from '@mui/icons-material/FormatPaint'
import ViewCompactIcon from '@mui/icons-material/ViewCompact'
import RoofingIcon from '@mui/icons-material/Roofing'
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import GavelIcon from '@mui/icons-material/Gavel'
import {
    calculateBudgetEstimate,
    type EstimatorSpaceType,
    type EstimatorFinishLevel,
    SPACE_CONFIG,
    FINISH_MULTIPLIERS,
} from '@services/estimator'
import { navigate } from 'vike/client/router'

const spaceIcons: Record<EstimatorSpaceType, React.ReactNode> = {
    cocina: <KitchenIcon />,
    bano: <BathtubIcon />,
    pintura: <FormatPaintIcon />,
    pisos: <ViewCompactIcon />,
    drywall_techos: <RoofingIcon />,
    obra_blanca: <HomeRepairServiceIcon />,
}

export const SmartEstimatorWizard: React.FC = () => {
    const [spaceType, setSpaceType] = useState<EstimatorSpaceType>('cocina')
    const config = SPACE_CONFIG[spaceType]
    const [areaM2, setAreaM2] = useState<number>(config.defaultAreaM2)
    const [finishLevel, setFinishLevel] = useState<EstimatorFinishLevel>('estandar')

    const handleSpaceChange = (type: EstimatorSpaceType) => {
        setSpaceType(type)
        setAreaM2(SPACE_CONFIG[type].defaultAreaM2)
    }

    const estimate = calculateBudgetEstimate(spaceType, areaM2, finishLevel)

    const handleHandoff = () => {
        const queryParams = new URLSearchParams({
            category: estimate.prefillCategory,
            title: estimate.prefillDraftName,
            approxArea: String(estimate.areaM2),
            budgetMin: String(estimate.estimatedMinCop),
            budgetMax: String(estimate.estimatedMaxCop),
        })
        navigate(`/nuevo-proyecto?${queryParams.toString()}`)
    }

    return (
        <Paper
            elevation={2}
            sx={{
                p: { xs: 2.5, md: 4 },
                borderRadius: 3,
                bgcolor: '#ffffff',
                border: '1px solid #e2e8f0',
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                <CalculateIcon color="primary" sx={{ fontSize: 28 }} />
                <Typography variant="h5" fontWeight="bold">
                    Cotizador Inteligente Asistido
                </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Calcula un rango de presupuesto orientativo en segundos antes de contactar al contratista.
            </Typography>

            {/* Step 1: Space Typology Selector */}
            <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1.5 }}>
                1. Selecciona el espacio a remodelar:
            </Typography>
            <Grid container spacing={1.5} sx={{ mb: 3 }}>
                {(Object.keys(SPACE_CONFIG) as EstimatorSpaceType[]).map((type) => {
                    const isSelected = spaceType === type
                    return (
                        <Grid item xs={6} sm={4} key={type}>
                            <Button
                                variant={isSelected ? 'contained' : 'outlined'}
                                fullWidth
                                onClick={() => handleSpaceChange(type)}
                                startIcon={spaceIcons[type]}
                                sx={{
                                    py: 1.2,
                                    textTransform: 'none',
                                    borderRadius: 2,
                                    fontWeight: isSelected ? 'bold' : 500,
                                    fontSize: '0.82rem',
                                    bgcolor: isSelected ? '#0d9488' : 'transparent',
                                    borderColor: isSelected ? '#0d9488' : '#cbd5e1',
                                    '&:hover': {
                                        bgcolor: isSelected ? '#0f766e' : '#f8fafc',
                                    },
                                }}
                            >
                                {SPACE_CONFIG[type].label}
                            </Button>
                        </Grid>
                    )
                })}
            </Grid>

            {/* Step 2: Area and Finish Tier */}
            <Box sx={{ mb: 3, p: 2.5, bgcolor: '#f8fafc', borderRadius: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle2" fontWeight="bold">
                        2. Área estimada:
                    </Typography>
                    <Typography variant="subtitle1" fontWeight="bold" color="primary">
                        {areaM2} m²
                    </Typography>
                </Box>
                <Slider
                    value={areaM2}
                    min={config.minAreaM2}
                    max={config.maxAreaM2}
                    onChange={(_, val) => setAreaM2(val as number)}
                    valueLabelDisplay="auto"
                    sx={{ color: '#0d9488' }}
                />

                <Typography variant="subtitle2" fontWeight="bold" sx={{ mt: 2, mb: 1 }}>
                    3. Nivel de acabados y especificación:
                </Typography>
                <RadioGroup
                    value={finishLevel}
                    onChange={(e) => setFinishLevel(e.target.value as EstimatorFinishLevel)}
                >
                    {(Object.keys(FINISH_MULTIPLIERS) as EstimatorFinishLevel[]).map((lvl) => (
                        <FormControlLabel
                            key={lvl}
                            value={lvl}
                            control={<Radio size="small" sx={{ color: '#0d9488', '&.Mui-checked': { color: '#0d9488' } }} />}
                            label={
                                <Typography variant="body2">
                                    <strong>{FINISH_MULTIPLIERS[lvl].label}</strong>
                                </Typography>
                            }
                        />
                    ))}
                </RadioGroup>
            </Box>

            {/* Step 3: Result Budget Display */}
            <Box
                sx={{
                    textAlign: 'center',
                    p: 3,
                    bgcolor: '#0f172a',
                    color: 'white',
                    borderRadius: 2.5,
                    mb: 3,
                }}
            >
                <Typography variant="caption" sx={{ color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1 }}>
                    Rango de Presupuesto Estimado
                </Typography>
                <Typography variant="h3" fontWeight="bold" sx={{ color: '#2dd4bf', my: 1 }}>
                    ${estimate.estimatedMinCop.toLocaleString('es-CO')} – ${estimate.estimatedMaxCop.toLocaleString('es-CO')} COP
                </Typography>
                <Typography variant="body2" sx={{ color: '#cbd5e1' }}>
                    Para {estimate.areaM2} m² de {estimate.spaceLabel.toLowerCase()} ({estimate.finishLabel.split('/')[0]?.trim() || estimate.finishLabel})
                </Typography>
            </Box>

            {/* Breakdown Table */}
            <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                Desglose de partidas de referencia:
            </Typography>
            <Table size="small" sx={{ mb: 2.5 }}>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Concepto</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Categoría</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>Cant.</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>Subtotal Aprox</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {estimate.breakdown.map((item, idx) => (
                        <TableRow key={idx}>
                            <TableCell>{item.item}</TableCell>
                            <TableCell>
                                <Chip label={item.category} size="small" sx={{ fontSize: '0.7rem' }} />
                            </TableCell>
                            <TableCell align="right">{item.quantity} {item.unit}</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 600 }}>
                                ${item.subtotalCop.toLocaleString('es-CO')} COP
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Legal Disclaimer (Ley 1480/2011) */}
            <Alert
                icon={<GavelIcon fontSize="inherit" />}
                severity="info"
                sx={{ mb: 3, fontSize: '0.76rem', lineHeight: 1.4 }}
            >
                <strong>Aviso Legal (Ley 1480 de 2011):</strong> {estimate.disclaimer}
            </Alert>

            {/* Handoff CTA */}
            <Button
                variant="contained"
                size="large"
                fullWidth
                endIcon={<ArrowForwardIcon />}
                onClick={handleHandoff}
                sx={{
                    bgcolor: '#0d9488',
                    '&:hover': { bgcolor: '#0f766e' },
                    fontWeight: 'bold',
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '1rem',
                }}
            >
                Solicitar Cotizaciones Reales con este Presupuesto
            </Button>
        </Paper>
    )
}

