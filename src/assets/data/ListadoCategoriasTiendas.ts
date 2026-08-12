/**
 * ListadoCategoriasTiendas.ts
 *
 * Namespaced category taxonomy specifically designed for retail stores,
 * material suppliers, equipment rentals, and technical services.
 *
 * Each category includes:
 * - key: unique string identifier for Tiendas
 * - label: human readable display name
 * - parentTradeKey?: optional key/label mapping to ListadoCategorias service trade
 * - iconName: MUI Icon name for rendering
 */

export interface TiendaCategoryOption {
    key: string
    label: string
    parentTradeKey?: number | string
    iconName: string
    description?: string
    synonyms?: string[]
}

export const ListadoCategoriasTiendas: TiendaCategoryOption[] = [
    {
        key: 'ferreteria_general',
        label: 'Ferreterías General',
        parentTradeKey: 24,
        iconName: 'Hardware',
        description: 'Herramientas manuales, tornillería, fijaciones y suministros generales.',
        synonyms: ['ferretería', 'ferreteria', 'tornillos', 'tornillería', 'herramientas', 'clavos', 'chapas', 'remaches', 'fijaciones'],
    },
    {
        key: 'pinturas_insumos',
        label: 'Venta de Pinturas e Insumos',
        parentTradeKey: 62,
        iconName: 'FormatPaint',
        description: 'Pinturas arquitectónicas, esmaltes, brochas, rodillos y diluyentes.',
        synonyms: ['pintura', 'pinturas', 'esmalte', 'vinilo', 'brochas', 'rodillos', 'thinner', 'estuco', 'diluyente', 'disolvente'],
    },
    {
        key: 'perfileria_aluminio',
        label: 'Perfilería y Aluminio',
        parentTradeKey: 18,
        iconName: 'ViewSidebar',
        description: 'Perfiles de aluminio, rieles, accesorios para ventanería y fachadas.',
        synonyms: ['aluminio', 'perfiles', 'perfilería', 'ventanería', 'ventanas', 'marcos', 'rieles'],
    },
    {
        key: 'vidrios_cristales',
        label: 'Vidrios y Cristalería',
        parentTradeKey: 18,
        iconName: 'Window',
        description: 'Vidrio templado, laminado, espejos y accesorios de fijación.',
        synonyms: ['vidrio', 'vidrios', 'cristal', 'cristales', 'espejos', 'templado', 'laminado'],
    },
    {
        key: 'andamios_equipos',
        label: 'Alquiler y Venta de Andamios',
        parentTradeKey: 50, // Oficial de obra / Construcción
        iconName: 'Engineering',
        description: 'Andamios tubulares, multidireccionales, cortadoras y mezcladoras.',
        synonyms: ['andamio', 'andamios', 'mezcladora', 'trompo', 'alquiler de equipos', 'cortadora de ladrillo', 'maquinaria'],
    },
    {
        key: 'servicio_tecnico_herramientas',
        label: 'Servicio Técnico de Herramientas',
        parentTradeKey: 52, // Mantenimiento mecánico
        iconName: 'Build',
        description: 'Mantenimiento y repuestos de taladros, pulidoras y herramientas eléctricas.',
        synonyms: ['reparación', 'repuestos', 'taladro', 'pulidora', 'servicio técnico', 'mantenimiento herramientas', 'carbones'],
    },
    {
        key: 'cerrajeria_insumos',
        label: 'Cerrajería (Insumos y Chapas)',
        parentTradeKey: 13,
        iconName: 'Lock',
        description: 'Cerraduras de seguridad, cilindros, candados y dupicados.',
        synonyms: ['chapas', 'cerraduras', 'candados', 'llaves', 'cerrajería', 'cilindros', 'pestillos'],
    },
    {
        key: 'tuberia_pvc_hidrosanitaria',
        label: 'Tubería y Accesorios PVC',
        parentTradeKey: 63, // Plomería
        iconName: 'Plumbing',
        description: 'Tubería de presión, sanitaria, conduit, limpiadores y soldadura PVC.',
        synonyms: ['tubo', 'tubería', 'tuberia', 'pvc', 'plomería', 'plomeria', 'codos', 'uniones', 'soldadura pvc', 'sanitaria', 'hidráulica'],
    },
    {
        key: 'materiales_electricos',
        label: 'Materiales y Equipos Eléctricos',
        parentTradeKey: 66, // Red eléctrica
        iconName: 'ElectricMeter',
        description: 'Cableado, breakers, tableros, tomacorrientes y conduit metal/PVC.',
        synonyms: ['cables', 'cableado', 'breakers', 'tomas', 'interruptores', 'eléctricos', 'electricidad', 'tablero eléctrico'],
    },
    {
        key: 'iluminacion_lamparas',
        label: 'Iluminación y Lámparas',
        parentTradeKey: 37,
        iconName: 'Lightbulb',
        description: 'Luminarias LED, paneles, reflectores, tiras LED y lámparas decorativas.',
        synonyms: ['lámparas', 'lamparas', 'led', 'bombillos', 'iluminación', 'luminarias', 'reflectores', 'tiras led'],
    },
    {
        key: 'gases_industriales_soldadura',
        label: 'Gases Industriales y Soldadura',
        parentTradeKey: 67, // Red de gases / Soldadura
        iconName: 'LocalGasStation',
        description: 'Oxígeno, argón, nitrógeno, electrodos, inversores y caretas de soldar.',
        synonyms: ['soldadura', 'electrodos', 'oxígeno', 'argón', 'caretas', 'inversor', 'gases', 'propano'],
    },
    {
        key: 'pisos_ceramicas_porcelanatos',
        label: 'Cerámicas, Porcelanatos y Pisos',
        parentTradeKey: 33,
        iconName: 'GridOn',
        description: 'Pisos cerámicos, porcelanatos, laminados, vinílicos, pegantes y boquillas.',
        synonyms: ['pisos', 'cerámica', 'ceramica', 'porcelanato', 'laminados', 'pegacor', 'boquilla', 'baldosa'],
    },
    {
        key: 'corte_dobleces_metalmecanica',
        label: 'Corte, Dobleces y Metalmecánica',
        parentTradeKey: 53,
        iconName: 'SquareFoot',
        description: 'Servicio de corte en cizalla, doblez de láminas, punzonado y tubos.',
        synonyms: ['corte', 'doblez', 'lámina', 'cizalla', 'metalmecánica', 'punzonado', 'planchas'],
    },
    {
        key: 'torno_mecanizado',
        label: 'Taller de Torno y Mecanizado',
        parentTradeKey: 53,
        iconName: 'PrecisionManufacturing',
        description: 'Mecanizado de piezas, bujes, roscas y rectificado industrial.',
        synonyms: ['torno', 'mecanizado', 'bujes', 'roscas', 'rectificado', 'piezas metálicas'],
    },
    {
        key: 'ornamentacion_hierro',
        label: 'Ornamentación y Perfiles de Hierro',
        parentTradeKey: 53,
        iconName: 'Fence',
        description: 'Perfiles de hierro, tubos estructurales, platinas, ángulos y mallas.',
        synonyms: ['hierro', 'perfiles de hierro', 'ángulos', 'platinas', 'tubos estructurales', 'mallas', 'varillas', 'ornamentación'],
    },
    {
        key: 'impermeabilizantes_aditivos',
        label: 'Venta de Impermeabilizantes',
        parentTradeKey: 38,
        iconName: 'WaterDrop',
        description: 'Mantos asfálticos, acrílicos, aditivos para concreto y selladores.',
        synonyms: ['impermeabilizante', 'sika', 'manto asfáltico', 'aditivos', 'selladores', 'humedad', 'filtra'],
    },
    {
        key: 'control_acceso_seguridad',
        label: 'Equipos de Control de Acceso',
        parentTradeKey: 23,
        iconName: 'Fingerprint',
        description: 'Cerraduras electrónicas, talanqueras, biometría y electroimanes.',
        synonyms: ['control de acceso', 'biometría', 'electroimán', 'talanquera', 'tarjeta de acceso', 'cerradura inteligente'],
    },
    {
        key: 'domotica_smart_home',
        label: 'Dispositivos de Domótica',
        parentTradeKey: 28,
        iconName: 'SmartHome',
        description: 'Interruptores inteligentes, sensores Zigbee/WiFi y motores de cortinas.',
        synonyms: ['domótica', 'domotica', 'smart home', 'wifi', 'zigbee', 'sensores', 'interruptor inteligente', 'automatización'],
    },
    {
        key: 'maderas_tableros_herrajes',
        label: 'Maderas, Triplex y Herrajes',
        parentTradeKey: 17, // Carpintería
        iconName: 'Forest',
        description: 'Hojas de MDF, RH, triplex, canto PVC, bisagras y rieles telescópicos.',
        synonyms: ['madera', 'maderas', 'triplex', 'mdf', 'rh', 'agomerados', 'bisagras', 'rieles', 'herrajes', 'carpintería', 'carpinteria', 'muebles', 'mueblería', 'muebleria', 'tableros', 'listones'],
    },
    {
        key: 'cubiertas_tejas_policarbonato',
        label: 'Tejas, Cubiertas y Policarbonato',
        parentTradeKey: 26, // Cubiertas y Techos
        iconName: 'Roofing',
        description: 'Tejas termoacústicas, policarbonato alveolar, zinc y accesorios.',
        synonyms: ['tejas', 'cubiertas', 'policarbonato', 'zinc', 'termoacústica', 'techos', 'canales'],
    },
    {
        key: 'camaras_cctv_alarmas',
        label: 'Equipos de Videovigilancia y CCTV',
        parentTradeKey: 10, // Cámaras de seguridad
        iconName: 'CameraOutdoor',
        description: 'Cámaras IP, DVR/NVR, disco duro para videovigilancia y sensores.',
        synonyms: ['cámaras', 'camaras', 'cctv', 'dvr', 'nvr', 'alarmas', 'seguridad electrónica', 'sensores de movimiento'],
    },
    {
        key: 'calentadores_repuestos',
        label: 'Calentadores y Repuestos',
        parentTradeKey: 13, // Calentadores
        iconName: 'DeviceThermostat',
        description: 'Calentadores a gas/eléctricos, mangueras, termostatos y diafragmas.',
        synonyms: ['calentadores', 'calentador', 'repuestos calentador', 'termostato', 'diafragma', 'gas'],
    },
    {
        key: 'aislamiento_acustico_termico',
        label: 'Aislamiento Acústico y Térmico',
        parentTradeKey: 3,
        iconName: 'GraphicEq',
        description: 'Lana de roca, fibra de vidrio, espumas acústicas y paneles frescasa.',
        synonyms: ['aislamiento', 'lana de roca', 'fibra de vidrio', 'acústico', 'térmico', 'frescasa', 'insonorizar'],
    },
    {
        key: 'aseo_insumos_quimicos',
        label: 'Insumos y Químicos de Aseo',
        parentTradeKey: 11,
        iconName: 'CleaningServices',
        description: 'Desengrasantes industriales, ceras, selladores de pisos y maquinaria de aseo.',
        synonyms: ['aseo', 'químicos', 'desengrasante', 'ceras', 'limpieza', 'detergentes industriales'],
    },
    {
        key: 'aires_acondicionados_repuestos',
        label: 'Aires Acondicionados y Repuestos',
        parentTradeKey: 2,
        iconName: 'AcUnit',
        description: 'Equipos Mini Split, tubería de cobre, gas refrigerante R410/R32 y soportes.',
        synonyms: ['aire acondicionado', 'mini split', 'gas refrigerante', 'cobre', 'refrigeración'],
    },
    {
        key: 'jardineria_insumos_abonos',
        label: 'Insumos de Jardinería y Abonos',
        parentTradeKey: 47, // Jardinería
        iconName: 'Grass',
        description: 'Tierra abonada, fertilizantes, grama sintética, mangueras y guadañas.',
        synonyms: ['jardinería', 'tierra abonada', 'fertilizantes', 'grama', 'mangueras', 'abono', 'plantas'],
    },
    {
        key: 'proteccion_incendio_extintores',
        label: 'Protección contra Incendio y Extintores',
        parentTradeKey: 65,
        iconName: 'FireExtinguisher',
        description: 'Recarga y venta de extintores, gabinetes, mangueras y detectores de humo.',
        synonyms: ['extintores', 'recarga extintor', 'gabinete contra incendio', 'detectores de humo', 'mangueras contra incendio'],
    },
    {
        key: 'redes_cableado_estructurado',
        label: 'Cableado Estructurado y Redes',
        parentTradeKey: 68,
        iconName: 'Lan',
        description: 'Cable UTP/Fibra, racks, patch panels, jacks RJ45 y switches.',
        synonyms: ['redes', 'utp', 'cable utp', 'fibra óptica', 'racks', 'patch panel', 'switches', 'rj45'],
    },
    {
        key: 'muebles_modulares_tapiceria',
        label: 'Muebles, Closets y Tapicería',
        parentTradeKey: 17,
        iconName: 'Chair',
        description: 'Muebles de oficina, salas, comedores, closets, armarios, tapizados y espumas.',
        synonyms: ['muebles', 'mueblería', 'muebleria', 'sillas', 'escritorios', 'closets', 'armarios', 'tapicería', 'tapiceria', 'telas de tapicería', 'espumas', 'muebles modulares', 'carpintería', 'carpinteria'],
    },
    {
        key: 'seguridad_industrial_epp',
        label: 'Seguridad Industrial, EPP y Equipos de Altura',
        parentTradeKey: 83,
        iconName: 'Engineering',
        description: 'Elementos de protección personal (EPP), arneses, cascos, líneas de vida y señalización.',
        synonyms: ['seguridad industrial', 'epp', 'cascos', 'arnés', 'arnes', 'línea de vida', 'linea de vida', 'trabajos en altura', 'alturas', 'guantes', 'botas de seguridad', 'gafas de protección', 'mosquetones'],
    },
    {
        key: 'drywall_placas_perfileria',
        label: 'Drywall, Placas de Yeso y Perfilería',
        parentTradeKey: 0,
        iconName: 'ViewQuilt',
        description: 'Placas de yeso drywall, superboard, omega, parales, masillas y cintas.',
        synonyms: ['drywall', 'draiwal', 'placas de yeso', 'superboard', 'omega', 'masilla drywall', 'cinta de papel', 'perfilería drywall', 'estuco seco'],
    },
    {
        key: 'griferias_sanitarios_cocinas',
        label: 'Griferías, Sanitarios y Muebles de Cocina',
        parentTradeKey: 71,
        iconName: 'Countertops',
        description: 'Griferías de baño y cocina, sanitarios, lavamanos, lavaplatos y mesones.',
        synonyms: ['grifería', 'griferia', 'sanitarios', 'lavamanos', 'lavaplatos', 'grifos', 'mezcladores', 'mesones de cocina', 'baños', 'cocinas'],
    },
    {
        key: 'cortinas_persianas_telas',
        label: 'Cortinas, Persianas y Telas Decorativas',
        parentTradeKey: 17,
        iconName: 'Blinds',
        description: 'Persianas enrollables, blackout, sheer elegante, cortinas y telas decorativas.',
        synonyms: ['cortinas', 'persianas', 'blackout', 'sheer elegante', 'panel japonés', 'telas decorativas', 'rieles de cortina', 'persiana'],
    },
]
