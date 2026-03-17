/**
 * Ayuda PQRS — Modern FAQ with AI Chatbot
 *
 * Architecture:
 * - Tabbed accordion layout (MUI Accordion)
 * - All FAQ questions answered inline
 * - "Chat en vivo" replaced with AI chatbot trigger via Zustand
 * - Responsive, modular, brand-consistent
 */

import { useState, type SyntheticEvent } from 'react'
import { useChatStore } from '@stores/chatStore'

// MUI
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Button from '@mui/material/Button'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'

import styles from './AyudaPqrs.module.scss'

// ── FAQ Data ─────────────────────────────────────────────────────────────────

interface FaqItem {
    question: string
    answer: string
}

const FAQ_SECTIONS: { id: string; label: string; items: FaqItem[] }[] = [
    {
        id: 'propietarios',
        label: 'Propietarios',
        items: [
            {
                question: '¿Cómo adquirir servicios?',
                answer:
                    'Ingresa a la sección de Presupuestos, selecciona el tipo de proyecto y la categoría del profesional que necesitas, haz clic en "Siguiente" y completa el formulario de 4 pasos en la página de Nuevo Proyecto. Los profesionales disponibles recibirán tu solicitud y te enviarán cotizaciones.',
            },
            {
                question: '¿Cómo modificar proyectos?',
                answer:
                    'Desde tu cuenta, accede a "Directorio de Requerimientos" en el menú principal. Allí puedes ver tus proyectos activos y editarlos según sea necesario.',
            },
            {
                question: '¿Cómo escoger el mejor personal?',
                answer:
                    'Consulta el Directorio de Profesionales en Portal de Servicios. Compara perfiles, revisa calificaciones con estrellas, experiencia en años, ubicación, habilidades específicas y portafolio de trabajos anteriores. Los comerciantes con la insignia de certificación Dezzpo han pasado una validación presencial de sus habilidades.',
            },
            {
                question: '¿Cómo solicito un presupuesto?',
                answer:
                    'Ingresa a la página de Presupuestos, completa el formulario "Solicitar Servicios" seleccionando tipo de proyecto y categoría, haz clic en "Siguiente" y completa el formulario de 4 pasos. Es totalmente gratuito y sin compromiso.',
            },
        ],
    },
    {
        id: 'comerciantes',
        label: 'Comerciantes',
        items: [
            {
                question: '¿Cómo ofrecer servicios?',
                answer:
                    'Regístrate como comerciante, completa tu perfil profesional con experiencia, habilidades y portafolio. Tu perfil será visible en el Directorio de Profesionales. Los propietarios podrán contactarte directamente o recibirás notificaciones cuando publiquen proyectos en tu categoría.',
            },
            {
                question: '¿Cuál es el costo de un proyecto?',
                answer:
                    'El costo depende del tipo de trabajo, complejidad y materiales necesarios. Cada comerciante define sus propios precios y envía cotizaciones personalizadas a los propietarios. La plataforma no establece precios fijos.',
            },
            {
                question: '¿Cómo certifico mis habilidades y servicios?',
                answer:
                    'Solicita la certificación Dezzpo desde tu perfil. Se programará una visita de inspección donde se validan tus certificados, diplomas, equipos y técnica. Al aprobar, recibes la insignia de verificación que se muestra en tu perfil público, aumentando la confianza de los propietarios.',
            },
            {
                question: '¿Cuánto me cobra la comunidad Dezzpo?',
                answer:
                    'Actualmente el registro y uso de la plataforma es gratuito para comerciantes. Comunidad Dezzpo no cobra comisiones por los servicios prestados.',
            },
            {
                question: '¿Cómo puedo aplicar a un proyecto?',
                answer:
                    'Cuando un propietario publica un requerimiento en tu categoría de servicio, recibirás una notificación. Desde el Directorio de Requerimientos puedes ver los proyectos disponibles y enviar tu propuesta con presupuesto.',
            },
            {
                question: '¿Cómo responder con un presupuesto?',
                answer:
                    'Al ver un requerimiento publicado, selecciona "Cotizar" para enviar tu propuesta. Incluye el valor estimado del trabajo, tiempo de ejecución y cualquier detalle relevante. El propietario comparará las cotizaciones recibidas y elegirá.',
            },
        ],
    },
    {
        id: 'general',
        label: 'General',
        items: [
            {
                question: '¿Cómo actualizo mi perfil en Dezzpo?',
                answer:
                    'Inicia sesión en tu cuenta y dirígete a "Mi cuenta" o "Ver tu perfil" en el menú principal. Desde allí puedes editar tu información personal, foto de perfil, habilidades, portafolio y datos de contacto.',
            },
            {
                question: '¿Cómo trabajan las calificaciones de los perfiles?',
                answer:
                    'Los propietarios califican a los comerciantes después de recibir un servicio. Se evalúan tres aspectos: cumplimiento de tiempos, calidad técnica del servicio, y entrega oportuna de documentos. El promedio de calificaciones se muestra públicamente en el perfil con estrellas.',
            },
            {
                question: '¿Cómo solicitar y realizar calificaciones?',
                answer:
                    'Al finalizar un servicio contratado a través de la plataforma, el propietario recibe la opción de calificar al comerciante desde su historial de servicio. La calificación incluye puntuación en estrellas y comentarios opcionales.',
            },
            {
                question: '¿Cómo configuro mi cuenta?',
                answer:
                    'Desde el menú lateral puedes acceder a las secciones: Mi cuenta (datos personales), Ajustes (preferencias), Privacidad, Formas de Pago y Cambiar Clave.',
            },
            {
                question: '¿Es segura la plataforma?',
                answer:
                    'Sí. Comunidad Dezzpo protege tu información con políticas de privacidad estrictas. Puedes cambiar tu contraseña en cualquier momento desde Configuración > Cambiar Clave. Nunca compartas tus credenciales de acceso.',
            },
            {
                question: 'No puedo usar mi cuenta',
                answer:
                    'Si tienes problemas para acceder, intenta restablecer tu contraseña desde la página de inicio de sesión. Si el problema persiste, contacta a servicio al cliente por WhatsApp al +57 320 484 2897 o por email a comunidad.dezzpo@gmail.com.',
            },
            {
                question: 'Consejos prácticos para Comerciantes calificados',
                answer:
                    'Mantén tu perfil actualizado con fotos de trabajos recientes en tu portafolio. Responde rápidamente a las solicitudes. Obtén la certificación Dezzpo para mayor visibilidad. Solicita calificaciones a tus clientes para mejorar tu reputación en la plataforma.',
            },
            {
                question: 'Reglamentación del Sistema de Salud y Seguridad en el Trabajo',
                answer:
                    'Los comerciantes deben cumplir con la normatividad colombiana de seguridad y salud en el trabajo (SST). Usar equipos de protección personal adecuados, seguir protocolos de seguridad y contar con ARL vigente. Dezzpo promueve la seguridad como parte de su Política Integral HSEQ.',
            },
            {
                question: '¿Cuánto cuesta registrarse?',
                answer:
                    'El registro es completamente gratuito tanto para propietarios como para comerciantes. No hay cargos ocultos por crear una cuenta en la plataforma.',
            },
        ],
    },
]

