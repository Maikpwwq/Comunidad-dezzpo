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

import { FAQ_SECTIONS } from './faqData'
import styles from './AyudaPqrs.module.scss'

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
            <section className={`ayuda-pqrs-titulo ${styles.HeroSection}`}>
                <div className={`opacidad-negro ${styles.HeroContent}`}>
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
                                        root: styles.AccordionItem || '',
                                        expanded: styles.AccordionItemExpanded || '',
                                    }}
                                >
                                    <AccordionSummary
                                        expandIcon={
                                            <ExpandMoreIcon className={styles.ExpandIcon || ''} />
                                        }
                                        className={styles.AccordionSummary || ''}
                                    >
                                        <span className={styles.AccordionQuestion}>
                                            {item.question}
                                        </span>
                                    </AccordionSummary>
                                    <AccordionDetails className={styles.AccordionDetails || ''}>
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
                            className={styles.AiCardBtn || ''}
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
