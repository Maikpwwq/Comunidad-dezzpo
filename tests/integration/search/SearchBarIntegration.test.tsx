import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QuickMatch } from '@/features/marketing/components/QuickMatch';

// Mock Router
vi.mock('vike/client/router', () => ({
  navigate: vi.fn(),
}));

describe('Search Bar (Integration)', () => {

  it.skip('Real Zustand store receives and surfaces search results correctly', () => {
    // FLAG EXPLICITLY: The project currently does not use a Zustand store for search results.
    // QuickMatch uses local `useState` for fuzzy matching.
    // SearchBar navigates immediately via `vike/client/router` without hitting a store.
    // Therefore, a meaningful test involving a Zustand search store cannot be written with the current codebase.
    expect(true).toBe(false);
  });

  it.skip('Filter state survives a simulated navigation away and back', () => {
    // FLAG EXPLICITLY: Since there is no Zustand search store, filter state does not survive 
    // navigation away and back in the current implementation of QuickMatch or SearchBar.
    expect(true).toBe(false);
  });

  // Let's test the closest existing integration behavior: QuickMatch fallback navigation
  it('QuickMatch fallback navigation to /nuevo-proyecto works', async () => {
    const user = userEvent.setup();
    render(<QuickMatch />);
    
    const input = screen.getByPlaceholderText(/Ej: plomero, electricista/i);
    await user.type(input, 'NonExistentService');
    
    // Hit enter
    await user.keyboard('{Enter}');
    
    const { navigate } = await import('vike/client/router');
    expect(navigate).toHaveBeenCalledWith('/nuevo-proyecto?q=NonExistentService');
  });

});
