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
}

export const ListadoCategoriasTiendas: TiendaCategoryOption[] = [
    {
        key: 'ferreteria_general',
        label: 'Ferreterías General',
        parentTradeKey: 24,
        iconName: 'Hardware',
        description: 'Herramientas manuales, tornillería, fijaciones y suministros generales.',
    },
    {
        key: 'pinturas_insumos',
        label: 'Venta de Pinturas e Insumos',
        parentTradeKey: 62,
        iconName: 'FormatPaint',
        description: 'Pinturas arquitectónicas, esmaltes, brochas, rodillos y diluyentes.',
    },
    {
        key: 'perfileria_aluminio',
        label: 'Perfilería y Aluminio',
        parentTradeKey: 18,
        iconName: 'ViewSidebar',
        description: 'Perfiles de aluminio, rieles, accesorios para ventanería y fachadas.',
    },
    {
        key: 'vidrios_cristales',
        label: 'Vidrios y Cristalería',
        parentTradeKey: 18,
        iconName: 'Window',
        description: 'Vidrio templado, laminado, espejos y accesorios de fijación.',
    },
    {
        key: 'andamios_equipos',
        label: 'Alquiler y Venta de Andamios',
        parentTradeKey: 50, // Oficial de obra / Construcción
        iconName: 'Engineering',
        description: 'Andamios tubulares, multidireccionales, cortadoras y mezcladoras.',
    },
    {
        key: 'servicio_tecnico_herramientas',
        label: 'Servicio Técnico de Herramientas',
        parentTradeKey: 52, // Mantenimiento mecánico
        iconName: 'Build',
        description: 'Mantenimiento y repuestos de taladros, pulidoras y herramientas eléctricas.',
    },
    {
        key: 'cerrajeria_insumos',
        label: 'Cerrajería (Insumos y Chapas)',
        parentTradeKey: 13,
        iconName: 'Lock',
        description: 'Cerraduras de seguridad, cilindros, candados y dupicados.',
    },
    {
        key: 'tuberia_pvc_hidrosanitaria',
        label: 'Tubería y Accesorios PVC',
        parentTradeKey: 63, // Plomería
        iconName: 'Plumbing',
        description: 'Tubería de presión, sanitaria, conduit, limpiadores y soldadura PVC.',
    },
    {
        key: 'materiales_electricos',
        label: 'Materiales y Equipos Eléctricos',
        parentTradeKey: 66, // Red eléctrica
        iconName: 'ElectricMeter',
        description: 'Cableado, breakers, tableros, tomacorrientes y conduit metal/PVC.',
    },
    {
        key: 'iluminacion_lamparas',
        label: 'Iluminación y Lámparas',
        parentTradeKey: 37,
        iconName: 'Lightbulb',
        description: 'Luminarias LED, paneles, reflectores, tiras LED y lámparas decorativas.',
    },
    {
        key: 'gases_industriales_soldadura',
        label: 'Gases Industriales y Soldadura',
        parentTradeKey: 67, // Red de gases / Soldadura
        iconName: 'LocalGasStation',
        description: 'Oxígeno, argón, nitrógeno, electrodos, inversores y caretas de soldar.',
    },
    {
        key: 'pisos_ceramicas_porcelanatos',
        label: 'Cerámicas, Porcelanatos y Pisos',
        parentTradeKey: 33,
        iconName: 'GridOn',
        description: 'Pisos cerámicos, porcelanatos, laminados, vinílicos, pegantes y boquillas.',
    },
    {
        key: 'corte_dobleces_metalmecanica',
        label: 'Corte, Dobleces y Metalmecánica',
        parentTradeKey: 53,
        iconName: 'SquareFoot',
        description: 'Servicio de corte en cizalla, doblez de láminas, punzonado y tubos.',
    },
    {
        key: 'torno_mecanizado',
        label: 'Taller de Torno y Mecanizado',
        parentTradeKey: 53,
        iconName: 'PrecisionManufacturing',
        description: 'Mecanizado de piezas, bujes, roscas y rectificado industrial.',
    },
    {
        key: 'ornamentacion_hierro',
        label: 'Ornamentación y Perfiles de Hierro',
        parentTradeKey: 53,
        iconName: 'Fence',
        description: 'Perfiles de hierro, tubos estructurales, platinas, ángulos y mallas.',
    },
    {
        key: 'impermeabilizantes_aditivos',
        label: 'Venta de Impermeabilizantes',
        parentTradeKey: 38,
        iconName: 'WaterDrop',
        description: 'Mantos asfálticos, acrílicos, aditivos para concreto y selladores.',
    },
    {
        key: 'control_acceso_seguridad',
        label: 'Equipos de Control de Acceso',
        parentTradeKey: 23,
        iconName: 'Fingerprint',
        description: 'Cerraduras electrónicas, talanqueras, biometría y electroimanes.',
    },
    {
        key: 'domotica_smart_home',
        label: 'Dispositivos de Domótica',
        parentTradeKey: 28,
        iconName: 'SmartHome',
        description: 'Interruptores inteligentes, sensores Zigbee/WiFi y motores de cortinas.',
    },
    {
        key: 'maderas_tableros_herrajes',
        label: 'Maderas, Triplex y Herrajes',
        parentTradeKey: 17, // Carpintería
        iconName: 'Forest',
        description: 'Hojas de MDF, RH, triplex, canto PVC, bisagras y rieles telescópicos.',
    },
    {
        key: 'cubiertas_tejas_policarbonato',
        label: 'Tejas, Cubiertas y Policarbonato',
        parentTradeKey: 26, // Cubiertas y Techos
        iconName: 'Roofing',
        description: 'Tejas termoacústicas, policarbonato alveolar, zinc y accesorios.',
    },
    {
        key: 'camaras_cctv_alarmas',
        label: 'Equipos de Videovigilancia y CCTV',
        parentTradeKey: 10, // Cámaras de seguridad
        iconName: 'CameraOutdoor',
        description: 'Cámaras IP, DVR/NVR, disco duro para videovigilancia y sensores.',
    },
    {
        key: 'calentadores_repuestos',
        label: 'Calentadores y Repuestos',
        parentTradeKey: 13, // Calentadores
        iconName: 'DeviceThermostat',
        description: 'Calentadores a gas/eléctricos, mangueras, termostatos y diafragmas.',
    },
    {
        key: 'aislamiento_acustico_termico',
        label: 'Aislamiento Acústico y Térmico',
        parentTradeKey: 3,
        iconName: 'GraphicEq',
        description: 'Lana de roca, fibra de vidrio, espumas acústicas y paneles frescasa.',
    },
    {
        key: 'aseo_insumos_quimicos',
        label: 'Insumos y Químicos de Aseo',
        parentTradeKey: 11,
        iconName: 'CleaningServices',
        description: 'Desengrasantes industriales, ceras, selladores de pisos y maquinaria de aseo.',
    },
    {
        key: 'aires_acondicionados_repuestos',
        label: 'Aires Acondicionados y Repuestos',
        parentTradeKey: 2,
        iconName: 'AcUnit',
        description: 'Equipos Mini Split, tubería de cobre, gas refrigerante R410/R32 y soportes.',
    },
    {
        key: 'jardineria_insumos_abonos',
        label: 'Insumos de Jardinería y Abonos',
        parentTradeKey: 47, // Jardinería
        iconName: 'Grass',
        description: 'Tierra abonada, fertilizantes, grama sintética, mangueras y guadañas.',
    },
    {
        key: 'proteccion_incendio_extintores',
        label: 'Protección contra Incendio y Extintores',
        parentTradeKey: 65,
        iconName: 'FireExtinguisher',
        description: 'Recarga y venta de extintores, gabinetes, mangueras y detectores de humo.',
    },
    {
        key: 'redes_cableado_estructurado',
        label: 'Cableado Estructurado y Redes',
        parentTradeKey: 68,
        iconName: 'Lan',
        description: 'Cable UTP/Fibra, racks, patch panels, jacks RJ45 y switches.',
    },
]
