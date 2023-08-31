import * as React from 'react'
import Button from '@mui/material/Button'
import { useTheme } from '@mui/material/styles'
import Row from 'react-bootstrap/Row'
import Box from '@mui/material/Box'
import MobileStepper from '@mui/material/MobileStepper'
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight'
import SwipeableViews from 'react-swipeable-views'
import { autoPlay, bindKeyboard } from 'react-swipeable-views-utils' //  virtualize,

import PopularCerrajeria from '#@/assets/img/Cerrajeria.png'
import PopularCarpinteria from '#@/assets/img/Carpinteria.png'
import PopularPintura from '#@/assets/img/Pintura.png'

const AutoPlaySwipeableViews = bindKeyboard(autoPlay(SwipeableViews))

const AcabadosMuros =
    'https://firebasestorage.googleapis.com/v0/b/app-comunidad-dezzpo.appspot.com/o/site%2Fcategories%2FAcabados%20en%20muros.jpg?alt=media&token=359cc772-d837-4984-8d71-2478bcbf3c7c'
const AcabadosMuros2 =
    'https://firebasestorage.googleapis.com/v0/b/app-comunidad-dezzpo.appspot.com/o/site%2Fcategories%2FAcabados%20en%20muros2.jpg?alt=media&token=4c440c1e-4eab-425f-9bad-7b3e3a0812e9'
const AcabadosMuros3 =
    'https://firebasestorage.googleapis.com/v0/b/app-comunidad-dezzpo.appspot.com/o/site%2Fcategories%2FAcabados%20en%20muros3.jpg?alt=media&token=0f1256e0-4991-446f-acf9-cf405febb858'
const AcabadosMuros4 =
    'https://firebasestorage.googleapis.com/v0/b/app-comunidad-dezzpo.appspot.com/o/site%2Fcategories%2FAcabados%20en%20muros4.webp?alt=media&token=289a60f0-72fa-4c0d-9c9b-4ad335acb248'
const AdministrarPH =
    'https://firebasestorage.googleapis.com/v0/b/app-comunidad-dezzpo.appspot.com/o/site%2Fcategories%2FAdministrarPH.jpg?alt=media&token=eb39e941-0801-4709-8948-1b37fb3c00bb'
const AdministrarPH2 =
    'https://firebasestorage.googleapis.com/v0/b/app-comunidad-dezzpo.appspot.com/o/site%2Fcategories%2FAdministrarPH2.jpg?alt=media&token=98e61ca0-9760-427e-b63c-2b886601a031'
const AislamientoAcustico =
    'https://firebasestorage.googleapis.com/v0/b/app-comunidad-dezzpo.appspot.com/o/site%2Fcategories%2FAislamientoAc%C3%BAstico.jpg?alt=media&token=f258faa7-3d9d-4ca5-86bf-e26bd52a092d'
const Albañileria =
    'https://firebasestorage.googleapis.com/v0/b/app-comunidad-dezzpo.appspot.com/o/site%2Fcategories%2FAlba%C3%B1iler%C3%ADa.jpg?alt=media&token=d3a459ef-f6e0-4586-9bec-f9ba74ac9156'
const Alfombras =
    'https://firebasestorage.googleapis.com/v0/b/app-comunidad-dezzpo.appspot.com/o/site%2Fcategories%2FAlfombras.webp?alt=media&token=b7f8e745-515c-4a1f-b448-acbb3db44fb8'
const Arquitectura =
    'https://firebasestorage.googleapis.com/v0/b/app-comunidad-dezzpo.appspot.com/o/site%2Fcategories%2FArquitectura.webp?alt=media&token=8c729aa6-0cce-4f98-a4c1-b18227b72d66'
const ArtesaniasManualidades =
    'https://firebasestorage.googleapis.com/v0/b/app-comunidad-dezzpo.appspot.com/o/site%2Fcategories%2FArtesan%C3%ADas%20y%20manualidades.webp?alt=media&token=4a61c1bf-2314-40fb-8312-ef602f84a7a0'
const ArtesaniasManualidades2 =
    'https://firebasestorage.googleapis.com/v0/b/app-comunidad-dezzpo.appspot.com/o/site%2Fcategories%2FArtesan%C3%ADas%20y%20manualidades2.jpg?alt=media&token=c68a4934-4f02-4191-9da8-2196c26f949d'
const AutomatizacionDomotica =
    'https://firebasestorage.googleapis.com/v0/b/app-comunidad-dezzpo.appspot.com/o/site%2Fcategories%2FAutomatizaci%C3%B3nDomotica.jpg?alt=media&token=a7ab6b66-6866-4620-bf80-3196baef6c66'
const AutomatizacionDomotica2 =
    'https://firebasestorage.googleapis.com/v0/b/app-comunidad-dezzpo.appspot.com/o/site%2Fcategories%2FAutomatizaci%C3%B3nDomotica2.jpg?alt=media&token=81b71879-9cfe-4d7c-b1b0-a13d10de24fd'
