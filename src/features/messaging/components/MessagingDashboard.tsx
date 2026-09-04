import { useState, useEffect, useMemo, useCallback } from 'react'
import SendbirdProvider from '@sendbird/uikit-react/SendbirdProvider'
import Channel from '@sendbird/uikit-react/Channel'
import { useSendbirdStateContext, sendbirdSelectors } from '@sendbird/uikit-react'
import type { GroupChannel } from '@sendbird/chat/groupChannel'
import { GroupChannelHandler } from '@sendbird/chat/groupChannel'
import '@sendbird/uikit-react/dist/index.css'
import styles from './Messaging.module.scss'

import { useAuth } from '@hooks/useAuth'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

// MUI Icons
import ForumRoundedIcon from '@mui/icons-material/ForumRounded'
import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close'
import HandshakeOutlinedIcon from '@mui/icons-material/HandshakeOutlined'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import FormatListBulletedRoundedIcon from '@mui/icons-material/FormatListBulletedRounded'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'

const accessToken = import.meta.env.VITE_APP_SENDBIRD_APPTOKEN
const appId = import.meta.env.VITE_APP_SENDBIRD_APPID
const MODERATOR_ID = '847329'

interface MessagingDashboardProps {
    initialChannelUrl?: string | undefined
}

/**
 * Formats a message timestamp into a compact human-readable string
 */
function formatMessageTime(createdAt?: number): string {
    if (!createdAt) return ''
    const date = new Date(createdAt)
    const now = new Date()
    const isToday = date.toDateString() === now.toDateString()

    if (isToday) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    const yesterday = new Date()
    yesterday.setDate(now.getDate() - 1)
    if (date.toDateString() === yesterday.toDateString()) {
        return 'Ayer'
    }

    return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
}

/**
 * Extracts snippet text for last message preview
 */
function getLastMessagePreview(channel: GroupChannel): string {
    if (!channel.lastMessage) return 'Inicia la conversación...'
    const msg = channel.lastMessage as { message?: string; name?: string }
    if (msg.message) return msg.message
    if (msg.name) return `📎 Archivo: ${msg.name}`
    return 'Nuevo mensaje'
}

/**
 * Extracts the counterparty (merchant or resident) from channel members
 */
function getCounterparty(channel: GroupChannel, myUserId: string) {
    const other =
        channel.members?.find((m) => m.userId !== myUserId && m.userId !== MODERATOR_ID) ||
        channel.members?.find((m) => m.userId !== myUserId)

    const nickname = other?.nickname || 'Usuario'
    const profileUrl = other?.profileUrl || ''
    const initials = nickname
        .trim()
        .split(' ')
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase() || 'U'

    return { nickname, profileUrl, initials }
}

/**
 * Extracts channel title and type metadata
 */
function getChannelMeta(channel: GroupChannel) {
    let title = channel.name || 'Conversación'
    const isNegotiation = channel.customType === 'draft_negotiation'
    const isContract = channel.customType === 'contract_execution'

    if (channel.data) {
        try {
            const parsed = JSON.parse(channel.data)
            if (parsed.title) title = parsed.title
        } catch {
            // keep fallback title
        }
    }

    let typeLabel = 'Chat'
    if (isNegotiation) typeLabel = 'Negociación'
    if (isContract) typeLabel = 'Contrato Activo'

    return { title, typeLabel, isNegotiation, isContract }
}

interface MessagingInnerProps {
    userId: string
    initialChannelUrl?: string | undefined
    isMobile: boolean
}

/**
 * Inner component mounted inside SendbirdProvider to access Sendbird context and hooks
 */