// ── Component ────────────────────────────────────────────────────────────────

export default function Page() {
    const [activeTab, setActiveTab] = useState('propietarios')
    const [expanded, setExpanded] = useState<string | false>(false)
    const { setOpen, setPathname } = useChatStore()

    const handleAccordion = (panel: string) => (_: SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false)
    }

    const handleOpenChatbot = () => {
        setPathname('/ayuda-pqrs')
        setOpen(true)
    }

    const activeSection = FAQ_SECTIONS.find((s) => s.id === activeTab)

    return (
        <div>
            {/* ── Hero ──────────────────────────────────────────────── */}
            <section className={styles.HeroSection}>
                <div className={styles.HeroContent}>
                    <h1 className={styles.HeroTitle}>
                        Centro de Ayuda
                    </h1>
                    <p className={styles.HeroSubtitle}>
                        Encuentra respuestas a las preguntas más frecuentes
                        o chatea con nuestro asistente IA disponible 24/7.
                    </p>
                </div>
            </section>

            {/* ── Content ───────────────────────────────────────────── */}
            <div className={styles.ContentWrapper}>
                {/* Tab Navigation */}
                <nav className={styles.TabBar} role="tablist">
                    {FAQ_SECTIONS.map((section) => (
                        <button
                            key={section.id}
                            role="tab"
                            aria-selected={activeTab === section.id}
                            className={`${styles.Tab} ${activeTab === section.id ? styles.TabActive : ''}`}
                            onClick={() => {
                                setActiveTab(section.id)
                                setExpanded(false)
                            }}
                        >
                            {section.label}
                            <span className={styles.CountBadge}>
                                {section.items.length}
                            </span>
                        </button>
                    ))}
                </nav>

                {/* FAQ Accordion */}
                {activeSection && (
                    <div className={styles.FaqList} role="tabpanel">
                        {activeSection.items.map((item, i) => {
                            const panelId = `${activeSection.id}-${i}`
                            return (
                                <Accordion
                                    key={panelId}
                                    expanded={expanded === panelId}
                                    onChange={handleAccordion(panelId)}
                                    disableGutters
                                    elevation={0}
                                    classes={{
                                        root: styles.AccordionItem,
                                        expanded: styles.AccordionItemExpanded,
                                    }}
                                >
                                    <AccordionSummary
                                        expandIcon={
                                            <ExpandMoreIcon className={styles.ExpandIcon} />
                                        }
                                        className={styles.AccordionSummary}
                                    >
                                        <span className={styles.AccordionQuestion}>
                                            {item.question}
                                        </span>
                                    </AccordionSummary>
                                    <AccordionDetails className={styles.AccordionDetails}>
                                        <p className={styles.AccordionAnswer}>
                                            {item.answer}
                                        </p>
                                    </AccordionDetails>
                                </Accordion>
                            )
                        })}
                    </div>
                )}

                {/* ── AI Chatbot Card ─────────────────────────────── */}
                <div className={styles.AiCardWrapper}>
                    <div className={styles.AiCard}>
                        <div className={styles.AiIconBox}>
                            <SmartToyIcon sx={{ fontSize: 36 }} />
                        </div>
                        <div className={styles.AiCardContent}>
                            <h3 className={styles.AiCardTitle}>
                                <HelpOutlineIcon sx={{ fontSize: 20, mr: 0.5, verticalAlign: 'text-bottom' }} />
                                ¿No encontraste tu respuesta?
                            </h3>
                            <p className={styles.AiCardDescription}>
                                Nuestro asistente con inteligencia artificial está disponible
                                las 24 horas del día, los 7 días de la semana para ayudarte con
                                cualquier duda sobre la plataforma, servicios y comerciantes.
                            </p>
                        </div>
                        <Button
                            variant="contained"
                            className={styles.AiCardBtn}
                            onClick={handleOpenChatbot}
                            startIcon={<SmartToyIcon />}
                        >
                            Chatear con IA
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
