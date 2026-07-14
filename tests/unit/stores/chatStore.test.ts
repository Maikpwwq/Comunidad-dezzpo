import { describe, it, expect } from 'vitest';
import { useChatStore } from '@/stores/chatStore';

describe('chatStore', () => {
  // The global setup.ts mock automatically resets Zustand stores after each test.
  // However, we ensure a clean state explicitly if needed.

  it('should have initial state', () => {
    const state = useChatStore.getState();
    expect(state.isOpen).toBe(false);
    expect(state.currentPathname).toBe('/');
  });

  it('should toggle chat state', () => {
    useChatStore.getState().toggleChat();
    expect(useChatStore.getState().isOpen).toBe(true);

    useChatStore.getState().toggleChat();
    expect(useChatStore.getState().isOpen).toBe(false);
  });

  it('should set open state explicitly', () => {
    useChatStore.getState().setOpen(true);
    expect(useChatStore.getState().isOpen).toBe(true);

    useChatStore.getState().setOpen(false);
    expect(useChatStore.getState().isOpen).toBe(false);
  });

  it('should set current pathname', () => {
    useChatStore.getState().setPathname('/app/portal-servicios');
    expect(useChatStore.getState().currentPathname).toBe('/app/portal-servicios');
  });
});
