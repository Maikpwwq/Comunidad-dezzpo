/**
 * Apéndice Costos Page
 *
 * Converted to TypeScript.
 * Displays cost reference table for common services.
 */
import { useState, useEffect, useRef, useCallback } from 'react'
// Styles
// Components and Data
import { Link } from '@hooks'
import {
    TableCards,
    type CategoriaItem,
} from '@features/marketing'
import { CategoriasService } from '@/services'
// Bootstrap
import { Row, Col, Container } from 'react-bootstrap'
// MUI
import {
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Box,
    Skeleton,
    TextField,
    InputAdornment
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'

// FAQ Links
const faqLinks = [
    { text: '¿Cuánto cuesta instalar nuevas tomacorrientes?', href: '#' },
    { text: '¿Cuánto cuesta instalar una ducha eléctrica?', href: '#' },
    { text: '¿Cuánto cuesta diagnosticar un fallo eléctrico?', href: '#' },
    { text: '¿Cuánto cuesta remodelar una habitación?', href: '#' },
    { text: '¿Cuánto cuesta instalar nuevas iluminaciones y lámparas?', href: '#' },
]

export default function Page() {
    const [categories, setCategories] = useState<CategoriaItem[]>([])
    const [nextIndex, setNextIndex] = useState<number | null>(0)
    const [hasMore, setHasMore] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')

    // Debounce search query
    const [debouncedQuery, setDebouncedQuery] = useState(searchQuery)
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedQuery(searchQuery), 500)
        return () => clearTimeout(timer)
    }, [searchQuery])

    const observer = useRef<IntersectionObserver | null>(null)

    const lastElementRef = useCallback((node: HTMLDivElement | null) => {
        if (isLoading) return
        if (observer.current) observer.current.disconnect()
        observer.current = new IntersectionObserver(entries => {
            if (entries[0]?.isIntersecting && hasMore) {
                // If the user searches, we rely on the useEffect below to trigger fetch
                // But for infinite scroll, we call loadMore directly
                loadMore(false)
            }
        })
        if (node) observer.current.observe(node)
    }, [isLoading, hasMore])

    // Reset list when debounced query changes
    useEffect(() => {
        setCategories([])
        setNextIndex(0)
        setHasMore(true)
        // Trigger initial load for new query
        loadMore(true)
    }, [debouncedQuery])

    const loadMore = async (isReset = false) => {
        // Prevent loading if already loading OR no more data (unless it's a reset/new search)
        if (isLoading || (!hasMore && !isReset)) return

        // If resetting, use index 0. If not, use nextIndex. But if nextIndex is null and not resetting, return.
        const indexToFetch = isReset ? 0 : nextIndex
        if (indexToFetch === null && !isReset) return

        setIsLoading(true)
        try {
            // Fetch batch
            const result = await CategoriasService.getCostosBatch(indexToFetch || 0, 5, debouncedQuery)

            setCategories(prev => isReset ? result.data : [...prev, ...result.data])
            setNextIndex(result.nextIndex)
            setHasMore(result.hasMore)
        } catch (error) {
            console.error('Failed to load costs batch', error)
        } finally {
            setIsLoading(false)
        }
    }

    const formatCurrency = (value: number) => {
        return parseInt(String(value)).toLocaleString('es-CO', {
            style: 'currency',
            currency: 'COP',
            maximumFractionDigits: 0
        })
    }

    return (
        <div className="cost-appendix-page">
            <Container fluid className="p-0">
                <Row className="apendiceCostosTitulo m-0 w-100 d-flex justify-content-end align-items-center">
                    <Col lg={4} md={6} sm={10} xs={12}>
                        <h1 className="titulo type-hero-title mb-3">
                            Costeo de Servicios
                            <br />
                            Comunes
                        </h1>
                        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                placeholder="Buscar por categoría o rol..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon color="action" />
                                        </InputAdornment>
                                    ),
                                    sx: {
                                        borderRadius: '50px',
                                        backgroundColor: 'white',
                                        '& fieldset': { borderColor: 'rgba(0, 0, 0, 0.1)' },
                                    }
                                }}
                            />
                        </Box>
                    </Col>
                </Row>
            </Container>
            <Container fluid className="p-0">
                <Row className="m-0 w-100 d-flex ps-4 pe-4">
                    {/* Mobile View */}
                    <div className="d-block d-md-none w-100">
                        <TableCards dataTable={categories} />
                    </div>
                    {/* Desktop View */}
                    <div className="d-none d-md-block w-100">
                        <Table
                            sx={{
                                minWidth: 650,
                                '& .MuiTableCell-root': {
                                    borderColor: 'rgba(0,0,0,0.1)'
                                }
                            }}
                        >
                            <TableHead>
                                <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Subcategoría</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Unidad Medida</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Descripción</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Precio bajo</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Precio alto</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {categories.length > 0 ? (
                                    categories.map((categoria, index) => {
                                        // Header Row (SubSistema)
                                        if (categoria.subSistema) {
                                            return (
                                                <TableRow key={`${categoria.subSistema}-${index}`} sx={{ backgroundColor: '#e9ecef' }}>
                                                    <TableCell colSpan={5} sx={{ fontWeight: 'bold', fontSize: '1.1rem', py: 2 }}>
                                                        {categoria.subSistema}
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        }

                                        // Data Row
                                        if (categoria.subCategoria) {
                                            const precioBajo = (categoria.subCategoriaPrecio || 0) * 1.05
                                            const precioAlto = (categoria.subCategoriaPrecio || 0) * 1.65

                                            return (
                                                <TableRow key={`${categoria.subCategoria}-${index}`} hover>
                                                    <TableCell>{categoria.subCategoria}</TableCell>
                                                    <TableCell>{categoria.subCategoriaCantidad}</TableCell>
                                                    <TableCell>{categoria.subCategoriaDescription}</TableCell>
                                                    <TableCell>{formatCurrency(precioBajo)}</TableCell>
                                                    <TableCell>{formatCurrency(precioAlto)}</TableCell>
                                                </TableRow>
                                            )
                                        }
                                        return null
                                    })
                                ) : (
                                    !isLoading && (
                                        <TableRow>
                                            <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                                                No se encontraron resultados.
                                            </TableCell>
                                        </TableRow>
                                    )
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Loader / Sentinel */}
                    <div ref={lastElementRef} className="w-100 py-3">
                        {isLoading && (
                            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Skeleton height={40} variant="rectangular" />
                                <Skeleton height={40} animation="wave" margin-top={2} />
                                <Skeleton height={40} animation={false} />
                            </Box>
                        )}
                    </div>
                </Row>
            </Container>
            <Container fluid className="p-0">
                <Row className="apendiceCostosPreguntas m-0 w-100">
                    <Col>
                        <ul>
                            {faqLinks.map((item, idx) => (
                                <li key={idx} className="mb-2">
                                    <Link href={item.href} className="body-2 text-decoration-none">
                                        {item.text}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}
