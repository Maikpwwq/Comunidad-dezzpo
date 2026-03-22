import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Box,
    Typography
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import SendbirdProvider from '@sendbird/uikit-react/SendbirdProvider'
import GroupChannel from '@sendbird/uikit-react/GroupChannel'
import '@sendbird/uikit-react/dist/index.css'

interface ChatAuditorModalProps {
    open: boolean
    channelUrl: string | null
    onClose: () => void
    title?: string
}

const appId = import.meta.env.VITE_APP_SENDBIRD_APPID
const moderatorId = import.meta.env.VITE_APP_SENDBIRD_MODERATOR_ID

export function ChatAuditorModal({ open, channelUrl, onClose, title = 'Auditoría de Chat (Solo Lectura)' }: ChatAuditorModalProps) {
    if (!open || !channelUrl) return null

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{ 
                sx: { 
                    height: '80vh', 
                    borderRadius: 3, 
                    display: 'flex', 
                    flexDirection: 'column' 
                } 
            }}
        >
            <DialogTitle sx={{ 
                bgcolor: 'linear-gradient(135deg, var(--brand-teal) 0%, var(--brand-teal-dark) 100%)', 
                color: '#fff', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                py: 2 
            }}>
                <Typography variant="h6" fontWeight={700}>
                    {title}
                </Typography>
                <IconButton onClick={onClose} sx={{ color: 'rgba(255,255,255,0.8)', '&:hover': { color: '#fff' } }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ p: 0, flex: 1, overflow: 'hidden' }}>
                <Box sx={{ 
                    height: '100%', 
                    width: '100%',
                    // Hide the message input component globally for this specific wrapper
                    '& .sendbird-message-input-wrapper': {
                        display: 'none !important'
                    }
                }}>
                    <SendbirdProvider
                        appId={appId}
                        userId={moderatorId}
                        nickname="Dezzpo Moderador"
                    >
                        <GroupChannel 
                            channelUrl={channelUrl} 
                        />
                    </SendbirdProvider>
                </Box>
            </DialogContent>
        </Dialog>
    )
}
