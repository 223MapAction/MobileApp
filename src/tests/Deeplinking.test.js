import { renderHook } from '@testing-library/react-native';
import { Linking } from 'react-native';
import useDeepLinking from '../../Deeplinking';

// Mocks plus détaillés
jest.mock('react-native', () => ({
  Linking: {
    addEventListener: jest.fn(() => ({
      remove: jest.fn()
    })),
    getInitialURL: jest.fn(() => Promise.resolve(null)),
    parse: jest.fn(() => ({
      path: '',
      queryParams: {}
    }))
  }
}));

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate
  })
}));

describe('useDeepLinking Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    console.error = jest.fn();
  });

  it('devrait s\'abonner aux deep links au montage', async () => {
    Linking.getInitialURL.mockResolvedValueOnce(null);
    
    const { result } = renderHook(() => useDeepLinking());
    
    expect(Linking.addEventListener).toHaveBeenCalledWith('url', expect.any(Function));
  });

  it('devrait se désabonner au démontage', async () => {
    const mockRemove = jest.fn();
    Linking.addEventListener.mockReturnValueOnce({ remove: mockRemove });
    
    const { unmount } = renderHook(() => useDeepLinking());
    unmount();
    
    expect(mockRemove).toHaveBeenCalled();
  });

  it('devrait gérer une URL de vérification d\'email valide', async () => {
    const mockUrl = 'myapp://verify-email/token123';
    Linking.getInitialURL.mockResolvedValueOnce(mockUrl);
    Linking.parse.mockReturnValueOnce({
      path: 'verify-email',
      queryParams: {}
    });

    const { result } = renderHook(() => useDeepLinking());
    
    // Simuler l'appel du callback
    const handleDeepLink = Linking.addEventListener.mock.calls[0][1];
    await handleDeepLink({ url: mockUrl });

    expect(mockNavigate).toHaveBeenCalledWith('passwordStep', { token: 'token123' });
  });

  it('devrait ignorer les URLs non liées à la vérification d\'email', async () => {
    const mockUrl = 'myapp://other-path';
    Linking.parse.mockReturnValueOnce({
      path: 'other-path',
      queryParams: {}
    });

    renderHook(() => useDeepLinking());
    
    const handleDeepLink = Linking.addEventListener.mock.calls[0][1];
    await handleDeepLink({ url: mockUrl });

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('devrait gérer les erreurs de parse', async () => {
    const mockUrl = 'invalid-url';
    Linking.parse.mockImplementationOnce(() => {
      throw new Error('Parse error');
    });

    renderHook(() => useDeepLinking());
    
    const handleDeepLink = Linking.addEventListener.mock.calls[0][1];
    await handleDeepLink({ url: mockUrl });

    expect(console.error).toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('devrait gérer une URL initiale valide', async () => {
    const mockUrl = 'myapp://verify-email/token123';
    Linking.getInitialURL.mockResolvedValueOnce(mockUrl);
    Linking.parse.mockReturnValueOnce({
      path: 'verify-email',
      queryParams: {}
    });

    renderHook(() => useDeepLinking());

    // Attendre que les promesses soient résolues
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(mockNavigate).toHaveBeenCalledWith('passwordStep', { token: 'token123' });
  });

  it('devrait gérer les erreurs de getInitialURL', async () => {
    Linking.getInitialURL.mockRejectedValueOnce(new Error('Failed to get URL'));

    renderHook(() => useDeepLinking());

    // Attendre que les promesses soient rejetées
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(console.error).toHaveBeenCalled();
  });
});