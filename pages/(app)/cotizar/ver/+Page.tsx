import { useState, useEffect, useRef, useCallback } from 'react'
import { usePageContext } from '@hooks/usePageContext'
import { getQuotation } from '@services/quotations'
import type { QuotationFirestoreDocument } from '@services/types'
import { Container, Row, Col } from 'react-bootstrap'
import {
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Typography,
    Button,
    CircularProgress,
} from '@mui/material'
import DownloadIcon from '@mui/icons-material/Download'
import QuotationPdfTemplate from '@features/quotes/components/QuotationPdfTemplate'
import type { QuotationPdfData } from '@features/quotes/components/QuotationPdfTemplate'

interface QuotationInfoState extends Partial<QuotationFirestoreDocument> {
    description?: string
    scope?: string
    procedimiento?: string
    tiempoEjecucion?: string
    actividades?: any[]
    condicionesNegocio?: string
    garantia?: string
    valorSubtotal?: number
    quotationDraftId?: string
    quotationPrice?: number
    quotationStatus?: 'pending' | 'accepted' | 'rejected'
}

export default function Page() {
    const pageContext = usePageContext()
    const { quotationId } = pageContext.routeParams as { quotationId: string }
    const [quotationInfo, setQuotationInfo] = useState<QuotationInfoState>({
        quotationId: '',
        quotationComercianteId: '',
        description: '',
        scope: '',
        procedimiento: '',
        tiempoEjecucion: '',
        actividades: [],
        condicionesNegocio: '',
        garantia: '',
        valorSubtotal: 0,
    })

    // PDF generation state
    const [isGenerating, setIsGenerating] = useState(false)
    const pdfRef = useRef<HTMLDivElement>(null)

    const fetchQuotationData = async () => {
        if (!quotationId || quotationId.trim() === '') return;
        try {
            const response = await getQuotation({ quotationId });
            if (response.success && response.data) {
                const {
                    quotationComercianteId,
                    quotationCreatedAt,
                    quotationDescription,
                    quotationDraftId,
                    quotationPrice,
                    quotationStatus,
                    ...rest
                } = response.data as any;
                setQuotationInfo({
                    ...quotationInfo,
                    quotationId: quotationId,
                    quotationComercianteId,
                    quotationCreatedAt,
                    description: quotationDescription || rest.description || '',
                    quotationDraftId,
                    quotationPrice,
                    quotationStatus,
                    scope: rest.scope || '',
                    procedimiento: rest.procedimiento || '',
                    tiempoEjecucion: rest.tiempoEjecucion || '',
                    actividades: rest.actividades || [],
                    condicionesNegocio: rest.condicionesNegocio || '',
                    garantia: rest.garantia || '',
                    valorSubtotal: rest.valorSubtotal || 0,
                    ...rest
                });
            } else {
                console.log('Quotation not found or error:', response.error);
            }
        } catch (error) {
            console.error('Error fetching quotation:', error);
        }
    };

    useEffect(() => {
        fetchQuotationData();
    }, [quotationId]);

    // ── PDF Download Handler ─────────────────────────────────────────────
    const handleDownloadPdf = useCallback(async () => {
        if (!pdfRef.current || isGenerating) return

        setIsGenerating(true)
        try {
            // Dynamically import html2pdf.js to keep it out of the main bundle
            const html2pdfModule = await import('html2pdf.js')
            const html2pdf = html2pdfModule.default || html2pdfModule

            const fileName = `Cotizacion_${quotationInfo.quotationId || 'sin-id'}.pdf`

            await html2pdf()
                .set({
                    margin: 0,
                    filename: fileName,
                    image: { type: 'jpeg', quality: 0.98 },
                    html2canvas: {
                        scale: 2,
                        useCORS: true,
                        letterRendering: true,
                    },
                    jsPDF: {
                        unit: 'mm',
                        format: 'a4',
                        orientation: 'portrait',
                    },
                    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
                } as any)
                .from(pdfRef.current)
                .save()
        } catch (error) {
            console.error('Error generating PDF:', error)
        } finally {
            setIsGenerating(false)
        }
    }, [quotationInfo, isGenerating])

    return (
        <Container
            fluid
            className="m-0 p-0 h-100 d-flex justify-content-center"
        >
            <Col className="col-8 pb-4 pt-4 align-items-start">
                <Row className="m-0 w-100 pb-2 d-flex" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h5" className="w-auto pb-4">
                        Consulta los detalles de la cotización
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={
                            isGenerating
                                ? <CircularProgress size={18} sx={{ color: '#fff' }} />
                                : <DownloadIcon />
                        }
                        disabled={isGenerating}
                        onClick={handleDownloadPdf}
                        sx={{
                            borderRadius: '50px',
                            backgroundColor: 'var(--background-main-green-color, #4caf50)',
                            textTransform: 'none',
                            fontWeight: 600,
                            px: 3,
                            '&:hover': {
                                backgroundColor: 'var(--primary-green-text-color, #388e3c)',
                            },
                            '&.Mui-disabled': {
                                backgroundColor: 'var(--background-main-green-color, #4caf50)',
                                opacity: 0.7,
                                color: '#fff',
                            },
                        }}
                    >
                        {isGenerating ? 'Generando...' : 'Descargar Cotización'}
                    </Button>
                </Row>
                <Typography variant="h6" className="p-description w-auto">
                    Descripción del servicio:
                </Typography>
                <Typography
                    variant="body1"
                    className="detail-pill p-description w-100 p-1 ps-3 pe-3"
                >
                    {quotationInfo.description}
                </Typography>
                <Typography
                    variant="h6"
                    className="p-description w-auto mt-3"
                >
                    Alcance del servicio:
                </Typography>
                <Typography
                    variant="body1"
                    className="detail-pill p-description w-100 p-1 ps-3 pe-3"
                >
                    {quotationInfo.scope}
                </Typography>
                <Typography
                    variant="h6"
                    className="p-description w-auto mt-3"
                >
                    Procedimiento a desarrollar:
                </Typography>
                <Typography
                    variant="body1"
                    className="detail-pill p-description w-100 p-1 ps-3 pe-3"
                >
                    {quotationInfo.procedimiento}
                </Typography>
                <Row className="m-0 w-100 p-0 pt-2 d-flex">
                    <Typography
                        variant="h6"
                        className="p-description pt-3 w-100"
                    >
                        Tabla de valores
                    </Typography>
                    <Table>
                        <TableHead>
                            <TableRow
                                className="w-100"
                                sx={{ display: 'table' }}
                            >
                                <TableCell></TableCell>
                                <TableCell>Ítem</TableCell>
                                <TableCell>Actividad</TableCell>
                                <TableCell>Unidad Medida</TableCell>
                                <TableCell>Cantidad</TableCell>
                                <TableCell>Precio unitario</TableCell>
                                <TableCell>Valor sin IVA</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {quotationInfo.actividades &&
                                quotationInfo.actividades.map(
                                    (actividad, index) => {
                                        const {
                                            item,
                                            actividadTitle,
                                            unidadMedida,
                                            cantidad,
                                            precio,
                                            valor,
                                        } = actividad
                                        return (
                                            <TableRow key={index}>
                                                <TableCell>
                                                    <Typography
                                                        variant="body1"
                                                    >
                                                        {item}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography
                                                        variant="body1"
                                                    >
                                                        {actividadTitle}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography
                                                        variant="body1"
                                                    >
                                                        {unidadMedida}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography
                                                        variant="body1"
                                                    >
                                                        {cantidad}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography
                                                        variant="body1"
                                                    >
                                                        {precio}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    {Number(valor).toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}
                                                </TableCell>
                                            </TableRow>
                                        )
                                    }
                                )}
                            <TableRow>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                                <TableCell>VALOR SUBTOTAL</TableCell>
                                <TableCell>
                                    {Number(quotationInfo.valorSubtotal).toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </Row>
                <Typography variant="h6" className="p-description w-auto">
                    Tiempo Ejecución:
                </Typography>
                <Typography
                    variant="body1"
                    className="detail-pill p-description w-100 p-1 ps-3 pe-3"
                >
                    {quotationInfo.tiempoEjecucion}
                </Typography>
                <Typography
                    variant="h6"
                    className="p-description w-auto mt-3"
                >
                    Condiciones de Negociación:
                </Typography>
                <Typography
                    variant="body1"
                    className="detail-pill p-description w-100 p-1 ps-3 pe-3"
                >
                    {quotationInfo.condicionesNegocio}
                </Typography>
                <Typography
                    variant="h6"
                    className="p-description w-auto mt-3"
                >
                    Garantía:
                </Typography>
                <Typography
                    variant="body1"
                    className="detail-pill p-description w-100 p-1 ps-3 pe-3"
                >
                    {quotationInfo.garantia}
                </Typography>
            </Col>

            {/* Hidden PDF template — positioned offscreen for html2pdf capture */}
            <div
                style={{
                    position: 'absolute',
                    left: '-9999px',
                    top: 0,
                    zIndex: -1,
                    overflow: 'hidden',
                }}
                aria-hidden="true"
            >
                <QuotationPdfTemplate ref={pdfRef} data={quotationInfo as QuotationPdfData} />
            </div>
        </Container>
    )
}
