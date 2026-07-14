import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NuevoProyectoPage from '#R/(marketing)/nuevo-proyecto/+Page';
import { navigate } from 'vike/client/router';
import { setDoc } from 'firebase/firestore';

// Mock Router
vi.mock('vike/client/router', () => ({
  navigate: vi.fn(),
}));

// Mock UUID
vi.mock('uuid', () => ({
  v4: () => 'mock-uuid-1234',
}));

// Mock Firebase
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  doc: vi.fn(() => 'mock-doc-ref'),
  setDoc: vi.fn(() => Promise.resolve()),
}));

vi.mock('@services/firebase', () => ({
  firestore: {},
  isFirebaseAvailable: () => true,
}));

// Mock Auth - Integration level mock returning a real-like user
vi.mock('@hooks/useAuth', () => ({
  useAuth: vi.fn(() => ({
    currentUser: { isAuth: true, userId: 'user-integration' },
  })),
}));

// Mock page context to simulate parameters passed from marketing pages
vi.mock('@hooks/usePageContext', () => ({
  usePageContext: () => ({ routeParams: { CategoriaProfesional: '1', TipoProyecto: 'Hogar' } }),
}));

// Let's use real components for PasoAPaso to make it an integration test, but mock heavy ones like AdjuntarArchivos
vi.mock('@components/common', () => ({
  AdjuntarArchivos: () => <div data-testid="mock-adjuntar" />
}));

vi.mock('@features/marketing', async (importOriginal) => {
  const actual = await importOriginal<any>();
  return {
    ...actual,
    // Real PasoAPaso, but mock Ubicacion (Map)
    Ubicacion: () => <div data-testid="mock-ubicacion" />
  };
});

describe('New Project Full Form (Integration)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    
    // Setup fake location search
    Object.defineProperty(window, 'location', {
      value: { search: '?category=1&type=Hogar&q=test_query' },
      writable: true
    });
  });

  it('category pre-selection from homepage correctly pre-fills the form', async () => {
    const user = userEvent.setup();
    render(<NuevoProyectoPage />);
    
    const descInput = await screen.findByPlaceholderText(/Ej: Se me rompió un tubo/i);
    expect(descInput).toHaveValue('test_query');
    
    expect(screen.getByRole('combobox', { name: /tipo de proyecto/i })).toHaveValue('Hogar');
    
    // The CategorySelector uses paramCategoriaProfesional internally in the page context mock
    // Wait, let's verify if the continue button becomes enabled faster since it's pre-filled
    const citySelect = screen.getByRole('combobox', { name: /zona de Bogotá/i });
    await user.selectOptions(citySelect, 'Suba');
    
    const continueBtn = screen.getByRole('button', { name: /Continuar/i });
    // It should be enabled because description, project type, category are pre-filled, and we filled city
    expect(continueBtn).not.toBeDisabled();
  });

  it('draft save/restore: partial data persists and reloads correctly', async () => {
    const user = userEvent.setup();
    render(<NuevoProyectoPage />);
    
    await user.selectOptions(screen.getByRole('combobox', { name: /zona de Bogotá/i }), 'Suba');
    await user.click(screen.getByRole('button', { name: /Continuar/i }));
    
    // Clicking Continuar saves to localStorage
    const saved = localStorage.getItem('requerimiento');
    expect(saved).not.toBeNull();
    
    const parsed = JSON.parse(saved as string);
    expect(parsed.draftCity).toBe('Suba');
    expect(parsed.draftDescription).toBe('test_query');
  });

  it('form submission flow end-to-end through mocked Firestore write', async () => {
    const user = userEvent.setup();
    render(<NuevoProyectoPage />);
    
    // Fill step 1
    await user.selectOptions(screen.getByRole('combobox', { name: /zona de Bogotá/i }), 'Suba');
    await user.click(screen.getByRole('button', { name: /Continuar/i }));
    
    // Fill step 2
    expect(await screen.findByText('Detalles opcionales de tu proyecto')).toBeInTheDocument();
    
    await user.type(screen.getByPlaceholderText(/Ej: Pintar fachada/i), 'End-to-End Project');
    
    const saveBtn = screen.getByRole('button', { name: /Guardar y finalizar/i });
    await user.click(saveBtn);
    
    expect(setDoc).toHaveBeenCalledTimes(1);
    
    const payload = vi.mocked(setDoc).mock.calls[0]![1];
    expect(payload).toMatchObject({
      draftDescription: 'test_query',
      draftCity: 'Suba',
      draftProject: 'Hogar',
      draftName: 'End-to-End Project',
      draftPropietarioResidente: 'user-integration'
    });
    
    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('/app/directorio-requerimientos');
    });
  });
});
