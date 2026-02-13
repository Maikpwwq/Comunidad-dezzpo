/**
 * Apéndice Costos Page
 *
 * Converted to TypeScript.
 * Displays cost reference table for common services.
 */
import { useState, useEffect } from 'react'
// Styles
// Components and Data
import { Link } from '@hooks'
import {
    TableCards,
    type CategoriaItem,
} from '@features/marketing'
import { CategoriasService } from '@/services'
// Bootstrap
import { Row, Col, Container, Spinner } from 'react-bootstrap'
// MUI
import {
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Box
} from '@mui/material'
// FAQ Links
const faqLinks = [
    { text: '¿Cuánto cuesta instalar nuevas tomacorrientes?', href: '#' },
    { text: '¿Cuánto cuesta instalar una ducha eléctrica?', href: '#' },
    { text: '¿Cuánto cuesta diagnosticar un fallo eléctrico?', href: '#' },
    { text: '¿Cuánto cuesta remodelar una habitación?', href: '#' },
    { text: '¿Cuánto cuesta instalar nuevas iluminaciones y lámparas?', href: '#' },
]
export default function Page() {
    const [categoriaInfo, setCategoriaInfo] = useState<CategoriaItem[]>([])
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await CategoriasService.getAllCostos()
                setCategoriaInfo(data)
            } catch (error) {
                console.error('Failed to load costos data', error)
            } finally {
                setIsLoading(false)
            }
        }
        loadData()
    }, [])
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
                <Row className="apendiceCostosTitulo m-0 w-100 d-flex justify-content-end">
                    <Col lg={4} md={6} sm={10} xs={12}>
                        <h1 className="titulo type-hero-title">
                            Costeo de Servicios
                            <br />
                            Comunes
                        </h1>
                    </Col>
                </Row>
            </Container>
            <Container fluid className="p-0">
                <Row className="m-0 w-100 d-flex ps-4 pe-4">
                    {isLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5, width: '100%' }}>
                            <Spinner animation="border" role="status" variant="primary">
                                <span className="visually-hidden">Cargando...</span>
                            </Spinner>
                        </Box>
                    ) : (
                        <>
                            {/* Mobile View */}
                            <div className="d-block d-md-none w-100">
                                <TableCards dataTable={categoriaInfo} />
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
                                        {categoriaInfo.map((categoria, index) => {
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
                                        })}
                                    </TableBody>
                                </Table>
                            </div>
                        </>
                    )}
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
