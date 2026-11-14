/**
 * Biblioteca (Library & Moodboards) Page
 *
 * Provides:
 * 1. Mis Tableros de Inspiración y Moodboards (I4.1 & R7-T4)
 * 2. Formatos y Documentos de Descarga
 */

import React, { useState, useEffect, useCallback } from 'react'
import { Row, Col, Container } from 'react-bootstrap'
import {
    Typography,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Box,
    Tabs,
    Tab,
    Button,
    Card,
    CardContent,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Alert,
    CircularProgress,
    IconButton,
    Chip,
} from '@mui/material'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import CloseIcon from '@mui/icons-material/Close'
import { useUserStore } from '@stores/userStore'
import {
    getBoardsByOwner,
    createInspirationBoard,
    addItemToBoard,
    type InspirationBoard,
} from '@services/inspiration'
import { processImageFile } from '@utils/mediaPipeline'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from '@services/firebase'

const documentosA = [
    { title: 'Contrato De Adquisición De Servicios' },
    { title: 'Formato De Requerimientos Del Cliente' },
    { title: 'Formato De Cotización De Servicios' },
]

const documentosB = [
    { title: 'Patologías Y Sistemas De Mantenimiento En Los Inmuebles' },
    { title: 'Manual De Procedimientos De Mantenimiento Correctivo Y Preventivo' },
    { title: 'Reglamentaciones Del Sistema De Salud Y Seguridad En El Trabajo' },
]