const AutomatizacionDomotica3 =
    'https://firebasestorage.googleapis.com/v0/b/app-comunidad-dezzpo.appspot.com/o/site%2Fcategories%2FAutomatizaci%C3%B3nDomotica3.jpg?alt=media&token=1504a356-c7af-4dfe-99ae-c469b399b9bc'
const CarpinteriaAluminio =
    'https://firebasestorage.googleapis.com/v0/b/app-comunidad-dezzpo.appspot.com/o/site%2Fcategories%2FAutomatizaci%C3%B3nDomotica3.jpg?alt=media&token=1504a356-c7af-4dfe-99ae-c469b399b9bc'
const CarpinteriaMetalica =
    'https://firebasestorage.googleapis.com/v0/b/app-comunidad-dezzpo.appspot.com/o/site%2Fcategories%2FCarpinter%C3%ADa%20met%C3%A1lica.webp?alt=media&token=de58cbfa-337a-41bc-b153-af060b714f1f'
const CarpinteriaMetalica2 =
    'https://firebasestorage.googleapis.com/v0/b/app-comunidad-dezzpo.appspot.com/o/site%2Fcategories%2FCarpinter%C3%ADa%20met%C3%A1lica2.jpg?alt=media&token=c3aed744-e0c6-4ec3-9317-b6497caeb20c'
const CarpinteriaMetalica3 =
    'https://firebasestorage.googleapis.com/v0/b/app-comunidad-dezzpo.appspot.com/o/site%2Fcategories%2FCarpinter%C3%ADa%20met%C3%A1lica3.jpg?alt=media&token=6d554afc-d739-4da4-a476-586ac9ee739e'
const Carpinteria =
    'https://firebasestorage.googleapis.com/v0/b/app-comunidad-dezzpo.appspot.com/o/site%2Fcategories%2FCarpinter%C3%ADa.webp?alt=media&token=7f728918-20d5-49b2-b6a5-ce5755fc6e07'
const Carpinteria2 =
    'https://firebasestorage.googleapis.com/v0/b/app-comunidad-dezzpo.appspot.com/o/site%2Fcategories%2FCarpinter%C3%ADa2.jpg?alt=media&token=5350cdf2-996d-49f3-9e59-0b1374c5cb96'
const Cerrajeria =
    'https://firebasestorage.googleapis.com/v0/b/app-comunidad-dezzpo.appspot.com/o/site%2Fcategories%2FCerrajer%C3%ADa.jpg?alt=media&token=aa459d82-c97e-49c5-8c6a-180c24acef94'
const ConstruccionObra =
    'https://firebasestorage.googleapis.com/v0/b/app-comunidad-dezzpo.appspot.com/o/site%2Fcategories%2FConstrucci%C3%B3n%20obra.jpg?alt=media&token=b7def741-65c5-4015-a77d-051c1292d30a'
const ConstruccionObra2 =
    'https://firebasestorage.googleapis.com/v0/b/app-comunidad-dezzpo.appspot.com/o/site%2Fcategories%2FConstrucci%C3%B3n%20obra2.jpg?alt=media&token=11748e88-2aa1-421a-a55b-5b7469470fc0'
const ConstruccionObra3 =
    'https://firebasestorage.googleapis.com/v0/b/app-comunidad-dezzpo.appspot.com/o/site%2Fcategories%2FConstrucci%C3%B3n%20obra3.webp?alt=media&token=d0a8aa64-ccd3-4214-9497-1c0b27ba3b11'
const ControlAcceso =
    'https://firebasestorage.googleapis.com/v0/b/app-comunidad-dezzpo.appspot.com/o/site%2Fcategories%2FControl%20de%20acceso.jpg?alt=media&token=62d76a9d-6777-4e8a-bb23-da0b1f514b1a'
const ControlAcceso2 =
    'https://firebasestorage.googleapis.com/v0/b/app-comunidad-dezzpo.appspot.com/o/site%2Fcategories%2FControl%20de%20acceso2.jpg?alt=media&token=32e98964-cb04-44f1-98d7-4188ccfe8c8e'
const ControlPlagas =
    'https://firebasestorage.googleapis.com/v0/b/app-comunidad-dezzpo.appspot.com/o/site%2Fcategories%2FControl%20de%20plagas.jpg?alt=media&token=d33abb56-1491-47bd-9cb3-f3f71b0f3c4c'
const ControlPlagas2 =
    'https://firebasestorage.googleapis.com/v0/b/app-comunidad-dezzpo.appspot.com/o/site%2Fcategories%2FControl%20de%20plagas.webp?alt=media&token=fcc0ffac-e36a-42b4-9098-4769a4ec2066'
