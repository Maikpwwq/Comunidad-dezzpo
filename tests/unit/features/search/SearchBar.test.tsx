import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBar from '@/components/layout/SearchBar';
import { navigate } from 'vike/client/router';

// Mock the router
vi.mock('vike/client/router', () => ({
  navigate: vi.fn(),
}));

// Mock page context
vi.mock('@hooks/usePageContext', () => ({
  usePageContext: () => ({ urlPathname: '/' }),
}));

// Mock the data source
vi.mock('@assets/data/ListadoCategorias', () => ({
  ListadoCategorias: [
    { key: 1, label: 'Plomería', iconName: 'PlumbIcon' },
    { key: 2, label: 'Electricidad', iconName: 'ElectricIcon' },
    { key: 3, label: 'Carpintería', iconName: 'WoodIcon' },
  ],
}));

// Mock the icons to prevent SVG rendering issues
vi.mock('@assets/data/CategoryIcons', () => ({
  CategoryIcons: {
    PlumbIcon: () => <span data-testid="icon-plumb" />,
    ElectricIcon: () => <span data-testid="icon-electric" />,
    WoodIcon: () => <span data-testid="icon-wood" />,
  },
}));

describe('SearchBar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders empty state correctly (no query)', () => {
    render(<SearchBar placeholder="Buscar categoría..." />);
    const input = screen.getByPlaceholderText('Buscar categoría...');
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('');
  });

  it('renders matching items from a mocked data source when typing', async () => {
    const user = userEvent.setup();
    render(<SearchBar placeholder="Buscar categoría..." />);
    
    const input = screen.getByPlaceholderText('Buscar categoría...');
    await user.type(input, 'Plom');
    
    // MUI Autocomplete renders a listbox portal when options are available
    const listbox = await screen.findByRole('listbox');
    expect(listbox).toBeInTheDocument();
    
    const options = within(listbox).getAllByRole('option');
    expect(options).toHaveLength(1);
    expect(options[0]).toHaveTextContent('Plomería');
  });

  it('selecting a result fires the correct navigation', async () => {
    const user = userEvent.setup();
    render(<SearchBar placeholder="Buscar categoría..." />);
    
    const input = screen.getByPlaceholderText('Buscar categoría...');
    await user.type(input, 'Elec');
    
    const listbox = await screen.findByRole('listbox');
    const option = within(listbox).getByText('Electricidad');
    
    await user.click(option);
    
    expect(navigate).toHaveBeenCalledWith('/app/portal-servicios/Electricidad');
  });

  it('submitting free text query on Enter fires navigation', async () => {
    const user = userEvent.setup();
    render(<SearchBar placeholder="Buscar categoría..." />);
    
    const input = screen.getByPlaceholderText('Buscar categoría...');
    await user.type(input, 'ONASI{Enter}');
    
    expect(navigate).toHaveBeenCalledWith('/app/portal-servicios/ONASI');
  });

  it('clearing the input resets results', async () => {
    const user = userEvent.setup();
    render(<SearchBar placeholder="Buscar categoría..." />);
    
    const input = screen.getByPlaceholderText('Buscar categoría...');
    await user.type(input, 'Carp');
    
    const listbox = await screen.findByRole('listbox');
    expect(within(listbox).getAllByRole('option')).toHaveLength(1);
    
    await user.clear(input);
    
    expect(input).toHaveValue('');
  });

  it('keyboard navigation works correctly', async () => {
    const user = userEvent.setup();
    render(<SearchBar placeholder="Buscar categoría..." />);
    
    const input = screen.getByPlaceholderText('Buscar categoría...');
    
    // Open dropdown by clicking, then use ArrowDown to highlight
    await user.click(input);
    
    let listbox = await screen.findByRole('listbox');
    let options = within(listbox).getAllByRole('option');
    expect(options.length).toBeGreaterThanOrEqual(1);
    
    await user.keyboard('{ArrowDown}');
    expect(input).toHaveAttribute('aria-activedescendant');
    
    const firstFocusId = input.getAttribute('aria-activedescendant');
    
    await user.keyboard('{ArrowDown}');
    const secondFocusId = input.getAttribute('aria-activedescendant');
    expect(secondFocusId).not.toBe(firstFocusId);
    
    await user.keyboard('{ArrowUp}');
    expect(input.getAttribute('aria-activedescendant')).toBe(firstFocusId);
    
    // Escape closes the dropdown
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });
});
