/**
 * Calificaciones (Ratings) Page
 *
 * Contract-gated rating system: users can only rate providers
 * after a contract has been completed. Accessed via:
 * /app/calificaciones?contractId=xxx
 *
 * Ratings are stored in the provider's user document under userVotes.reviews[].
 */
import React, { useState, useEffect, useCallback } from 'react'
import { Container, Spinner, Alert } from 'react-bootstrap'
import {
    Typography,
    Button,
    TextareaAutosize,
    Rating,
    Paper,
    Divider,
    Snackbar,
} from '@mui/material'

// Stores
import { useUserStore } from '@stores/userStore'

// Services
import { getContract, updateContract } from '@services/contracts'
import { getUser, updateUser } from '@services/users'
import type { ContractFirestoreDocument, UserRole } from '@services/types'
import { arrayUnion } from 'firebase/firestore'

interface RateState {
    gestion: number
    calidad: number
    oportunidad: number
    description: string
}

const ratingCriteria = [
    {
        name: 'gestion' as const,
        label: 'Gestión',
        description: 'Cumple con los tiempos de entrega de certificaciones, pólizas, actas y contratos.',
    },
    {
        name: 'calidad' as const,
        label: 'Calidad',
        description: 'El servicio cumplió con las especificaciones y normas técnicas establecidas.',
    },
    {
        name: 'oportunidad' as const,
        label: 'Oportunidad',
        description: 'El servicio fue prestado en las fechas y horarios programados.',
    },
]

export default function Page() {
    const currentUserId = useUserStore((state) => state.userId)

    const [contractId, setContractId] = useState<string | null>(null)
    const [contract, setContract] = useState<ContractFirestoreDocument | null>(null)
    const [providerName, setProviderName] = useState<string>('')
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [submitted, setSubmitted] = useState(false)

    const [snackOpen, setSnackOpen] = useState(false)
    const [snackMessage, setSnackMessage] = useState('')

    const [rate, setRate] = useState<RateState>({
        gestion: 0,
        calidad: 0,
        oportunidad: 0,
        description: '',
    })

    // Parse contractId from URL
    useEffect(() => {
        if (typeof window === 'undefined') return
        const params = new URLSearchParams(window.location.search)
        setContractId(params.get('contractId'))
    }, [])

    // Fetch contract + provider info
    useEffect(() => {
        const fetchData = async () => {
            if (!contractId) {
                setIsLoading(false)
                return
            }

            try {
                const contractData = await getContract(contractId)

                if (!contractData) {
                    setError('Contrato no encontrado')
                    setIsLoading(false)
                    return
                }

                if (contractData.status !== 'completed') {
                    setError('Solo puedes calificar contratos completados')
                    setIsLoading(false)
                    return
                }

                if (contractData.rated) {
                    setError('Este contrato ya fue calificado')
                    setIsLoading(false)
                    return
                }

                if (contractData.clientId !== currentUserId) {
                    setError('No tienes permiso para calificar este contrato')
                    setIsLoading(false)
                    return
                }

                setContract(contractData)

                // Fetch provider name
                const providerData = await getUser({ userId: contractData.providerId, role: 2 as UserRole })
                if (providerData) {
                    setProviderName(providerData.userName || 'Proveedor')
                }
            } catch (err) {
                console.error('Error fetching contract:', err)
                setError('Error al cargar el contrato')
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [contractId, currentUserId])

    const handleRate = (value: number | null, name: keyof RateState) => {
        if (value !== null && name !== 'description') {
            setRate({ ...rate, [name]: value })
        }
    }

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setRate({ ...rate, description: event.target.value })
    }

    const handleSubmit = useCallback(async () => {
        if (!contract || !currentUserId) return

        const { gestion, calidad, oportunidad, description } = rate
        if (gestion === 0 || calidad === 0 || oportunidad === 0) {
            setSnackMessage('Por favor califica todos los criterios')
            setSnackOpen(true)
            return
        }

        setIsSubmitting(true)
        try {
            const mean = parseFloat(((gestion + calidad + oportunidad) / 3).toFixed(1))

            const review = {
                contractId: contract.contractId,
                reviewerId: currentUserId,
                gestion,
                calidad,
                oportunidad,
                mean,
                description,
                date: new Date().toISOString(),
            }

            // 1. Add review to provider's userVotes.reviews array
            await updateUser({
                userId: contract.providerId,
                role: 2 as UserRole,
                data: {
                    'userVotes.reviews': arrayUnion(review),
                } as any,
            })

            // 2. Mark contract as rated
            await updateContract({
                contractId: contract.contractId!,
                data: { rated: true },
            })

            setSubmitted(true)
            setSnackMessage('¡Calificación enviada exitosamente!')
            setSnackOpen(true)
        } catch (err) {
            console.error('Error submitting rating:', err)
            setSnackMessage('Error al enviar la calificación')
            setSnackOpen(true)
        } finally {
            setIsSubmitting(false)
        }
    }, [contract, currentUserId, rate])

    if (isLoading) {
        return (
            <Container fluid className="p-4 text-center">
                <Spinner animation="border" />
                <p className="mt-2">Cargando...</p>
            </Container>
        )
    }

    if (error) {
        return (
            <Container fluid className="p-4">
                <Alert variant="warning">{error}</Alert>
            </Container>
        )
    }

    if (!contractId || !contract) {
        return (
            <Container fluid className="p-4">
                <Alert variant="info">
                    Selecciona un contrato completado desde tu historial de servicios para calificar.
                </Alert>
            </Container>
        )
    }

    if (submitted) {
        return (
            <Container fluid className="p-4 text-center">
                <h1 className="type-hero-title">¡Gracias!</h1>
                <Typography variant="body1" sx={{ mt: 2 }}>
                    Tu calificación para <strong>{providerName}</strong> ha sido registrada.
                </Typography>
            </Container>
        )
    }

    return (
        <Container fluid className="p-0">
            <div className="p-4" style={{ maxWidth: 720, margin: '0 auto' }}>
                <h1 className="type-hero-title">Calificaciones</h1>
                <Typography variant="body1" color="text.secondary">
                    Evalúa el desempeño de <strong>{providerName}</strong>
                </Typography>

                <Paper elevation={1} sx={{ p: 3, mt: 3, borderRadius: 2 }}>
                    {ratingCriteria.map((criteria) => (
                        <React.Fragment key={criteria.name}>
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '1rem 0',
                                }}
                            >
                                <div style={{ flex: 1, paddingRight: '1rem' }}>
                                    <Typography variant="body1" fontWeight={600}>
                                        {criteria.label}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {criteria.description}
                                    </Typography>
                                </div>
                                <Rating
                                    name={criteria.name}
                                    value={rate[criteria.name]}
                                    onChange={(_, value) => handleRate(value, criteria.name)}
                                    size="large"
                                />
                            </div>
                            <Divider />
                        </React.Fragment>
                    ))}

                    <TextareaAutosize
                        value={rate.description}
                        onChange={handleChange}
                        name="rateDescription"
                        placeholder="Observaciones generales (opcional)"
                        minRows={3}
                        style={{
                            width: '100%',
                            marginTop: '1rem',
                            padding: '0.75rem',
                            borderRadius: '8px',
                            border: '1px solid #e0e0e0',
                            fontFamily: 'inherit',
                            fontSize: '0.875rem',
                        }}
                    />

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                        <Button
                            className="btn-round btn-high"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Enviando...' : 'Enviar Calificación'}
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
