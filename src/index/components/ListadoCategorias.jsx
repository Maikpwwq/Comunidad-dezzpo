export { ListadoCategorias }

import DomainDisabledIcon from '@mui/icons-material/DomainDisabled'
import GraphicEqIcon from '@mui/icons-material/GraphicEq'
import HouseSidingIcon from '@mui/icons-material/HouseSiding'
import HardwareIcon from '@mui/icons-material/Hardware'
import ArchitectureIcon from '@mui/icons-material/Architecture'
import HandshakeIcon from '@mui/icons-material/Handshake'
import ConstructionIcon from '@mui/icons-material/Construction'
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing'
import CarpenterIcon from '@mui/icons-material/Carpenter'
import SquareFootIcon from '@mui/icons-material/SquareFoot'
import VpnKeyIcon from '@mui/icons-material/VpnKey'
import BusinessIcon from '@mui/icons-material/Business'
import FingerprintIcon from '@mui/icons-material/Fingerprint'
import PestControlRodentIcon from '@mui/icons-material/PestControlRodent'
import DrawIcon from '@mui/icons-material/Draw'
import SensorsIcon from '@mui/icons-material/Sensors'
import FloodIcon from '@mui/icons-material/Flood'
import ElectricMeterIcon from '@mui/icons-material/ElectricMeter'
import FoundationIcon from '@mui/icons-material/Foundation'
import HubIcon from '@mui/icons-material/Hub'
import GasMeterIcon from '@mui/icons-material/GasMeter'
import WaterDamageIcon from '@mui/icons-material/WaterDamage'
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle'
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt'
import DesignServicesIcon from '@mui/icons-material/DesignServices'
import RoofingIcon from '@mui/icons-material/Roofing'
import ForestIcon from '@mui/icons-material/Forest'
import SensorWindowIcon from '@mui/icons-material/SensorWindow'
import LocalFloristIcon from '@mui/icons-material/LocalFlorist'
import LocalLaundryServiceIcon from '@mui/icons-material/LocalLaundryService'
import CleaningServicesIcon from '@mui/icons-material/CleaningServices'
import EngineeringIcon from '@mui/icons-material/Engineering'
import BuildIcon from '@mui/icons-material/Build'
import MoveUpIcon from '@mui/icons-material/MoveUp'
import EmojiTransportationIcon from '@mui/icons-material/EmojiTransportation'
import LandscapeIcon from '@mui/icons-material/Landscape'
import FormatPaintIcon from '@mui/icons-material/FormatPaint'
import PlumbingIcon from '@mui/icons-material/Plumbing'
import LanIcon from '@mui/icons-material/Lan'
import KitchenIcon from '@mui/icons-material/Kitchen'
import BathroomIcon from '@mui/icons-material/Bathroom'
import PoolIcon from '@mui/icons-material/Pool'
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService'
import DryCleaningIcon from '@mui/icons-material/DryCleaning'
import CameraOutdoorIcon from '@mui/icons-material/CameraOutdoor'
import BathtubIcon from '@mui/icons-material/Bathtub'
import ChairIcon from '@mui/icons-material/Chair'
import HandymanIcon from '@mui/icons-material/Handyman'
import TungstenIcon from '@mui/icons-material/Tungsten'
import ThermostatAutoIcon from '@mui/icons-material/ThermostatAuto'
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat'
import BlenderIcon from '@mui/icons-material/Blender'
import DeckIcon from '@mui/icons-material/Deck'
import ElectricalServicesIcon from '@mui/icons-material/ElectricalServices'
import WaterIcon from '@mui/icons-material/Water'
import CheckroomIcon from '@mui/icons-material/Checkroom'
import ControlCameraIcon from '@mui/icons-material/ControlCamera'
import CottageIcon from '@mui/icons-material/Cottage'
import DeskIcon from '@mui/icons-material/Desk'
import BorderBottomIcon from '@mui/icons-material/BorderBottom'

