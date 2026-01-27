/**
 * Projects Feature Types
 */

import React from 'react'

export interface CategoryItem {
    key: number
    label: string
    rol: string
    variant: 'outlined' | 'filled'
    icon: React.ReactElement
}

export interface SubCategoryItem {
    subCategoria: string
    subCategoriaDescription?: string
    subCategoriaPrecio: number | string
    subCategoriaCantidad?: string
    subCategoriaPhotoUrl?: string
}

export interface ProjectDraftInfo {
    draftCategory?: string | number
    draftProject?: string
    tipoProyecto?: string
    [key: string]: unknown
}

export interface CategorySelectionState {
    selected: SubCategoryItem[]
    [key: string]: unknown
}

export type ProjectType = 'Hogar' | 'Negocio' | 'PH' | 'Inmobiliaria' | 'Alianzas'

export const PROJECT_TYPES: { value: ProjectType | ''; label: string }[] = [
    { value: '', label: 'seleccionar uno' },
    { value: 'Hogar', label: 'Hogar' },
    { value: 'Negocio', label: 'Negocio' },
    { value: 'PH', label: 'Propiedad Horizontal' },
    { value: 'Inmobiliaria', label: 'Inmobiliaria' },
    { value: 'Alianzas', label: 'Alianzas' },
]
