/**
 * Asesorías (Advisories) App Page (/app/asesorias)
 *
 * Authenticated workspace for Propietarios and Comerciantes to manage technical Q&A threads.
 */
import { useState, useEffect, useCallback } from 'react'
import { Container, Spinner, Alert } from 'react-bootstrap'
import {
    Typography,
    Paper,
    Button,
    TextField,
    TextareaAutosize,
    Divider,
    Chip,
    Snackbar,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Avatar,
    Box,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer'
import VerifiedIcon from '@mui/icons-material/Verified'
import SendIcon from '@mui/icons-material/Send'
import PersonIcon from '@mui/icons-material/Person'
import EngineeringIcon from '@mui/icons-material/Engineering'

// Stores
import { useUserStore } from '@stores/userStore'

// Services
import {
    getAllAsesorias,
    createAsesoria,
    addAsesoriaResponse,
} from '@services/asesoriaService'
import type { AsesoriaFirestoreDocument } from '@services/types'

export default function Page() {
    const currentUserId = useUserStore((state) => state.userId)
    const userRole = useUserStore((state) => state.rol) // 1 = Propietario, 2 = Comerciante
    const displayName = useUserStore((state) => state.displayName) || ''
    const photoUrl = useUserStore((state) => state.photoUrl) || ''

    const [asesorias, setAsesorias] = useState<AsesoriaFirestoreDocument[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [snackOpen, setSnackOpen] = useState(false)
    const [snackMessage, setSnackMessage] = useState('')

    // New question form
    const [newTitle, setNewTitle] = useState('')
    const [newDescription, setNewDescription] = useState('')
    const [newCategory, setNewCategory] = useState('')

    // Response form
    const [activeResponseId, setActiveResponseId] = useState<string | null>(null)
    const [responseText, setResponseText] = useState('')

    // Fetch all asesorias
    const fetchAsesorias = useCallback(async () => {
        setIsLoading(true)
        try {
            const list = await getAllAsesorias()
            setAsesorias(list)
        } catch (error) {
            console.error('Error fetching asesorias:', error)
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchAsesorias()
    }, [fetchAsesorias])

    // Create a new asesoria (Propietario only)
    const handleCreateAsesoria = useCallback(async () => {
        if (!currentUserId || !newTitle.trim()) return

        setIsSubmitting(true)
        try {
            const docId = await createAsesoria({
                asesoriaTitulo: newTitle.trim(),
                asesoriaDescription: newDescription.trim(),
                asesoriaCategoria: newCategory.trim() || 'General',
                asesoriaAuthorId: currentUserId,
                asesoriaAuthorName: displayName || 'Usuario Dezzpo',
                asesoriaAuthorRole: (userRole as 1 | 2) || 1,
                asesoriaAuthorPhotoUrl: photoUrl,
            })

            if (docId) {
                setNewTitle('')
                setNewDescription('')
                setNewCategory('')
                setSnackMessage('¡Consulta publicada exitosamente!')
                setSnackOpen(true)
                fetchAsesorias()
            }
        } catch (error) {
            console.error('Error creating asesoria:', error)
            setSnackMessage('Error al publicar la consulta')
            setSnackOpen(true)
        } finally {
            setIsSubmitting(false)
        }
    }, [currentUserId, displayName, userRole, photoUrl, newTitle, newDescription, newCategory, fetchAsesorias])

    // Add a response
    const handleAddResponse = useCallback(async (asesoriaId: string) => {
        if (!currentUserId || !responseText.trim()) return

        setIsSubmitting(true)
        try {
            const ok = await addAsesoriaResponse(asesoriaId, {
                providerId: currentUserId,
                authorName: displayName || (userRole === 2 ? 'Comerciante Calificado' : 'Usuario Dezzpo'),
                authorRole: (userRole as 1 | 2) || 1,
                authorPhotoUrl: photoUrl,
                answerText: responseText.trim(),
                date: new Date().toISOString(),
                isVerifiedProvider: userRole === 2,
            })

            if (ok) {
                setResponseText('')
                setActiveResponseId(null)
                setSnackMessage('¡Respuesta enviada!')
                setSnackOpen(true)
                fetchAsesorias()
            }
        } catch (error) {
            console.error('Error adding response:', error)
            setSnackMessage('Error al enviar la respuesta')
            setSnackOpen(true)
        } finally {
            setIsSubmitting(false)
        }
    }, [currentUserId, displayName, userRole, photoUrl, responseText, fetchAsesorias])

    if (!currentUserId) {
        return (
            <Container fluid className="p-4">
                <Alert variant="warning">Debes iniciar sesión para usar las asesorías.</Alert>
            </Container>
        )
    }

    if (isLoading) {
        return (
            <Container fluid className="p-4 text-center">
                <Spinner animation="border" />
                <p className="mt-2">Cargando asesorías...</p>
            </Container>
        )
    }

    return (
        <Container fluid className="p-0">
            <div className="p-4" style={{ maxWidth: 900, margin: '0 auto' }}>
                <h1 className="type-hero-title">Asesorías Técnicas</h1>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    {userRole === 1
                        ? 'Publica tus consultas técnicas y recibe respuestas de profesionales calificados.'
                        : 'Responde a las consultas técnicas de la comunidad de propietarios y residentes.'}
                </Typography>

                {/* New question form (Propietario only) */}
                {userRole === 1 && (
                    <Paper elevation={1} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
                        <Typography variant="h6" fontWeight={700} gutterBottom>
                            Nueva Consulta Técnica
                        </Typography>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                            <TextField
                                label="Título de la consulta"
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                size="small"
                                fullWidth
                            />
                            <TextField
                                label="Categoría (ej. Electricidad, Plomería, Pintura)"
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                size="small"
                                fullWidth
                            />
                            <TextareaAutosize
                                value={newDescription}
                                onChange={(e) => setNewDescription(e.target.value)}
                                placeholder="Describe tu consulta técnica con detalle..."
                                minRows={3}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    borderRadius: '8px',
                                    border: '1px solid #e0e0e0',
                                    fontFamily: 'inherit',
                                    fontSize: '0.875rem',
                                }}
                            />
                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Button
                                    className="btn-round btn-high"
                                    onClick={handleCreateAsesoria}
                                    disabled={isSubmitting || !newTitle.trim()}
                                >
                                    {isSubmitting ? 'Publicando...' : 'Publicar Consulta'}
                                </Button>
                            </div>
                        </div>
                    </Paper>
                )}

                {/* List of asesorias */}
                {asesorias.length === 0 ? (
                    <Paper elevation={0} sx={{ p: 4, textAlign: 'center', borderRadius: 3, border: '1px dashed #ccc' }}>
                        <QuestionAnswerIcon sx={{ fontSize: 48, color: '#ccc', mb: 1 }} />
                        <Typography variant="body1" color="text.secondary">
                            No hay consultas publicadas aún.
                        </Typography>
                    </Paper>
                ) : (
                    asesorias.map((asesoria) => {
                        const targetId = asesoria.asesoriaId || asesoria.id || ''
                        const respuestas = asesoria.asesoriaRespuestas || []

                        return (
                            <Accordion key={targetId} sx={{ mb: 2, borderRadius: '12px !important' }}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%' }}>
                                        <Avatar src={asesoria.asesoriaAuthorPhotoUrl} sx={{ width: 36, height: 36 }}>
                                            {asesoria.asesoriaAuthorName?.charAt(0) || <PersonIcon />}
                                        </Avatar>
                                        <div style={{ flex: 1 }}>
                                            <Typography variant="subtitle1" fontWeight={700}>
                                                {asesoria.asesoriaTitulo}
                                            </Typography>
                                            {asesoria.asesoriaCategoria && (
                                                <Chip
                                                    label={asesoria.asesoriaCategoria}
                                                    size="small"
                                                    variant="outlined"
                                                    sx={{ mt: 0.5 }}
                                                />
                                            )}
                                        </div>
                                        <Chip
                                            label={`${respuestas.length} respuestas`}
                                            size="small"
                                            color={respuestas.length > 0 ? 'success' : 'default'}
                                        />
                                    </div>
                                </AccordionSummary>
                                <AccordionDetails sx={{ p: 3 }}>
                                    <Typography variant="body1" sx={{ mb: 2, color: 'text.primary' }}>
                                        {asesoria.asesoriaDescription}
                                    </Typography>

                                    <Divider sx={{ mb: 2 }} />

                                    {/* Responses */}
                                    <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5 }}>
                                        Respuestas de la comunidad ({respuestas.length})
                                    </Typography>

                                    {respuestas.length === 0 ? (
                                        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', mb: 2 }}>
                                            Aún no hay respuestas registradas para esta consulta.
                                        </Typography>
                                    ) : (
                                        respuestas.map((resp, idx) => (
                                            <Paper
                                                key={resp.responseId || idx}
                                                variant="outlined"
                                                sx={{ p: 2, mb: 1.5, borderRadius: 2, bgcolor: '#fafafa' }}
                                            >
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                                    <Avatar src={resp.authorPhotoUrl} sx={{ width: 28, height: 28 }}>
                                                        {resp.authorRole === 2 ? <EngineeringIcon fontSize="small" /> : <PersonIcon fontSize="small" />}
                                                    </Avatar>
                                                    <Typography variant="subtitle2" fontWeight={700}>
                                                        {resp.authorName || 'Usuario Dezzpo'}
                                                    </Typography>
                                                    {resp.isVerifiedProvider && (
                                                        <Chip
                                                            icon={<VerifiedIcon color="primary" fontSize="small" />}
                                                            label="Profesional Certificado"
                                                            size="small"
                                                            variant="outlined"
                                                            sx={{ height: 20, fontSize: '0.7rem' }}
                                                        />
                                                    )}
                                                    <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
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
                                                <Typography variant="body2" sx={{ pl: 4.5 }}>
                                                    {resp.answerText}
                                                </Typography>
                                            </Paper>
                                        ))
                                    )}

                                    {/* Response Form */}
                                    {activeResponseId === targetId ? (
                                        <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            <TextareaAutosize
                                                value={responseText}
                                                onChange={(e) => setResponseText(e.target.value)}
                                                placeholder="Escribe tu respuesta profesional o recomendación..."
                                                minRows={2}
                                                style={{
                                                    width: '100%',
                                                    padding: '0.5rem',
                                                    borderRadius: '6px',
                                                    border: '1px solid #ccc',
                                                    fontFamily: 'inherit',
                                                    fontSize: '0.875rem',
                                                }}
                                            />
                                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                                <Button
                                                    size="small"
                                                    onClick={() => {
                                                        setActiveResponseId(null)
                                                        setResponseText('')
                                                    }}
                                                >
                                                    Cancelar
                                                </Button>
                                                <Button
                                                    size="small"
                                                    className="btn-round btn-high"
                                                    onClick={() => handleAddResponse(targetId)}
                                                    disabled={isSubmitting || !responseText.trim()}
                                                >
                                                    Enviar Respuesta
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            startIcon={<SendIcon fontSize="small" />}
                                            sx={{ mt: 1, textTransform: 'none', fontWeight: 600 }}
                                            onClick={() => setActiveResponseId(targetId)}
                                        >
                                            Responder a este hilo
                                        </Button>
                                    )}
                                </AccordionDetails>
                            </Accordion>
                        )
                    })
                )}

                <Snackbar
                    open={snackOpen}
                    autoHideDuration={3000}
                    onClose={() => setSnackOpen(false)}
                    message={snackMessage}
                />
            </div>
        </Container>
    )
}
