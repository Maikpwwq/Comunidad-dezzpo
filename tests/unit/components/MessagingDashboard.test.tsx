import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MessagingDashboard } from '@features/messaging'

// Mock useAuth
const mockUseAuth = vi.fn()
vi.mock('@hooks/useAuth', () => ({
    useAuth: () => mockUseAuth(),
}))

// Mock SendbirdProvider and Channel
vi.mock('@sendbird/uikit-react/SendbirdProvider', () => ({
    default: ({ children, breakpoint }: { children: React.ReactNode; breakpoint: boolean }) => (
        <div data-testid="sendbird-provider" data-breakpoint={String(breakpoint)}>
            {children}
        </div>
    ),
}))

vi.mock('@sendbird/uikit-react/Channel', () => ({
    default: ({ channelUrl, onBackClick }: { channelUrl: string; onBackClick?: () => void }) => (
        <div data-testid="sendbird-channel" data-channel-url={channelUrl}>
            {onBackClick && (
                <button data-testid="back-button" onClick={onBackClick}>
                    Atrás
                </button>
            )}
        </div>
    ),
}))

vi.mock('@sendbird/uikit-react', () => ({
    useSendbirdStateContext: () => ({}),
    sendbirdSelectors: {
        getSdk: () => null,
    },
}))

describe('MessagingDashboard Component', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('renders loading placeholder when user is not logged in', () => {
        mockUseAuth.mockReturnValue({ currentUser: null })

        render(<MessagingDashboard />)
        expect(screen.getByText(/cargando chat/i)).toBeInTheDocument()
    })

    it('renders SendbirdProvider and messaging container when currentUser is logged in', () => {
        mockUseAuth.mockReturnValue({
            currentUser: {
                userId: 'test_user_123',
                displayName: 'Carlos Contratista',
            },
        })

        render(<MessagingDashboard initialChannelUrl="sendbird_group_channel_test" />)

        const provider = screen.getByTestId('sendbird-provider')
        expect(provider).toBeInTheDocument()
    })
})
