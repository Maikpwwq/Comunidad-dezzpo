export const bogotaZoneNames: Record<string, string> = {
    'bogota': 'Bogotá',
    'bogota-norte': 'Bogotá Norte',
    'bogota-sur': 'Bogotá Sur',
    'bogota-centro': 'Bogotá Centro',
    'bogota-occidente': 'Bogotá Occidente',
    'suba': 'Suba',
    'usaquen': 'Usaquén',
    'chapinero': 'Chapinero',
    'teusaquillo': 'Teusaquillo',
    'kennedy': 'Kennedy',
    'engativa': 'Engativá',
    'fontibon': 'Fontibón',
    'barrios-unidos': 'Barrios Unidos',
    'bosa': 'Bosa',
    'puente-aranda': 'Puente Aranda',
    'los-martires': 'Los Mártires',
    'santa-fe': 'Santa Fe',
    'san-cristobal': 'San Cristóbal',
    'usme': 'Usme',
    'tunjuelito': 'Tunjuelito',
    'antonio-narino': 'Antonio Nariño',
    'la-candelaria': 'La Candelaria',
    'rafael-uribe-uribe': 'Rafael Uribe Uribe',
    'ciudad-bolivar': 'Ciudad Bolívar',
    'sumapaz': 'Sumapaz',
    'soacha': 'Soacha',
    'chia': 'Chía',
    'cajica': 'Cajicá',
    'zipaquira': 'Zipaquirá',
    'cota': 'Cota',
    'funza': 'Funza',
    'mosquera': 'Mosquera',
    'madrid': 'Madrid',
    'facatativa': 'Facatativá',
    'la-calera': 'La Calera',
    'sopo': 'Sopó'
}

export const standardCityZoneNames: Record<string, string> = {
    'centro': 'Centro',
    'norte': 'Norte',
    'sur': 'Sur',
    'occidente': 'Occidente',
    'oriente': 'Oriente',
    'noroccidente': 'Noroccidente',
    'nororiente': 'Nororiente',
    'suroccidente': 'Suroccidente',
    'suroriente': 'Suroriente',
    'alrededores': 'Área Metropolitana / Alrededores',
    'otra-zona': 'Otra Zona',
}

export const zoneNames: Record<string, string> = {
    ...bogotaZoneNames,
    ...standardCityZoneNames,
}

export const zones = Object.keys(zoneNames)

/**
 * Checks if a city string is Bogotá or one of its Cundinamarca metropolitan municipalities.
 */
export function isBogotaRegion(ciudad: string = ''): boolean {
    if (!ciudad || !ciudad.trim()) return true
    const norm = ciudad.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim()
    if (norm.includes('bogota')) return true
    
    const metroKeys = ['soacha', 'chia', 'cajica', 'zipaquira', 'cota', 'funza', 'mosquera', 'madrid', 'facatativa', 'la calera', 'sopo']
    return metroKeys.some(m => norm.includes(m))
}

/**
 * Returns appropriate zone selection dictionary (slug -> label) based on selected city.
 */
export function getZonesForCity(ciudad: string = ''): Record<string, string> {
    return isBogotaRegion(ciudad) ? bogotaZoneNames : standardCityZoneNames
}

export const departamentosColombia = [
    'Bogotá D.C.',
    'Cundinamarca',
    'Antioquia',
    'Valle del Cauca',
    'Santander',
    'Meta',
    'Huila',
    'Boyacá',
    'Tolima',
    'Atlántico',
    'Bolívar',
    'Caldas',
    'Risaralda',
    'Quindío',
    'Norte de Santander',
    'Nariño',
    'Cauca',
    'Cesar',
    'Córdoba',
    'Magdalena',
    'Sucre',
    'La Guajira',
    'Casanare',
    'Chocó',
    'Caquetá',
    'Putumayo',
    'Arauca',
    'Amazonas',
    'Guaviare',
    'Guainía',
    'Vaupés',
    'Vichada',
    'San Andrés y Providencia',
]