const ControlPlagas3 =
    'https://firebasestorage.googleapis.com/v0/b/app-comunidad-dezzpo.appspot.com/o/site%2Fcategories%2FControl%20de%20plagas2.webp?alt=media&token=12601a99-0fe6-445d-ae44-6d7f616b7e54'
const Demoliciones =
    'https://firebasestorage.googleapis.com/v0/b/app-comunidad-dezzpo.appspot.com/o/site%2Fcategories%2FDemoliciones.jpg?alt=media&token=b0d8759e-2f6f-44c7-8ea2-39408682f2fb'
const DiseñoImpresion =
    'https://firebasestorage.googleapis.com/v0/b/app-comunidad-dezzpo.appspot.com/o/site%2Fcategories%2FDise%C3%B1o%20e%20impresi%C3%B3n.webp?alt=media&token=5aed9957-083a-47ad-bef4-e85bf6de1116'
const DiseñoImpresion2 =
    'https://firebasestorage.googleapis.com/v0/b/app-comunidad-dezzpo.appspot.com/o/site%2Fcategories%2FDise%C3%B1o%20e%20impresi%C3%B3n2.webp?alt=media&token=d46c33d1-cb72-4499-a19d-281e4fe2baa9'
const DiseñoImpresion3 =
    'https://firebasestorage.googleapis.com/v0/b/app-comunidad-dezzpo.appspot.com/o/site%2Fcategories%2FDise%C3%B1o%20e%20impresi%C3%B3n3.webp?alt=media&token=6c965099-f587-4a30-95db-e2d69929c391'
const DrenajesInundaciones =
    'https://firebasestorage.googleapis.com/v0/b/app-comunidad-dezzpo.appspot.com/o/site%2Fcategories%2FDrenajes%20e%20inundaciones.jpg?alt=media&token=05dce332-5ffc-48eb-9f26-a1bde3295797'
const DrenajesInundaciones2 =
    'https://firebasestorage.googleapis.com/v0/b/app-comunidad-dezzpo.appspot.com/o/site%2Fcategories%2FDrenajes%20e%20inundaciones2.jpg?alt=media&token=1c670753-1d7e-489e-b781-8f3d2cf46a40'
const DrenajesInundaciones3 =
    'https://firebasestorage.googleapis.com/v0/b/app-comunidad-dezzpo.appspot.com/o/site%2Fcategories%2FDrenajes%20e%20inundaciones4.jpg?alt=media&token=a4c22fbc-3952-47b5-b05d-d17ce5156648'
const Electricidad =
    'https://firebasestorage.googleapis.com/v0/b/app-comunidad-dezzpo.appspot.com/o/site%2Fcategories%2FElectricidad.jpg?alt=media&token=375f9261-f652-4a63-a9d8-f75cf39b162c'
const Electricidad2 =
    'https://firebasestorage.googleapis.com/v0/b/app-comunidad-dezzpo.appspot.com/o/site%2Fcategories%2FElectricidad2.webp?alt=media&token=07ce19d7-176e-4373-9578-8722b8fcbdee'
const Electricidad3 =
    'https://firebasestorage.googleapis.com/v0/b/app-comunidad-dezzpo.appspot.com/o/site%2Fcategories%2FElectricidad3.webp?alt=media&token=53696b2e-56fe-4f15-b06f-76157e115f70'
const Electricista =
    'https://firebasestorage.googleapis.com/v0/b/app-comunidad-dezzpo.appspot.com/o/site%2Fcategories%2FElectricista.jpg?alt=media&token=e9bd6607-e625-4efb-ac9e-4f2312437b79'
const Electricista2 =
    'https://firebasestorage.googleapis.com/v0/b/app-comunidad-dezzpo.appspot.com/o/site%2Fcategories%2FElectricista.webp?alt=media&token=2595b573-6727-48b6-bb4a-90932403f377'
const Electricista3 =
    'https://firebasestorage.googleapis.com/v0/b/app-comunidad-dezzpo.appspot.com/o/site%2Fcategories%2FElectricista2.webp?alt=media&token=75432fa5-4254-4841-87b2-47b9177bad8f'
const EstudioSuelos =
    'https://firebasestorage.googleapis.com/v0/b/app-comunidad-dezzpo.appspot.com/o/site%2Fcategories%2FEstudioSuelos.jpg?alt=media&token=f1ca4153-b126-4985-ae16-e3a204a06d2f'
const Gasodomesticos =
    'https://firebasestorage.googleapis.com/v0/b/app-comunidad-dezzpo.appspot.com/o/site%2Fcategories%2FGasodom%C3%A9sticos.webp?alt=media&token=6c727180-2e64-4038-999a-6122d9754192'
