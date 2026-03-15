/**
 * QuotationPdfTemplate
 *
 * Hidden, print-optimized DOM subtree for html2pdf.js capture.
 * Renders a clean A4 quotation document with platform logo,
 * provider/client info, itemized cost breakdown, and all sections.
 *
 * Uses inline styles for PDF fidelity (no external CSS in captured DOM).
 */

import React, { forwardRef } from 'react'
// @ts-ignore
import LogoPNG from '@assets/img/LogoPNG.png'

interface Actividad {
    item?: string | number
    actividadTitle?: string
    unidadMedida?: string
    cantidad?: number
    precio?: number
    valor?: number
}

export interface QuotationPdfData {
    quotationId?: string
    quotationComercianteId?: string
    quotationCreatedAt?: string
    quotationDraftId?: string
    quotationPrice?: number
    quotationStatus?: string
    description?: string
    scope?: string
    procedimiento?: string
    tiempoEjecucion?: string
    actividades?: Actividad[]
    condicionesNegocio?: string
    garantia?: string
    valorSubtotal?: number
}

// ── Inline style objects ─────────────────────────────────────────────────────

const PAGE: React.CSSProperties = {
    width: '210mm',
    minHeight: '297mm',
    padding: '20mm 18mm',
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    fontSize: '11px',
    lineHeight: '1.5',
    color: '#111',
    background: '#fff',
}

const HEADER: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '3px solid #4caf50',
    paddingBottom: '12px',
    marginBottom: '20px',
}

const LOGO: React.CSSProperties = {
    height: '48px',
    objectFit: 'contain',
}

const TITLE: React.CSSProperties = {
    fontSize: '22px',
    fontWeight: 700,
    color: '#2e7d32',
    margin: 0,
}

const META_GRID: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '6px 24px',
    marginBottom: '20px',
    fontSize: '10.5px',
}

const META_LABEL: React.CSSProperties = {
    fontWeight: 600,
    color: '#555',
}

const SECTION_TITLE: React.CSSProperties = {
    fontSize: '13px',
    fontWeight: 700,
    color: '#2e7d32',
    margin: '16px 0 4px',
    borderBottom: '1px solid #e0e0e0',
    paddingBottom: '2px',
}

const SECTION_BODY: React.CSSProperties = {
    fontSize: '11px',
    color: '#333',
    margin: '0 0 8px',
    whiteSpace: 'pre-wrap',
}

const TABLE: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '6px',
    marginBottom: '16px',
    fontSize: '10.5px',
}

const TH: React.CSSProperties = {
    background: '#e8f5e9',
    border: '1px solid #c8e6c9',
    padding: '6px 8px',
    fontWeight: 700,
    textAlign: 'left',
    fontSize: '10px',
}

const TD: React.CSSProperties = {
    border: '1px solid #e0e0e0',
    padding: '5px 8px',
}

const TD_RIGHT: React.CSSProperties = {
    ...TD,
    textAlign: 'right',
}

const SUBTOTAL_ROW: React.CSSProperties = {
    background: '#f1f8e9',
    fontWeight: 700,
}

