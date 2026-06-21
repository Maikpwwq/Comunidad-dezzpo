import { ListadoCategorias } from '@assets/data/ListadoCategorias'

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

const zones = [
    'bogota',
    'bogota-norte',
    'bogota-sur',
    'bogota-centro',
    'bogota-occidente',
    'suba',
    'usaquen',
    'chapinero',
    'teusaquillo',
    'kennedy',
    'engativa',
    'fontibon'
]

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
