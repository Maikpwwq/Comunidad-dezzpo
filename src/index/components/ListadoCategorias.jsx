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

const ListadoCategorias = [
    {
        key: 0,
        label: 'Administraciones PH',
        rol: 'Administradores PH',
        variant: 'outlined',
        icon: <DomainDisabledIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 1,
        label: 'Aislamiento acústico',
        rol: 'Aisladores acústicos',
        variant: 'outlined',
        icon: <GraphicEqIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 2,
        label: 'Acabados en muros',
        rol: 'Afinadores de muros y acabados',
        variant: 'outlined',
        icon: <HouseSidingIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 3,
        label: 'Albañilería',
        rol: 'Albañiles',
        variant: 'outlined',
        icon: <HardwareIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 4,
        label: 'Arquitectura',
        rol: 'Arquitectos',
        variant: 'outlined',
        icon: <ArchitectureIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 5,
        label: 'Artesanías y manualidades ',
        rol: 'Artesanos',
        variant: 'outlined',
        icon: <HandshakeIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 6,
        label: 'Asistencia toderos',
        rol: 'Toderos',
        variant: 'outlined',
        icon: <ConstructionIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 7,
        label: 'Automatización',
        rol: 'Técnico en automatización',
        variant: 'outlined',
        icon: <PrecisionManufacturingIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 8,
        label: 'Carpintería',
        rol: 'Carpinteros',
        variant: 'outlined',
        icon: <CarpenterIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 9,
        label: 'Carpintería en aluminio',
        rol: 'Carpinteros del aluminio',
        variant: 'outlined',
        icon: <SquareFootIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 10,
        label: 'Carpintería metálica',
        rol: 'Carpinteros de metales',
        variant: 'outlined',
        icon: <SquareFootIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 11,
        label: 'Cerrajería',
        rol: 'Cerrajeros',
        variant: 'outlined',
        icon: <VpnKeyIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 12,
        label: 'Construcción obra',
        rol: 'Constructoras',
        variant: 'outlined',
        icon: <BusinessIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 13,
        label: 'Control de acceso',
        rol: 'Integradores Control de acceso',
        variant: 'outlined',
        icon: <FingerprintIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 14,
        label: 'Control de plagas',
        rol: 'Controladores de plagas',
        variant: 'outlined',
        icon: <PestControlRodentIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 15,
        label: 'Diseño e impresión',
        rol: 'Centros de diseño grafico',
        variant: 'outlined',
        icon: <DrawIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 16,
        label: 'Domótica',
        rol: 'Técnico en domótica',
        variant: 'outlined',
        icon: <SensorsIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 17,
        label: 'Drenajes e inundaciones',
        rol: 'Técnico en drenajes e inundaciones',
        variant: 'outlined',
        icon: <FloodIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 18,
        label: 'Electricidad',
        rol: 'Electricistas',
        variant: 'outlined',
        icon: <ElectricMeterIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 19,
        label: 'Estudios de suelos',
        rol: 'Geólogos',
        variant: 'outlined',
        icon: <FoundationIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 20,
        label: 'Ferreterías',
        rol: 'Ferreteros',
        variant: 'outlined',
        icon: <HubIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 21,
        label: 'Gasodomésticos',
        rol: 'Técnico en gasodomésticos',
        variant: 'outlined',
        icon: <GasMeterIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 22,
        label: 'Impermeabilización',
        rol: 'Impermeabilizadores',
        variant: 'outlined',
        icon: <WaterDamageIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 23,
        label: 'Instalación de adoquín',
        rol: 'Instaladores de Adoquín',
        variant: 'outlined',
        icon: <SupervisedUserCircleIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 24,
        label: 'Instalación de cableado estructurado',
        rol: 'Instaladores de cableado estructurado',
        variant: 'outlined',
        icon: <ElectricBoltIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 25,
        label: 'Instalación de cerámica',
        rol: 'Instaladores de cerámica',
        variant: 'outlined',
        icon: <DesignServicesIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 26,
        label: 'Instalación de cubiertas',
        rol: 'Instaladores de cubiertas',
        variant: 'outlined',
        icon: <RoofingIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 27,
        label: 'Instalación de parques',
        rol: 'Instaladores de parques',
        variant: 'outlined',
        icon: <ForestIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 28,
        label: 'Instalación de ventanas',
        rol: 'Instaladores de ventanas',
        variant: 'outlined',
        icon: <SensorWindowIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 29,
        label: 'Jardinería',
        rol: 'Jardineros',
        variant: 'outlined',
        icon: <LocalFloristIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 30,
        label: 'Lavandería',
        rol: 'Lavanderías',
        variant: 'outlined',
        icon: <LocalLaundryServiceIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 31,
        label: 'Limpiezas técnicas',
        rol: 'Técnicos de Limpiezas técnicas',
        variant: 'outlined',
        icon: <CleaningServicesIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 32,
        label: 'Maestro Obra',
        rol: 'Maestros de Obra',
        variant: 'outlined',
        icon: <EngineeringIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 33,
        label: 'Mecanica',
        rol: 'Mecanicos',
        variant: 'outlined',
        icon: <BuildIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 34,
        label: 'Movilizar pesos',
        rol: 'Ayudantes de movilizaciones',
        variant: 'outlined',
        icon: <MoveUpIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 35,
        label: 'Mudanzas',
        rol: 'Ayudantes de mudanzas',
        variant: 'outlined',
        icon: <EmojiTransportationIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 36,
        label: 'Paisajismo',
        rol: 'Paisajistas',
        variant: 'outlined',
        icon: <LandscapeIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 37,
        label: 'Pintura',
        rol: 'Pintores',
        variant: 'outlined',
        icon: <FormatPaintIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 38,
        label: 'Plomería',
        rol: 'Plomeros',
        variant: 'outlined',
        icon: <PlumbingIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 39,
        label: 'Redes cableado estructurado',
        rol: 'Tecnicos de redes',
        variant: 'outlined',
        icon: <LanIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 40,
        label: 'Reformas Cocinas',
        rol: 'Instaladores Cocinas',
        variant: 'outlined',
        icon: <KitchenIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 41,
        label: 'Reformas Baños',
        rol: 'Instaladores Baños',
        variant: 'outlined',
        icon: <BathroomIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 42,
        label: 'Reformas Piscinas',
        rol: 'Reparadores de piscinas',
        variant: 'outlined',
        icon: <PoolIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 43,
        label: 'Refrigeración',
        rol: 'Técnico en refrigeración',
        variant: 'outlined',
        icon: <HomeRepairServiceIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 44,
        label: 'Servicio doméstico',
        rol: 'Asistentes de servicio domestico',
        variant: 'outlined',
        icon: <DryCleaningIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 45,
        label: 'Sistemas de Seguridad y alarmas',
        rol: 'Técnico en seguridad electrónica',
        variant: 'outlined',
        icon: <CameraOutdoorIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 46,
        label: 'Tanques de agua',
        rol: 'Técnicos de Tanques de agua',
        variant: 'outlined',
        icon: <BathtubIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 47,
        label: 'Tapicería',
        rol: 'Tapiceros',
        variant: 'outlined',
        icon: <ChairIcon fontSize="medium" className="mx-2 my-1" />,
    },
    {
        key: 48,
        label: 'Trabajos en piedra',
        rol: 'Trabajadores de piedras',
        variant: 'outlined',
        icon: <HandymanIcon fontSize="medium" className="mx-2 my-1" />,
    },
]
