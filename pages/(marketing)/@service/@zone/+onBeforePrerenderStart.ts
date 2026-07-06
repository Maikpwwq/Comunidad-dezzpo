import { ListadoCategorias } from '@assets/data/ListadoCategorias'
import { zones } from '@assets/data/ListadoZonas'

function slugify(text: string): string {
    return text
        .toString()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-')
}

// zones imported from @assets/data/ListadoZonas

export async function onBeforePrerenderStart() {
    const urls: string[] = []
    for (const cat of ListadoCategorias) {
        const serviceSlug = slugify(cat.label)
        if (serviceSlug) {
            for (const zone of zones) {
                urls.push(`/${serviceSlug}/${zone}`)
            }
        }
    }
    return urls
}