const FOOTER: React.CSSProperties = {
    marginTop: '32px',
    paddingTop: '10px',
    borderTop: '1px solid #e0e0e0',
    fontSize: '9px',
    color: '#999',
    textAlign: 'center',
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatCOP(value?: number): string {
    if (value == null) return '$0'
    return Number(value).toLocaleString('es-CO', { style: 'currency', currency: 'COP' })
}

function formatDate(dateStr?: string): string {
    if (!dateStr) return '—'
    try {
        return new Date(dateStr).toLocaleDateString('es-CO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
    } catch {
        return dateStr
    }
}

function statusLabel(status?: string): string {
    switch (status) {
        case 'accepted': return 'Aceptada'
        case 'rejected': return 'Rechazada'
        case 'pending': return 'Pendiente'
        default: return status || '—'
    }
}

// ── Component ────────────────────────────────────────────────────────────────

const QuotationPdfTemplate = forwardRef<HTMLDivElement, { data: QuotationPdfData }>(
    ({ data }, ref) => (
        <div ref={ref} style={PAGE}>
            {/* Header */}
            <div style={HEADER}>
                <img src={LogoPNG} alt="Comunidad Dezzpo" style={LOGO} />
                <div style={{ textAlign: 'right' }}>
                    <h1 style={TITLE}>Cotización</h1>
                    <span style={{ fontSize: '10px', color: '#777' }}>
                        {formatDate(data.quotationCreatedAt)}
                    </span>
                </div>
            </div>

            {/* Meta info */}
            <div style={META_GRID}>
                <span><span style={META_LABEL}>N.º Cotización:</span> {data.quotationId || '—'}</span>
                <span><span style={META_LABEL}>Estado:</span> {statusLabel(data.quotationStatus)}</span>
                <span><span style={META_LABEL}>Proveedor ID:</span> {data.quotationComercianteId || '—'}</span>
                <span><span style={META_LABEL}>Requerimiento:</span> {data.quotationDraftId || '—'}</span>
            </div>

            {/* Sections */}
            {data.description && (
                <>
                    <p style={SECTION_TITLE}>Descripción del Servicio</p>
                    <p style={SECTION_BODY}>{data.description}</p>
                </>
            )}

            {data.scope && (
                <>
                    <p style={SECTION_TITLE}>Alcance del Servicio</p>
                    <p style={SECTION_BODY}>{data.scope}</p>
                </>
            )}

            {data.procedimiento && (
                <>
                    <p style={SECTION_TITLE}>Procedimiento a Desarrollar</p>
                    <p style={SECTION_BODY}>{data.procedimiento}</p>
                </>
            )}

            {/* Itemized cost table */}
            {data.actividades && data.actividades.length > 0 && (
                <>
                    <p style={SECTION_TITLE}>Tabla de Valores</p>
                    <table style={TABLE}>
                        <thead>
                            <tr>
                                <th style={TH}>Ítem</th>
                                <th style={TH}>Actividad</th>
                                <th style={TH}>Unidad Medida</th>
                                <th style={TH}>Cantidad</th>
                                <th style={TH}>Precio Unitario</th>
                                <th style={TH}>Valor sin IVA</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.actividades.map((act, i) => (
                                <tr key={i}>
                                    <td style={TD}>{act.item}</td>
                                    <td style={TD}>{act.actividadTitle}</td>
                                    <td style={TD}>{act.unidadMedida}</td>
                                    <td style={TD_RIGHT}>{act.cantidad}</td>
                                    <td style={TD_RIGHT}>{formatCOP(act.precio)}</td>
                                    <td style={TD_RIGHT}>{formatCOP(act.valor)}</td>
                                </tr>
                            ))}
                            <tr style={SUBTOTAL_ROW}>
                                <td style={TD} colSpan={4}></td>
                                <td style={{ ...TD, fontWeight: 700 }}>VALOR SUBTOTAL</td>
                                <td style={TD_RIGHT}>{formatCOP(data.valorSubtotal)}</td>
                            </tr>
                        </tbody>
                    </table>
                </>
            )}

            {data.tiempoEjecucion && (
                <>
                    <p style={SECTION_TITLE}>Tiempo de Ejecución</p>
                    <p style={SECTION_BODY}>{data.tiempoEjecucion}</p>
                </>
            )}

            {data.condicionesNegocio && (
                <>
                    <p style={SECTION_TITLE}>Condiciones de Negociación</p>
                    <p style={SECTION_BODY}>{data.condicionesNegocio}</p>
                </>
            )}

            {data.garantia && (
                <>
                    <p style={SECTION_TITLE}>Garantía</p>
                    <p style={SECTION_BODY}>{data.garantia}</p>
                </>
            )}

            {/* Footer */}
            <div style={FOOTER}>
                Documento generado por Comunidad Dezzpo · {formatDate(new Date().toISOString())}
            </div>
        </div>
    )
)

QuotationPdfTemplate.displayName = 'QuotationPdfTemplate'

export default QuotationPdfTemplate
