/**
 * B2B Propiedad Horizontal (PH) Contract Service (T-I5.1 & T-I5.2)
 *
 * Implements legal framework and contract generation for multi-family residential
 * and commercial buildings under Colombian Ley 675 de 2001 (Régimen de Propiedad Horizontal).
 *
 * Features:
 * - Legal framework based on Arts. 50 & 51 (Facultades del Administrador)
 * - Mandatory disclaimer: «BORRADOR PARA REVISIÓN LEGAL»
 * - Exclusion of technical/structural construction liability for Comunidad Dezzpo
 * - Required guarantees: Póliza de Cumplimiento & Póliza de Responsabilidad Civil Extracontractual (RCE)
 * - Multi-part common area budget breakdown
 */

import { validateColombianNit } from '@utils/colombiaNit'

export interface PhCommonAreaPartida {
    readonly areaName: string // e.g. "Fachada Principal", "Cubierta / Terraza", "Cuarto de Bombas"
    readonly scopeDescription: string
    readonly estimatedBudgetCop: number
    readonly technicalNotes?: string
}

export interface PhContractParties {
    readonly copropiedadName: string
    readonly copropiedadNit: string
    readonly adminName: string
    readonly adminCedula: string
    readonly adminActaUrl?: string
    readonly providerRazonSocial: string
    readonly providerNitOrCedula: string
    readonly providerRepresentante: string
    readonly providerMatriculaProfesional?: string
}

export interface PhContractTerms {
    readonly agreedAmountCop: number
    readonly durationWeeks: number
    readonly requiresCouncilApproval: boolean
    readonly councilApprovalDate?: string
    readonly partidas: PhCommonAreaPartida[]
    readonly insuranceRequired: boolean
    readonly advancePaymentPercentage?: number // Default 0% under Escrow Lógico Modelo D
}

export interface GeneratedPhContract {
    readonly headerBadge: 'BORRADOR PARA REVISIÓN LEGAL'
    readonly legalFrameworkCitation: string
    readonly clauses: Array<{ readonly title: string; readonly content: string }>
    readonly summaryMarkdown: string
    readonly formattedNit: string
    readonly isNitValid: boolean
}

/**
 * Generates an official, legally structured B2B Marco Contract for Propiedad Horizontal
 * strictly adhering to Colombian Law 675 of 2001 and Law 527 of 1999.
 */