const ListadoCategorias = [
    {
        key: 0,
        label: 'Acabados en muros',
        rol: 'Afinadores de muros y acabados',
        variant: 'outlined',
        icon: <HouseSidingIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 1,
        label: 'Administración PH',
        rol: 'Administradores PH',
        variant: 'outlined',
        icon: <DomainDisabledIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 2,
        label: 'Aires Acondicionados',
        rol: 'Técnicos de aires Acondicionados',
        variant: 'outlined',
        icon: <DeviceThermostatIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 3,
        label: 'Aislamiento acústico',
        rol: 'Aisladores acústicos',
        variant: 'outlined',
        icon: <GraphicEqIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 4,
        label: 'Albañilería',
        rol: 'Albañiles',
        variant: 'outlined',
        icon: <HardwareIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 5,
        label: 'Alfombras',
        rol: 'Alfombristas',
        variant: 'outlined',
        icon: <BorderBottomIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 6,
        label: 'Arquitectura',
        rol: 'Arquitectos',
        variant: 'outlined',
        icon: <ArchitectureIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 7,
        label: 'Armarios y closets',
        rol: 'Técnicos de armarios y closets',
        variant: 'outlined',
        icon: <CheckroomIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 8,
        label: 'Artesanías y manualidades ',
        rol: 'Artesanos',
        variant: 'outlined',
        icon: <HandshakeIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 9,
        label: 'Asistencia toderos',
        rol: 'Toderos',
        variant: 'outlined',
        icon: <ConstructionIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 10,
        label: 'Ascensores',
        rol: 'Toderos',
        variant: 'outlined',
        icon: <ConstructionIcon fontSize="medium" className="mx-2 my-1" />, // Change
    },
    {
        key: 11,
        label: 'Aseo Hogar y Oficina',
        rol: 'Aseadores',
        variant: 'outlined',
        icon: <CleaningServicesIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 12,
        label: 'Automatización',
        rol: 'Técnico en automatización',
        variant: 'outlined',
        icon: (
            <PrecisionManufacturingIcon
                fontSize="medium"
                className="mx-2 my-1"
            />
        ),
    },
    {
        key: 13,
        label: 'Calentadores',
        rol: 'Técnicos de calentadores',
        variant: 'outlined',
        icon: <ThermostatAutoIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 14,
        label: 'Camaras de seguridad',
        rol: 'Técnicos de camaras de seguridad',
        variant: 'outlined',
        icon: <ThermostatAutoIcon fontSize="medium" className="mx-2 my-1" />, // Change
    },
    {
        key: 15,
        label: 'Canales y bajantes',
        rol: 'Técnicos de canales y bajantes',
        variant: 'outlined',
        icon: <ThermostatAutoIcon fontSize="medium" className="mx-2 my-1" />, // Change
    },
    {
        key: 16,
        label: 'Carpintería',
        rol: 'Carpinteros',
        variant: 'outlined',
        icon: <CarpenterIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 17,
        label: 'Carpintería en aluminio',
        rol: 'Carpinteros del aluminio',
        variant: 'outlined',
        icon: <SquareFootIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 18,
        label: 'Cerrajería',
        rol: 'Cerrajeros',
        variant: 'outlined',
        icon: <VpnKeyIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 19,
        label: 'Chimeneas',
        rol: 'Técnicos de chimeneas',
        variant: 'outlined',
        icon: <CottageIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 20,
        label: 'Cocinas integrales',
        rol: 'Técnicos de Cocinas integrales',
        variant: 'outlined',
        icon: <BusinessIcon fontSize="medium" className="mx-2 my-1" />, // Change
    },
    {
        key: 21,
        label: 'Construcción civil',
        rol: 'Constructora civil',
        variant: 'outlined',
        icon: <BusinessIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 22,
        label: 'Control de acceso',
        rol: 'Integradores Control de acceso',
        variant: 'outlined',
        icon: <FingerprintIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 23,
        label: 'Control de plagas',
        rol: 'Controladores de plagas',
        variant: 'outlined',
        icon: <PestControlRodentIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 24,
        label: 'Cortinas',
        rol: 'Técnicos de Cortinas',
        variant: 'outlined',
        icon: <PestControlRodentIcon fontSize="medium" className="mx-2 my-1" />, // Change
    },
    {
        key: 25,
        label: 'Cubiertas y Techos',
        rol: 'Técnicos de cubiertas y techos',
        variant: 'outlined',
        icon: <RoofingIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 26,
        label: 'Diseño e impresión',
        rol: 'Centros de diseño grafico',
        variant: 'outlined',
        icon: <DrawIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 27,
        label: 'Domótica',
        rol: 'Técnico en domótica',
        variant: 'outlined',
        icon: <SensorsIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 28,
        label: 'Destape drenajes',
        rol: 'Técnico en drenajes',
        variant: 'outlined',
        icon: <WaterIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 29,
        label: 'Inundaciones',
        rol: 'Técnico en inundaciones',
        variant: 'outlined',
        icon: <FloodIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 30,
        label: 'Electrodomésticos línea blanca',
        rol: 'Técnico en electrodomésticos línea blanca',
        variant: 'outlined',
        icon: <BlenderIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 31,
        label: 'Electrodomésticos línea marrón',
        rol: 'Técnico en electrodomésticos línea marrón',
        variant: 'outlined',
        icon: (
            <ElectricalServicesIcon fontSize="medium" className="mx-2 my-1" />
        ),
    },
    {
        key: 32,
        label: 'Ensamblado de muebles',
        rol: 'Técnico en ensamblaje de muebles',
        variant: 'outlined',
        icon: <DeskIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 33,
        label: 'Estudios de suelos',
        rol: 'Geólogos',
        variant: 'outlined',
        icon: <FoundationIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 34,
        label: 'Ferreterías',
        rol: 'Ferreteros',
        variant: 'outlined',
        icon: <HubIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 35,
        label: 'Gasodomésticos',
        rol: 'Técnicos en gasodomésticos',
        variant: 'outlined',
        icon: <GasMeterIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 36,
        label: 'Iluminación',
        rol: 'Técnicos en iluminación',
        variant: 'outlined',
        icon: <TungstenIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 37,
        label: 'Impermeabilización',
        rol: 'Técnicos en impermeabilizaciones',
        variant: 'outlined',
        icon: <WaterDamageIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 38,
        label: 'Instalación de adoquín',
        rol: 'Instaladores de Adoquín',
        variant: 'outlined',
        icon: (
            <SupervisedUserCircleIcon fontSize="medium" className="mx-2 my-1" />
        ),
    },
    {
        key: 39,
        label: 'Instalación de cerámica',
        rol: 'Instaladores de cerámica',
        variant: 'outlined',
        icon: <DesignServicesIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 40,
        label: 'Instalación pisos deck',
        rol: 'Técnicos de pisos deck',
        variant: 'outlined',
        icon: <DeckIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 41,
        label: 'Instalación pisos PVC',
        rol: 'Técnicos de pisos PVC',
        variant: 'outlined',
        icon: <DeckIcon fontSize="medium" className="mx-2 my-1" />, // Change
    },
    {
        key: 42,
        label: 'Instalación de parques',
        rol: 'Técnicos de parques',
        variant: 'outlined',
        icon: <ForestIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 43,
        label: 'Instalación de pisos laminados',
        rol: 'Técnicos de pisos laminados',
        variant: 'outlined',
        icon: <SquareFootIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 44,
        label: 'Instalación de porcelanatos',
        rol: 'Instaladores de porcelanatos',
        variant: 'outlined',
        icon: <ControlCameraIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 45,
        label: 'Instalación de soportes y bases para TV',
        rol: 'Instaladores de soportes y bases para TV',
        variant: 'outlined',
        icon: <HardwareIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 46,
        label: 'Instalación de ventanas',
        rol: 'Instaladores de ventanas',
        variant: 'outlined',
        icon: <SensorWindowIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 47,
        label: 'Jardinería',
        rol: 'Jardineros',
        variant: 'outlined',
        icon: <LocalFloristIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 48,
        label: 'Lavandería',
        rol: 'Lavanderías',
        variant: 'outlined',
        icon: (
            <LocalLaundryServiceIcon fontSize="medium" className="mx-2 my-1" />
        ),
    },
    {
        key: 49,
        label: 'Limpiezas técnicas',
        rol: 'Técnicos de Limpiezas técnicas',
        variant: 'outlined',
        icon: <CleaningServicesIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 50,
        label: 'Oficial de Obra',
        rol: 'Oficiales de Obra',
        variant: 'outlined',
        icon: <EngineeringIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 51,
        label: 'Mantenimiento locativo',
        rol: 'Técnicos de mantenimiento locativo',
        variant: 'outlined',
        icon: <BuildIcon fontSize="medium" className="mx-2 my-1" />, // Change
    },
    {
        key: 52,
        label: 'Mantenimiento mecanico',
        rol: 'Técnicos de mantenimiento mecanico',
        variant: 'outlined',
        icon: <BuildIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 53,
        label: 'Metálmecanica',
        rol: 'Técnicos en metálmecanica',
        variant: 'outlined',
        icon: <SquareFootIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 54,
        label: 'Muebles',
        rol: 'Técnicos en muebles',
        variant: 'outlined',
        icon: <MoveUpIcon fontSize="medium" className="mx-2 my-1" />, // Change
    },
    {
        key: 55,
        label: 'Movilizar pesos',
        rol: 'Ayudantes de movilizaciones',
        variant: 'outlined',
        icon: <MoveUpIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 56,
        label: 'Mudanzas',
        rol: 'Ayudantes de mudanzas',
        variant: 'outlined',
        icon: (
            <EmojiTransportationIcon fontSize="medium" className="mx-2 my-1" />
        ),
    },
    {
        key: 57,
        label: 'Obra Liviana',
        rol: 'Técnicos de obra liviana',
        variant: 'outlined',
        icon: <BusinessIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 58,
        label: 'Paisajismo',
        rol: 'Paisajistas',
        variant: 'outlined',
        icon: <LandscapeIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 59,
        label: 'Pañetes y estucos',
        rol: 'Técnicos de pañete y estuco',
        variant: 'outlined',
        icon: <LandscapeIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 60,
        label: 'Pergolas',
        rol: 'Técnicos de pergolas',
        variant: 'outlined',
        icon: <FormatPaintIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 61,
        label: 'Persianas enrollables Blackout',
        rol: 'Técnicos de Persianas enrollables Blackout',
        variant: 'outlined',
        icon: <PestControlRodentIcon fontSize="medium" className="mx-2 my-1" />, // Change
    },
    {
        key: 62,
        label: 'Pintura',
        rol: 'Pintores',
        variant: 'outlined',
        icon: <FormatPaintIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 63,
        label: 'Plomería',
        rol: 'Plomeros',
        variant: 'outlined',
        icon: <PlumbingIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 64,
        label: 'Pozos sépticos y trampas de grasas',
        rol: 'Técnicos en pozos sépticos y trampas de grasas',
        variant: 'outlined',
        icon: <PlumbingIcon fontSize="medium" className="mx-2 my-1" />, // Change 
    },
    {
        key: 65,
        label: 'Protección contra incendio',
        rol: 'Técnicos en protección contra incendio',
        variant: 'outlined',
        icon: <ElectricMeterIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 66,
        label: 'Red electrica',
        rol: 'Electricistas',
        variant: 'outlined',
        icon: <ElectricMeterIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 67,
        label: 'Red de gases',
        rol: 'Técnicos de red de gases',
        variant: 'outlined',
        icon: <ElectricMeterIcon fontSize="medium" className="mx-2 my-1" />, // Change
    },    
    {
        key: 68,
        label: 'Redes de cableado estructurado',
        rol: 'Tecnicos de redes de cableado estructurado',
        variant: 'outlined',
        icon: <LanIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 69,
        label: 'Redes de telecomunicaciones',
        rol: 'Técnicos de red de telecomunicaciones',
        variant: 'outlined',
        icon: <ChairIcon fontSize="medium" className="mx-2 my-1" />, // Change
    },
    {
        key: 70,
        label: 'Redes hidrosanitarias',
        rol: 'Técnicos de redes hidrosanitarias',
        variant: 'outlined',
        icon: <KitchenIcon fontSize="medium" className="mx-2 my-1" />, // Change
    },
    {
        key: 71,
        label: 'Reformas Cocinas',
        rol: 'Instaladores Cocinas',
        variant: 'outlined',
        icon: <KitchenIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 72,
        label: 'Reformas Baños',
        rol: 'Instaladores Baños',
        variant: 'outlined',
        icon: <BathroomIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 73,
        label: 'Reformas Piscinas',
        rol: 'Reparadores de piscinas',
        variant: 'outlined',
        icon: <PoolIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 74,
        label: 'Refrigeración',
        rol: 'Técnico en refrigeración',
        variant: 'outlined',
        icon: <HomeRepairServiceIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 75,
        label: 'Servicio doméstico',
        rol: 'Asistentes de servicio domestico',
        variant: 'outlined',
        icon: <DryCleaningIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 76,
        label: 'Sistemas de Seguridad y alarmas',
        rol: 'Técnico en seguridad electrónica',
        variant: 'outlined',
        icon: <CameraOutdoorIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 77,
        label: 'Soldadura',
        rol: 'Técnicos en soldadura',
        variant: 'outlined',
        icon: <SquareFootIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 78,
        label: 'Tanques de agua',
        rol: 'Técnicos de Tanques de agua',
        variant: 'outlined',
        icon: <BathtubIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 79,
        label: 'Tapicería',
        rol: 'Tapiceros',
        variant: 'outlined',
        icon: <ChairIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 80,
        label: 'Techos PVC',
        rol: 'Técnicos de techos PVC',
        variant: 'outlined',
        icon: <ChairIcon fontSize="medium" className="mx-2 my-1" />, // Change
    },
    {
        key: 81,
        label: 'Trabajos en piedra',
        rol: 'Trabajadores de piedras',
        variant: 'outlined',
        icon: <HandymanIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 82,
        label: 'Trasiego de escombros',
        rol: 'Técnicos de trasiego de escombros',
        variant: 'outlined',
        icon: <HandymanIcon fontSize="medium" className="mx-2 my-1" />, // Change
    },
]
