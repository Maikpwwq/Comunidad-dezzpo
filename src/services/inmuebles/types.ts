/**
 * Inmuebles Service Types
 */

export interface Inmueble {
    id: string
    propietarioId: string
    alias: string
    direccion: string
    ciudad: string
    tipo?: string
    codigoPostal?: string
    zona?: string
    lat?: number
    lng?: number
    isPreferida: boolean
    createdAt: string
    updatedAt: string
}

export type CreateInmuebleInput = Omit<Inmueble, 'id' | 'propietarioId' | 'createdAt' | 'updatedAt'>
export type UpdateInmuebleInput = Partial<CreateInmuebleInput>
