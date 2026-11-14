/**
 * Architectural Styles Catalog & Deterministic Plan B (T-I8.1)
 *
 * 12 Curated architectural and interior design styles calibrated for the Colombian market.
 * Connects visual aesthetic inspiration with tangible supplier categories (ListadoCategoriasTiendas)
 * and qualified tradesmen (ListadoCategorias) without incurring external LLM costs.
 */

export interface StyleColorSwatch {
    readonly hex: string
    readonly name: string
    readonly usage: 'muro' | 'acabado' | 'acento' | 'carpinteria'
}

export interface StyleMaterialItem {
    readonly name: string
    readonly categoryTiendaKey: string
    readonly categoryTiendaLabel: string
    readonly usageDescription: string
}

export interface ArchitecturalStyle {
    readonly id: string
    readonly slug: string
    readonly name: string
    readonly tagline: string
    readonly description: string
    readonly badge: string
    readonly palette: StyleColorSwatch[]
    readonly keyMaterials: StyleMaterialItem[]
    readonly recommendedTrades: string[]
    readonly typicalBudgetRange: {
        readonly minCopPerM2: number
        readonly maxCopPerM2: number
        readonly unitLabel: string
    }
    readonly suitableSpaces: string[]
    readonly visualPromptKeywords: string[]
}