const Gasodomesticos2 =
    'https://firebasestorage.googleapis.com/v0/b/app-comunidad-dezzpo.appspot.com/o/site%2Fcategories%2FGasodom%C3%A9sticos2.jpg?alt=media&token=7257744a-095f-43fa-8ab5-d6482bc2d809'
const MantoAsfaltico =
    'https://firebasestorage.googleapis.com/v0/b/app-comunidad-dezzpo.appspot.com/o/site%2Fcategories%2FImpermeabilizaci%C3%B3n%20Manto%20Asfaltico.jpg?alt=media&token=90a94877-98fd-4f6b-8282-c0264579a0ab'
const Impermeabilizacion =
    'https://firebasestorage.googleapis.com/v0/b/app-comunidad-dezzpo.appspot.com/o/site%2Fcategories%2FImpermeabilizaci%C3%B3n.webp?alt=media&token=089295d8-72cd-4ca9-bce6-3391f9e97b28'
const Impermeabilizacion2 =
    'https://firebasestorage.googleapis.com/v0/b/app-comunidad-dezzpo.appspot.com/o/site%2Fcategories%2FImpermeabilizaci%C3%B3n2.webp?alt=media&token=5e0cf782-4057-4b76-97d0-133038426ea6'
const InstalacionAdoquin =
    'https://firebasestorage.googleapis.com/v0/b/app-comunidad-dezzpo.appspot.com/o/site%2Fcategories%2FInstalaci%C3%B3n%20de%20adoqu%C3%ADn.jpg?alt=media&token=a12754a5-8382-4fc5-b292-2cabfe372b09'
const InstalacionAdoquin2 =
    'https://firebasestorage.googleapis.com/v0/b/app-comunidad-dezzpo.appspot.com/o/site%2Fcategories%2FInstalaci%C3%B3n%20de%20adoqu%C3%ADn2.jpg?alt=media&token=e7e8ac7d-d618-4738-9562-ce4831e71204'
const InstalacionAdoquin3 =
    'https://firebasestorage.googleapis.com/v0/b/app-comunidad-dezzpo.appspot.com/o/site%2Fcategories%2FInstalaci%C3%B3n%20de%20adoqu%C3%ADn3.jpg?alt=media&token=b98a2b97-0be5-4a2a-87ce-6b7f6e477352'
const InstalacionCeramica =
    'https://firebasestorage.googleapis.com/v0/b/app-comunidad-dezzpo.appspot.com/o/site%2Fcategories%2FInstalaci%C3%B3n%20de%20cer%C3%A1mica.jpg?alt=media&token=feec8e59-7293-45e8-869a-5b90c6f2f3ba'
const InstalacionCeramica2 =
    'https://firebasestorage.googleapis.com/v0/b/app-comunidad-dezzpo.appspot.com/o/site%2Fcategories%2FInstalaci%C3%B3n%20de%20cer%C3%A1mica2.jpg?alt=media&token=85dada92-3c3d-453a-83a8-5a894724b949'
const InstalacionCeramica3 =
    'https://firebasestorage.googleapis.com/v0/b/app-comunidad-dezzpo.appspot.com/o/site%2Fcategories%2FInstalaci%C3%B3n%20de%20cer%C3%A1mica3.jpg?alt=media&token=58e24f40-a99b-49c1-a3ec-438182e64386'
const InstalacionCeramica4 =
    'https://firebasestorage.googleapis.com/v0/b/app-comunidad-dezzpo.appspot.com/o/site%2Fcategories%2FInstalaci%C3%B3n%20de%20cer%C3%A1mica4.jpg?alt=media&token=cab01d16-a9a0-49cf-9c34-24c83b176c1f'
const InstalacionCeramica5 =
    'https://firebasestorage.googleapis.com/v0/b/app-comunidad-dezzpo.appspot.com/o/site%2Fcategories%2FInstalaci%C3%B3n%20de%20cer%C3%A1mica5.jpg?alt=media&token=1d64713e-8951-4ec8-96c8-eb47ef17831e'
const InstalacionCubiertas =
    'https://firebasestorage.googleapis.com/v0/b/app-comunidad-dezzpo.appspot.com/o/site%2Fcategories%2FInstalaci%C3%B3n%20de%20cubiertas.jpg?alt=media&token=50711948-0d16-4fce-8384-5f17d1a09f95'
const InstalacionCubiertas2 =
    'https://firebasestorage.googleapis.com/v0/b/app-comunidad-dezzpo.appspot.com/o/site%2Fcategories%2FInstalaci%C3%B3n%20de%20cubiertas.webp?alt=media&token=7d9e3145-175f-4a0a-a652-852ee007be9b'
const InstalacionCubiertas3 =
    'https://firebasestorage.googleapis.com/v0/b/app-comunidad-dezzpo.appspot.com/o/site%2Fcategories%2FInstalaci%C3%B3n%20de%20cubiertas2.webp?alt=media&token=8f9388d7-fe31-4037-a79d-8ee89121c928'
