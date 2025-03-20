// Import des extensions de Jest pour les tests
import '@testing-library/jest-dom';

// Mock pour les fichiers de style
jest.mock('./styles/printStyles.css', () => ({}));

// Mock pour le localStorage
const mockLocalStorage = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    })
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true
});

// Mock pour window.print
Object.defineProperty(window, 'print', {
  value: jest.fn(),
  writable: true
});

// Mock pour les événements d'impression
window.matchMedia = jest.fn().mockImplementation(query => {
  return {
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  };
});

// Mock d'événement pour beforeprint
window.addEventListener = jest.fn((event, callback) => {
  if (event === 'beforeprint') {
    window.beforePrintCallback = callback;
  }
});

window.removeEventListener = jest.fn();

// Spy global sur console.error pour éviter la pollution des logs de test
console.error = jest.fn();

// Nettoyage après chaque test
afterEach(() => {
  jest.clearAllMocks();
  mockLocalStorage.clear();
});