export default function Page() {
    const currentUserId = useUserStore((state) => state.userId)
    const [currentTab, setCurrentTab] = useState(0)

    // Moodboards state
    const [boards, setBoards] = useState<InspirationBoard[]>([])
    const [isLoadingBoards, setIsLoadingBoards] = useState(false)
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [newBoardTitle, setNewBoardTitle] = useState('')
    const [newBoardDescription, setNewBoardDescription] = useState('')
    const [isCreatingBoard, setIsCreatingBoard] = useState(false)
    const [boardError, setBoardError] = useState<string | null>(null)

    // Add item modal
    const [selectedBoardId, setSelectedBoardId] = useState<string | null>(null)
    const [itemTitle, setItemTitle] = useState('')
    const [itemNotes, setItemNotes] = useState('')
    const [itemFile, setItemFile] = useState<File | null>(null)
    const [isAddingItem, setIsAddingItem] = useState(false)

    const fetchBoards = useCallback(async () => {
        if (!currentUserId) return
        setIsLoadingBoards(true)
        try {
            const res = await getBoardsByOwner(currentUserId)
            if (res.success && res.data) {
                setBoards(res.data)
            }
        } catch (err) {
            console.warn('[Biblioteca] Error fetching boards:', err)
        } finally {
            setIsLoadingBoards(false)
        }
    }, [currentUserId])

    useEffect(() => {
        fetchBoards()
    }, [fetchBoards])

    const handleCreateBoard = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!currentUserId || !newBoardTitle.trim()) return

        setIsCreatingBoard(true)
        setBoardError(null)

        try {
            const res = await createInspirationBoard({
                ownerId: currentUserId,
                title: newBoardTitle.trim(),
                description: newBoardDescription.trim(),
            })

            if (res.success && res.data) {
                setBoards((prev) => [res.data!, ...prev])
                setIsCreateModalOpen(false)
                setNewBoardTitle('')
                setNewBoardDescription('')
            } else {
                setBoardError(res.error?.message || 'Error al crear tablero.')
            }
        } catch (err) {
            setBoardError('Error inesperado al crear el tablero.')
        } finally {
            setIsCreatingBoard(false)
        }
    }

    const handleAddItem = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedBoardId || !currentUserId) return

        setIsAddingItem(true)
        setBoardError(null)

        try {
            let photoUrl = ''
            if (itemFile && storage) {
                const processed = await processImageFile(itemFile)
                const storageRef = ref(storage, `inspiration/${currentUserId}/${Date.now()}.webp`)
                await uploadBytes(storageRef, processed.blob, { contentType: 'image/webp' })
                photoUrl = await getDownloadURL(storageRef)
            }

            const itemPayload: Parameters<typeof addItemToBoard>[1] = {
                type: photoUrl ? 'project_image' : 'color_palette',
                url: photoUrl,
                ...(itemTitle.trim() ? { title: itemTitle.trim() } : {}),
                ...(itemNotes.trim() ? { notes: itemNotes.trim() } : {}),
            }

            const res = await addItemToBoard(selectedBoardId, itemPayload)

            if (res.success && res.data) {
                setBoards((prev) =>
                    prev.map((b) => (b.boardId === selectedBoardId ? res.data! : b))
                )
                setSelectedBoardId(null)
                setItemTitle('')
                setItemNotes('')
                setItemFile(null)
            } else {
                setBoardError(res.error?.message || 'Error al agregar elemento.')
            }
        } catch (err) {
            setBoardError('Error al subir imagen o procesar el elemento.')
        } finally {
            setIsAddingItem(false)
        }
    }

    return (
        <Container fluid className="p-0 h-100">
            <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 4, pt: 3 }}>
                <Tabs value={currentTab} onChange={(_, val) => setCurrentTab(val)} textColor="primary" indicatorColor="primary">
                    <Tab
                        icon={<CollectionsBookmarkIcon fontSize="small" />}
                        iconPosition="start"
                        label="Mis Tableros de Inspiración (Moodboards)"
                        sx={{ textTransform: 'none', fontWeight: 600 }}
                    />
                    <Tab
                        icon={<FileDownloadIcon fontSize="small" />}
                        iconPosition="start"
                        label="Documentos y Formatos Legales"
                        sx={{ textTransform: 'none', fontWeight: 600 }}
                    />
                </Tabs>
            </Box>

            {/* TAB 0: Moodboards (I4.1) */}
            {currentTab === 0 && (
                <Box sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                        <Box>
                            <Typography variant="h5" fontWeight="bold">
                                Tableros de Inspiración y Moodboards
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Guarda ideas, referencias de diseño y acabados para adjuntarlos a tus cotizaciones con profesionales.
                            </Typography>
                        </Box>
                        <Button
                            variant="contained"
                            startIcon={<AutoAwesomeIcon />}
                            onClick={() => setIsCreateModalOpen(true)}
                            sx={{
                                bgcolor: '#0d9488',
                                '&:hover': { bgcolor: '#0f766e' },
                                textTransform: 'none',
                                fontWeight: 'bold',
                                borderRadius: 2,
                            }}
                        >
                            Crear Nuevo Tablero
                        </Button>
                    </Box>

                    {isLoadingBoards ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                            <CircularProgress size={32} />
                        </Box>
                    ) : boards.length === 0 ? (
                        <Card sx={{ p: 5, textAlign: 'center', bgcolor: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: 3 }}>
                            <CollectionsBookmarkIcon sx={{ fontSize: 48, color: '#94a3b8', mb: 1.5 }} />
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Aún no has creado ningún tablero
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 450, mx: 'auto', mb: 3 }}>
                                Organiza tus ideas de remodelación por ambiente (Cocina, Baño, Fachada) para que los maestros entiendan exactamente lo que deseas.
                            </Typography>
                            <Button
                                variant="outlined"
                                onClick={() => setIsCreateModalOpen(true)}
                                sx={{ textTransform: 'none', borderRadius: 2 }}
                            >
                                Crear mi Primer Tablero
                            </Button>
                        </Card>
                    ) : (
                        <Row className="g-4">
                            {boards.map((board) => (
                                <Col key={board.boardId} lg={4} md={6} xs={12}>
                                    <Card
                                        elevation={0}
                                        sx={{
                                            border: '1px solid #e2e8f0',
                                            borderRadius: 3,
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            overflow: 'hidden',
                                            transition: 'box-shadow 0.2s',
                                            '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.06)' },
                                        }}
                                    >
                                        {/* Board preview thumbnails */}
                                        <Box sx={{ height: 140, bgcolor: '#0f172a', display: 'flex', gap: 0.5, p: 0.5 }}>
                                            {board.items && board.items.length > 0 ? (
                                                board.items.slice(0, 3).map((item, idx) => (
                                                    <Box
                                                        key={item.id}
                                                        component="img"
                                                        src={item.url || 'https://via.placeholder.com/150'}
                                                        alt={item.title || `Foto ${idx + 1}`}
                                                        sx={{ width: `${100 / Math.min(board.items.length, 3)}%`, height: '100%', objectFit: 'cover', borderRadius: 1 }}
                                                    />
                                                ))
                                            ) : (
                                                <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <Typography variant="caption" sx={{ color: '#64748b' }}>
                                                        Sin elementos guardados
                                                    </Typography>
                                                </Box>
                                            )}
                                        </Box>

                                        <CardContent sx={{ p: 2.5, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                            <Box>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                                    <Typography variant="subtitle1" fontWeight="bold">
                                                        {board.title}
                                                    </Typography>
                                                    <Chip
                                                        label={`${board.items?.length || 0} ideas`}
                                                        size="small"
                                                        sx={{ fontSize: '0.7rem', fontWeight: 600 }}
                                                    />
                                                </Box>
                                                {board.description && (
                                                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem', mb: 2 }}>
                                                        {board.description}
                                                    </Typography>
                                                )}
                                            </Box>

                                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, pt: 1 }}>
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    startIcon={<AddPhotoAlternateIcon />}
                                                    onClick={() => setSelectedBoardId(board.boardId)}
                                                    sx={{ textTransform: 'none', borderRadius: 2, fontSize: '0.78rem' }}
                                                >
                                                    Agregar Idea
                                                </Button>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    )}
                </Box>
            )}

            {/* TAB 1: Documentos y Descargas (Legacy Formatos) */}
            {currentTab === 1 && (
                <Row className="m-0 w-100 p-4">
                    <Col className="col-12 col-md-10 d-flex flex-column align-items-start">
                        <Typography className="type-section-title">Descargar documentos</Typography>
                        <p className="type-body">
                            Encuentra aquí plantillas para redactar tus documentos, material de consulta, enlaces útiles y más.
                        </p>
                        <p className="type-body">
                            Al ejecutar un nuevo proyecto siempre edite e imprima primero los documentos anexos, como lo son cotizaciones y contratos.
                        </p>

                        <Table className="my-3">
                            <TableHead>
                                <TableRow>
                                    <TableCell className="headline-s">Título</TableCell>
                                    <TableCell className="headline-s">Formato</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {documentosA.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="type-body">{item.title}</TableCell>
                                        <TableCell className="type-body">PDF</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        <Typography className="type-section-title mt-4">Material de consulta técnica</Typography>
                        <Table className="my-3">
                            <TableHead>
                                <TableRow>
                                    <TableCell className="headline-s">Título</TableCell>
                                    <TableCell className="headline-s">Formato</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {documentosB.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="type-body">{item.title}</TableCell>
                                        <TableCell className="type-body">PDF</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        <Box sx={{ mt: 3 }}>
                            <Typography className="type-section-title">Directorio de Ferreterías</Typography>
                            <a href="/app/tiendas" className="btn btn-round btn-high mt-2" style={{ textDecoration: 'none', display: 'inline-block' }}>
                                Ir a Tiendas y Ferreterías
                            </a>
                        </Box>
                    </Col>
                </Row>
            )}

            {/* Create Board Modal */}
            <Dialog open={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                        Nuevo Tablero de Inspiración
                    </Typography>
                    <IconButton size="small" onClick={() => setIsCreateModalOpen(false)} aria-label="Cerrar modal">
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <form onSubmit={handleCreateBoard}>
                    <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {boardError && <Alert severity="error">{boardError}</Alert>}
                        <TextField
                            label="Nombre del Tablero"
                            placeholder="Ej. Remodelación Cocina o Baño de Visitas"
                            value={newBoardTitle}
                            onChange={(e) => setNewBoardTitle(e.target.value)}
                            fullWidth
                            required
                            size="small"
                        />
                        <TextField
                            label="Descripción o Enfoque de Estilo"
                            placeholder="Ej. Colores neutros, grifería negra mate, iluminación cálida..."
                            value={newBoardDescription}
                            onChange={(e) => setNewBoardDescription(e.target.value)}
                            multiline
                            rows={3}
                            fullWidth
                            size="small"
                        />
                    </DialogContent>
                    <DialogActions sx={{ p: 2 }}>
                        <Button onClick={() => setIsCreateModalOpen(false)} disabled={isCreatingBoard} sx={{ textTransform: 'none' }}>
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={isCreatingBoard || !newBoardTitle.trim()}
                            sx={{ textTransform: 'none', fontWeight: 'bold' }}
                        >
                            {isCreatingBoard ? 'Creando...' : 'Crear Tablero'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            {/* Add Item to Board Modal */}
            <Dialog open={Boolean(selectedBoardId)} onClose={() => setSelectedBoardId(null)} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                        Agregar Referencia al Tablero
                    </Typography>
                    <IconButton size="small" onClick={() => setSelectedBoardId(null)} aria-label="Cerrar modal">
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <form onSubmit={handleAddItem}>
                    <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {boardError && <Alert severity="error">{boardError}</Alert>}
                        <TextField
                            label="Título o Concepto"
                            placeholder="Ej. Porcelanato tipo madera o Mueble flotante"
                            value={itemTitle}
                            onChange={(e) => setItemTitle(e.target.value)}
                            fullWidth
                            size="small"
                        />
                        <TextField
                            label="Notas o Especificación"
                            placeholder="Ej. Preferir formato 60x120 rectificado anti-deslizante..."
                            value={itemNotes}
                            onChange={(e) => setItemNotes(e.target.value)}
                            multiline
                            rows={2}
                            fullWidth
                            size="small"
                        />
                        <Button
                            variant="outlined"
                            component="label"
                            size="small"
                            startIcon={<AddPhotoAlternateIcon />}
                            sx={{ textTransform: 'none' }}
                        >
                            {itemFile ? itemFile.name : 'Subir Foto de Referencia'}
                            <input
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={(e) => setItemFile(e.target.files?.[0] || null)}
                            />
                        </Button>
                        <Typography variant="caption" color="text.secondary">
                            Las imágenes se procesan automáticamente en formato WebP para uso privado de cotización (Decisión Andina 351).
                        </Typography>
                    </DialogContent>
                    <DialogActions sx={{ p: 2 }}>
                        <Button onClick={() => setSelectedBoardId(null)} disabled={isAddingItem} sx={{ textTransform: 'none' }}>
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={isAddingItem || (!itemTitle.trim() && !itemFile && !itemNotes.trim())}
                            sx={{ textTransform: 'none', fontWeight: 'bold' }}
                        >
                            {isAddingItem ? 'Guardando...' : 'Guardar en Tablero'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Container>
    )
}
