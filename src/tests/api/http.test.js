import axios from 'axios';
import http, { 
  getImage, 
  ApiUrl, 
  ShareUrl, 
  ResetPasswordUrl,
  makeid,
  getUrl,
  getOptions
} from '../../api/http';
import { Alert } from 'react-native';
import { getUser } from '../../api/userStorage';

jest.mock('axios', () => ({
  create: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    interceptors: {
      response: {
        use: jest.fn()
      }
    }
  })),
}));
jest.mock('react-native/Libraries/Alert/Alert', () => ({ alert: jest.fn() }));
jest.mock('../../api/userStorage');

describe('HTTP Service', () => {
  let axiosInstance;
  let errorInterceptor;

  beforeEach(() => {
    jest.clearAllMocks();
    axiosInstance = axios.create();
    errorInterceptor = axiosInstance.interceptors.response.use.mock.calls[0][1];
  });

  describe('Configuration initiale', () => {
    it('devrait créer une instance axios avec la bonne configuration', () => {
      expect(axios.create).toHaveBeenCalledWith({
        baseURL: expect.stringContaining('/MapApi'),
        timeout: 20000,
        withCredentials: true
      });
    });

    it('devrait exporter les bonnes URLs', () => {
      expect(ApiUrl).toBe('https://api.map-action.com');
      expect(ShareUrl).toBe('https://www.actionmap.withvolkeno.com');
      expect(ResetPasswordUrl).toBe(`${ApiUrl}/MapApi/password_reset/`);
    });
  });

  describe('Intercepteur de réponse', () => {
    it('devrait gérer les erreurs 400 avec messages de validation', async () => {
      const error = {
        response: {
          status: 400,
          data: {
            errors: {
              field1: ['erreur 1'],
              field2: ['erreur 2']
            }
          }
        }
      };
      await errorInterceptor(error);
      expect(Alert.alert).toHaveBeenCalledWith('Erreur de validation', expect.any(String));
    });

    it('devrait gérer les erreurs 400 sans messages de validation', async () => {
      const error = {
        response: {
          status: 400,
          data: {}
        }
      };
      await errorInterceptor(error);
      expect(Alert.alert).toHaveBeenCalledWith('Erreur de saisie', expect.any(String));
    });

    it('devrait gérer les erreurs 401-499', async () => {
      const error = {
        response: {
          status: 401,
          data: { detail: 'Signature has expired.' }
        }
      };
      await expect(errorInterceptor(error)).rejects.toEqual({ detail: 'Signature has expired.' });
    });

    it('devrait gérer les erreurs 500+', async () => {
      const error = {
        response: {
          status: 500
        }
      };
      await errorInterceptor(error);
      expect(Alert.alert).toHaveBeenCalledWith('Erreur serveur', expect.any(String));
    });

    it('devrait propager l\'erreur si pas de status', async () => {
      const error = new Error('Network error');
      await expect(errorInterceptor(error)).rejects.toEqual(error);
    });
  });

  describe('Méthodes HTTP', () => {
    beforeEach(() => {
      getUser.mockResolvedValue({ token: 'test-token' });
    });

    it('devrait faire un appel GET avec les bonnes options', async () => {
      axiosInstance.get.mockResolvedValueOnce({ data: 'test' });
      await http.get('/test');
      expect(axiosInstance.get).toHaveBeenCalledWith('/test', expect.objectContaining({
        headers: expect.objectContaining({
          'Authorization': 'Bearer test-token'
        })
      }));
    });

    it('devrait faire un appel POST avec les bonnes options', async () => {
      axiosInstance.post.mockResolvedValueOnce({ data: 'test' });
      await http.post('/test', { data: 'test' });
      expect(axiosInstance.post).toHaveBeenCalledWith('/test', { data: 'test' }, expect.any(Object));
    });

    it('devrait faire un appel PUT avec les bonnes options', async () => {
      axiosInstance.put.mockResolvedValueOnce({ data: 'test' });
      await http.put('/test', { data: 'test' });
      expect(axiosInstance.put).toHaveBeenCalledWith('/test', { data: 'test' }, expect.any(Object));
    });

    it('devrait faire un appel DELETE', async () => {
      axiosInstance.delete.mockResolvedValueOnce({ data: 'test' });
      await http.delete('/test');
      expect(axiosInstance.delete).toHaveBeenCalledWith('/test', expect.any(Object));
    });
  });

  describe('getOptions', () => {
    it('devrait configurer les options par défaut', async () => {
      const result = await http.getOptions({});
      expect(result).toEqual({
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test-token'
        },
        timeout: 30000
      });
    });

    it('devrait préserver les en-têtes personnalisés', async () => {
      const result = await http.getOptions({
        headers: {
          'Custom-Header': 'value'
        }
      });
      expect(result.headers['Custom-Header']).toBe('value');
    });
  });

  describe('getImage', () => {
    it('devrait gérer les URIs locales', () => {
      expect(getImage('file:///test.jpg')).toEqual({ uri: 'file:///test.jpg' });
    });

    it('devrait gérer l\'avatar par défaut', () => {
      expect(getImage('/uploads/avatars/default.png', true)).toEqual(expect.any(Object));
    });

    it('devrait gérer les URIs distantes avec flag', () => {
      expect(getImage('/test.jpg', true)).toEqual({ uri: `${ApiUrl}/test.jpg` });
    });

    it('devrait gérer les URIs distantes sans flag', () => {
      expect(getImage('/test.jpg')).toEqual({ uri: `${ApiUrl}/test.jpg` });
    });

    it('devrait gérer les URIs undefined', () => {
      expect(getImage(undefined)).toEqual(expect.any(Object));
      expect(getImage(undefined, true)).toEqual(expect.any(Object));
    });
  });

  describe('upload', () => {
    it('devrait configurer correctement l\'upload', async () => {
      const formData = new FormData();
      axiosInstance.post.mockResolvedValueOnce({ data: 'test' });
      
      await http.upload(formData, '/upload');
      
      expect(axiosInstance.post).toHaveBeenCalledWith(
        '/upload',
        formData,
        expect.objectContaining({
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
      );
    });
  });

  describe('makeid', () => {
    it('devrait générer une chaîne de la longueur spécifiée', () => {
      const length = 10;
      const result = makeid(length);
      expect(result).toHaveLength(length);
      expect(result).toMatch(/^[A-Za-z0-9]+$/);
    });

    it('devrait générer des chaînes différentes', () => {
      const result1 = makeid(10);
      const result2 = makeid(10);
      expect(result1).not.toBe(result2);
    });
  });
});