export const ARCHITECTURAL_STYLES: ArchitecturalStyle[] = [
    {
        id: 'style-nordic',
        slug: 'nordico-calmo',
        name: 'Nórdico Escandinavo Calmo',
        tagline: 'Luz natural, maderas claras y minimalismo acogedor',
        description:
            'Maximiza la luminosidad en espacios urbanos usando maderas de roble o pino claro, muros blancos mate y textiles texturizados que aportan calidez y serenidad.',
        badge: 'Tendencia Urbana',
        palette: [
            { hex: '#F8F9FA', name: 'Blanco Nieve', usage: 'muro' },
            { hex: '#E9ECEF', name: 'Gris Perla', usage: 'acabado' },
            { hex: '#D7C4B7', name: 'Roble Natural', usage: 'carpinteria' },
            { hex: '#495057', name: 'Grafito Acento', usage: 'acento' },
        ],
        keyMaterials: [
            {
                name: 'Madera laminada o listones de roble claro',
                categoryTiendaKey: 'maderas_tableros_herrajes',
                categoryTiendaLabel: 'Maderas, Tableros y Herrajes',
                usageDescription: 'Pisos estructurados, paneles alistonados decorativos y repisas flotantes.',
            },
            {
                name: 'Pintura vinílica tipo 1 blanco mate lavable',
                categoryTiendaKey: 'pinturas_insumos',
                categoryTiendaLabel: 'Venta de Pinturas e Insumos',
                usageDescription: 'Pintura en cielo rasos y muros para multiplicar la luz natural.',
            },
            {
                name: 'Lámparas colgantes minimalistas 3000K',
                categoryTiendaKey: 'iluminacion_lamparas',
                categoryTiendaLabel: 'Iluminación y Lámparas',
                usageDescription: 'Luz cálida difusa en zonas de comedor y salas de descanso.',
            },
        ],
        recommendedTrades: ['Pintura', 'Carpintería', 'Pisos y Enchapes'],
        typicalBudgetRange: {
            minCopPerM2: 120000,
            maxCopPerM2: 240000,
            unitLabel: 'COP / m²',
        },
        suitableSpaces: ['Apartamento Completo', 'Sala', 'Habitación', 'Cocina'],
        visualPromptKeywords: ['nordic interior', 'light oak', 'scandinavian warm lighting', 'clean lines'],
    },
    {
        id: 'style-industrial',
        slug: 'industrial-urbano',
        name: 'Industrial Urbano Bogotá',
        tagline: 'Ladrillo a la vista, perfilería negra y carácter fabril',
        description:
            'Estética loft con elementos constructivos expuestos: vigas metálicas, tuberías galvanizadas a la vista, ladrillo tolete bogotano y concreto pulido.',
        badge: 'Estilo Loft',
        palette: [
            { hex: '#212529', name: 'Negro Mate', usage: 'acabado' },
            { hex: '#9A3B3B', name: 'Ladrillo Tolete', usage: 'muro' },
            { hex: '#CED4DA', name: 'Concreto Pulido', usage: 'acabado' },
            { hex: '#B08968', name: 'Cuero / Madera Envejecida', usage: 'carpinteria' },
        ],
        keyMaterials: [
            {
                name: 'Estructuras y divisiones de hierro negro',
                categoryTiendaKey: 'ornamentacion',
                categoryTiendaLabel: 'Ornamentación y Trabajo en Hierro',
                usageDescription: 'Puertas corredizas tipo granero y mamparas divisorias con vidrio templado.',
            },
            {
                name: 'Porcelanato acabado microcemento 60x120',
                categoryTiendaKey: 'pisos_ceramicas_porcelanatos',
                categoryTiendaLabel: 'Pisos, Cerámicas y Porcelanatos',
                usageDescription: 'Pisos continuos de alto tráfico sin juntas visibles.',
            },
            {
                name: 'Rieles de spots direccionales LED',
                categoryTiendaKey: 'iluminacion_lamparas',
                categoryTiendaLabel: 'Iluminación y Lámparas',
                usageDescription: 'Iluminación acentuada sobre muros de ladrillo y zonas de trabajo.',
            },
        ],
        recommendedTrades: ['Ornamentación', 'Pisos y Enchapes', 'Electricidad'],
        typicalBudgetRange: {
            minCopPerM2: 150000,
            maxCopPerM2: 310000,
            unitLabel: 'COP / m²',
        },
        suitableSpaces: ['Loft', 'Sala - Comedor', 'Oficina / Estudio', 'Cocina'],
        visualPromptKeywords: ['urban industrial loft', 'exposed brick wall', 'black steel frame', 'concrete floor'],
    },
    {
        id: 'style-japandi',
        slug: 'japandi-zen',
        name: 'Japandi Zen Minimalista',
        tagline: 'La síntesis perfecta entre estética japonesa y funcionalidad nórdica',
        description:
            'Espacios depurados basados en la filosofía wabi-sabi: belleza en la imperfección, texturas cerámicas artesanales, bambú y tonos tierra tenues.',
        badge: 'Equilibrio Zen',
        palette: [
            { hex: '#F4F1DE', name: 'Arena Cálida', usage: 'muro' },
            { hex: '#E07A5F', name: 'Terracota Suave', usage: 'acento' },
            { hex: '#3D405B', name: 'Índigo Profundo', usage: 'acabado' },
            { hex: '#81B29A', name: 'Salvia Sutil', usage: 'acento' },
        ],
        keyMaterials: [
            {
                name: 'MDF y madera alistonada de eucalipto o fresno',
                categoryTiendaKey: 'maderas_tableros_herrajes',
                categoryTiendaLabel: 'Maderas, Tableros y Herrajes',
                usageDescription: 'Celosías y biombos divisorios para filtrar suavemente la luz.',
            },
            {
                name: 'Cerámica tipo zellige o gres artesanal',
                categoryTiendaKey: 'pisos_ceramicas_porcelanatos',
                categoryTiendaLabel: 'Pisos, Cerámicas y Porcelanatos',
                usageDescription: 'Salpicaderos de cocina y muros de acento en duchas.',
            },
            {
                name: 'Griferías empotradas en níquel cepillado',
                categoryTiendaKey: 'griferias_sanitarios_cocinas',
                categoryTiendaLabel: 'Griferías y Sanitarios',
                usageDescription: 'Líneas limpias sin tornillos ni rosetas expuestas.',
            },
        ],
        recommendedTrades: ['Carpintería', 'Pisos y Enchapes', 'Fontanería'],
        typicalBudgetRange: {
            minCopPerM2: 160000,
            maxCopPerM2: 320000,
            unitLabel: 'COP / m²',
        },
        suitableSpaces: ['Baño Principal', 'Habitación Suite', 'Sala de Estar'],
        visualPromptKeywords: ['japandi interior', 'wabi sabi aesthetic', 'eucalyptus wood slats', 'organic ceramics'],
    },
    {
        id: 'style-contemporary',
        slug: 'contemporaneo-elegante',
        name: 'Contemporáneo Elegante',
        tagline: 'Líneas puras, iluminación indirecta y materiales nobles',
        description:
            'Elegancia atemporal con cielo rasos en drywall con fosa de luz indirecta (gargantas LED), carpintería arquitectónica oculta y porcelanatos de gran formato.',
        badge: 'Alta Gama',
        palette: [
            { hex: '#FFFFFF', name: 'Blanco Puro', usage: 'muro' },
            { hex: '#6C757D', name: 'Gris Basalto', usage: 'acabado' },
            { hex: '#343A40', name: 'Negro Carbón', usage: 'acento' },
            { hex: '#D4AF37', name: 'Latón Dorado', usage: 'acento' },
        ],
        keyMaterials: [
            {
                name: 'Drywall para cielo rasos con luz perimetral',
                categoryTiendaKey: 'drywall_placas_perfileria',
                categoryTiendaLabel: 'Drywall, Placas y Perfilería',
                usageDescription: 'Cielo raso suspendido con cajillo para cinta LED indirecta.',
            },
            {
                name: 'Porcelanato pulido rectificado 80x160',
                categoryTiendaKey: 'pisos_ceramicas_porcelanatos',
                categoryTiendaLabel: 'Pisos, Cerámicas y Porcelanatos',
                usageDescription: 'Pisos continuos tipo Calacatta o Statuario de alto brillo.',
            },
            {
                name: 'Tiras LED COB 2700K regulables con domótica',
                categoryTiendaKey: 'domotica_smart_home',
                categoryTiendaLabel: 'Domótica y Smart Home',
                usageDescription: 'Automatización de escenas lumínicas desde smartphone.',
            },
        ],
        recommendedTrades: ['Drywall y Techos', 'Pintura', 'Electricidad', 'Pisos y Enchapes'],
        typicalBudgetRange: {
            minCopPerM2: 180000,
            maxCopPerM2: 380000,
            unitLabel: 'COP / m²',
        },
        suitableSpaces: ['Apartamento Completo', 'Sala Principal', 'Cocina Abierta'],
        visualPromptKeywords: ['contemporary luxury interior', 'cove ceiling LED', 'calacatta porcelain', 'brass details'],
    },
    {
        id: 'style-rustic-modern',
        slug: 'rustico-moderno',
        name: 'Rústico Moderno Campestre',
        tagline: 'Calidez de piedra, vigas rústicas y confort moderno',
        description:
            'Ideal para casas de campo o suburbios (Chía, Cajicá, La Calera). Combina chimeneas tradicionales enchapadas en piedra con ventanería de aluminio térmico y cocinas abiertas.',
        badge: 'Sabana & Campestre',
        palette: [
            { hex: '#6F4E37', name: 'Nogal Café', usage: 'carpinteria' },
            { hex: '#8B8589', name: 'Piedra Muñeca', usage: 'muro' },
            { hex: '#FFFDD0', name: 'Blanco Crema', usage: 'muro' },
            { hex: '#2C5E3B', name: 'Verde Bosque', usage: 'acento' },
        ],
        keyMaterials: [
            {
                name: 'Piedra natural muñeca o laja cortada',
                categoryTiendaKey: 'depositos_materiales',
                categoryTiendaLabel: 'Depósitos y Materiales Básicos',
                usageDescription: 'Muros de chimenea y fachadas interiores.',
            },
            {
                name: 'Ventanería hermética en aluminio o PVC',
                categoryTiendaKey: 'perfileria_aluminio',
                categoryTiendaLabel: 'Perfilería y Aluminio',
                usageDescription: 'Aislamiento térmico para zonas frías de la sabana.',
            },
            {
                name: 'Inmunizantes y lacas para maderas macizas',
                categoryTiendaKey: 'pinturas_insumos',
                categoryTiendaLabel: 'Venta de Pinturas e Insumos',
                usageDescription: 'Protección para vigas de madera a la vista.',
            },
        ],
        recommendedTrades: ['Albañilería y Mampostería', 'Carpintería', 'Pintura'],
        typicalBudgetRange: {
            minCopPerM2: 170000,
            maxCopPerM2: 340000,
            unitLabel: 'COP / m²',
        },
        suitableSpaces: ['Casa Campestre', 'Sala con Chimenea', 'Cocina Rustica'],
        visualPromptKeywords: ['modern rustic country house', 'stone fireplace', 'wooden ceiling beams', 'cozy warmth'],
    },
    {
        id: 'style-biophilic',
        slug: 'biofilico-verde',
        name: 'Biofílico Urbano (Verde & Natural)',
        tagline: 'Integración viva de plantas, luz solar y materiales orgánicos',
        description:
            'Mejora la salud y bienestar incorporando jardines verticales interiores, jardineras empotradas, luz natural cenital y maderas certificadas.',
        badge: 'Bienestar & Eco',
        palette: [
            { hex: '#2D6A4F', name: 'Verde Follaje', usage: 'acento' },
            { hex: '#D8F3DC', name: 'Menta Claro', usage: 'muro' },
            { hex: '#B7B7A4', name: 'Piedra de Río', usage: 'acabado' },
            { hex: '#DDB892', name: 'Yute / Mimbre', usage: 'carpinteria' },
        ],
        keyMaterials: [
            {
                name: 'Sistemas modulares para jardines verticales',
                categoryTiendaKey: 'jardineria_insumos_abonos',
                categoryTiendaLabel: 'Jardinería, Viveros y Abonos',
                usageDescription: 'Estructuras de riego por goteo interior y geotextil para muros vivos.',
            },
            {
                name: 'Pisos de madera tecnológica o bambú impermeable',
                categoryTiendaKey: 'pisos_ceramicas_porcelanatos',
                categoryTiendaLabel: 'Pisos, Cerámicas y Porcelanatos',
                usageDescription: 'Resistentes a la humedad y de origen renovable.',
            },
            {
                name: 'Claraboyas y domos en policarbonato',
                categoryTiendaKey: 'cubiertas_tejas_policarbonato',
                categoryTiendaLabel: 'Cubiertas, Tejas y Policarbonato',
                usageDescription: 'Entrada cenital de sol para vegetación interior.',
            },
        ],
        recommendedTrades: ['Jardinería', 'Fontanería', 'Pisos y Enchapes'],
        typicalBudgetRange: {
            minCopPerM2: 140000,
            maxCopPerM2: 290000,
            unitLabel: 'COP / m²',
        },
        suitableSpaces: ['Balcón / Terraza', 'Patio Interior', 'Baño Zen'],
        visualPromptKeywords: ['biophilic design apartment', 'living green wall', 'natural light skylight', 'bamboo flooring'],
    },
    {
        id: 'style-minimalist-warm',
        slug: 'minimalismo-calido',
        name: 'Minimalismo Cálido',
        tagline: 'Despeje visual sin frialdad: microcemento, lino y curvas suaves',
        description:
            'Reduce el exceso visual manteniendo la calidez doméstica mediante esquinas curvas en yeso/drywall, estucos texturizados y ausencia de tiradores en muebles.',
        badge: 'Top Arquitectos',
        palette: [
            { hex: '#FAF9F6', name: 'Blanco Lino', usage: 'muro' },
            { hex: '#E3DAC9', name: 'Champaña Tiza', usage: 'acabado' },
            { hex: '#C2B280', name: 'Arena Suave', usage: 'carpinteria' },
            { hex: '#706D66', name: 'Piedra Pardo', usage: 'acento' },
        ],
        keyMaterials: [
            {
                name: 'Estuco veneciano o microcemento alisado',
                categoryTiendaKey: 'pinturas_insumos',
                categoryTiendaLabel: 'Venta de Pinturas e Insumos',
                usageDescription: 'Muros sin juntas con acabado sedoso continuo.',
            },
            {
                name: 'Mobiliario con sistema push-to-open sin manijas',
                categoryTiendaKey: 'muebles_closets',
                categoryTiendaLabel: 'Muebles Modulares y Closets',
                usageDescription: 'Cocinas y closets planos integrados al muro.',
            },
            {
                name: 'Perfilería de transición oculta',
                categoryTiendaKey: 'ferreteria_general',
                categoryTiendaLabel: 'Ferreterías General',
                usageDescription: 'Guardapulverizadores y zócalos remetidos a ras.',
            },
        ],
        recommendedTrades: ['Pintura', 'Drywall y Techos', 'Carpintería'],
        typicalBudgetRange: {
            minCopPerM2: 135000,
            maxCopPerM2: 270000,
            unitLabel: 'COP / m²',
        },
        suitableSpaces: ['Apartamento', 'Cocina', 'Baño'],
        visualPromptKeywords: ['warm minimalist interior', 'seamless microcement', 'handleless kitchen', 'curved walls'],
    },
    {
        id: 'style-mediterranean',
        slug: 'mediterraneo-sol',
        name: 'Mediterráneo Cálido',
        tagline: 'Arcos, texturas encaladas, terracota y frescura',
        description:
            'Evoca las villas de la costa con arcos de medio punto, vanos abiertos, suelos de barro cocido o gres rústico y telas ligeras de lino blanco.',
        badge: 'Fresco & Vital',
        palette: [
            { hex: '#FFFFFF', name: 'Blanco Cal', usage: 'muro' },
            { hex: '#C86D51', name: 'Terracota Viva', usage: 'acabado' },
            { hex: '#2B6CB0', name: 'Azul Egeo', usage: 'acento' },
            { hex: '#ECC94B', name: 'Amarillo Ocre', usage: 'acento' },
        ],
        keyMaterials: [
            {
                name: 'Baldosas de barro cocido o gres esmaltado',
                categoryTiendaKey: 'pisos_ceramicas_porcelanatos',
                categoryTiendaLabel: 'Pisos, Cerámicas y Porcelanatos',
                usageDescription: 'Pisos de baldosas rústicas de gran durabilidad.',
            },
            {
                name: 'Pintura a la cal o estuco rústico texturizado',
                categoryTiendaKey: 'pinturas_insumos',
                categoryTiendaLabel: 'Venta de Pinturas e Insumos',
                usageDescription: 'Muros encalados con textura artesanal manual.',
            },
            {
                name: 'Cortinas livianas en gasa o lino',
                categoryTiendaKey: 'cortinas_persianas_telas',
                categoryTiendaLabel: 'Cortinas, Persianas y Telas',
                usageDescription: 'Cortinajes que ondean con la brisa sin oscurecer.',
            },
        ],
        recommendedTrades: ['Albañilería y Mampostería', 'Pisos y Enchapes', 'Pintura'],
        typicalBudgetRange: {
            minCopPerM2: 130000,
            maxCopPerM2: 260000,
            unitLabel: 'COP / m²',
        },
        suitableSpaces: ['Terraza', 'Cocina Rústica', 'Baño de Visitas'],
        visualPromptKeywords: ['mediterranean villa interior', 'terracotta tiles', 'whitewashed plaster arch', 'linen curtains'],
    },
    {
        id: 'style-classic-renovated',
        slug: 'clasico-renovado',
        name: 'Clásico Renovado / Neoclásico',
        tagline: 'Molduras en yeso, pisos en espina de pez y sobriedad señorial',
        description:
            'Especialmente idóneo para remodelaciones en barrios patrimoniales (Usaquén, Teusaquillo, Chapinero Alto). Restaura la belleza de boiseries, cornisas y pisos de madera espigada con comodidades contemporáneas.',
        badge: 'Patrimonial',
        palette: [
            { hex: '#F5F5F0', name: 'Blanco Antiguo', usage: 'muro' },
            { hex: '#2A3439', name: 'Azul Pizarra', usage: 'muro' },
            { hex: '#9C6644', name: 'Madera Roble Oscuro', usage: 'carpinteria' },
            { hex: '#C0A080', name: 'Bronce Envejecido', usage: 'acento' },
        ],
        keyMaterials: [
            {
                name: 'Molduras, cornisas y zócalos altos de poliuretano',
                categoryTiendaKey: 'drywall_placas_perfileria',
                categoryTiendaLabel: 'Drywall, Placas y Perfilería',
                usageDescription: 'Paredes con boiserie francesa y cornisas decorativas.',
            },
            {
                name: 'Pisos de madera en espina de pescado (Herringbone)',
                categoryTiendaKey: 'maderas_tableros_herrajes',
                categoryTiendaLabel: 'Maderas, Tableros y Herrajes',
                usageDescription: 'Madera estructurada pulida con acabado mate poliuretánico.',
            },
            {
                name: 'Herrajes y manijas en bronce envejecido',
                categoryTiendaKey: 'cerrajeria_insumos',
                categoryTiendaLabel: 'Cerrajería y Cerraduras',
                usageDescription: 'Cerraduras estilo vintage para puertas de madera maciza.',
            },
        ],
        recommendedTrades: ['Carpintería', 'Pintura', 'Pisos y Enchapes'],
        typicalBudgetRange: {
            minCopPerM2: 190000,
            maxCopPerM2: 390000,
            unitLabel: 'COP / m²',
        },
        suitableSpaces: ['Apartamento Clásico', 'Sala Principal', 'Estudio'],
        visualPromptKeywords: ['modern neoclassic interior', 'herringbone parquet', 'wall mouldings boiserie', 'vintage brass handles'],
    },
    {
        id: 'style-boho',
        slug: 'boho-chic-natural',
        name: 'Boho Chic Natural',
        tagline: 'Texturas trenzadas, patrones geométricos y espíritu libre',
        description:
            'Ambiente desenfadado y acogedor con alfombras étnicas, lámparas de fibras naturales (yute, mimbre, fique colombiano), plantas colgantes y cojines bordados.',
        badge: 'Creativo & Libre',
        palette: [
            { hex: '#E9D8A6', name: 'Arena Tostada', usage: 'muro' },
            { hex: '#EE9B00', name: 'Mostaza Cálido', usage: 'acento' },
            { hex: '#CA6702', name: 'Ámbar Tierra', usage: 'acento' },
            { hex: '#005F73', name: 'Azul Petróleo', usage: 'acabado' },
        ],
        keyMaterials: [
            {
                name: 'Telas decorativas y tapizados en algodón y lino',
                categoryTiendaKey: 'tapiceria',
                categoryTiendaLabel: 'Tapicería y Espumas',
                usageDescription: 'Retapizado de muebles antiguos y cojines de piso.',
            },
            {
                name: 'Lámparas colgantes en fibras de mimbre o fique',
                categoryTiendaKey: 'iluminacion_lamparas',
                categoryTiendaLabel: 'Iluminación y Lámparas',
                usageDescription: 'Puntos focales con texturas tejidas a mano.',
            },
            {
                name: 'Pintura vinílica en tonos ocres y neutros cálidos',
                categoryTiendaKey: 'pinturas_insumos',
                categoryTiendaLabel: 'Venta de Pinturas e Insumos',
                usageDescription: 'Paredes cálidas que contrastan con textiles.',
            },
        ],
        recommendedTrades: ['Tapicería', 'Pintura', 'Electricidad'],
        typicalBudgetRange: {
            minCopPerM2: 110000,
            maxCopPerM2: 210000,
            unitLabel: 'COP / m²',
        },
        suitableSpaces: ['Sala de Descanso', 'Habitación Juvenil', 'Estudio Creativo'],
        visualPromptKeywords: ['boho chic living room', 'rattan pendant light', 'macrame wall hanging', 'textured fabrics'],
    },
    {
        id: 'style-art-deco',
        slug: 'art-deco-moderno',
        name: 'Art Decó Glamour Moderno',
        tagline: 'Geometría audaz, acentos dorados y terciopelos intensos',
        description:
            'Añade dramatismo y sofisticación con arcos simétricos, detalles en dorado brillante, espejos biselados y paletas cromáticas profundas (esmeralda, azul noche).',
        badge: 'Glamour & Lujo',
        palette: [
            { hex: '#0B2545', name: 'Azul Noche Profundo', usage: 'muro' },
            { hex: '#D4AF37', name: 'Dorado Pulido', usage: 'acento' },
            { hex: '#134074', name: 'Cobalto Joya', usage: 'acabado' },
            { hex: '#EEF4F8', name: 'Mármol Blanco', usage: 'acabado' },
        ],
        keyMaterials: [
            {
                name: 'Perfiles decorativos y esquineros dorados de acero inoxidable',
                categoryTiendaKey: 'inoxidables',
                categoryTiendaLabel: 'Inoxidables y Aceros Especiales',
                usageDescription: 'Incrustaciones metálicas doradas en muebles y enchapes.',
            },
            {
                name: 'Espejos decorativos biselados a la medida',
                categoryTiendaKey: 'vidrios_cristales',
                categoryTiendaLabel: 'Vidrios y Cristalería',
                usageDescription: 'Muros espejados geométricos que multiplican la profundidad.',
            },
            {
                name: 'Telas de terciopelo antimanchas para tapicería',
                categoryTiendaKey: 'tapiceria',
                categoryTiendaLabel: 'Tapicería y Espumas',
                usageDescription: 'Sofás y cabeceros tapizados en capitoné suave.',
            },
        ],
        recommendedTrades: ['Pisos y Enchapes', 'Vidriería', 'Tapicería', 'Pintura'],
        typicalBudgetRange: {
            minCopPerM2: 190000,
            maxCopPerM2: 410000,
            unitLabel: 'COP / m²',
        },
        suitableSpaces: ['Baño Social de Lujo', 'Comedor Formal', 'Lobby'],
        visualPromptKeywords: ['modern art deco bathroom', 'geometric gold trim', 'emerald green tiles', 'bevelled mirrors'],
    },
    {
        id: 'style-loft-openspace',
        slug: 'open-space-flexible',
        name: 'Open Space & Loft Flexible',
        tagline: 'Amplitud sin barreras, paneles móviles y cocinas integradas',
        description:
            'Elimina tabiques innecesarios en apartamentos medianos para crear un espacio fluido. La cocina se integra con una isla central y los ambientes se zonifican con iluminación y desniveles.',
        badge: 'Espacios Abiertos',
        palette: [
            { hex: '#F8F9FA', name: 'Blanco Luz', usage: 'muro' },
            { hex: '#495057', name: 'Gris Carbón', usage: 'acabado' },
            { hex: '#A68A68', name: 'Roble Medio', usage: 'carpinteria' },
            { hex: '#0D9488', name: 'Turquesa Dezzpo', usage: 'acento' },
        ],
        keyMaterials: [
            {
                name: 'Mobiliario de cocina integral con isla de cuarzo',
                categoryTiendaKey: 'muebles_closets',
                categoryTiendaLabel: 'Muebles Modulares y Closets',
                usageDescription: 'Islas multifunción con mesón resistente a manchas y rayones.',
            },
            {
                name: 'Divisiones corredizas de vidrio templado y aluminio',
                categoryTiendaKey: 'perfileria_aluminio',
                categoryTiendaLabel: 'Perfilería y Aluminio',
                usageDescription: 'Cierre acústico flexible para home office sin perder luz.',
            },
            {
                name: 'Campanas extractoras isla y estufas empotradas',
                categoryTiendaKey: 'gasodomesticos',
                categoryTiendaLabel: 'Gasodomésticos y Calentadores',
                usageDescription: 'Extracción potente sin ductos visibles en áreas abiertas.',
            },
        ],
        recommendedTrades: ['Cocinas Integrales', 'Carpintería', 'Electricidad', 'Fontanería'],
        typicalBudgetRange: {
            minCopPerM2: 160000,
            maxCopPerM2: 350000,
            unitLabel: 'COP / m²',
        },
        suitableSpaces: ['Cocina - Comedor Integrado', 'Monoambiente / Estudio', 'Apartamento Tipo Loft'],
        visualPromptKeywords: ['open plan kitchen living room', 'quartz island', 'sliding glass partition', 'bright interior'],
    },
]

/**
 * Returns an architectural style by its slug identifier.
 */
export function getStyleBySlug(slug: string): ArchitecturalStyle | undefined {
    return ARCHITECTURAL_STYLES.find((s) => s.slug === slug || s.id === slug)
}

/**
 * Generates an estimated budget for a space using a specific architectural style.
 */
export function estimateStyleBudget(
    style: ArchitecturalStyle,
    areaM2: number
): { readonly minCop: number; readonly maxCop: number } {
    const validArea = Math.max(1, areaM2)
    return {
        minCop: Math.round(style.typicalBudgetRange.minCopPerM2 * validArea),
        maxCop: Math.round(style.typicalBudgetRange.maxCopPerM2 * validArea),
    }
}