const InstalacionCubiertas4 =
    'https://firebasestorage.googleapis.com/v0/b/app-comunidad-dezzpo.appspot.com/o/site%2Fcategories%2FInstalaci%C3%B3n%20de%20cubiertas3.jpg?alt=media&token=644d6b13-aa9a-43d6-b7ad-7a6e9b37c59e'
const InstalacionCubiertas5 =
    'https://firebasestorage.googleapis.com/v0/b/app-comunidad-dezzpo.appspot.com/o/site%2Fcategories%2FInstalaci%C3%B3n%20de%20cubiertas4.jpg?alt=media&token=e85d850b-7bdf-4eda-a24e-86f1c6250f72'
const InstalacionParques =
    'https://firebasestorage.googleapis.com/v0/b/app-comunidad-dezzpo.appspot.com/o/site%2Fcategories%2FInstalaci%C3%B3n%20de%20parques.jpg?alt=media&token=0ca7d840-4044-4d27-89b1-0650adbbeeb9'
const InstalacionParques2 =
    'https://firebasestorage.googleapis.com/v0/b/app-comunidad-dezzpo.appspot.com/o/site%2Fcategories%2FInstalaci%C3%B3n%20de%20parques2.webp?alt=media&token=0646f151-6580-44db-b859-fa5225d210e6'
const InstalacionVentanas =
    'https://firebasestorage.googleapis.com/v0/b/app-comunidad-dezzpo.appspot.com/o/site%2Fcategories%2FInstalaci%C3%B3n%20de%20ventanas.jpg?alt=media&token=f5399a0e-5f36-4803-b520-6dd2b134daca'
const InstalacionVentanas2 =
    'https://firebasestorage.googleapis.com/v0/b/app-comunidad-dezzpo.appspot.com/o/site%2Fcategories%2FInstalaci%C3%B3n%20de%20ventanas2.jpg?alt=media&token=28dbcb10-ecc2-49eb-8275-0ae7e945570e'
const Jardineria =
    'https://firebasestorage.googleapis.com/v0/b/app-comunidad-dezzpo.appspot.com/o/site%2Fcategories%2FJardiner%C3%ADa.jpg?alt=media&token=93e64659-184c-460a-9e1a-61f01b5aa0ff'
const Jardineria2 =
    'https://firebasestorage.googleapis.com/v0/b/app-comunidad-dezzpo.appspot.com/o/site%2Fcategories%2FJardiner%C3%ADa2.jpg?alt=media&token=e88a40ce-d3a4-427f-a8a5-50e44c0d27d1'
const Lavanderia =
    'https://firebasestorage.googleapis.com/v0/b/app-comunidad-dezzpo.appspot.com/o/site%2Fcategories%2FLavander%C3%ADa.webp?alt=media&token=06e95ef1-7076-4886-ad00-a255df37f635'
const LimpiezaTanques =
    'https://firebasestorage.googleapis.com/v0/b/app-comunidad-dezzpo.appspot.com/o/site%2Fcategories%2FLimpieza%20Tanques%20de%20agua.jpg?alt=media&token=e1823b62-7794-4cca-9ae3-81ee89c53738'
const LimpiezasTecnicas =
    'https://firebasestorage.googleapis.com/v0/b/app-comunidad-dezzpo.appspot.com/o/site%2Fcategories%2FLimpiezas%20t%C3%A9cnicas.webp?alt=media&token=06c6c07f-0757-486b-98bc-4c154dad1fdc'
const LimpiezasTecnicas2 =
    'https://firebasestorage.googleapis.com/v0/b/app-comunidad-dezzpo.appspot.com/o/site%2Fcategories%2FLimpiezas%20t%C3%A9cnicas2.webp?alt=media&token=32653040-5899-4722-9bdc-b72259817624'
const MaestroConstructor =
    'https://firebasestorage.googleapis.com/v0/b/app-comunidad-dezzpo.appspot.com/o/site%2Fcategories%2FMaestro%20Construcci%C3%B3n.jpg?alt=media&token=a0219848-dcdf-4a74-b17b-2445ef4a037c'
const MaestroObra =
    'https://firebasestorage.googleapis.com/v0/b/app-comunidad-dezzpo.appspot.com/o/site%2Fcategories%2FMaestro%20Obra.webp?alt=media&token=8d88cd79-b349-4acf-84b9-b150bd906dfa'
const MaestroObra2 =
    'https://firebasestorage.googleapis.com/v0/b/app-comunidad-dezzpo.appspot.com/o/site%2Fcategories%2FMaestro%20Obra2.webp?alt=media&token=f4a575e5-c99b-4ae4-965d-2c19c7bd8fa8'
