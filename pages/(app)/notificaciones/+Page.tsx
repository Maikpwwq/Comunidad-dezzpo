/**
 * Notificaciones (Notifications) Page
 *
 * Full-featured Notification Center:
 * - Real-time synchronization
 * - Filter tabs (All, Unread, System Announcements, Service Updates, Social Activity)
 * - Individual & bulk mark-as-read actions
 * - Interactive action cards with deep-linking
 */

import React, { useState, useMemo } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    Chip,
    Tabs,
    Tab,
    Avatar,
    IconButton,
    Tooltip,
    Skeleton,
} from '@mui/material'

import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import DoneAllIcon from '@mui/icons-material/DoneAll'
import CampaignIcon from '@mui/icons-material/Campaign'
import FavoriteIcon from '@mui/icons-material/Favorite'
import CommentIcon from '@mui/icons-material/Comment'
import RequestQuoteIcon from '@mui/icons-material/RequestQuote'
import AssignmentIcon from '@mui/icons-material/Assignment'
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard'
import PendingActionsIcon from '@mui/icons-material/PendingActions'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'

import { useUserStore } from '@stores/userStore'
import { useNotificationStore } from '@stores/useNotificationStore'
import type { NotificationDocument, NotificationType } from '@services/types'
import { navigate } from 'vike/client/router'

const TYPE_CONFIG: Record<
    NotificationType,
    { icon: React.ReactElement; color: string; label: string }
> = {
    system_announcement: {
        icon: <CampaignIcon color="primary" />,
        color: '#0284c7',
        label: 'Anuncio de Plataforma',
    },
    pending_action: {
        icon: <PendingActionsIcon color="warning" />,
        color: '#d97706',
        label: 'Acción Requerida',
    },
    profile_favorite: {
        icon: <FavoriteIcon sx={{ color: '#ec4899' }} />,
        color: '#ec4899',
        label: 'Favorito Recibido',
    },
    profile_comment: {
        icon: <CommentIcon color="info" />,
        color: '#3b82f6',
        label: 'Comentario en Perfil',
    },
    quote_received: {
        icon: <RequestQuoteIcon color="success" />,
        color: '#16a34a',
        label: 'Cotización Recibida',
    },
    contract_update: {
        icon: <AssignmentIcon color="secondary" />,
        color: '#9333ea',
        label: 'Actualización de Contrato',
    },
    referral_earned: {
        icon: <CardGiftcardIcon sx={{ color: '#eab308' }} />,
        color: '#ca8a04',
        label: 'Premio / Referido',
    },
}

