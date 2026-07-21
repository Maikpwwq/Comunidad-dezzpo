/**
 * Legal Page (/legal)
 *
 * Provides in-app interactive reading of terms, privacy policies, and agreements
 * to keep users within the Dezzpo platform.
 */

import { useState, useEffect } from 'react'
import { Row, Col, Container } from 'react-bootstrap'
import {
    Box,
    Typography,
    Paper,
    Button,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Tabs,
    Tab,
    Tooltip,
} from '@mui/material'

import MenuBookIcon from '@mui/icons-material/MenuBook'
import DownloadIcon from '@mui/icons-material/Download'
import CloseIcon from '@mui/icons-material/Close'
import PrintIcon from '@mui/icons-material/Print'
import GavelIcon from '@mui/icons-material/Gavel'
import ShieldIcon from '@mui/icons-material/Shield'
import CookieIcon from '@mui/icons-material/Cookie'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

import { LEGAL_DOCUMENTS, type LegalDocument } from '@assets/data/legalDocuments'

export default function Page() {
    const [selectedDocId, setSelectedDocId] = useState<string | null>(null)
    const [modalOpen, setModalOpen] = useState(false)

    // Check URL parameters for direct document links (e.g. /legal?doc=propietarios-terminos)
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search)
            const docParam = params.get('doc')
            if (docParam && LEGAL_DOCUMENTS.some((d) => d.id === docParam)) {
                setSelectedDocId(docParam)
                setModalOpen(true)
            }
        }
    }, [])

    const handleOpenDoc = (docId: string) => {
        setSelectedDocId(docId)
        setModalOpen(true)
    }

    const handleCloseModal = () => {
        setModalOpen(false)
    }

    const activeDoc = LEGAL_DOCUMENTS.find((d) => d.id === selectedDocId) || LEGAL_DOCUMENTS[0]!

    const handlePrint = () => {
        if (typeof window !== 'undefined') {
            window.print()
        }
    }

    const getDocIcon = (id: string) => {
        if (id.includes('terminos')) return <GavelIcon sx={{ fontSize: 32, color: 'primary.main' }} />
        if (id.includes('privacidad')) return <ShieldIcon sx={{ fontSize: 32, color: '#0284c7' }} />
        return <CookieIcon sx={{ fontSize: 32, color: '#eab308' }} />
    }

    return (
        <div className="legal-page-wrapper">
            {/* Header */}
            <Container fluid className="p-0">
                <Row
                    className="m-0 w-100 p-5 d-flex align-items-center"
                    style={{
                        minHeight: '260px',
                        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.85) 100%)',
                    }}
                >
                    <Col className="text-center">
                        <Chip
                            icon={<CheckCircleIcon sx={{ color: '#38bdf8 !important' }} />}
                            label="Transparencia y Seguridad Dezzpo"
                            sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: '#ffffff', fontWeight: 700, mb: 2 }}
                        />
                        <h1 className="type-hero-title text-blanco text-center mb-2">Centro Legal Dezzpo</h1>
                        <Typography variant="body1" sx={{ color: '#cbd5e1', maxWidth: 640, mx: 'auto' }}>
                            Consulta y lee en línea todos los acuerdos de uso, términos de servicio y políticas de tratamiento de datos vigentes.
                        </Typography>
                    </Col>
                </Row>
            </Container>

            {/* Document Cards Grid */}
            <Container className="py-5">
                <Row className="justify-content-center">
                    {LEGAL_DOCUMENTS.map((doc) => (
                        <Col key={doc.id} lg={6} md={6} sm={12} className="mb-4">
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3.5,
                                    borderRadius: 4,
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justify: 'space-between',
                                    border: '1px solid #e2e8f0',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                                    transition: 'all 0.2s ease-in-out',
                                    '&:hover': {
                                        transform: 'translateY(-3px)',
                                        boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                                        borderColor: 'primary.main',
                                    },
                                }}
                            >
                                <Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                        {getDocIcon(doc.id)}
                                        <Chip label={doc.version} size="small" color="primary" variant="outlined" sx={{ fontWeight: 700 }} />
                                    </Box>

                                    <Typography variant="h5" fontWeight={800} color="text.primary" sx={{ mb: 0.5 }}>
                                        {doc.title}
                                    </Typography>

                                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                                        {doc.subtitle}
                                    </Typography>

                                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 3 }}>
                                        Última actualización: <strong>{doc.lastUpdated}</strong>
                                    </Typography>
                                </Box>

                                <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', pt: 2, borderTop: '1px solid #f1f5f9' }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        startIcon={<MenuBookIcon />}
                                        onClick={() => handleOpenDoc(doc.id)}
                                        sx={{ flexGrow: 1, textTransform: 'none', fontWeight: 700, borderRadius: 2.5, py: 1 }}
                                    >
                                        Leer en la Plataforma
                                    </Button>

                                    {doc.pdfDownloadUrl && (
                                        <Tooltip title="Descargar copia PDF">
                                            <Button
                                                variant="outlined"
                                                color="inherit"
                                                href={doc.pdfDownloadUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                sx={{ borderRadius: 2.5, minWidth: 44, px: 1.5 }}
                                            >
                                                <DownloadIcon />
                                            </Button>
                                        </Tooltip>
                                    )}
                                </Box>
                            </Paper>
                        </Col>
                    ))}
                </Row>
            </Container>

            {/* Interactive In-App Legal Reader Modal */}
            <Dialog
                open={modalOpen}
                onClose={handleCloseModal}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: { borderRadius: 4, maxHeight: '90vh' },
                }}
            >
                {/* Header */}
                <DialogTitle
                    sx={{
                        p: 3,
                        bgcolor: '#0f172a',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justify: 'space-between',
                    }}
                >
                    <Box sx={{ pr: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                            <Typography variant="h6" fontWeight={800} color="#ffffff">
                                {activeDoc.title}
                            </Typography>
                            <Chip label={activeDoc.version} size="small" color="primary" sx={{ height: 20, fontSize: '0.7rem' }} />
                        </Box>
                        <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                            {activeDoc.subtitle} • Actualizado: {activeDoc.lastUpdated}
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Tooltip title="Imprimir documento">
                            <IconButton size="small" onClick={handlePrint} sx={{ color: '#94a3b8', '&:hover': { color: '#ffffff' } }}>
                                <PrintIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        {activeDoc.pdfDownloadUrl && (
                            <Tooltip title="Descargar PDF">
                                <IconButton
                                    size="small"
                                    component="a"
                                    href={activeDoc.pdfDownloadUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{ color: '#94a3b8', '&:hover': { color: '#ffffff' } }}
                                >
                                    <DownloadIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        )}
                        <IconButton size="small" onClick={handleCloseModal} sx={{ color: '#94a3b8', '&:hover': { color: '#ffffff' } }}>
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </Box>
                </DialogTitle>

                {/* Tabs to switch between agreements directly in modal */}
                <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: '#1e293b' }}>
                    <Tabs
                        value={activeDoc.id}
                        onChange={(_, val) => setSelectedDocId(val)}
                        variant="scrollable"
                        scrollButtons="auto"
                        textColor="inherit"
                        indicatorColor="primary"
                        sx={{
                            '& .MuiTab-root': { color: '#94a3b8', textTransform: 'none', fontWeight: 600 },
                            '& .Mui-selected': { color: '#38bdf8 !important' },
                        }}
                    >
                        {LEGAL_DOCUMENTS.map((d) => (
                            <Tab key={d.id} value={d.id} label={d.title.split(' ')[0] + ' ' + (d.subtitle ? `(${d.subtitle.split(' ')[2] || ''})` : '')} />
                        ))}
                    </Tabs>
                </Box>

                {/* Body Content */}
                <DialogContent dividers sx={{ p: 4, bgcolor: '#ffffff', color: '#1e293b' }}>
                    <Box
                        sx={{
                            fontFamily: 'inherit',
                            lineHeight: 1.7,
                            fontSize: '0.95rem',
                            '& h1': { fontSize: '1.75rem', fontWeight: 800, mb: 1, color: '#0f172a' },
                            '& h2': { fontSize: '1.25rem', fontWeight: 700, mt: 3, mb: 1.5, color: '#0f172a', borderBottom: '1px solid #e2e8f0', pb: 1 },
                            '& h3': { fontSize: '1.1rem', fontWeight: 700, mt: 2, mb: 1, color: '#1e293b' },
                            '& p': { mb: 2 },
                            '& ul, & ol': { mb: 2, pl: 3 },
                            '& li': { mb: 0.75 },
                            '& hr': { my: 3, borderColor: '#e2e8f0' },
                            '& strong': { color: '#0f172a' },
                        }}
                    >
                        {activeDoc.content.split('\n').map((line, lIdx) => {
                            if (line.startsWith('# ')) {
                                return <Typography key={lIdx} variant="h4" fontWeight={800} sx={{ mb: 1, color: '#0f172a' }}>{line.replace('# ', '')}</Typography>
                            }
                            if (line.startsWith('## ')) {
                                return <Typography key={lIdx} variant="h6" fontWeight={700} sx={{ mt: 3, mb: 1.5, color: '#0f172a', borderBottom: '1px solid #e2e8f0', pb: 0.5 }}>{line.replace('## ', '')}</Typography>
                            }
                            if (line.startsWith('**') && line.endsWith('**')) {
                                return <Typography key={lIdx} variant="subtitle2" fontWeight={800} sx={{ mt: 1.5, color: '#0f172a' }}>{line.replace(/\*\*/g, '')}</Typography>
                            }
                            if (line.startsWith('- ')) {
                                return (
                                    <Box key={lIdx} sx={{ display: 'flex', gap: 1, mb: 0.75, pl: 1 }}>
                                        <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 700 }}>•</Typography>
                                        <Typography variant="body2" color="text.primary">{line.replace('- ', '')}</Typography>
                                    </Box>
                                )
                            }
                            if (line.trim() === '---') {
                                return <hr key={lIdx} style={{ margin: '16px 0', borderColor: '#e2e8f0' }} />
                            }
                            if (!line.trim()) return <Box key={lIdx} sx={{ height: 8 }} />
                            return (
                                <Typography key={lIdx} variant="body2" sx={{ mb: 1.5, color: '#334155', lineHeight: 1.7 }}>
                                    {line}
                                </Typography>
                            )
                        })}
                    </Box>
                </DialogContent>

                {/* Footer Actions */}
                <DialogActions sx={{ p: 2.5, bgcolor: '#f8fafc', justifyContent: 'space-between' }}>
                    <Typography variant="caption" color="text.secondary">
                        Comunidad Dezzpo © {new Date().getFullYear()} • Documento Oficial Vigente
                    </Typography>
                    <Button variant="contained" onClick={handleCloseModal} sx={{ fontWeight: 700, borderRadius: 2 }}>
                        Cerrar y Entendido
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}