const Mecanica =
    'https://firebasestorage.googleapis.com/v0/b/app-comunidad-dezzpo.appspot.com/o/site%2Fcategories%2FMecanica.jpg?alt=media&token=52f2e761-e8dd-43b0-ae01-129532e89b4d'
const Mecanica2 =
    'https://firebasestorage.googleapis.com/v0/b/app-comunidad-dezzpo.appspot.com/o/site%2Fcategories%2FMecanica2.jpg?alt=media&token=2a7626b6-ed8b-43f6-bd1a-f882acf679de'
const MovilizarPesos =
    'https://firebasestorage.googleapis.com/v0/b/app-comunidad-dezzpo.appspot.com/o/site%2Fcategories%2FMovilizar%20pesos.jpg?alt=media&token=5ff9f435-0122-4393-a1e6-2038451e89ed'
const MovilizarPesos2 =
    'https://firebasestorage.googleapis.com/v0/b/app-comunidad-dezzpo.appspot.com/o/site%2Fcategories%2FMovilizar%20pesos.webp?alt=media&token=4227b9ca-8c3c-4a6a-8cb8-62b2cf85c9e1'
const Mudanzas =
    'https://firebasestorage.googleapis.com/v0/b/app-comunidad-dezzpo.appspot.com/o/site%2Fcategories%2FMudanzas.webp?alt=media&token=9a3622c5-0a44-41a1-ae0d-decb349a0a79'
const Mudanzas2 =
    'https://firebasestorage.googleapis.com/v0/b/app-comunidad-dezzpo.appspot.com/o/site%2Fcategories%2FMudanzas2.webp?alt=media&token=cfea4844-63d0-4f71-bd7b-030fc8e8dfe9'
const Mudanzas3 =
    'https://firebasestorage.googleapis.com/v0/b/app-comunidad-dezzpo.appspot.com/o/site%2Fcategories%2FMudanzas3.jpg?alt=media&token=f882760a-9cf0-4d82-8453-588c852f8ba3'
const Paisajismo =
    'https://firebasestorage.googleapis.com/v0/b/app-comunidad-dezzpo.appspot.com/o/site%2Fcategories%2FPaisajismo.jpg?alt=media&token=106a6cd9-604f-4d47-b8ad-197113f35103'
const Pintura =
    'https://firebasestorage.googleapis.com/v0/b/app-comunidad-dezzpo.appspot.com/o/site%2Fcategories%2FPintura.jpg?alt=media&token=514c5aa5-3feb-4f0c-ad08-0e97457e484a'
const Pintura2 =
    'https://firebasestorage.googleapis.com/v0/b/app-comunidad-dezzpo.appspot.com/o/site%2Fcategories%2FPintura.webp?alt=media&token=61cd7412-6662-4623-987d-311d3d86b877'
const Pintura3 =
    'https://firebasestorage.googleapis.com/v0/b/app-comunidad-dezzpo.appspot.com/o/site%2Fcategories%2FPintura2.webp?alt=media&token=854fb88a-80dc-4041-a6dc-1af57cb35e2b'
const Pintura4 =
    'https://firebasestorage.googleapis.com/v0/b/app-comunidad-dezzpo.appspot.com/o/site%2Fcategories%2FPintura3.jpg?alt=media&token=5b546405-bde5-44aa-aa22-1f7a17a61b29'
const Plomeria =
    'https://firebasestorage.googleapis.com/v0/b/app-comunidad-dezzpo.appspot.com/o/site%2Fcategories%2FPlomer%C3%ADa.webp?alt=media&token=a82ad9db-8bd6-40ca-90df-3c28a43dd76e'
const Plomeria2 =
    'https://firebasestorage.googleapis.com/v0/b/app-comunidad-dezzpo.appspot.com/o/site%2Fcategories%2FPlomer%C3%ADa2.webp?alt=media&token=1003b6a1-5ce1-468d-bb1a-c6fa6ba9efe7'
const Plomeria3 =
    'https://firebasestorage.googleapis.com/v0/b/app-comunidad-dezzpo.appspot.com/o/site%2Fcategories%2Fplomero3.webp?alt=media&token=616aa5e8-2dac-4bca-9350-7111779d3807'
const ReformasBaños =
    'https://firebasestorage.googleapis.com/v0/b/app-comunidad-dezzpo.appspot.com/o/site%2Fcategories%2FReformas%20Ba%C3%B1os.webp?alt=media&token=cfd5c984-0414-419a-83a8-bd8d9f1508f0'
const ReformasCocinas =
    'https://firebasestorage.googleapis.com/v0/b/app-comunidad-dezzpo.appspot.com/o/site%2Fcategories%2FReformas%20Cocinas.jpg?alt=media&token=3af5b157-5ad2-4a83-8a2d-8eaf6ef66c30'
