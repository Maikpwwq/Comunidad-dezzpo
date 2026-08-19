import React from 'react'
import {
    Collapse,
    Box,
    Typography,
    Alert,
    Chip,
    Paper,
    CircularProgress,
    Stack,
} from '@mui/material'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import StorefrontIcon from '@mui/icons-material/Storefront'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import BusinessIcon from '@mui/icons-material/Business'
import type { DuplicateCheckStatus } from '@hooks/useDuplicateNameCheck'
import type { ComercianteDuplicateMatch, TiendaDuplicateMatch } from '@services/validation/duplicateCheckService'

export interface DuplicateNameAlertProps {
    status: DuplicateCheckStatus
    isChecking?: boolean
    matches: (ComercianteDuplicateMatch | TiendaDuplicateMatch)[]
    exactMatch?: boolean
    type?: 'comerciante' | 'tienda'
    checkedValue?: string
}

export const DuplicateNameAlert: React.FC<DuplicateNameAlertProps> = ({
    status,
    isChecking = false,
    matches,
    exactMatch = false,
    type = 'comerciante',
    checkedValue = '',
}) => {
    const isVisible = status !== 'idle'

    return (
        <Collapse in={isVisible} unmountOnExit>
            <Box sx={{ mt: 1, mb: 1.5 }}>
                {/* ── 1. Checking state ── */}
                {isChecking && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1, py: 0.5 }}>
                        <CircularProgress size={14} thickness={5} color="primary" />
                        <Typography variant="caption" color="text.secondary">
                            Verificando disponibilidad de nombre en Dezzpo...
                        </Typography>
                    </Box>
                )}

                {/* ── 2. Available state ── */}
                {!isChecking && status === 'available' && (
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.8,
                            px: 1.2,
                            py: 0.6,
                            borderRadius: '6px',
                            bgcolor: 'rgba(46, 125, 50, 0.08)',
                            border: '1px solid rgba(46, 125, 50, 0.25)',
                        }}
                    >
                        <CheckCircleOutlineIcon sx={{ fontSize: 16, color: 'success.main' }} />
                        <Typography variant="caption" sx={{ color: 'success.dark', fontWeight: 600 }}>
                            Nombre disponible para registro
                        </Typography>
                    </Box>
                )}

                {/* ── 3. Matches found state ── */}
                {!isChecking && status === 'matches_found' && matches.length > 0 && (
                    <Alert
                        severity={exactMatch ? 'warning' : 'info'}
                        icon={<WarningAmberIcon fontSize="small" />}
                        sx={{
                            p: 1.5,
                            borderRadius: '8px',
                            border: exactMatch ? '1px solid #f59e0b' : '1px solid #60a5fa',
                            '& .MuiAlert-message': { width: '100%' },
                        }}
                    >
                        <Box sx={{ mb: 1 }}>
                            <Typography variant="subtitle2" fontWeight={700} sx={{ lineHeight: 1.3 }}>
                                {exactMatch
                                    ? `Ya existe un ${type === 'tienda' ? 'comercio/tienda' : 'profesional/empresa'} con un nombre idéntico:`
                                    : `Existen coincidencias similares para "${checkedValue}":`}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.3 }}>
                                Revisa los datos de los comercios registrados para verificar si se trata de un nuevo registro o un posible duplicado:
                            </Typography>
                        </Box>

                        {/* List of matching cards */}
                        <Stack spacing={1} sx={{ maxHeight: 220, overflowY: 'auto', pr: 0.5, my: 1 }}>
                            {matches.map((item, index) => {
                                const isComerciante = type === 'comerciante'
                                const match = item as ComercianteDuplicateMatch
                                const tiendaMatch = item as TiendaDuplicateMatch

                                return (
                                    <Paper
                                        key={index}
                                        elevation={0}
                                        sx={{
                                            p: 1.2,
                                            borderRadius: '6px',
                                            bgcolor: '#ffffff',
                                            border: '1px solid #e2e8f0',
                                            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                                {isComerciante ? (
                                                    <PersonOutlineIcon sx={{ fontSize: 16, color: '#0ea5e9' }} />
                                                ) : (
                                                    <StorefrontIcon sx={{ fontSize: 16, color: '#10b981' }} />
                                                )}
                                                <Typography variant="body2" fontWeight={700} sx={{ color: '#0f172a' }}>
                                                    {isComerciante ? match.userName : tiendaMatch.nombre}
                                                </Typography>
                                            </Box>
                                            <Chip
                                                label={item.similarity === 'exact' ? 'Coincidencia exacta' : 'Nombre similar'}
                                                size="small"
                                                color={item.similarity === 'exact' ? 'warning' : 'default'}
                                                sx={{ height: 18, fontSize: '0.65rem', fontWeight: 600 }}
                                            />
                                        </Box>

                                        {/* Razón Social / Representante Legal */}
                                        {isComerciante ? (
                                            <>
                                                {match.userRazonSocial && match.userRazonSocial !== match.userName && (
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.3 }}>
                                                        <BusinessIcon sx={{ fontSize: 13, color: 'text.secondary' }} />
                                                        <Typography variant="caption" color="text.secondary">
                                                            Razón Social: <strong>{match.userRazonSocial}</strong>
                                                        </Typography>
                                                    </Box>
                                                )}
                                                {match.userContactName && (
                                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.3 }}>
                                                        Contacto / Representante: <strong>{match.userContactName}</strong>
                                                    </Typography>
                                                )}
                                                {match.userProfession && (
                                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                                                        Actividad / Profesión: <em>{match.userProfession}</em>
                                                    </Typography>
                                                )}
                                                {(match.userCiudad || match.userDirection) && (
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                        <LocationOnIcon sx={{ fontSize: 13, color: 'text.secondary' }} />
                                                        <Typography variant="caption" color="text.secondary">
                                                            {match.userCiudad || ''}{match.userCiudad && match.userDirection ? ' • ' : ''}{match.userDirection || ''}
                                                        </Typography>
                                                    </Box>
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                {tiendaMatch.razonSocial && (
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.3 }}>
                                                        <BusinessIcon sx={{ fontSize: 13, color: 'text.secondary' }} />
                                                        <Typography variant="caption" color="text.secondary">
                                                            Razón Social: <strong>{tiendaMatch.razonSocial}</strong> {tiendaMatch.nit ? `(NIT: ${tiendaMatch.nit})` : ''}
                                                        </Typography>
                                                    </Box>
                                                )}
                                                {tiendaMatch.sedes && tiendaMatch.sedes.length > 0 && (
                                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.5, mt: 0.3 }}>
                                                        <LocationOnIcon sx={{ fontSize: 13, color: 'text.secondary', mt: 0.2 }} />
                                                        <Typography variant="caption" color="text.secondary">
                                                            {tiendaMatch.sedes.map((s) => `${s.nombreSede} (${s.ciudad || s.zona || 'Bogotá'})`).join(' • ')}
                                                        </Typography>
                                                    </Box>
                                                )}
                                            </>
                                        )}
                                    </Paper>
                                )
                            })}
                        </Stack>

                        <Typography variant="caption" sx={{ display: 'block', mt: 1, color: '#475569', fontStyle: 'italic' }}>
                            💡 Si tu negocio es una entidad distinta con diferente actividad comercial, ubicación o personería jurídica, puedes continuar con el registro.
                        </Typography>
                    </Alert>
                )}
            </Box>
        </Collapse>
    )
}
