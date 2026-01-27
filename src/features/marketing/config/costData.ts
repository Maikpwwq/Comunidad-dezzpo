import type { CategoriaItem } from '../types'

export const apendiceCostosData: CategoriaItem[] = [
    {
        subSistema: 'Instalaciones Eléctricas'
    },
    {
        subCategoria: 'Salida de Tomacorriente',
        subCategoriaCantidad: 'Unidad',
        subCategoriaDescription: 'Instalación de salida eléctrica monofásica con polo a tierra.',
        subCategoriaPrecio: 45000
    },
    {
        subCategoria: 'Salida de Iluminación',
        subCategoriaCantidad: 'Unidad',
        subCategoriaDescription: 'Instalación de punto de iluminación en techo o pared.',
        subCategoriaPrecio: 38000
    },
    {
        subSistema: 'Instalaciones Hidrosanitarias'
    },
    {
        subCategoria: 'Punto Hidráulico',
        subCategoriaCantidad: 'Unidad',
        subCategoriaDescription: 'Instalación de punto de agua fría (PVC presión).',
        subCategoriaPrecio: 55000
    },
    {
        subCategoria: 'Punto Sanitario',
        subCategoriaCantidad: 'Unidad',
        subCategoriaDescription: 'Instalación de punto de desagüe (PVC sanitario).',
        subCategoriaPrecio: 60000
    },
    {
        subSistema: 'Albañilería y Mampostería'
    },
    {
        subCategoria: 'Muro en Ladrillo',
        subCategoriaCantidad: 'm²',
        subCategoriaDescription: 'Levantamiento de muro en ladrillo tolete común.',
        subCategoriaPrecio: 75000
    },
    {
        subCategoria: 'Pañete',
        subCategoriaCantidad: 'm²',
        subCategoriaDescription: 'Pañete liso sobre muro existente.',
        subCategoriaPrecio: 32000
    }
]