const ReformasCocinas2 =
    'https://firebasestorage.googleapis.com/v0/b/app-comunidad-dezzpo.appspot.com/o/site%2Fcategories%2FReformas%20Cocinas.webp?alt=media&token=c209a362-1434-49d5-81d1-7952c1672e48'
const ReformasPiscinas =
    'https://firebasestorage.googleapis.com/v0/b/app-comunidad-dezzpo.appspot.com/o/site%2Fcategories%2FReformas%20Piscinas.jpg?alt=media&token=b44d3f70-6ef3-4ea4-8772-64ae2262792a'
const ReformasPiscinas2 =
    'https://firebasestorage.googleapis.com/v0/b/app-comunidad-dezzpo.appspot.com/o/site%2Fcategories%2FReformas%20Piscinas.webp?alt=media&token=2b8e3d6b-6a20-4d2d-9bc6-86b0e2235c98'
const Refrigeracion =
    'https://firebasestorage.googleapis.com/v0/b/app-comunidad-dezzpo.appspot.com/o/site%2Fcategories%2FRefrigeraci%C3%B3n.webp?alt=media&token=0f7a7be5-2eb3-4134-9135-06b29915417b'
const Refrigeracion2 =
    'https://firebasestorage.googleapis.com/v0/b/app-comunidad-dezzpo.appspot.com/o/site%2Fcategories%2FRefrigeraci%C3%B3n2.webp?alt=media&token=04164d3c-bb28-4bf6-9832-8e8e2e97141c'
const Refrigeracion3 =
    'https://firebasestorage.googleapis.com/v0/b/app-comunidad-dezzpo.appspot.com/o/site%2Fcategories%2Frefrigeraci%C3%B3n3.webp?alt=media&token=c72ce5af-0ff6-4d0f-b2b1-697ef8d41381'
const ServicioDomestico =
    'https://firebasestorage.googleapis.com/v0/b/app-comunidad-dezzpo.appspot.com/o/site%2Fcategories%2FServicio%20dom%C3%A9stico.webp?alt=media&token=892b7f01-72d4-494c-b776-a1fcb92e002e'
const ServicioDomestico2 =
    'https://firebasestorage.googleapis.com/v0/b/app-comunidad-dezzpo.appspot.com/o/site%2Fcategories%2FServicio%20dom%C3%A9stico2.jpg?alt=media&token=58cdd7cc-a371-43b6-8554-3412cb195bda'
const SistemasSeguridadAlarmas =
    'https://firebasestorage.googleapis.com/v0/b/app-comunidad-dezzpo.appspot.com/o/site%2Fcategories%2FSistemas%20de%20Seguridad%20y%20alarmas.jpg?alt=media&token=f61a0ea0-e944-43cb-96b3-b1f165705c9d'
const SistemasSeguridadAlarmas2 =
    'https://firebasestorage.googleapis.com/v0/b/app-comunidad-dezzpo.appspot.com/o/site%2Fcategories%2FSistemas%20de%20Seguridad%20y%20alarmas2.webp?alt=media&token=53b47c16-2fa9-4dbd-b209-8ad609612f86'
const Tapiceria =
    'https://firebasestorage.googleapis.com/v0/b/app-comunidad-dezzpo.appspot.com/o/site%2Fcategories%2FTapicer%C3%ADa.jpg?alt=media&token=0bc0dad6-83bc-49b7-b08c-69f05fe2922a'
const Tapiceria2 =
    'https://firebasestorage.googleapis.com/v0/b/app-comunidad-dezzpo.appspot.com/o/site%2Fcategories%2FTapicer%C3%ADa.webp?alt=media&token=2cdd670e-2fbc-49b5-99eb-7a0ef18dc94c'
const Toderos =
    'https://firebasestorage.googleapis.com/v0/b/app-comunidad-dezzpo.appspot.com/o/site%2Fcategories%2FToderos.webp?alt=media&token=8101f7bc-6a87-46b0-89be-92944a80e923'
const CableadoEstructurado =
    'https://firebasestorage.googleapis.com/v0/b/app-comunidad-dezzpo.appspot.com/o/site%2Fcategories%2Fcableado%20estructurado.webp?alt=media&token=21085ba2-d0c2-4b19-99ff-5a83d4aa3322'