export function generatePhB2bContract(
    parties: PhContractParties,
    terms: PhContractTerms
): GeneratedPhContract {
    const nitValidation = validateColombianNit(parties.copropiedadNit)
    const formattedNit = nitValidation.formatted || parties.copropiedadNit

    const legalFrameworkCitation =
        'Ley 675 de 2001 (Régimen de Propiedad Horizontal), Ley 527 de 1999 (Comercio Electrónico y Mensajes de Datos), Decreto 2364 de 2012 y Código Civil Colombiano Art. 1602.'

    const clauses = [
        {
            title: 'CLÁUSULA PRIMERA: PARTES Y CAPACIDAD LEGAL',
            content: `El presente contrato se celebra entre la Copropiedad "${parties.copropiedadName}", identificada con NIT ${formattedNit}, representada legalmente por ${parties.adminName} (C.C. ${parties.adminCedula}), en su calidad de Administrador(a) y Representante Legal conforme a las facultades conferidas por los Artículos 50 y 51 de la Ley 675 de 2001; y de otra parte, el Contratista "${parties.providerRazonSocial}", identificado(a) con documento ${parties.providerNitOrCedula}, representado(a) por ${parties.providerRepresentante}${parties.providerMatriculaProfesional ? `, con Matrícula Profesional No. ${parties.providerMatriculaProfesional}` : ''}.`,
        },
        {
            title: 'CLÁUSULA SEGUNDA: OBJETO Y ZONAS COMUNES A INTERVENIR',
            content: `El Contratista se obliga para con la Copropiedad a ejecutar las obras de mantenimiento, adecuación y conservación en los bienes comunes especificados a continuación: ${terms.partidas
                .map((p, idx) => `\n  ${idx + 1}. [${p.areaName}]: ${p.scopeDescription} (Presupuesto acordado: $${p.estimatedBudgetCop.toLocaleString('es-CO')} COP).`)
                .join('')}`,
        },
        {
            title: 'CLÁUSULA TERCERA: VALOR, FORMA DE PAGO E HITOS DE OBRA (MODELO PROCEDIMENTAL DEZZPO)',
            content: `El valor total acordado para la ejecución de las obras es de $${terms.agreedAmountCop.toLocaleString('es-CO')} COP. Conforme al modelo de gestión de Comunidad Dezzpo (Modelo D de Escrow Lógico sin intermediación financiera directa), los pagos se realizarán directamente entre la Copropiedad y el Contratista contra Acta de Recibo Parcial a Satisfacción de cada hito de obra suscrita electrónicamente por el Administrador, con previa verificación de evidencias fotográficas en la bitácora de obra.`,
        },
        {
            title: 'CLÁUSULA CUARTA: APROBACIÓN DEL CONSEJO DE ADMINISTRACIÓN / ASAMBLEA',
            content: terms.requiresCouncilApproval
                ? `En cumplimiento del reglamento interno de la Copropiedad y el Art. 50 de la Ley 675 de 2001, la validez y desembolsos del presente contrato quedan sujetos a la aprobación del Consejo de Administración de la Copropiedad${terms.councilApprovalDate ? ` (registrada el ${terms.councilApprovalDate})` : ''}.`
                : 'El Administrador manifiesta que el monto y naturaleza de la presente obra se encuentra dentro de sus facultades estatutarias ordinarias de conservación de bienes comunes.',
        },
        {
            title: 'CLÁUSULA QUINTA: GARANTÍAS Y PÓLIZAS DE SEGURO',
            content: terms.insuranceRequired
                ? 'El Contratista constituirá a su costa, a favor de la Copropiedad, las siguientes garantías en compañía de seguros legalmente constituida en Colombia: (a) Póliza de Cumplimiento del Contrato equivalente al 20% del valor total; (b) Póliza de Responsabilidad Civil Extracontractual (RCE) que ampare daños a bienes comunes y privados de copropietarios por el 30% del valor contractual; (c) Póliza de Salarios y Prestaciones Sociales por el 10% del valor contractual.'
                : 'Las partes convienen sustituir las pólizas por retención procedimental de garantía del 10% del saldo final hasta la liquidación y firma del acta de recibo definitivo a satisfacción.',
        },
        {
            title: 'CLÁUSULA SEXTA: DESLINDE DE RESPONSABILIDAD DE COMUNIDAD DEZZPO',
            content:
                'Las partes reconocen y aceptan de manera expresa que Comunidad Dezzpo actúa exclusivamente como facilitador tecnológico y plataforma de intermediación digital y soporte procedimental de hitos y bitácora de obra. Comunidad Dezzpo NO es parte contractual, NO asume responsabilidad solidaria, técnica, constructiva, civil ni laboral por la ejecución de las obras, vicios ocultos, estabilidad estructural de las áreas comunes ni cumplimiento prestacional de los operarios vinculados por el Contratista.',
        },
        {
            title: 'CLÁUSULA SÉPTIMA: MENSAJES DE DATOS Y VALIDEZ PROBATORIA',
            content:
                'Conforme a la Ley 527 de 1999 y el Decreto 2364 de 2012, las aprobaciones, bitácora fotográfica de avances, registros de fecha/hora (timestamps) y firmas electrónicas registradas a través de la plataforma Comunidad Dezzpo gozan de plena validez jurídica, ejecutiva y probatoria entre las partes.',
        },
    ]

    const summaryMarkdown = `
# BORRADOR PARA REVISIÓN LEGAL
### CONTRATO MARCO B2B DE OBRA Y MANTENIMIENTO EN PROPIEDAD HORIZONTAL
**Marco Legal:** ${legalFrameworkCitation}

**Copropiedad Contratante:** ${parties.copropiedadName} (NIT ${formattedNit})  
**Administrador / Representante:** ${parties.adminName} (C.C. ${parties.adminCedula})  
**Contratista Ejecutor:** ${parties.providerRazonSocial} (${parties.providerNitOrCedula})  
**Valor Total:** $${terms.agreedAmountCop.toLocaleString('es-CO')} COP  
**Plazo Estimado:** ${terms.durationWeeks} semanas  
**Aprobación de Consejo:** ${terms.requiresCouncilApproval ? 'Requerida' : 'Facultad ordinaria'}  

---

${clauses.map((c) => `#### ${c.title}\n${c.content}\n`).join('\n')}

---
*Documento generado electrónicamente en la plataforma Comunidad Dezzpo para revisión del Consejo de Administración y firma bilateral.*
`.trim()

    return {
        headerBadge: 'BORRADOR PARA REVISIÓN LEGAL',
        legalFrameworkCitation,
        clauses,
        summaryMarkdown,
        formattedNit,
        isNitValid: nitValidation.isValid,
    }
}