export default function Page() {
    const currentUserId = useUserStore((state) => state.userId)
    const notifications = useNotificationStore((state) => state.notifications)
    const unreadCount = useNotificationStore((state) => state.unreadCount)
    const loading = useNotificationStore((state) => state.loading)
    const markRead = useNotificationStore((state) => state.markRead)
    const markAllRead = useNotificationStore((state) => state.markAllRead)

    const [activeTab, setActiveTab] = useState<string>('all')

    const filteredNotifications = useMemo(() => {
        return notifications.filter((n) => {
            if (activeTab === 'unread') return !n.isRead
            if (activeTab === 'system') return n.type === 'system_announcement'
            if (activeTab === 'services')
                return n.type === 'quote_received' || n.type === 'contract_update' || n.type === 'pending_action'
            if (activeTab === 'social')
                return n.type === 'profile_favorite' || n.type === 'profile_comment' || n.type === 'referral_earned'
            return true
        })
    }, [notifications, activeTab])

    const handleCardClick = async (notif: NotificationDocument) => {
        const notifId = notif.notificationId || notif.id
        if (notifId && !notif.isRead) {
            await markRead(notifId)
        }
        if (notif.actionUrl) {
            navigate(notif.actionUrl)
        }
    }

    return (
        <Container fluid className="p-0 h-100">
            <Row className="m-0 w-100 d-flex pt-4 pb-4">
                <Col className="col-12 max-width-lg mx-auto">
                    {/* Header */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                        <Box>
                            <Typography variant="h4" fontWeight={800} color="text.primary">
                                Notificaciones
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Entérate de novedades, estados de tus servicios e interacciones en tiempo real.
                            </Typography>
                        </Box>

                        {unreadCount > 0 && currentUserId && (
                            <Button
                                variant="outlined"
                                color="primary"
                                startIcon={<DoneAllIcon />}
                                onClick={() => markAllRead(currentUserId)}
                                sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 700 }}
                            >
                                Marcar todas como leídas ({unreadCount})
                            </Button>
                        )}
                    </Box>

                    {/* Filter Tabs */}
                    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                        <Tabs
                            value={activeTab}
                            onChange={(_, val) => setActiveTab(val)}
                            variant="scrollable"
                            scrollButtons="auto"
                        >
                            <Tab label={`Todas (${notifications.length})`} value="all" sx={{ fontWeight: 600 }} />
                            <Tab label={`Sin leer (${unreadCount})`} value="unread" sx={{ fontWeight: 600 }} />
                            <Tab label="Anuncios de Plataforma" value="system" sx={{ fontWeight: 600 }} />
                            <Tab label="Servicios y Cotizaciones" value="services" sx={{ fontWeight: 600 }} />
                            <Tab label="Social y Perfil" value="social" sx={{ fontWeight: 600 }} />
                        </Tabs>
                    </Box>

                    {/* Notifications List */}
                    {loading ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Skeleton variant="rounded" height={80} sx={{ borderRadius: 3 }} />
                            <Skeleton variant="rounded" height={80} sx={{ borderRadius: 3 }} />
                            <Skeleton variant="rounded" height={80} sx={{ borderRadius: 3 }} />
                        </Box>
                    ) : filteredNotifications.length === 0 ? (
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                minHeight: '280px',
                                color: 'text.secondary',
                                bgcolor: 'background.paper',
                                borderRadius: 4,
                                p: 4,
                                boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                            }}
                        >
                            <NotificationsNoneIcon sx={{ fontSize: 64, mb: 2, opacity: 0.4 }} />
                            <Typography variant="h6" fontWeight={700}>
                                No hay notificaciones en esta sección
                            </Typography>
                            <Typography variant="body2" sx={{ mt: 0.5, textAlign: 'center' }}>
                                Te avisaremos cuando haya actualizaciones importantes sobre tus proyectos o perfil.
                            </Typography>
                        </Box>
                    ) : (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {filteredNotifications.map((item, index) => {
                                const cfg = TYPE_CONFIG[item.type] || TYPE_CONFIG.system_announcement
                                const dateFormatted = item.createdAt
                                    ? new Date(item.createdAt).toLocaleDateString('es-CO', {
                                          day: '2-digit',
                                          month: 'short',
                                          hour: '2-digit',
                                          minute: '2-digit',
                                      })
                                    : ''

                                return (
                                    <Card
                                        key={item.notificationId || index}
                                        onClick={() => handleCardClick(item)}
                                        sx={{
                                            borderRadius: 3,
                                            boxShadow: item.isRead ? '0 2px 6px rgba(0,0,0,0.03)' : '0 4px 16px rgba(15,118,110,0.12)',
                                            borderLeft: `5px solid ${cfg.color}`,
                                            bgcolor: item.isRead ? 'background.paper' : 'rgba(15, 118, 110, 0.03)',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease-in-out',
                                            '&:hover': {
                                                transform: 'translateY(-2px)',
                                                boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
                                            },
                                        }}
                                    >
                                        <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                                {/* Actor Avatar or Type Icon */}
                                                {item.metadata?.actorPhotoUrl ? (
                                                    <Avatar src={item.metadata.actorPhotoUrl} sx={{ width: 44, height: 44 }} />
                                                ) : (
                                                    <Avatar
                                                        sx={{
                                                            bgcolor: `${cfg.color}15`,
                                                            width: 44,
                                                            height: 44,
                                                        }}
                                                    >
                                                        {cfg.icon}
                                                    </Avatar>
                                                )}

                                                {/* Content */}
                                                <Box sx={{ flexGrow: 1 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, mb: 0.5 }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <Typography variant="subtitle1" fontWeight={item.isRead ? 600 : 800}>
                                                                {item.title}
                                                            </Typography>
                                                            {!item.isRead && (
                                                                <Chip label="Nueva" size="small" color="primary" sx={{ height: 20, fontSize: '0.7rem' }} />
                                                            )}
                                                        </Box>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {dateFormatted}
                                                        </Typography>
                                                    </Box>

                                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                        {item.body}
                                                    </Typography>

                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                                                        <Chip
                                                            label={cfg.label}
                                                            size="small"
                                                            variant="outlined"
                                                            sx={{ borderColor: `${cfg.color}40`, color: cfg.color, height: 22, fontSize: '0.72rem' }}
                                                        />
                                                        {item.actionUrl && (
                                                            <Typography variant="caption" color="primary" fontWeight={700}>
                                                                Ver detalles →
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                </Box>

                                                {/* Read check icon */}
                                                {!item.isRead && (
                                                    <Tooltip title="Marcar como leída">
                                                        <IconButton
                                                            size="small"
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                if (item.notificationId || item.id) {
                                                                    markRead(item.notificationId || item.id)
                                                                }
                                                            }}
                                                        >
                                                            <CheckCircleOutlineIcon fontSize="small" color="action" />
                                                        </IconButton>
                                                    </Tooltip>
                                                )}
                                            </Box>
                                        </CardContent>
                                    </Card>
                                )
                            })}
                        </Box>
                    )}
                </Col>
            </Row>
        </Container>
    )
}
