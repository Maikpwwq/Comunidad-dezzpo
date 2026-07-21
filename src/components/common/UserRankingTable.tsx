/**
 * Public User Ranking & Classification Table Component
 *
 * Renders an interactive matrix showcasing the classification, gradation,
 * and membership categories for Comerciantes Calificados and Propietarios.
 */

import { useState } from 'react'
import {
    Box,
    Typography,
    Paper,
    Tabs,
    Tab,
    Grid,
    Chip,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
} from '@mui/material'

import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import EngineeringIcon from '@mui/icons-material/Engineering'
import HomeWorkIcon from '@mui/icons-material/HomeWork'
import StarIcon from '@mui/icons-material/Star'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium'

import {
    COMERCIANTE_RANKINGS,
    PROPIETARIO_RANKINGS,
    type UserRankingCategory,
} from '@config/userClassification.config'

export default function UserRankingTable() {
    const [userType, setUserType] = useState<'comerciante' | 'propietario'>('comerciante')

    const currentRankings =
        userType === 'comerciante' ? COMERCIANTE_RANKINGS : PROPIETARIO_RANKINGS

    return (
        <Box sx={{ width: '100%' }}>
            {/* User Role Tabs Selector */}
            <Paper
                elevation={0}
                sx={{
                    p: 1,
                    mb: 4,
                    borderRadius: 4,
                    bgcolor: '#0f172a',
                    display: 'flex',
                    justify: 'center',
                }}
            >
                <Tabs
                    value={userType}
                    onChange={(_, val) => setUserType(val)}
                    textColor="inherit"
                    indicatorColor="primary"
                    sx={{
                        '& .MuiTab-root': {
                            color: '#94a3b8',
                            fontWeight: 700,
                            fontSize: '1rem',
                            textTransform: 'none',
                            px: 4,
                            py: 1.5,
                        },
                        '& .Mui-selected': { color: '#38bdf8 !important' },
                    }}
                >
                    <Tab
                        icon={<EngineeringIcon />}
                        iconPosition="start"
                        label="Comerciantes Calificados"
                        value="comerciante"
                    />
                    <Tab
                        icon={<HomeWorkIcon />}
                        iconPosition="start"
                        label="Propietarios y Residentes"
                        value="propietario"
                    />
                </Tabs>
            </Paper>

            {/* Ranking Sections */}
            <Grid container spacing={3.5}>
                {Object.entries(currentRankings).map(([key, cat]) => (
                    <Grid item key={key} xs={12} md={4}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3.5,
                                borderRadius: 4,
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                border: '1px solid #e2e8f0',
                                bgcolor: '#ffffff',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                            }}
                        >
                            <Box sx={{ mb: 2.5 }}>
                                <Chip
                                    label={`Campo Firestore: ${cat.firestoreField}`}
                                    size="small"
                                    color="primary"
                                    variant="outlined"
                                    sx={{ fontWeight: 700, mb: 1, fontSize: '0.72rem' }}
                                />
                                <Typography variant="h6" fontWeight={800} sx={{ color: '#0f172a', mb: 1 }}>
                                    {cat.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.5 }}>
                                    {cat.description}
                                </Typography>

                                <Typography variant="caption" fontWeight={700} color="text.primary" display="block" sx={{ mb: 1 }}>
                                    Factores de Ascenso:
                                </Typography>
                                <List density="compact" disablePadding sx={{ mb: 2 }}>
                                    {cat.criteria.map((crit, cIdx) => (
                                        <ListItem key={cIdx} disablePadding sx={{ mb: 0.5 }}>
                                            <ListItemIcon sx={{ minWidth: 22 }}>
                                                <CheckCircleOutlineIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={crit}
                                                primaryTypographyProps={{ variant: 'caption', color: 'text.secondary' }}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </Box>

                            <Divider sx={{ mb: 2 }} />

                            {/* Tiers Accordion List */}
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 'auto' }}>
                                <Typography variant="subtitle2" fontWeight={800} sx={{ color: '#0f172a', mb: 1 }}>
                                    Niveles e Insignias:
                                </Typography>

                                {cat.tiers.map((tier) => (
                                    <Accordion
                                        key={tier.id}
                                        elevation={0}
                                        sx={{
                                            bgcolor: tier.bgLight,
                                            borderRadius: '10px !important',
                                            border: `1px solid ${tier.color}30`,
                                            '&:before': { display: 'none' },
                                        }}
                                    >
                                        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: tier.color }} />}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%' }}>
                                                <WorkspacePremiumIcon sx={{ color: tier.color }} />
                                                <Box sx={{ flexGrow: 1 }}>
                                                    <Typography variant="subtitle2" fontWeight={800} sx={{ color: tier.color }}>
                                                        {tier.name}
                                                    </Typography>
                                                    {tier.subtitle && (
                                                        <Typography variant="caption" color="text.secondary">
                                                            {tier.subtitle}
                                                        </Typography>
                                                    )}
                                                </Box>
                                            </Box>
                                        </AccordionSummary>
                                        <AccordionDetails sx={{ pt: 0, pb: 2, px: 2 }}>
                                            <Typography variant="caption" color="text.primary" sx={{ lineHeight: 1.5, display: 'block' }}>
                                                {tier.description}
                                            </Typography>
                                        </AccordionDetails>
                                    </Accordion>
                                ))}
                            </Box>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Box>
    )
}