const Categorias = [
    [AcabadosMuros, AcabadosMuros2, AcabadosMuros3],
    [AcabadosMuros4, AdministrarPH, AdministrarPH2],
    [AislamientoAcustico, Albañileria, Alfombras],
    [Arquitectura, ArtesaniasManualidades, ArtesaniasManualidades2],
    [AutomatizacionDomotica, AutomatizacionDomotica2, AutomatizacionDomotica3],
    [CarpinteriaAluminio, CarpinteriaMetalica, CarpinteriaMetalica2],
    [CarpinteriaMetalica3, Carpinteria, Carpinteria2],
    [Cerrajeria, ConstruccionObra, ConstruccionObra2],
    [ConstruccionObra3, ControlAcceso, ControlAcceso2],
    [ControlPlagas, ControlPlagas2, ControlPlagas3],
    [Demoliciones, DiseñoImpresion, DiseñoImpresion2],
    [DiseñoImpresion3, DrenajesInundaciones, DrenajesInundaciones2],
    [DrenajesInundaciones3, Electricidad, Electricidad2],
    [Electricidad3, Electricista, Electricista2],
    [Electricista3, EstudioSuelos, Gasodomesticos],
    [Gasodomesticos2, MantoAsfaltico, Impermeabilizacion],
    [Impermeabilizacion2, InstalacionAdoquin, InstalacionAdoquin2],
    [InstalacionAdoquin3, InstalacionCeramica, InstalacionCeramica2],
    [InstalacionCeramica3, InstalacionCeramica4, InstalacionCeramica5],
    [InstalacionCubiertas, InstalacionCubiertas2, InstalacionCubiertas3],
    [InstalacionCubiertas4, InstalacionCubiertas5, InstalacionParques],
    [InstalacionParques2, InstalacionVentanas, InstalacionVentanas2],
    [Jardineria, Jardineria2, Lavanderia],
    [LimpiezaTanques, LimpiezasTecnicas, LimpiezasTecnicas2],
    [MaestroConstructor, MaestroObra, MaestroObra2],
    [Mecanica, Mecanica2, MovilizarPesos],
    [MovilizarPesos2, Mudanzas, Mudanzas2],
    [Mudanzas3, Paisajismo, Pintura],
    [Pintura2, Pintura3, Pintura4],
    [Plomeria, Plomeria2, Plomeria3],
    [ReformasBaños, ReformasCocinas, ReformasCocinas2],
    [ReformasPiscinas, ReformasPiscinas2, Refrigeracion],
    [Refrigeracion2, Refrigeracion3, ServicioDomestico],
    [ServicioDomestico2, SistemasSeguridadAlarmas, SistemasSeguridadAlarmas2],
    [Tapiceria, Tapiceria2, Toderos],
    // { CableadoEstructurado },
]

const styles = (theme) => ({
    stepper: {
        position: 'relative',
        bottom: '-25px',
        zIndex: 1000,
        background: 'transparent',
        height: '0px',
        padding: 0,
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'row',
    },
})

const CategoriasSlider = () => {
    const theme = useTheme()
    const classes = styles(theme)
    const maxSteps = 2
    const [activeStep, setActiveStep] = React.useState(0)
    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1)
    }

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1)
    }

    const handleStepChange = (step) => {
        setActiveStep(step)
    }
    return (
        <Box
            sx={{
                width: '80%',
                sm: { width: '100%' },
                flexGrow: 1,
            }}
        >
            <AutoPlaySwipeableViews
                axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                index={activeStep}
                onChangeIndex={handleStepChange}
                enableMouseEvents
                // slideRenderer={slideRenderer}
            >
                {Categorias.map((categoria, index) => {
                    return (
                        <Row key={index}>
                            <img
                                src={categoria[0]}
                                alt="Categorias Populares entre la Comunidad"
                                height="170"
                                style={{ width: '33%', padding: 0 }}
                                maxwidth="300"
                            />
                            <img
                                src={categoria[1]}
                                alt="Categorias Populares entre la Comunidad"
                                height="170"
                                style={{ width: '33%', padding: 0 }}
                                maxwidth="300"
                            />
                            <img
                                src={categoria[2]}
                                alt="Categorias Populares entre la Comunidad"
                                height="170"
                                style={{ width: '33%', padding: 0 }}
                                maxwidth="300"
                            />
                        </Row>
                    )
                })}
            </AutoPlaySwipeableViews>
            <MobileStepper
                // variant=
                sx={classes.stepper}
                className="pb-4 mb-4"
                // steps={maxSteps}
                // position="static"
                activeStep={activeStep}
                nextButton={
                    <Button
                        size="lg"
                        onClick={handleNext}
                        className="arrow-next"
                        disabled={activeStep === maxSteps - 1}
                        // style={{ left: '68px' }}
                    >
                        {theme.direction === 'rtl' ? (
                            <KeyboardArrowLeft fontSize="large" />
                        ) : (
                            <KeyboardArrowRight fontSize="large" />
                        )}
                    </Button>
                }
                backButton={
                    <Button
                        size="lg"
                        onClick={handleBack}
                        className="arrow-back"
                        disabled={activeStep === 0}
                        // style={{ right: '68px' }}
                    >
                        {theme.direction === 'rtl' ? (
                            <KeyboardArrowRight fontSize="large" />
                        ) : (
                            <KeyboardArrowLeft fontSize="large" />
                        )}
                    </Button>
                }
            />
        </Box>
    )
}
export default CategoriasSlider
