/**
 * Historial de Servicios (Service History) Page
 *
 * Role-based display of contracts and drafts:
 * - Propietarios (Role 1): See their requirements + contracts as client
 * - Comerciantes (Role 2): See their quotations + contracts as provider
 */
import { useState, useEffect } from 'react'
import { Container, Spinner, Alert } from 'react-bootstrap'
import {
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    Tabs,
    Tab,
    Box,
    Button,
} from '@mui/material'
import { navigate } from 'vike/client/router'

// Stores
import { useUserStore } from '@stores/userStore'

// Services
import { getDraftsByUser } from '@services/drafts'
import { getContractsByClient, getContractsByProvider } from '@services/contracts'
import { getQuotationsByComerciante } from '@services/quotations'
import type { DraftFirestoreDocument, ContractFirestoreDocument, QuotationFirestoreDocument } from '@services/types'

// Status chip color mapping
const statusColors: Record<string, 'default' | 'primary' | 'success' | 'warning' | 'error'> = {
    'open': 'primary',
    'closed': 'default',
    'active': 'warning',
    'completed': 'success',
    'disputed': 'error',
    'pending': 'warning',
    'accepted': 'success',
    'rejected': 'error',
}

const statusLabels: Record<string, string> = {
    'open': 'Abierto',
    'closed': 'Cerrado',
    'active': 'Activo',
    'completed': 'Completado',
    'disputed': 'En disputa',
    'pending': 'Pendiente',
    'accepted': 'Aceptada',
    'rejected': 'Rechazada',
}

function StatusChip({ status }: { status: string }) {
    return (
        <Chip
            label={statusLabels[status] || status}
            color={statusColors[status] || 'default'}
            size="small"
            variant="outlined"
        />
    )
}

