import { describe, it, expect, beforeEach } from 'vitest';
import { useUserStore } from '@/stores/userStore';

describe('userStore', () => {
  beforeEach(() => {
    // Clear storage to prevent cross-test contamination due to persist middleware
    localStorage.clear();
  });

  it('should have initial state', () => {
    const state = useUserStore.getState();
    expect(state.userId).toBeNull();
    expect(state.isAuth).toBe(false);
    expect(state.rol).toBeNull();
  });

  it('should update user information', () => {
    useUserStore.getState().updateUser({
      userId: '123',
      displayName: 'John Doe',
      email: 'john@example.com'
    });

    const state = useUserStore.getState();
    expect(state.userId).toBe('123');
    expect(state.displayName).toBe('John Doe');
    expect(state.email).toBe('john@example.com');
  });

  it('should update authentication and role state', () => {
    useUserStore.getState().updateIsAuth(true);
    useUserStore.getState().updateRol(1);

    expect(useUserStore.getState().isAuth).toBe(true);
    expect(useUserStore.getState().rol).toBe(1);
  });

  it('should clear user state', () => {
    useUserStore.getState().updateUser({ userId: '123', isAuth: true });
    useUserStore.getState().clearUser();

    const state = useUserStore.getState();
    expect(state.userId).toBeNull();
    expect(state.isAuth).toBe(false);
  });

  it('should manage contact arrays', () => {
    const phone = { number: '555-1234', type: 'mobile', isPrimary: true };
    useUserStore.getState().addContact('phones', phone as any);
    
    expect(useUserStore.getState().phones.length).toBe(1);
    expect(useUserStore.getState().phones[0]?.number).toBe('555-1234');

    useUserStore.getState().removeContact('phones', 0);
    // Since it's primary, the store logic prevents removal if isPrimary is true!
    expect(useUserStore.getState().phones.length).toBe(1);

    // Add a non-primary
    useUserStore.getState().addContact('phones', { number: '555-0000', type: 'work', isPrimary: false } as any);
    expect(useUserStore.getState().phones.length).toBe(2);
    
    // Remove the non-primary
    useUserStore.getState().removeContact('phones', 1);
    expect(useUserStore.getState().phones.length).toBe(1);
  });

  it('should toggle favorites and saved drafts', () => {
    useUserStore.getState().toggleSavedDraft('draft-1');
    expect(useUserStore.getState().savedDrafts).toContain('draft-1');

    useUserStore.getState().toggleSavedDraft('draft-1');
    expect(useUserStore.getState().savedDrafts).not.toContain('draft-1');

    useUserStore.getState().toggleLikedProfile('prof-1');
    expect(useUserStore.getState().likedProfiles).toContain('prof-1');
  });
});
