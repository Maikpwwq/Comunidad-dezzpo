import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Mock localStorage for jsdom environment
const localStorageMock = (function () {
  let store: Record<string, string> = {};
  return {
    getItem: function (key: string) { return store[key] || null; },
    setItem: function (key: string, value: string) { store[key] = value.toString(); },
    removeItem: function (key: string) { delete store[key]; },
    clear: function () { store = {}; }
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Zustand mock to reset singleton stores between tests automatically.
// Handles both simple `create(stateCreator)` and curried `create<T>()(stateCreator)` patterns,
// including middleware like `persist()`.
const { create: actualCreate, createStore: actualCreateStore } = await vi.importActual<typeof import('zustand')>('zustand');

export const storeResetFns = new Set<() => void>();

function registerStore(store: unknown): void {
  // Type guard: only register objects that have getState/setState (real Zustand stores)
  if (
    store &&
    typeof store === 'object' &&
    'getState' in store &&
    typeof (store as Record<string, unknown>).getState === 'function' &&
    'setState' in store &&
    typeof (store as Record<string, unknown>).setState === 'function'
  ) {
    const typedStore = store as { getState: () => unknown; setState: (state: unknown, replace?: boolean) => void };
    const initialState = typedStore.getState();
    storeResetFns.add(() => {
      typedStore.setState(initialState, true);
    });
  }
}

vi.mock('zustand', async (importOriginal) => {
  const actual = await importOriginal<typeof import('zustand')>();

  // Wrap `create` to handle both:
  //   create(stateCreator)        → returns store directly
  //   create<T>()(stateCreator)   → returns a function that takes stateCreator
  const mockedCreate = (...args: unknown[]) => {
    if (args.length === 0) {
      // Curried form: create<T>() returns a function
      return (stateCreator: unknown) => {
        const store = (actualCreate as Function)()(stateCreator);
        registerStore(store);
        return store;
      };
    }
    // Direct form: create(stateCreator)
    const store = (actualCreate as Function)(...args);
    registerStore(store);
    return store;
  };

  const mockedCreateStore = (...args: unknown[]) => {
    const store = (actualCreateStore as Function)(...args);
    registerStore(store);
    return store;
  };

  return {
    ...actual,
    create: mockedCreate,
    createStore: mockedCreateStore,
    default: mockedCreate,
  };
});

afterEach(() => {
  cleanup();
  storeResetFns.forEach((resetFn) => resetFn());
});