function MessagingInner({ userId, initialChannelUrl, isMobile }: MessagingInnerProps) {
    const context = useSendbirdStateContext()
    const sdk = sendbirdSelectors.getSdk(context)

    const [channels, setChannels] = useState<GroupChannel[]>([])
    const [isLoadingChannels, setIsLoadingChannels] = useState<boolean>(true)
    const [activeTab, setActiveTab] = useState<'all' | 'negotiations' | 'contracts'>('all')
    const [searchTerm, setSearchTerm] = useState<string>('')
    const [currentChannelUrl, setCurrentChannelUrl] = useState<string>(initialChannelUrl || '')

    // Keep active channel in sync if query param changes
    useEffect(() => {
        if (initialChannelUrl) {
            setCurrentChannelUrl(initialChannelUrl)
        }
    }, [initialChannelUrl])

    // Load user's group channels from Sendbird SDK
    const fetchChannels = useCallback(async () => {
        if (!sdk || !('groupChannel' in sdk)) return
        try {
            const query = (sdk as unknown as {
                groupChannel: {
                    createMyGroupChannelListQuery: (params: {
                        includeEmpty: boolean
                        limit: number
                        order: string
                    }) => { next: () => Promise<GroupChannel[]> }
                }
            }).groupChannel.createMyGroupChannelListQuery({
                includeEmpty: true,
                limit: 50,
                order: 'latest_last_message',
            })

            const list = await query.next()
            setChannels(list)
        } catch (err) {
            console.error('Error fetching Sendbird channels:', err)
        } finally {
            setIsLoadingChannels(false)
        }
    }, [sdk])

    // Initial fetch and real-time live event subscription
    useEffect(() => {
        if (!sdk || !(sdk as unknown as { currentUser?: unknown }).currentUser) return
        fetchChannels()

        const HANDLER_ID = 'DEZZPO_MESSAGING_LIVE_HANDLER'
        const handler = new GroupChannelHandler({
            onMessageReceived: (channel) => {
                setChannels((prev) => {
                    const filtered = prev.filter((c) => c.url !== channel.url)
                    return [channel as GroupChannel, ...filtered]
                })
            },
            onChannelChanged: (channel) => {
                setChannels((prev) => {
                    const idx = prev.findIndex((c) => c.url === channel.url)
                    if (idx >= 0) {
                        const updated = [...prev]
                        updated[idx] = channel as GroupChannel
                        return updated
                    }
                    return [channel as GroupChannel, ...prev]
                })
            },
            onUserJoined: () => {
                fetchChannels()
            },
            onUserLeft: () => {
                fetchChannels()
            },
        })

        const sbGroupChannel = (sdk as unknown as {
            groupChannel: {
                addGroupChannelHandler: (id: string, h: GroupChannelHandler) => void
                removeGroupChannelHandler: (id: string) => void
            }
        }).groupChannel

        sbGroupChannel.addGroupChannelHandler(HANDLER_ID, handler)

        return () => {
            try {
                sbGroupChannel.removeGroupChannelHandler(HANDLER_ID)
            } catch {
                // ignore
            }
        }
    }, [sdk, fetchChannels])

    // Metric counts
    const negotiationsCount = useMemo(
        () => channels.filter((c) => c.customType === 'draft_negotiation').length,
        [channels]
    )
    const contractsCount = useMemo(
        () => channels.filter((c) => c.customType === 'contract_execution').length,
        [channels]
    )
    const totalUnread = useMemo(
        () => channels.reduce((sum, c) => sum + (c.unreadMessageCount || 0), 0),
        [channels]
    )

    // Filtered channel list by active tab and search query
    const filteredChannels = useMemo(() => {
        return channels.filter((channel) => {
            // Tab filter
            if (activeTab === 'negotiations' && channel.customType !== 'draft_negotiation') {
                return false
            }
            if (activeTab === 'contracts' && channel.customType !== 'contract_execution') {
                return false
            }

            // Search filter
            if (searchTerm.trim()) {
                const query = searchTerm.toLowerCase()
                const { nickname } = getCounterparty(channel, userId)
                const { title } = getChannelMeta(channel)
                const lastMsg = getLastMessagePreview(channel).toLowerCase()

                const matchesNickname = nickname.toLowerCase().includes(query)
                const matchesTitle = title.toLowerCase().includes(query)
                const matchesMsg = lastMsg.includes(query)

                return matchesNickname || matchesTitle || matchesMsg
            }

            return true
        })
    }, [channels, activeTab, searchTerm, userId])

    // Render mobile top bubbles row (Messenger-style)
    const renderMobileBubblesBar = () => (
        <div className={styles.mobileBubblesBar}>
            {/* Overview / List Button */}
            <button
                type="button"
                className={`${styles.bubbleAllBtn} ${!currentChannelUrl ? styles.activeAll : ''}`}
                onClick={() => setCurrentChannelUrl('')}
                title="Ver lista de conversaciones"
            >
                <div className={styles.allIconCircle}>
                    <FormatListBulletedRoundedIcon sx={{ fontSize: 20 }} />
                </div>
                <span>Lista</span>
            </button>

            {/* Horizontal Row of Conversation Bubbles */}
            {channels.map((channel) => {
                const { nickname, profileUrl, initials } = getCounterparty(channel, userId)
                const { isNegotiation, isContract } = getChannelMeta(channel)
                const isActive = currentChannelUrl === channel.url
                const hasUnread = channel.unreadMessageCount > 0

                return (
                    <button
                        key={`bubble-${channel.url}`}
                        type="button"
                        className={`${styles.bubbleItem} ${isActive ? styles.bubbleActive : ''}`}
                        onClick={() => setCurrentChannelUrl(channel.url)}
                    >
                        <div className={styles.bubbleAvatarWrapper}>
                            {profileUrl ? (
                                <img
                                    src={profileUrl}
                                    alt={nickname}
                                    className={styles.bubbleAvatar}
                                    onError={(e) => {
                                        // Fallback on broken image
                                        ;(e.currentTarget as HTMLImageElement).style.display = 'none'
                                    }}
                                />
                            ) : (
                                <div className={styles.bubbleInitials}>{initials}</div>
                            )}

                            {hasUnread && (
                                <span className={styles.bubbleUnread}>
                                    {channel.unreadMessageCount > 99 ? '99+' : channel.unreadMessageCount}
                                </span>
                            )}

                            <span className={styles.bubbleTypeBadge}>
                                {isNegotiation ? '🤝' : isContract ? '📄' : '💬'}
                            </span>
                        </div>
                        <span className={styles.bubbleName}>{nickname}</span>
                    </button>
                )
            })}
        </div>
    )

    // Render Channel Cards List (used in sidebar for desktop and master view for mobile)
    const renderChannelCardsList = () => (
        <div className={styles.channelCardsList}>
            {isLoadingChannels ? (
                <div className={styles.emptyState}>Cargando conversaciones...</div>
            ) : filteredChannels.length === 0 ? (
                <div className={styles.emptyState}>
                    {searchTerm
                        ? 'No se encontraron conversaciones con esa búsqueda.'
                        : activeTab === 'negotiations'
                        ? 'No tienes negociaciones activas.'
                        : activeTab === 'contracts'
                        ? 'No tienes contratos activos en curso.'
                        : 'No tienes mensajes pendientes.'}
                </div>
            ) : (
                filteredChannels.map((channel) => {
                    const { nickname, profileUrl, initials } = getCounterparty(channel, userId)
                    const { title, typeLabel, isNegotiation, isContract } = getChannelMeta(channel)
                    const isActive = currentChannelUrl === channel.url
                    const lastMsg = getLastMessagePreview(channel)
                    const lastTime = formatMessageTime(channel.lastMessage?.createdAt)
                    const unread = channel.unreadMessageCount || 0

                    return (
                        <div
                            key={`card-${channel.url}`}
                            className={`${styles.channelCard} ${isActive ? styles.active : ''}`}
                            onClick={() => setCurrentChannelUrl(channel.url)}
                        >
                            <div className={styles.cardAvatarWrapper}>
                                {profileUrl ? (
                                    <img
                                        src={profileUrl}
                                        alt={nickname}
                                        className={styles.cardAvatar}
                                        onError={(e) => {
                                            ;(e.currentTarget as HTMLImageElement).style.display = 'none'
                                        }}
                                    />
                                ) : (
                                    <div className={styles.cardInitials}>{initials}</div>
                                )}
                            </div>

                            <div className={styles.cardInfo}>
                                <div className={styles.cardHeaderRow}>
                                    <span className={styles.cardName}>{nickname}</span>
                                    {lastTime && <span className={styles.cardTime}>{lastTime}</span>}
                                </div>

                                <div className={styles.cardTagRow}>
                                    <span
                                        className={`${styles.typeTag} ${
                                            isNegotiation
                                                ? styles.tagNegotiation
                                                : isContract
                                                ? styles.tagContract
                                                : styles.tagGeneral
                                        }`}
                                    >
                                        {isNegotiation && <HandshakeOutlinedIcon sx={{ fontSize: 13 }} />}
                                        {isContract && <DescriptionOutlinedIcon sx={{ fontSize: 13 }} />}
                                        {typeLabel}: {title}
                                    </span>
                                </div>

                                <div className={styles.cardLastMessageRow}>
                                    <span className={styles.cardLastMessage}>{lastMsg}</span>
                                    {unread > 0 && (
                                        <span className={styles.cardUnreadBadge}>
                                            {unread > 99 ? '99+' : unread}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    )
                })
            )}
        </div>
    )

    // Render Sidebar Component
    const renderSidebar = () => (
        <div className={styles.sidebar}>
            <div className={styles.sidebarHeader}>
                <div className={styles.headerTitleRow}>
                    <h3>Conversaciones</h3>
                    {totalUnread > 0 && (
                        <span className={styles.unreadTotalChip}>
                            {totalUnread} sin leer
                        </span>
                    )}
                </div>

                {/* Search box */}
                <div className={styles.searchContainer}>
                    <SearchIcon sx={{ position: 'absolute', left: 12, color: '#94a3b8', fontSize: '1.1rem', pointerEvents: 'none' }} />
                    <input
                        type="text"
                        placeholder="Buscar por usuario o proyecto..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={styles.searchInput}
                    />
                    {searchTerm && (
                        <button
                            type="button"
                            className={styles.clearBtn}
                            onClick={() => setSearchTerm('')}
                            aria-label="Limpiar búsqueda"
                        >
                            <CloseIcon sx={{ fontSize: 16 }} />
                        </button>
                    )}
                </div>

                {/* Filter tabs */}
                <div className={styles.filterTabs}>
                    <button
                        type="button"
                        className={`${styles.tabButton} ${activeTab === 'all' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('all')}
                    >
                        Todos <span className={styles.tabBadge}>{channels.length}</span>
                    </button>
                    <button
                        type="button"
                        className={`${styles.tabButton} ${activeTab === 'negotiations' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('negotiations')}
                    >
                        Negociaciones <span className={styles.tabBadge}>{negotiationsCount}</span>
                    </button>
                    <button
                        type="button"
                        className={`${styles.tabButton} ${activeTab === 'contracts' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('contracts')}
                    >
                        Contratos <span className={styles.tabBadge}>{contractsCount}</span>
                    </button>
                </div>
            </div>

            {/* Scrollable list */}
            {renderChannelCardsList()}
        </div>
    )

    // Render Desktop Empty State
    const renderDesktopEmptyState = () => (
        <div className={styles.desktopEmptyState}>
            <div className={styles.emptyIconCircle}>
                <ForumRoundedIcon sx={{ fontSize: 40 }} />
            </div>
            <h4>Bandeja de Mensajes Dezzpo</h4>
            <p>
                Selecciona una negociación o contrato en el panel lateral para coordinar condiciones, resolver inquietudes y acordar propuestas de forma segura.
            </p>
            <div className={styles.emptyPillsRow}>
                <span className={styles.emptyPill}>
                    <CheckCircleOutlineIcon sx={{ fontSize: 16, color: '#00b86b' }} /> Conversaciones privadas
                </span>
                <span className={styles.emptyPill}>
                    <CheckCircleOutlineIcon sx={{ fontSize: 16, color: '#00b86b' }} /> Contratos vinculados
                </span>
                <span className={styles.emptyPill}>
                    <CheckCircleOutlineIcon sx={{ fontSize: 16, color: '#00b86b' }} /> Respuestas en tiempo real
                </span>
            </div>
        </div>
    )

    return (
        <div className={styles.messagingContainer}>
            {/* Mobile Top Messenger Bubbles Row */}
            {isMobile && channels.length > 0 && renderMobileBubblesBar()}

            {/* Layout Switching: Mobile vs Desktop */}
            {isMobile ? (
                // On mobile: if a channel is active, show the full chat; otherwise, show the directory list
                currentChannelUrl ? (
                    <div className={styles.chatArea}>
                        <Channel
                            channelUrl={currentChannelUrl}
                            onBackClick={() => setCurrentChannelUrl('')}
                        />
                    </div>
                ) : (
                    renderSidebar()
                )
            ) : (
                // On desktop: 2-column layout (sidebar + chat pane)
                <>
                    {renderSidebar()}
                    <div className={styles.chatArea}>
                        {currentChannelUrl ? (
                            <Channel channelUrl={currentChannelUrl} />
                        ) : (
                            renderDesktopEmptyState()
                        )}
                    </div>
                </>
            )}
        </div>
    )
}

export default function MessagingDashboard({ initialChannelUrl }: MessagingDashboardProps) {
    const { currentUser } = useAuth()
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))

    const userId = currentUser?.userId
    const userName = currentUser?.displayName || 'Usuario'

    if (!appId || !userId) {
        return <div className={styles.emptyState}>Cargando chat...</div>
    }

    return (
        <SendbirdProvider
            appId={appId}
            userId={userId}
            nickname={userName}
            accessToken={accessToken}
            breakpoint={isMobile}
        >
            <MessagingInner
                userId={userId}
                initialChannelUrl={initialChannelUrl}
                isMobile={isMobile}
            />
        </SendbirdProvider>
    )
}
