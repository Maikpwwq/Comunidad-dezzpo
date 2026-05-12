import { useState, useEffect } from 'react'
import SendbirdProvider from '@sendbird/uikit-react/SendbirdProvider'
import ChannelList from '@sendbird/uikit-react/ChannelList'
import Channel from '@sendbird/uikit-react/Channel'
import '@sendbird/uikit-react/dist/index.css'
import styles from './Messaging.module.scss'
import type { GroupChannel } from '@sendbird/chat/groupChannel'

// Assuming we have the Zustand store for user info (fallback to props if not integrated yet)
import { useAuth } from '@hooks/useAuth'

const accessToken = import.meta.env.VITE_APP_SENDBIRD_APPTOKEN
const appId = import.meta.env.VITE_APP_SENDBIRD_APPID
const MODERATOR_ID = '847329'

interface MessagingDashboardProps {
    initialChannelUrl?: string | undefined
}

export default function MessagingDashboard({ initialChannelUrl }: MessagingDashboardProps) {
    const { currentUser } = useAuth()
    const userId = currentUser?.userId
    const userName = currentUser?.displayName || 'Usuario'

    const [currentChannelUrl, setCurrentChannelUrl] = useState<string>(initialChannelUrl || '')

    useEffect(() => {
        if (initialChannelUrl) {
            setCurrentChannelUrl(initialChannelUrl)
        }
    }, [initialChannelUrl])

    if (!appId || !userId) {
        return <div className={styles.emptyState}>Cargando chat...</div>
    }

    // Custom Item Renderer for the Channel List
    const renderChannelPreview = (props: { channel: GroupChannel }) => {
        const { channel } = props
        // Filter out the current user and moderator to find the "Merchant"
        const merchant = channel.members.find(
            (m: { userId: string }) => m.userId !== userId && m.userId !== MODERATOR_ID
        )
        const chatTitle = merchant?.nickname || 'Usuario'
        const avatarUrl = merchant?.profileUrl || 'https://via.placeholder.com/150'

        // Extract context subheader (assuming data JSON)
        let subHeader = 'Chat'
        try {
            if (channel.data) {
                const parsedData = JSON.parse(channel.data)
                if (channel.customType === 'draft_negotiation') {
                    subHeader = `Negociación: ${parsedData.title || channel.name}`
                } else if (channel.customType === 'contract_execution') {
                    subHeader = `Contrato: ${parsedData.title || channel.name}`
                }
            } else {
                if (channel.customType === 'draft_negotiation') subHeader = 'Negociación (Borrador)'
                if (channel.customType === 'contract_execution') subHeader = 'Contrato Activo'
            }
        } catch (e) {
            // fallback
            if (channel.customType === 'draft_negotiation') subHeader = 'Negociación (Borrador)'
            if (channel.customType === 'contract_execution') subHeader = 'Contrato Activo'
        }

        const isActive = currentChannelUrl === channel.url

        return (
            <div 
                className={`${styles.channelCard} ${isActive ? styles.active : ''}`}
                onClick={() => setCurrentChannelUrl(channel.url)}
            >
                <img src={avatarUrl} alt="avatar" className={styles.channelAvatar} />
                <div className={styles.channelInfo}>
                    <div className={styles.channelHeader}>
                        <span className={styles.merchantName}>{chatTitle}</span>
                        {channel.unreadMessageCount > 0 && (
                            <span className={styles.badge}>{channel.unreadMessageCount}</span>
                        )}
                    </div>
                    <span className={styles.subHeader}>{subHeader}</span>
                </div>
            </div>
        )
    }

    return (
        <SendbirdProvider appId={appId} userId={userId} nickname={userName} accessToken={accessToken}>
            <div className={styles.messagingContainer}>
                {/* LEFT COLUMN: Sectioned List */}
                <div className={styles.sidebar}>
                    {/* Section 1: Negociaciones */}
                    <div className={styles.listSection}>
                        <h4 className={styles.sectionTitle}>Negociaciones</h4>
                        <div className={styles.listWrapper}>
                            <ChannelList
                                queries={{
                                    channelListQuery: {
                                        customTypesFilter: ['draft_negotiation'],
                                        includeEmpty: true
                                    }
                                }}
                                renderChannelPreview={renderChannelPreview}
                                // Hide default header
                                renderHeader={() => <div style={{ display: 'none' }} />}
                            />
                        </div>
                    </div>

                    {/* Section 2: Contratos Activos */}
                    <div className={styles.listSection}>
                        <h4 className={styles.sectionTitle}>Contratos Activos</h4>
                        <div className={styles.listWrapper}>
                            <ChannelList
                                queries={{
                                    channelListQuery: {
                                        customTypesFilter: ['contract_execution'],
                                        includeEmpty: true
                                    }
                                }}
                                renderChannelPreview={renderChannelPreview}
                                renderHeader={() => <div style={{ display: 'none' }} />}
                            />
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Active Chat */}
                <div className={styles.chatArea}>
                    {currentChannelUrl ? (
                        <Channel channelUrl={currentChannelUrl} />
                    ) : (
                        <div className={styles.emptyState}>
                            Seleccione una negociación o contrato para comenzar a chatear.
                        </div>
                    )}
                </div>
            </div>
        </SendbirdProvider>
    )
}
