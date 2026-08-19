/**
 * Tiendas & Suppliers Types
 */

export interface SedeLocation {
    id: string
    nombreSede: string            // e.g. "Sede Chapinero" or "Sucursal Principal"
    direccion: string             // Required address
    departamento?: string         // e.g. "Cundinamarca", "Meta", "Huila", "Bogotá D.C."
    ciudad: string                // Default: "Bogotá, Colombia"
    codigoPostal?: string
    zona: string                  // Zone slug from ListadoZonas (e.g. "chapinero", "suba")
    hasCustomPhones?: boolean     // False = inherits top-level telefonoPrincipal & whatsappPrincipal
    telefonos?: string[]          // Branch-specific phones (optional if hasCustomPhones is false)
    whatsapp?: string             // Branch-specific WhatsApp number
    horario?: string              // e.g. "Lun-Vie 8:00 - 17:00, Sáb 8:00 - 13:00"
    lat?: number                  // Map pin latitude
    lng?: number                  // Map pin longitude
    detallesUbicacion?: string    // Physical location hints (landmarks, "al lado de...")
    nombreContacto?: string       // On-site contact person name
    cargoContacto?: string        // On-site contact person role/title
}

export interface TiendaDocument {
    id: string
    nombre: string                // Required business name
    razonSocial?: string          // Legal business name (optional)
    nit?: string                  // Tax ID (optional)
    slug: string                  // URL-friendly slug
    categorias: string[]          // Array of category keys/labels from ListadoCategoriasTiendas (Min 1)
    descripcion?: string          // Short slogan or description
    email?: string                // Primary email or summary
    emails?: string[]             // Array of registered contact emails (Min 1)
    sitioWeb?: string
    telefonoPrincipal?: string    // Top-level summary contact phone
    whatsappPrincipal?: string    // Top-level summary WhatsApp
    logoUrl?: string              // Cloud Storage URL
    sedes: SedeLocation[]         // Array of branches (Min 1 required)
    
    // Status & Provenance
    estado: 'pendiente' | 'aprobado' | 'rechazado'
    origen: 'equipo_dezzpo' | 'usuario'
    createdBy: string             // User UID or 'admin'
    createdAt: string             // ISO timestamp
    updatedAt: string             // ISO timestamp
    
    // Reserved Growth / Outreach Fields (Future Paid Visibility)
    tierVisibilidad?: 'estandar' | 'destacado' | 'patrocinado' // Default: 'estandar'
    estadoOutreach?: 'sin_contactar' | 'en_negociacion' | 'cliente_pago' | 'no_interesado'
    notasInternas?: string        // Admin-only notes
}

export type CreateTiendaInput = Omit<
    TiendaDocument,
    'id' | 'slug' | 'createdAt' | 'updatedAt' | 'estado' | 'origen' | 'createdBy'
> & {
    estado?: 'pendiente' | 'aprobado' | 'rechazado'
    origen?: 'equipo_dezzpo' | 'usuario'
    createdBy?: string
}

export type UpdateTiendaInput = Partial<CreateTiendaInput> & {
    estado?: 'pendiente' | 'aprobado' | 'rechazado'
    tierVisibilidad?: 'estandar' | 'destacado' | 'patrocinado'
    estadoOutreach?: 'sin_contactar' | 'en_negociacion' | 'cliente_pago' | 'no_interesado'
    notasInternas?: string
}

export interface TiendaFilters {
    categoria?: string
    zona?: string
    query?: string
    estado?: 'pendiente' | 'aprobado' | 'rechazado'
    tierVisibilidad?: string
}
