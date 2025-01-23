import { 
  register, 
  login, 
  registerEmail, 
  otpRequest, 
  verifyEmail, 
  verifyOtp,
  verify_token,
  refresh_token,
  get_token,
  getTokenByEmail,
  login_with_google,
  login_with_facebook,
  login_with_apple,
  fetchCSRFToken
} from '../../api/auth';
import http from '../../api/http';

jest.mock('../../api/http');

describe('Auth Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('devrait enregistrer un utilisateur avec avatar', async () => {
      const mockResponse = { success: true };
      http.post.mockResolvedValueOnce(mockResponse);

      const userData = {
        avatar: 'file:///test.png',
        email: 'test@test.com',
        name: 'Test User'
      };

      const result = await register(userData);
      expect(result).toEqual(mockResponse);
      expect(http.post).toHaveBeenCalledWith(
        '/register/',
        expect.any(FormData),
        expect.objectContaining({
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
      );
    });

    it('devrait enregistrer un utilisateur sans avatar', async () => {
      const mockResponse = { success: true };
      http.post.mockResolvedValueOnce(mockResponse);

      const userData = {
        email: 'test@test.com',
        name: 'Test User'
      };

      const result = await register(userData);
      expect(result).toEqual(mockResponse);
    });

    it('devrait gérer les erreurs d\'enregistrement', async () => {
      const mockError = new Error('Erreur d\'enregistrement');
      http.post.mockRejectedValueOnce(mockError);

      await expect(register({ email: 'test@test.com' })).rejects.toThrow();
    });
  });

  describe('login', () => {
    it('devrait connecter un utilisateur avec succès', async () => {
      const mockResponse = { token: 'test-token' };
      http.post.mockResolvedValueOnce(mockResponse);

      const result = await login({ email: 'test@test.com', password: 'password' });
      expect(result).toEqual(mockResponse);
    });

    it('devrait gérer les erreurs de connexion', async () => {
      const mockError = new Error('Identifiants invalides');
      http.post.mockRejectedValueOnce(mockError);

      await expect(login({ email: 'test@test.com', password: 'wrong' }))
        .rejects.toThrow();
    });
  });

  describe('Vérification email et OTP', () => {
    it('devrait envoyer une demande d\'enregistrement email', async () => {
      const mockResponse = { success: true };
      http.post.mockResolvedValueOnce(mockResponse);

      const result = await registerEmail('test@test.com');
      expect(result).toEqual(mockResponse);
    });

    it('devrait faire une demande OTP', async () => {
      const mockResponse = { success: true };
      http.post.mockResolvedValueOnce(mockResponse);

      const result = await otpRequest();
      expect(result).toEqual(mockResponse);
    });

    it('devrait vérifier un email avec token', async () => {
      const mockResponse = { success: true };
      http.post.mockResolvedValueOnce(mockResponse);

      const result = await verifyEmail('test-token');
      expect(result).toEqual(mockResponse);
    });

    it('devrait vérifier un OTP', async () => {
      const mockResponse = { success: true };
      http.post.mockResolvedValueOnce(mockResponse);

      const result = await verifyOtp();
      expect(result).toEqual(mockResponse);
    });
  });

  describe('Gestion des tokens', () => {
    it('devrait vérifier un token', async () => {
      const mockResponse = { valid: true };
      http.post.mockResolvedValueOnce(mockResponse);

      const result = await verify_token('test-token');
      expect(result).toEqual(mockResponse);
    });

    it('devrait rafraîchir un token', async () => {
      const mockResponse = { token: 'new-token' };
      http.post.mockResolvedValueOnce(mockResponse);

      const result = await refresh_token({ refresh: 'refresh-token' });
      expect(result).toEqual(mockResponse);
    });

    it('devrait obtenir un token par email', async () => {
      const mockResponse = { token: 'email-token' };
      http.post.mockResolvedValueOnce(mockResponse);

      const result = await getTokenByEmail('test@test.com');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('Authentification sociale', () => {
    it('devrait se connecter avec Google', async () => {
      const mockResponse = { success: true };
      http.post.mockResolvedValueOnce(mockResponse);

      const result = await login_with_google({ token: 'google-token' });
      expect(result).toEqual(mockResponse);
    });

    it('devrait se connecter avec Facebook', async () => {
      const mockResponse = { success: true };
      http.post.mockResolvedValueOnce(mockResponse);

      const result = await login_with_facebook({ token: 'facebook-token' });
      expect(result).toEqual(mockResponse);
    });

    it('devrait se connecter avec Apple', async () => {
      const mockResponse = { success: true };
      http.post.mockResolvedValueOnce(mockResponse);

      const result = await login_with_apple({ token: 'apple-token' });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('fetchCSRFToken', () => {
    it('devrait récupérer un CSRF token', async () => {
      const mockResponse = { csrf_token: 'csrf-token' };
      http.get.mockResolvedValueOnce(mockResponse);

      const result = await fetchCSRFToken();
      expect(result).toBe('csrf-token');
    });

    it('devrait gérer les erreurs de récupération du CSRF token', async () => {
      const mockError = new Error('Erreur CSRF');
      http.get.mockRejectedValueOnce(mockError);

      await expect(fetchCSRFToken()).rejects.toThrow();
    });
  });
});
