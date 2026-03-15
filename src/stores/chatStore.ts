/**
 * Chat Store — Zustand
 *
 * Manages chat widget state:
 * - isOpen: toggle the chat panel
 * - currentPathname: captured from window.location for context-aware retrieval
 */

import { create } from 'zustand'

interface ChatState {
    isOpen: boolean
    currentPathname: string
    toggleChat: () => void
    setOpen: (open: boolean) => void
    setPathname: (pathname: string) => void
}

export const useChatStore = create<ChatState>((set) => ({
    isOpen: false,
    currentPathname: '/',

    toggleChat: () => set((s) => ({ isOpen: !s.isOpen })),
    setOpen: (open) => set({ isOpen: open }),
    setPathname: (pathname) => set({ currentPathname: pathname }),
}))
