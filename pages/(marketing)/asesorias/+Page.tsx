/**
 * Asesorías Page (/asesorias)
 *
 * Public Marketing Landing & Community QA Forum.
 * Allows visitors to ask technical questions and browse the community's Q&A history.
 * Drives SEO and Inbound Lead Generation.
 */

import { useState, useEffect, useMemo, useCallback } from 'react'
import { navigate } from 'vike/client/router'
import { Row, Col, Container, Button, Form, Spinner } from 'react-bootstrap'
import {
    Box,
    Grid,
    Typography,
    Paper,
    TextField,
    Chip,
    Avatar,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Divider,
    IconButton,
    Tooltip,
    Snackbar,
    Alert,
    InputAdornment,
} from '@mui/material'

import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ChatIcon from '@mui/icons-material/Chat'
import EmailIcon from '@mui/icons-material/Email'
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer'
import SearchIcon from '@mui/icons-material/Search'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import VerifiedIcon from '@mui/icons-material/Verified'
import SendIcon from '@mui/icons-material/Send'
import PersonIcon from '@mui/icons-material/Person'
import EngineeringIcon from '@mui/icons-material/Engineering'

import { Link } from '@hooks'
import { useUserStore } from '@stores/userStore'
import {
    getAllAsesorias,
    createAsesoria,
    addAsesoriaResponse,
    incrementAsesoriaLikes,
} from '@services/asesoriaService'
import type { AsesoriaFirestoreDocument } from '@services/types'

const CATEGORIES = [
    'Todas',
    'Pintura y Acabados',
    'Electricidad',
    'Plomería y Grifería',
    'Remodelación General',
    'Techos y Cubiertas',
    'Estructuras y Mampostería',
    'Impermeabilización',
]

