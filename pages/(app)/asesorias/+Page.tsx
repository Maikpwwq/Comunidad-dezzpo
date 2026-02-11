/**
 * Asesorías (Advisories) Page
 *
 * Propietarios can post technical questions.
 * Comerciantes can respond with expert advice.
 * Stored in the 'asesorias' Firestore collection.
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
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer'

// Stores
import { useUserStore } from '@stores/userStore'

// Services
import { firestore, isFirebaseAvailable } from '@services/firebase'
import { collection, getDocs, addDoc, doc, updateDoc, arrayUnion } from 'firebase/firestore'
import type { AsesoriaFirestoreDocument, AsesoriaResponse } from '@services/types'

const ASESORIAS_COLLECTION = 'asesorias'

export default function Page() {
    const currentUserId = useUserStore((state) => state.userId)
    const userRole = useUserStore((state) => state.rol) // 1 = Propietario, 2 = Comerciante
    const userName = (useUserStore as any)((state: any) => state.userName) || ''

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
    useEffect(() => {
        const fetchAsesorias = async () => {
            if (!isFirebaseAvailable() || !firestore) {
                setIsLoading(false)
                return
            }

            try {
                const asesoriasRef = collection(firestore, ASESORIAS_COLLECTION)
                const snapshot = await getDocs(asesoriasRef)
                const data = snapshot.docs.map((doc) => ({
                    ...doc.data(),
                    asesoriaId: doc.id,
                })) as AsesoriaFirestoreDocument[]

                setAsesorias(data)
            } catch (error) {
                console.error('Error fetching asesorias:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchAsesorias()
    }, [])

    // Create a new asesoria (Propietario only)
    const handleCreateAsesoria = useCallback(async () => {
        if (!currentUserId || !firestore || !newTitle.trim()) return

        setIsSubmitting(true)
        try {
            const asesoriasRef = collection(firestore, ASESORIAS_COLLECTION)
            const newDoc = await addDoc(asesoriasRef, {
                asesoriaTitulo: newTitle.trim(),
                asesoriaDescription: newDescription.trim(),
                asesoriaCategoria: newCategory.trim(),
                asesoriaSelect: 'open',
                asesoriaAuthorId: currentUserId,
                asesoriaAuthorName: userName || 'Anónimo',
                asesoriaCreatedAt: new Date().toISOString(),
                asesoriaRespuestas: [],
            })

            // Add to local state
            setAsesorias(prev => [{
                asesoriaId: newDoc.id,
                asesoriaTitulo: newTitle.trim(),
                asesoriaDescription: newDescription.trim(),
                asesoriaCategoria: newCategory.trim(),
                asesoriaSelect: 'open',
                asesoriaRespuestas: [],
            }, ...prev])

            setNewTitle('')
            setNewDescription('')
            setNewCategory('')
            setSnackMessage('¡Consulta publicada exitosamente!')
            setSnackOpen(true)
        } catch (error) {
            console.error('Error creating asesoria:', error)
            setSnackMessage('Error al publicar la consulta')
            setSnackOpen(true)
        } finally {
            setIsSubmitting(false)
        }
    }, [currentUserId, userName, newTitle, newDescription, newCategory])

    // Add a response (Comerciante only)
    const handleAddResponse = useCallback(async (asesoriaId: string) => {
        if (!currentUserId || !firestore || !responseText.trim()) return

        setIsSubmitting(true)
        try {
            const asesoriaRef = doc(firestore, ASESORIAS_COLLECTION, asesoriaId)
            const newResponse: AsesoriaResponse = {
                providerId: currentUserId,
                answerText: responseText.trim(),
                date: new Date().toISOString(),
            }

            await updateDoc(asesoriaRef, {
                asesoriaRespuestas: arrayUnion(newResponse),
            })

            // Update local state
            setAsesorias(prev => prev.map(a =>
                a.asesoriaId === asesoriaId
                    ? { ...a, asesoriaRespuestas: [...(a.asesoriaRespuestas || []), newResponse] }
                    : a
            ))

            setResponseText('')
            setActiveResponseId(null)
            setSnackMessage('¡Respuesta enviada!')
            setSnackOpen(true)
        } catch (error) {
            console.error('Error adding response:', error)
            setSnackMessage('Error al enviar la respuesta')
            setSnackOpen(true)
        } finally {
            setIsSubmitting(false)
        }
    }, [currentUserId, responseText])

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
                        ? 'Publica tus consultas técnicas y recibe respuestas de profesionales.'
                        : 'Responde a las consultas técnicas de los propietarios y residentes.'}
                </Typography>

                {/* New question form (Propietario only) */}
                {userRole === 1 && (
                    <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Nueva Consulta
                        </Typography>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <TextField
                                label="Título de la consulta"
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                size="small"
                                fullWidth
                            />
                            <TextField
                                label="Categoría (ej. Electricidad, Plomería)"
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
                    <Paper elevation={0} sx={{ p: 4, textAlign: 'center', borderRadius: 2, border: '1px dashed #ccc' }}>
                        <QuestionAnswerIcon sx={{ fontSize: 48, color: '#ccc', mb: 1 }} />
                        <Typography variant="body1" color="text.secondary">
                            No hay consultas publicadas aún.
                        </Typography>
                    </Paper>
                ) : (
                    asesorias.map((asesoria) => (
                        <Accordion key={asesoria.asesoriaId} sx={{ mb: 1, borderRadius: '8px !important' }}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%' }}>
                                    <div style={{ flex: 1 }}>
                                        <Typography variant="subtitle1" fontWeight={600}>
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
                                        label={`${(asesoria.asesoriaRespuestas || []).length} respuestas`}
                                        size="small"
                                        color={(asesoria.asesoriaRespuestas || []).length > 0 ? 'success' : 'default'}
                                    />
                                </div>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography variant="body2" sx={{ mb: 2 }}>
                                    {asesoria.asesoriaDescription}
                                </Typography>

                                <Divider sx={{ mb: 2 }} />

                                {/* Responses */}
                                {(asesoria.asesoriaRespuestas || []).map((resp, idx) => (
                                    <Paper
                                        key={idx}
                                        variant="outlined"
                                        sx={{ p: 2, mb: 1, borderRadius: 1, bgcolor: '#fafafa' }}
                                    >
                                        <Typography variant="body2">{resp.answerText}</Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Profesional • {resp.date}
                                        </Typography>
                                    </Paper>
                                ))}

                                {/* Response form (Comerciante only) */}
                                {userRole === 2 && (
                                    <>
                                        {activeResponseId === asesoria.asesoriaId ? (
                                            <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                                <TextareaAutosize
                                                    value={responseText}
                                                    onChange={(e) => setResponseText(e.target.value)}
                                                    placeholder="Escribe tu respuesta profesional..."
                                                    minRows={2}
                                                    style={{
                                                        width: '100%',
                                                        padding: '0.5rem',
                                                        borderRadius: '6px',
                                                        border: '1px solid #e0e0e0',
                                                        fontFamily: 'inherit',
                                                        fontSize: '0.875rem',
                                                    }}
                                                />
                                                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                                    <Button
                                                        size="small"
                                                        onClick={() => { setActiveResponseId(null); setResponseText('') }}
                                                    >
                                                        Cancelar
                                                    </Button>
                                                    <Button
                                                        size="small"
                                                        className="btn-round btn-high"
                                                        onClick={() => handleAddResponse(asesoria.asesoriaId!)}
                                                        disabled={isSubmitting || !responseText.trim()}
                                                    >
                                                        Enviar
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <Button
                                                size="small"
                                                sx={{ mt: 1 }}
                                                onClick={() => setActiveResponseId(asesoria.asesoriaId!)}
                                            >
                                                Responder
                                            </Button>
                                        )}
                                    </>
                                )}
                            </AccordionDetails>
                        </Accordion>
                    ))
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
