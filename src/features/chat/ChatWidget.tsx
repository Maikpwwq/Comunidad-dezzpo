/**
 * ChatWidget — Floating RAG Chat for Comunidad Dezzpo
 *
 * Non-intrusive floating bubble (bottom-right). Opens a chat panel
 * that sends the current pathname for context-aware retrieval.
 *
 * Uses native fetch to POST to /api/v1/chat and streams the response,
 * avoiding AI SDK v6 useChat API incompatibilities.
 */

import { useState, useEffect, useRef, type FormEvent } from 'react'
import { useChatStore } from '@stores/chatStore'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import CloseIcon from '@mui/icons-material/Close'
import SendIcon from '@mui/icons-material/Send'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import styles from './ChatWidget.module.scss'

// ── Types ────────────────────────────────────────────────────────────────────

interface ChatMessage {
    id: string
    role: 'user' | 'assistant'
    content: string
}

// ── Component ────────────────────────────────────────────────────────────────

export default function ChatWidget() {
    const { isOpen, currentPathname, toggleChat, setPathname } = useChatStore()
    const [inputValue, setInputValue] = useState('')
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Capture pathname on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setPathname(window.location.pathname)
        }
    }, [])

    // Recapture on open (user may have navigated)
    useEffect(() => {
        if (isOpen && typeof window !== 'undefined') {
            setPathname(window.location.pathname)
        }
    }, [isOpen])

    // Auto-scroll to latest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    // ── Send message & stream response ───────────────────────────────────

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        const trimmed = inputValue.trim()
        if (!trimmed || isLoading) return

        // Add user message
        const userMsg: ChatMessage = {
            id: `user-${Date.now()}`,
            role: 'user',
            content: trimmed,
        }

        const updatedMessages = [...messages, userMsg]
        setMessages(updatedMessages)
        setInputValue('')
        setIsLoading(true)

        // Build the assistant placeholder
        const assistantId = `assistant-${Date.now()}`
        const assistantMsg: ChatMessage = {
            id: assistantId,
            role: 'assistant',
            content: '',
        }
        setMessages([...updatedMessages, assistantMsg])

        try {
            // POST to our Hono API route
            const response = await fetch('/api/v1/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: updatedMessages.map((m) => ({
                        role: m.role,
                        content: m.content,
                    })),
                    currentPathname,
                }),
            })

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`)
            }

            // Stream the text response
            const reader = response.body?.getReader()
            const decoder = new TextDecoder()
            let accumulated = ''

            if (reader) {
                while (true) {
                    const { done, value } = await reader.read()
                    if (done) break

                    accumulated += decoder.decode(value, { stream: true })

                    // Update the assistant message in place
                    setMessages((prev) =>
                        prev.map((m) =>
                            m.id === assistantId
                                ? { ...m, content: accumulated }
                                : m
                        )
                    )
                }
            }
        } catch (error) {
            console.error('[ChatWidget] Stream error:', error)
            setMessages((prev) =>
                prev.map((m) =>
                    m.id === assistantId
                        ? { ...m, content: '⚠️ Error de conexión. Intenta de nuevo.' }
                        : m
                )
            )
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            {/* Floating Action Button */}
            <button
                className={styles.ChatFab}
                onClick={toggleChat}
                aria-label={isOpen ? 'Cerrar chat' : 'Abrir chat'}
            >
                {isOpen ? <CloseIcon /> : <ChatBubbleOutlineIcon />}
            </button>

            {/* Chat Panel */}
            {isOpen && (
                <div className={styles.ChatPanel}>
                    {/* Header */}
                    <div className={styles.ChatHeader}>
                        <div>
                            <h3>Asistente Dezzpo</h3>
                            <span>Respuestas basadas en nuestra base de conocimiento</span>
                        </div>
                        <button className={styles.CloseBtn} onClick={toggleChat}>
                            <CloseIcon fontSize="small" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className={styles.MessagesArea}>
                        {messages.length === 0 && (
                            <div className={styles.EmptyState}>
                                <SmartToyIcon />
                                <p>¡Hola! Soy el asistente de Comunidad Dezzpo. Pregúntame sobre servicios, comerciantes o cualquier tema.</p>
                            </div>
                        )}

                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`${styles.MessageBubble} ${
                                    msg.role === 'user'
                                        ? styles.UserBubble
                                        : styles.AssistantBubble
                                }`}
                                dangerouslySetInnerHTML={{
                                    __html: formatChatMessage(msg.content),
                                }}
                            />
                        ))}

                        {/* Loading indicator */}
                        {isLoading && (
                            <div className={styles.LoadingDots}>
                                <span /><span /><span />
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form className={styles.InputArea} onSubmit={handleSubmit}>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Escribe tu pregunta..."
                            disabled={isLoading}
                            autoFocus
                        />
                        <button
                            type="submit"
                            className={styles.SendBtn}
                            disabled={isLoading || !inputValue.trim()}
                        >
                            <SendIcon />
                        </button>
                    </form>
                </div>
            )}
        </>
    )
}

// ── Format Helper ────────────────────────────────────────────────────────────

function formatChatMessage(content: string): string {
    if (!content) return ''
    return content
        .replace(
            /\[([^\]]+)\]\(([^)]+)\)/g,
            '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
        )
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br />')
}
