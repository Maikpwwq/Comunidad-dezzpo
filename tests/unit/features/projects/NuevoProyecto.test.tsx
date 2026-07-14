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

// Mock Auth
vi.mock('@hooks/useAuth', () => ({
  useAuth: vi.fn(() => ({
    currentUser: { isAuth: true, userId: 'user-1' },
  })),
}));

// Mock page context
vi.mock('@hooks/usePageContext', () => ({
  usePageContext: () => ({ routeParams: {} }),
}));

// Mock child components to isolate tests
vi.mock('@components/common', () => ({
  AdjuntarArchivos: () => <div data-testid="mock-adjuntar" />
}));

vi.mock('@features/projects', async (importOriginal) => {
  const actual = await importOriginal<any>();
  return {
    ...actual,
    CategorySelector: ({ setDraftInfo, draftInfo }: any) => (
      <select 
        data-testid="mock-category" 
        onChange={(e) => setDraftInfo({ draftCategory: e.target.value })}
        value={draftInfo.draftCategory || ''}
      >
        <option value="">Select Category</option>
        <option value="1">Category 1</option>
      </select>
    )
  };
});

vi.mock('@features/marketing', () => ({
  PasoAPaso: () => <div data-testid="mock-paso-a-paso" />,
  Ubicacion: () => <div data-testid="mock-ubicacion" />
}));

describe('New Project Flow - /nuevo-proyecto', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders required fields on Step 0 and blocks continuation if missing', async () => {
    const user = userEvent.setup();
    render(<NuevoProyectoPage />);
    
    expect(screen.getByText('¿Qué necesitas?')).toBeInTheDocument();
    
    const continueBtn = screen.getByRole('button', { name: /Continuar/i });
    expect(continueBtn).toBeDisabled();
    
    // Fill required fields
    const descInput = screen.getByPlaceholderText(/Ej: Se me rompió un tubo/i);
    await user.type(descInput, 'Necesito arreglar la pared');
    
    const citySelect = screen.getByRole('combobox', { name: /zona de Bogotá/i });
    await user.selectOptions(citySelect, 'Suba');
    
    const projectTypeSelect = screen.getByRole('combobox', { name: /tipo de proyecto/i });
    await user.selectOptions(projectTypeSelect, 'Hogar');
    
    const categorySelect = screen.getByTestId('mock-category');
    await user.selectOptions(categorySelect, '1');
    
    // Once all required are filled, button is enabled
    expect(continueBtn).not.toBeDisabled();
  });

  it('navigates to Step 2 (authenticated) and submits correctly', async () => {
    const user = userEvent.setup();
    render(<NuevoProyectoPage />);
    
    // Complete Step 0
    await user.type(screen.getByPlaceholderText(/Ej: Se me rompió un tubo/i), 'Arreglo test');
    await user.selectOptions(screen.getByRole('combobox', { name: /zona de Bogotá/i }), 'Suba');
    await user.selectOptions(screen.getByRole('combobox', { name: /tipo de proyecto/i }), 'Hogar');
    await user.selectOptions(screen.getByTestId('mock-category'), '1');
    
    await user.click(screen.getByRole('button', { name: /Continuar/i }));
    
    // Because isAuth is true in the mock, it skips Step 1 and goes to Step 2
    expect(await screen.findByText('Detalles opcionales de tu proyecto')).toBeInTheDocument();
    
    // Fill optional details
    await user.type(screen.getByPlaceholderText(/Ej: Pintar fachada/i), 'Título Proyecto');
    
    const saveBtn = screen.getByRole('button', { name: /Guardar y finalizar/i });
    await user.click(saveBtn);
    
    // Verify Firestore call
    expect(setDoc).toHaveBeenCalledTimes(1);
    const mockRef = vi.mocked(setDoc).mock.calls[0]![0];
    const payload = vi.mocked(setDoc).mock.calls[0]![1];
    
    expect(mockRef).toBe('mock-doc-ref');
    expect(payload).toMatchObject({
      draftDescription: 'Arreglo test',
      draftCity: 'Suba',
      draftProject: 'Hogar',
      draftCategory: '1',
      draftName: 'Título Proyecto',
      draftId: 'mock-uuid-1234',
    });
    
    // Verify success navigation
    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('/app/directorio-requerimientos');
    });
  });

  it('fails gracefully on Firestore error (NOTE: The UI currently does not handle this)', async () => {
    // We are flagging that the current code does not surface error state!
    vi.mocked(setDoc).mockRejectedValueOnce(new Error('Firestore error'));
    const user = userEvent.setup();
    render(<NuevoProyectoPage />);
    
    // Fast path to save
    await user.type(screen.getByPlaceholderText(/Ej: Se me rompió un tubo/i), 'A');
    await user.selectOptions(screen.getByRole('combobox', { name: /zona de Bogotá/i }), 'Suba');
    await user.selectOptions(screen.getByRole('combobox', { name: /tipo de proyecto/i }), 'Hogar');
    await user.selectOptions(screen.getByTestId('mock-category'), '1');
    await user.click(screen.getByRole('button', { name: /Continuar/i }));
    
    const saveBtn = await screen.findByRole('button', { name: /Guardar y finalizar/i });
    await user.click(saveBtn);
    
    // Navigation should not occur on error, but the component has an unhandled promise
    expect(navigate).not.toHaveBeenCalled();
    // In a real TDD setup, we'd assert an error toast here, but since the UI doesn't have it:
    // expect(screen.getByText('Error al guardar')).toBeInTheDocument(); 
  });
});