export default function Page() {
    const currentUserId = useUserStore((state) => state.userId)
    const userRole = useUserStore((state) => state.rol)
    const displayName = useUserStore((state) => state.displayName)
    const photoUrl = useUserStore((state) => state.photoUrl)

    // Form state
    const [asesoriaTitulo, setAsesoriaTitulo] = useState('')
    const [asesoriaDescription, setAsesoriaDescription] = useState('')
    const [asesoriaCategoria, setAsesoriaCategoria] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    // History state
    const [threads, setThreads] = useState<AsesoriaFirestoreDocument[]>([])
    const [isLoadingThreads, setIsLoadingThreads] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('Todas')

    // Active response state per thread
    const [activeResponseId, setActiveResponseId] = useState<string | null>(null)
    const [responseText, setResponseText] = useState('')

    // Feedback
    const [snackbar, setSnackbar] = useState<{
        open: boolean
        message: string
        severity: 'success' | 'info' | 'warning' | 'error'
    }>({ open: false, message: '', severity: 'success' })

    // Load advisory threads
    const loadThreads = useCallback(async () => {
        setIsLoadingThreads(true)
        try {
            const list = await getAllAsesorias()
            setThreads(list)
        } catch (err) {
            console.error('Error loading asesorias:', err)
        } finally {
            setIsLoadingThreads(false)
        }
    }, [])

    useEffect(() => {
        loadThreads()
    }, [loadThreads])

    // Check for pending draft from unauthenticated session
    useEffect(() => {
        if (!currentUserId) return
        const pendingDraft = sessionStorage.getItem('pending_asesoria_draft')
        if (pendingDraft) {
            try {
                const parsed = JSON.parse(pendingDraft)
                sessionStorage.removeItem('pending_asesoria_draft')

                createAsesoria({
                    asesoriaTitulo: parsed.asesoriaTitulo,
                    asesoriaDescription: parsed.asesoriaDescription,
                    asesoriaCategoria: parsed.asesoriaCategoria,
                    asesoriaAuthorId: currentUserId,
                    asesoriaAuthorName: displayName || 'Usuario Dezzpo',
                    asesoriaAuthorRole: (userRole as 1 | 2) || 1,
                    asesoriaAuthorPhotoUrl: photoUrl || '',
                }).then((id) => {
                    if (id) {
                        setSnackbar({
                            open: true,
                            message: '¡Tu consulta ha sido publicada con éxito!',
                            severity: 'success',
                        })
                        loadThreads()
                    }
                })
            } catch (err) {
                console.error('Error parsing pending draft:', err)
            }
        }
    }, [currentUserId, displayName, userRole, photoUrl, loadThreads])

    // Submit new question
    const handleSubmitQuestion = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!asesoriaTitulo.trim() || !asesoriaDescription.trim()) return

        if (!currentUserId) {
            // Save draft to sessionStorage and redirect to login
            sessionStorage.setItem(
                'pending_asesoria_draft',
                JSON.stringify({
                    asesoriaTitulo,
                    asesoriaDescription,
                    asesoriaCategoria: asesoriaCategoria || 'General',
                })
            )
            setSnackbar({
                open: true,
                message: 'Para publicar tu consulta, por favor inicia sesión o regístrate gratuitamente.',
                severity: 'info',
            })
            setTimeout(() => {
                navigate('/ingreso?returnTo=/asesorias')
            }, 1200)
            return
        }

        setIsSubmitting(true)
        try {
            const id = await createAsesoria({
                asesoriaTitulo: asesoriaTitulo.trim(),
                asesoriaDescription: asesoriaDescription.trim(),
                asesoriaCategoria: asesoriaCategoria || 'General',
                asesoriaAuthorId: currentUserId,
                asesoriaAuthorName: displayName || 'Usuario Dezzpo',
                asesoriaAuthorRole: (userRole as 1 | 2) || 1,
                asesoriaAuthorPhotoUrl: photoUrl || '',
            })

            if (id) {
                setAsesoriaTitulo('')
                setAsesoriaDescription('')
                setAsesoriaCategoria('')
                setSnackbar({
                    open: true,
                    message: '¡Tu consulta ha sido publicada exitosamente!',
                    severity: 'success',
                })
                loadThreads()
            }
        } catch (err) {
            console.error('Error publishing question:', err)
            setSnackbar({
                open: true,
                message: 'Ocurrió un error al publicar tu consulta.',
                severity: 'error',
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    // Submit response to thread
    const handleSendResponse = async (asesoriaId: string) => {
        if (!responseText.trim()) return

        if (!currentUserId) {
            setSnackbar({
                open: true,
                message: 'Debes iniciar sesión para participar en la discusión.',
                severity: 'info',
            })
            setTimeout(() => {
                navigate('/ingreso?returnTo=/asesorias')
            }, 1200)
            return
        }

        try {
            const ok = await addAsesoriaResponse(asesoriaId, {
                providerId: currentUserId,
                authorName: displayName || (userRole === 2 ? 'Comerciante Calificado' : 'Usuario Dezzpo'),
                authorRole: (userRole as 1 | 2) || 1,
                authorPhotoUrl: photoUrl || '',
                answerText: responseText.trim(),
                date: new Date().toISOString(),
                isVerifiedProvider: userRole === 2,
            })

            if (ok) {
                setResponseText('')
                setActiveResponseId(null)
                setSnackbar({
                    open: true,
                    message: '¡Tu respuesta ha sido publicada!',
                    severity: 'success',
                })
                loadThreads()
            }
        } catch (err) {
            console.error('Error submitting response:', err)
        }
    }

    // Upvote thread
    const handleLikeThread = async (asesoriaId: string) => {
        await incrementAsesoriaLikes(asesoriaId)
        setThreads((prev) =>
            prev.map((t) =>
                (t.asesoriaId || t.id) === asesoriaId ? { ...t, likesCount: (t.likesCount || 0) + 1 } : t
            )
        )
    }

    // Filter threads
    const filteredThreads = useMemo(() => {
        return threads.filter((item) => {
            const matchesCategory =
                selectedCategory === 'Todas' ||
                item.asesoriaCategoria?.toLowerCase() === selectedCategory.toLowerCase()

            const matchesSearch =
                !searchTerm.trim() ||
                item.asesoriaTitulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.asesoriaDescription?.toLowerCase().includes(searchTerm.toLowerCase())

            return matchesCategory && matchesSearch
        })
    }, [threads, selectedCategory, searchTerm])

    return (
        <div className="consulting-page">
            {/* Hero Header */}
            <Container fluid className="p-0">
                <Row className="asesorias-titulo m-0 w-100">
                    <Col className="align-items-end" lg={6} md={8} sm={10} xs={12}>
                        <Col className="opacidad-negro">
                            <h1 className="type-hero-title text-blanco mb-4">ASESORÍAS EN VIVO</h1>
                            <p className="body-1 text-blanco mb-4">
                                Consulta a nuestra comunidad de profesionales calificados y resuelve las dudas
                                técnicas, de materiales, tiempo y costo de tu próximo proyecto.
                            </p>
                        </Col>
                    </Col>
                </Row>
            </Container>

            {/* Question Form & Real-time Chat Info */}
            <Container fluid className="p-0">
                <Row className="asesorias-preguntas m-0 w-100 py-5">
                    <Col className="row max-width-lg mx-auto">
                        <Col className="col pb-4" md={7} sm={12}>
                            <h2 className="headline-xl mb-2">¿Requieres de una asesoría técnica?</h2>
                            <p className="body-1 mb-4 text-muted">
                                Publica tu pregunta de manera gratuita y recibe la orientación de nuestros especialistas.
                            </p>

                            <Form className="pb-4" onSubmit={handleSubmitQuestion}>
                                <Form.Group className="mb-3" controlId="formasesoriaCategoria">
                                    <Form.Label className="body-2 fw-bold">Seleccionar categoría</Form.Label>
                                    <Form.Select
                                        value={asesoriaCategoria}
                                        onChange={(e) => setAsesoriaCategoria(e.target.value)}
                                        className="body-2"
                                    >
                                        <option value="">Selecciona una categoría</option>
                                        {CATEGORIES.filter((c) => c !== 'Todas').map((cat) => (
                                            <option key={cat} value={cat}>
                                                {cat}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formAsesoriaTitulo">
                                    <Form.Label className="body-2 fw-bold">Dale un título a tu pregunta</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Ej: ¿Qué tipo de pintura es ideal para fachadas con humedad?"
                                        value={asesoriaTitulo}
                                        onChange={(e) => setAsesoriaTitulo(e.target.value)}
                                        className="body-2"
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formAsesoriaDescription">
                                    <Form.Label className="body-2 fw-bold">¿Qué quisieras conocer?</Form.Label>
                                    <br />
                                    <Form.Text className="text-muted body-2">
                                        Describe los detalles de tu inquietud para recibir respuestas precisas.
                                    </Form.Text>
                                    <Form.Control
                                        as="textarea"
                                        style={{ height: '110px' }}
                                        placeholder="Escribe tu consulta detallada aquí..."
                                        value={asesoriaDescription}
                                        onChange={(e) => setAsesoriaDescription(e.target.value)}
                                        className="body-2 mt-1"
                                        required
                                    />
                                </Form.Group>

                                <Button
                                    type="submit"
                                    disabled={isSubmitting || !asesoriaTitulo.trim() || !asesoriaDescription.trim()}
                                    className="btn btn-round btn-high btn-avanzar body-2 fw-bold px-4"
                                >
                                    {isSubmitting ? 'PUBLICANDO...' : 'PUBLICAR CONSULTA'}
                                </Button>
                            </Form>
                        </Col>

                        <Col className="col pt-4 pb-4" md={5} sm={12}>
                            <Paper elevation={0} sx={{ p: 4, borderRadius: 4, bgcolor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                                <h3 className="headline-l mb-3">
                                    Contacta Con Un Asesor en Tiempo Real <ChatIcon className="ms-1 color-primary" />
                                </h3>
                                <p className="body-2 text-muted mb-4">
                                    ¿Prefieres atención inmediata de nuestro equipo? Escríbenos por WhatsApp y te ayudaremos en directo.
                                </p>
                                <Button
                                    className="btn btn-round btn-high btn-avanzar body-2 fw-bold px-4 w-100"
                                    href="https://wa.me/573204842897?text=Hola%20estoy%20interesado%20en%20saber%20acerca%20de%20como%20Dezzpo%20..."
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    CHAT EN VIVO POR WHATSAPP
                                </Button>
                            </Paper>
                        </Col>
                    </Col>
                </Row>
            </Container>

            {/* Historial de Preguntas de la Comunidad (Community QA Forum) */}
            <Box sx={{ bgcolor: '#0f172a', py: 8, color: '#ffffff' }}>
                <Container fluid className="px-3 px-md-5">
                    <Row className="m-0 w-100">
                        <Col className="max-width-lg mx-auto">
                            <Box sx={{ textAlign: 'center', mb: 5 }}>
                                <Chip label="Comunidad Dezzpo" color="primary" sx={{ fontWeight: 700, mb: 1.5 }} />
                                <Typography variant="h3" fontWeight={800} sx={{ color: '#ffffff', mb: 1 }}>
                                    Historial de Preguntas de la Comunidad
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#94a3b8', maxWidth: 680, mx: 'auto' }}>
                                    Revisa las soluciones técnicas propuestas por nuestros comerciantes calificados y participa en los hilos de discusión.
                                </Typography>
                            </Box>

                            {/* Search & Category Filter */}
                            <Paper sx={{ p: 3, mb: 4, borderRadius: 3, bgcolor: '#1e293b', border: '1px solid #334155' }}>
                                <Grid container spacing={2} alignItems="center">
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            placeholder="Buscar preguntas técnicas..."
                                            fullWidth
                                            size="small"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <SearchIcon sx={{ color: '#94a3b8' }} />
                                                    </InputAdornment>
                                                ),
                                                sx: { color: '#ffffff', bgcolor: '#0f172a', borderRadius: 2 },
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                            {CATEGORIES.map((cat) => (
                                                <Chip
                                                    key={cat}
                                                    label={cat}
                                                    clickable
                                                    onClick={() => setSelectedCategory(cat)}
                                                    color={selectedCategory === cat ? 'primary' : 'default'}
                                                    sx={{
                                                        bgcolor: selectedCategory === cat ? undefined : '#0f172a',
                                                        color: selectedCategory === cat ? undefined : '#cbd5e1',
                                                        fontWeight: 600,
                                                        fontSize: '0.78rem',
                                                    }}
                                                />
                                            ))}
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Paper>

                            {/* Threads List */}
                            {isLoadingThreads ? (
                                <Box sx={{ textAlign: 'center', py: 6 }}>
                                    <Spinner animation="border" variant="light" />
                                    <Typography variant="body2" sx={{ color: '#94a3b8', mt: 2 }}>
                                        Cargando historial de la comunidad...
                                    </Typography>
                                </Box>
                            ) : filteredThreads.length === 0 ? (
                                <Paper sx={{ p: 6, textAlign: 'center', bgcolor: '#1e293b', borderRadius: 3, border: '1px dashed #334155' }}>
                                    <QuestionAnswerIcon sx={{ fontSize: 56, color: '#64748b', mb: 2 }} />
                                    <Typography variant="h6" fontWeight={700} sx={{ color: '#f8fafc' }}>
                                        No se encontraron preguntas en esta categoría
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#94a3b8', mt: 0.5 }}>
                                        ¡Sé el primero en realizar una consulta técnica a la comunidad arriba!
                                    </Typography>
                                </Paper>
                            ) : (
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    {filteredThreads.map((thread) => {
                                        const threadId = thread.asesoriaId || thread.id || ''
                                        const respuestas = thread.asesoriaRespuestas || []
                                        const dateStr = thread.asesoriaCreatedAt
                                            ? new Date(thread.asesoriaCreatedAt).toLocaleDateString('es-CO', {
                                                  day: '2-digit',
                                                  month: 'short',
                                                  year: 'numeric',
                                              })
                                            : ''

                                        return (
                                            <Accordion
                                                key={threadId}
                                                sx={{
                                                    bgcolor: '#1e293b',
                                                    color: '#f8fafc',
                                                    borderRadius: '12px !important',
                                                    border: '1px solid #334155',
                                                    '&:before': { display: 'none' },
                                                }}
                                            >
                                                <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#94a3b8' }} />}>
                                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, width: '100%', pr: 1 }}>
                                                        <Avatar src={thread.asesoriaAuthorPhotoUrl} sx={{ bgcolor: 'primary.main', width: 42, height: 42 }}>
                                                            {thread.asesoriaAuthorName?.charAt(0) || <PersonIcon />}
                                                        </Avatar>

                                                        <Box sx={{ flexGrow: 1 }}>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 0.5 }}>
                                                                <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#ffffff' }}>
                                                                    {thread.asesoriaTitulo}
                                                                </Typography>
                                                                {thread.asesoriaCategoria && (
                                                                    <Chip
                                                                        label={thread.asesoriaCategoria}
                                                                        size="small"
                                                                        sx={{ bgcolor: '#0f172a', color: '#38bdf8', fontSize: '0.72rem', height: 20 }}
                                                                    />
                                                                )}
                                                            </Box>

                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                                <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                                                                    Por <strong>{thread.asesoriaAuthorName || 'Usuario Dezzpo'}</strong> • {dateStr}
                                                                </Typography>
                                                            </Box>
                                                        </Box>

                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <Chip
                                                                label={`${respuestas.length} ${respuestas.length === 1 ? 'respuesta' : 'respuestas'}`}
                                                                size="small"
                                                                color={respuestas.length > 0 ? 'success' : 'default'}
                                                                sx={{ fontWeight: 700 }}
                                                            />
                                                        </Box>
                                                    </Box>
                                                </AccordionSummary>

                                                <AccordionDetails sx={{ pt: 1, pb: 3, px: 3, borderTop: '1px solid #334155' }}>
                                                    {/* Question Full Content */}
                                                    <Typography variant="body1" sx={{ color: '#cbd5e1', mb: 3, whiteSpace: 'pre-line' }}>
                                                        {thread.asesoriaDescription}
                                                    </Typography>

                                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                                                        <Tooltip title="Esta consulta fue útil">
                                                            <Button
                                                                size="small"
                                                                startIcon={<ThumbUpIcon fontSize="small" />}
                                                                onClick={() => handleLikeThread(threadId)}
                                                                sx={{ color: '#38bdf8', textTransform: 'none' }}
                                                            >
                                                                Útil ({thread.likesCount || 0})
                                                            </Button>
                                                        </Tooltip>
                                                    </Box>

                                                    <Divider sx={{ borderColor: '#334155', mb: 3 }} />

                                                    {/* Responses Header */}
                                                    <Typography variant="subtitle2" fontWeight={700} sx={{ color: '#cbd5e1', mb: 2 }}>
                                                        Respuestas de la Comunidad ({respuestas.length})
                                                    </Typography>

                                                    {respuestas.length === 0 ? (
                                                        <Typography variant="body2" sx={{ color: '#94a3b8', fontStyle: 'italic', mb: 3 }}>
                                                            Aún no hay respuestas profesionales registradas para esta inquietud.
                                                        </Typography>
                                                    ) : (
                                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
                                                            {respuestas.map((resp, rIdx) => (
                                                                <Paper
                                                                    key={resp.responseId || rIdx}
                                                                    sx={{
                                                                        p: 2.5,
                                                                        bgcolor: '#0f172a',
                                                                        border: resp.isVerifiedProvider ? '1px solid #0284c7' : '1px solid #334155',
                                                                        borderRadius: 2.5,
                                                                    }}
                                                                >
                                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                                                                        <Avatar src={resp.authorPhotoUrl} sx={{ width: 32, height: 32, bgcolor: '#334155' }}>
                                                                            {resp.authorRole === 2 ? <EngineeringIcon /> : <PersonIcon />}
                                                                        </Avatar>
                                                                        <Box sx={{ flexGrow: 1 }}>
                                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                                <Typography variant="subtitle2" fontWeight={700} sx={{ color: '#f8fafc' }}>
                                                                                    {resp.authorName}
                                                                                </Typography>
                                                                                {resp.isVerifiedProvider && (
                                                                                    <Chip
                                                                                        icon={<VerifiedIcon sx={{ fontSize: '14px !important', color: '#0284c7' }} />}
                                                                                        label="Profesional Certificado"
                                                                                        size="small"
                                                                                        sx={{ bgcolor: 'rgba(2, 132, 199, 0.15)', color: '#38bdf8', fontSize: '0.7rem', height: 20 }}
                                                                                    />
                                                                                )}
                                                                            </Box>
                                                                            <Typography variant="caption" sx={{ color: '#64748b' }}>
                                                                                {resp.date
                                                                                    ? new Date(resp.date).toLocaleDateString('es-CO', {
                                                                                          day: '2-digit',
                                                                                          month: 'short',
                                                                                          hour: '2-digit',
                                                                                          minute: '2-digit',
                                                                                      })
                                                                                    : ''}
                                                                            </Typography>
                                                                        </Box>
                                                                    </Box>
                                                                    <Typography variant="body2" sx={{ color: '#e2e8f0', whiteSpace: 'pre-line' }}>
                                                                        {resp.answerText}
                                                                    </Typography>
                                                                </Paper>
                                                            ))}
                                                        </Box>
                                                    )}

                                                    {/* Reply Box */}
                                                    {activeResponseId === threadId ? (
                                                        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                                            <TextField
                                                                multiline
                                                                rows={3}
                                                                fullWidth
                                                                placeholder="Escribe tu respuesta profesional o recomendación técnica..."
                                                                value={responseText}
                                                                onChange={(e) => setResponseText(e.target.value)}
                                                                InputProps={{
                                                                    sx: { color: '#ffffff', bgcolor: '#0f172a', borderRadius: 2 },
                                                                }}
                                                            />
                                                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                                                <Button
                                                                    size="small"
                                                                    variant="text"
                                                                    onClick={() => {
                                                                        setActiveResponseId(null)
                                                                        setResponseText('')
                                                                    }}
                                                                    sx={{ color: '#94a3b8' }}
                                                                >
                                                                    Cancelar
                                                                </Button>
                                                                <Button
                                                                    size="small"
                                                                    variant="contained"
                                                                    startIcon={<SendIcon />}
                                                                    disabled={!responseText.trim()}
                                                                    onClick={() => handleSendResponse(threadId)}
                                                                    sx={{ fontWeight: 700, textTransform: 'none' }}
                                                                >
                                                                    Publicar Respuesta
                                                                </Button>
                                                            </Box>
                                                        </Box>
                                                    ) : (
                                                        <Button
                                                            variant="outlined"
                                                            size="small"
                                                            startIcon={<SendIcon />}
                                                            onClick={() => setActiveResponseId(threadId)}
                                                            sx={{ color: '#38bdf8', borderColor: '#38bdf8', textTransform: 'none', fontWeight: 700 }}
                                                        >
                                                            Aportar una Respuesta
                                                        </Button>
                                                    )}
                                                </AccordionDetails>
                                            </Accordion>
                                        )
                                    })}
                                </Box>
                            )}

                            <Box sx={{ textAlign: 'center', mt: 6 }}>
                                <Button
                                    className="btn btn-round btn-middle btn-blog"
                                    onClick={() => navigate('/blog')}
                                    sx={{ py: 1.5, px: 4 }}
                                >
                                    <EmailIcon className="me-2" />
                                    EXPLORAR BLOG DE LA COMUNIDAD
                                </Button>
                            </Box>
                        </Col>
                    </Row>
                </Container>
            </Box>

            {/* Snackbar feedback */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
            >
                <Alert severity={snackbar.severity} onClose={() => setSnackbar((s) => ({ ...s, open: false }))}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </div>
    )
}