export default function Page() {
    const currentUserId = useUserStore((state) => state.userId)
    const userRole = useUserStore((state) => state.rol)

    const [activeTab, setActiveTab] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Propietario data
    const [drafts, setDrafts] = useState<DraftFirestoreDocument[]>([])
    const [clientContracts, setClientContracts] = useState<ContractFirestoreDocument[]>([])

    // Comerciante data
    const [quotations, setQuotations] = useState<QuotationFirestoreDocument[]>([])
    const [providerContracts, setProviderContracts] = useState<ContractFirestoreDocument[]>([])

    useEffect(() => {
        const fetchData = async () => {
            if (!currentUserId) {
                setIsLoading(false)
                return
            }

            setIsLoading(true)
            setError(null)

            try {
                if (userRole === 1) {
                    // Propietario: fetch my drafts + client contracts
                    const [draftsData, contractsData] = await Promise.all([
                        getDraftsByUser(currentUserId),
                        getContractsByClient(currentUserId),
                    ])
                    setDrafts(draftsData)
                    setClientContracts(contractsData)
                } else if (userRole === 2) {
                    // Comerciante: fetch my quotations + provider contracts
                    const [quotationsRes, contractsData] = await Promise.all([
                        getQuotationsByComerciante(currentUserId),
                        getContractsByProvider(currentUserId),
                    ])
                    setQuotations(quotationsRes.data || [])
                    setProviderContracts(contractsData)
                }
            } catch (err) {
                console.error('Error fetching service history:', err)
                setError('Error al cargar el historial de servicios')
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [currentUserId, userRole])

    if (!currentUserId) {
        return (
            <Container fluid className="p-4">
                <Alert variant="warning">Debes iniciar sesión para ver tu historial.</Alert>
            </Container>
        )
    }

    if (isLoading) {
        return (
            <Container fluid className="p-4 text-center">
                <Spinner animation="border" />
                <p className="mt-2">Cargando historial...</p>
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

    return (
        <Container fluid className="p-0">
            <div className="p-4">
                <h1 className="type-hero-title">Historial de Servicios</h1>

                {userRole === 1 && (
                    /* ============ PROPIETARIO VIEW ============ */
                    <>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 3 }}>
                            <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
                                <Tab label={`Mis Requerimientos (${drafts.length})`} />
                                <Tab label={`Contratos (${clientContracts.length})`} />
                            </Tabs>
                        </Box>

                        {activeTab === 0 && (
                            <TableContainer component={Paper} sx={{ mt: 2 }}>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Categoría</TableCell>
                                            <TableCell>Descripción</TableCell>
                                            <TableCell>Fecha</TableCell>
                                            <TableCell>Estado</TableCell>
                                            <TableCell>Acciones</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {drafts.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={5} align="center">
                                                    <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                                                        No tienes requerimientos publicados.
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            drafts.map((draft) => (
                                                <TableRow key={draft.draftId} hover>
                                                    <TableCell>{draft.draftCategory}</TableCell>
                                                    <TableCell sx={{ maxWidth: 300 }}>
                                                        <Typography variant="body2" noWrap>
                                                            {draft.draftDescription}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>{draft.draftCreatedAt}</TableCell>
                                                    <TableCell>
                                                        <StatusChip status={draft.status || 'open'} />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button
                                                            size="small"
                                                            onClick={() => navigate(`/app/ver-requerimiento/${draft.draftId}`)}
                                                        >
                                                            Ver
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}

                        {activeTab === 1 && (
                            <ContractsTable contracts={clientContracts} roleLabel="Proveedor" roleField="providerId" />
                        )}
                    </>
                )}

                {userRole === 2 && (
                    /* ============ COMERCIANTE VIEW ============ */
                    <>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 3 }}>
                            <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
                                <Tab label={`Cotizaciones Enviadas (${quotations.length})`} />
                                <Tab label={`Trabajos Ganados (${providerContracts.length})`} />
                            </Tabs>
                        </Box>

                        {activeTab === 0 && (
                            <TableContainer component={Paper} sx={{ mt: 2 }}>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Requerimiento</TableCell>
                                            <TableCell>Monto</TableCell>
                                            <TableCell>Estado</TableCell>
                                            <TableCell>Descripción</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {quotations.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={4} align="center">
                                                    <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                                                        No has enviado cotizaciones.
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            quotations.map((q) => (
                                                <TableRow key={q.quotationId} hover>
                                                    <TableCell>{q.quotationDraftId}</TableCell>
                                                    <TableCell>
                                                        ${(q.quotationPrice || 0).toLocaleString('es-CO')}
                                                    </TableCell>
                                                    <TableCell>
                                                        <StatusChip status={q.quotationStatus || 'pending'} />
                                                    </TableCell>
                                                    <TableCell sx={{ maxWidth: 300 }}>
                                                        <Typography variant="body2" noWrap>
                                                            {q.quotationDescription}
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}

                        {activeTab === 1 && (
                            <ContractsTable contracts={providerContracts} roleLabel="Cliente" roleField="clientId" />
                        )}
                    </>
                )}
            </div>
        </Container>
    )
}

/**
 * Reusable Contracts Table — shows contracts with the counterpart's ID
 */
function ContractsTable({
    contracts,
    roleLabel,
    roleField,
}: {
    contracts: ContractFirestoreDocument[]
    roleLabel: string
    roleField: 'clientId' | 'providerId'
}) {
    return (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>{roleLabel}</TableCell>
                        <TableCell>Monto</TableCell>
                        <TableCell>Estado</TableCell>
                        <TableCell>Fecha</TableCell>
                        <TableCell>Acciones</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {contracts.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} align="center">
                                <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                                    No tienes contratos registrados.
                                </Typography>
                            </TableCell>
                        </TableRow>
                    ) : (
                        contracts.map((contract) => (
                            <TableRow key={contract.contractId} hover>
                                <TableCell>
                                    <Typography variant="body2" noWrap>
                                        {contract[roleField]}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    ${contract.agreedAmount.toLocaleString('es-CO')} COP
                                </TableCell>
                                <TableCell>
                                    <StatusChip status={contract.status} />
                                </TableCell>
                                <TableCell>{contract.createdAt}</TableCell>
                                <TableCell>
                                    {contract.status === 'completed' && !contract.rated && (
                                        <Button
                                            size="small"
                                            onClick={() => navigate(`/app/calificaciones?contractId=${contract.contractId}`)}
                                        >
                                            Calificar
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    )
}
