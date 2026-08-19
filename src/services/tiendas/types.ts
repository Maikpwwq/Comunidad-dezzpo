/**
 * Tiendas & Suppliers Types
 */

export interface SedeLocation {
    id: string
    nombreSede: string            // e.g. "Sede Chapinero" or "Sucursal Principal"
    direccion: string             // Required address
    departamento?: string | undefined // e.g. "Cundinamarca", "Meta", "Huila", "Bogotá D.C."
    ciudad: string                // Default: "Bogotá, Colombia"
    codigoPostal?: string | undefined
    zona: string                  // Zone slug from ListadoZonas (e.g. "chapinero", "suba")
    hasCustomPhones?: boolean | undefined // False = inherits top-level telefonoPrincipal & whatsappPrincipal
    telefonos?: string[] | undefined // Branch-specific phones (optional if hasCustomPhones is false)
    whatsapp?: string | undefined    // Branch-specific WhatsApp number
    horario?: string | undefined     // e.g. "Lun-Vie 8:00 - 17:00, Sáb 8:00 - 13:00"
    lat?: number | undefined         // Map pin latitude
    lng?: number | undefined         // Map pin longitude
    detallesUbicacion?: string | undefined // Physical location hints (landmarks, "al lado de...")
    nombreContacto?: string | undefined    // On-site contact person name
    cargoContacto?: string | undefined     // On-site contact person role/title
}

export interface TiendaDocument {
    id: string
    nombre: string                // Required business name
    razonSocial?: string | undefined // Legal business name (optional)
    nit?: string | undefined         // Tax ID (optional)
    slug: string                  // URL-friendly slug
    categorias: string[]          // Array of category keys/labels from ListadoCategoriasTiendas (Min 1)
    descripcion?: string | undefined // Short slogan or description
    email?: string | undefined       // Primary email or summary
    emails?: string[] | undefined    // Array of registered contact emails (Min 1)
    sitioWeb?: string | undefined
    telefonoPrincipal?: string | undefined // Top-level summary contact phone
    whatsappPrincipal?: string | undefined // Top-level summary WhatsApp
    logoUrl?: string | undefined     // Cloud Storage URL
    sedes: SedeLocation[]         // Array of branches (Min 1 required)
    
    // Status & Provenance
    estado: 'pendiente' | 'aprobado' | 'rechazado'
    origen: 'equipo_dezzpo' | 'usuario'
    createdBy: string             // User UID or 'admin'
    createdAt: string             // ISO timestamp
    updatedAt: string             // ISO timestamp
    
    // Reserved Growth / Outreach Fields (Future Paid Visibility)
    tierVisibilidad?: 'estandar' | 'destacado' | 'patrocinado' | undefined // Default: 'estandar'
    estadoOutreach?: 'sin_contactar' | 'en_negociacion' | 'cliente_pago' | 'no_interesado' | undefined
    notasInternas?: string | undefined // Admin-only notes
}

export type CreateTiendaInput = Omit<
    TiendaDocument,
    'id' | 'slug' | 'createdAt' | 'updatedAt' | 'estado' | 'origen' | 'createdBy'
> & {
    estado?: 'pendiente' | 'aprobado' | 'rechazado' | undefined
    origen?: 'equipo_dezzpo' | 'usuario' | undefined
    createdBy?: string | undefined
}

export type UpdateTiendaInput = Partial<CreateTiendaInput> & {
    estado?: 'pendiente' | 'aprobado' | 'rechazado' | undefined
    tierVisibilidad?: 'estandar' | 'destacado' | 'patrocinado' | undefined
    estadoOutreach?: 'sin_contactar' | 'en_negociacion' | 'cliente_pago' | 'no_interesado' | undefined
    notasInternas?: string | undefined
}

export interface TiendaFilters {
    categoria?: string | undefined
    zona?: string | undefined
    query?: string | undefined
    estado?: 'pendiente' | 'aprobado' | 'rechazado' | undefined
    tierVisibilidad?: string | undefined
}
