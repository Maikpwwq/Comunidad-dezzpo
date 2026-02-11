/**
 * Contratar (Contract) Page
 *
 * Contract creation flow: fetches draft + quotation data,
 * shows a summary, and creates a contract on confirmation.
 */
import { useState, useEffect, useCallback } from 'react'
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap'
import { Button, Typography, Paper, Divider, Snackbar } from '@mui/material'
import { navigate } from 'vike/client/router'

// Stores
import { useUserStore } from '@stores/userStore'

// Services
import { getDraft, updateDraft } from '@services/drafts'
import { createContract } from '@services/contracts'
import type { DraftFirestoreDocument } from '@services/types'

export default function Page() {
    const currentUserId = useUserStore((state) => state.userId)

    // Extract route params from URL search params
    const [draftId, setDraftId] = useState<string | null>(null)
    const [quotationId, setQuotationId] = useState<string | null>(null)
    const [providerId, setProviderId] = useState<string | null>(null)
    const [agreedAmount, setAgreedAmount] = useState<number>(0)

    // Data
    const [draft, setDraft] = useState<DraftFirestoreDocument | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [snackOpen, setSnackOpen] = useState(false)
    const [snackMessage, setSnackMessage] = useState('')

    // Parse URL params on mount
    useEffect(() => {
        if (typeof window === 'undefined') return
        const params = new URLSearchParams(window.location.search)
        setDraftId(params.get('draftId'))
        setQuotationId(params.get('quotationId'))
        setProviderId(params.get('providerId'))
        const amount = parseFloat(params.get('amount') || '0')
        setAgreedAmount(isNaN(amount) ? 0 : amount)
    }, [])

    // Fetch draft data
    useEffect(() => {
        const fetchData = async () => {
            if (!draftId) {
                setIsLoading(false)
                return
            }

            try {
                const draftData = await getDraft({ draftId })
                setDraft(draftData)
            } catch (err) {
                console.error('Error fetching contract data:', err)
                setError('Error al cargar los datos del contrato')
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [draftId])

    // Handle contract creation
    const handleConfirmContract = useCallback(async () => {
        if (!currentUserId || !draftId || !providerId || !quotationId) {
            setSnackMessage('Faltan datos para crear el contrato')
            setSnackOpen(true)
            return
        }

        setIsSubmitting(true)
        try {
            // 1. Create the contract
            const contractId = await createContract({
                data: {
                    draftId,
                    clientId: currentUserId,
                    providerId,
                    quotationId,
                    status: 'active',
                    createdAt: new Date().toISOString(),
                    agreedAmount,
                },
            })

            if (!contractId) {
                throw new Error('Failed to create contract')
            }

            // 2. Close the draft
            await updateDraft({
                draftId,
                data: { status: 'closed' },
            })

            setSnackMessage('¡Contrato creado exitosamente!')
            setSnackOpen(true)

            // 3. Navigate to service history after a brief delay
            setTimeout(() => {
                navigate('/app/historial-servicios')
            }, 1500)
        } catch (err) {
            console.error('Error creating contract:', err)
            setSnackMessage('Error al crear el contrato')
            setSnackOpen(true)
        } finally {
            setIsSubmitting(false)
        }
    }, [currentUserId, draftId, providerId, quotationId, agreedAmount])

    if (isLoading) {
        return (
            <Container fluid className="p-4 text-center">
                <Spinner animation="border" />
                <p className="mt-2">Cargando datos del contrato...</p>
            </Container>
        )
    }

    if (error) {
        return (
            <Container fluid className="p-4">
                <Alert variant="danger">{error}</Alert>
            </Container>
        )
    }

    if (!draftId || !quotationId || !providerId) {
        return (
            <Container fluid className="p-4">
                <Alert variant="warning">
                    Faltan parámetros necesarios. Regresa al requerimiento para contratar.
                </Alert>
                <Button
                    className="btn-round btn-low mt-3"
                    onClick={() => navigate('/app/requerimientos')}
                >
                    Ir a requerimientos
                </Button>
            </Container>
        )
    }

    return (
        <Container fluid className="p-0">
            <div className="p-4">
                <h1 className="type-hero-title">Confirmar Contrato</h1>

                <Paper elevation={2} sx={{ p: 3, mt: 3, borderRadius: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Resumen del Contrato
                    </Typography>
                    <Divider sx={{ mb: 2 }} />

                    <Row>
                        <Col md={6}>
                            <Typography variant="body2" color="text.secondary">
                                Requerimiento
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                {draft?.draftName || draft?.draftCategory || draftId}
                            </Typography>

                            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                                Descripción
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                {draft?.draftDescription || 'Sin descripción'}
                            </Typography>
                        </Col>

                        <Col md={6}>
                            <Typography variant="body2" color="text.secondary">
                                ID de Cotización
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                {quotationId}
                            </Typography>

                            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                                Monto Acordado
                            </Typography>
                            <Typography variant="h5" color="primary" gutterBottom>
                                ${agreedAmount.toLocaleString('es-CO')} COP
                            </Typography>
                        </Col>
                    </Row>

                    <Divider sx={{ my: 3 }} />

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                        <Button
                            className="btn-round btn-low"
                            onClick={() => navigate(-1 as any)}
                            disabled={isSubmitting}
                        >
                            Cancelar
                        </Button>
                        <Button
                            className="btn-round btn-high"
                            onClick={handleConfirmContract}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Creando contrato...' : 'Confirmar Contrato'}
                        </Button>
                    </div>
                </Paper>

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
