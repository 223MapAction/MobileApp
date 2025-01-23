import { list_user, read_user, update_user } from '../../api/user';
import http from '../../api/http';

jest.mock('../../api/http');

describe('User Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('list_user', () => {
    it('devrait récupérer tous les utilisateurs en une seule page', async () => {
      const mockUsers = {
        results: [
          { id: 1, name: 'User 1' },
          { id: 2, name: 'User 2' }
        ],
        next: null
      };
      http.get.mockResolvedValueOnce(mockUsers);

      const result = await list_user();
      expect(result).toEqual(mockUsers.results);
      expect(http.get).toHaveBeenCalledWith('/user/');
    });

    it('devrait gérer la pagination et récupérer toutes les pages', async () => {
      const page1 = {
        results: [{ id: 1, name: 'User 1' }],
        next: '/user/?page=2'
      };
      const page2 = {
        results: [{ id: 2, name: 'User 2' }],
        next: null
      };

      http.get
        .mockResolvedValueOnce(page1)
        .mockResolvedValueOnce(page2);

      const result = await list_user();
      expect(result).toHaveLength(2);
      expect(result).toEqual([...page1.results, ...page2.results]);
      expect(http.get).toHaveBeenCalledTimes(2);
    });

    it('devrait gérer les erreurs de récupération des utilisateurs', async () => {
      const mockError = new Error('Erreur de récupération');
      http.get.mockRejectedValueOnce(mockError);

      await expect(list_user()).rejects.toThrow('Erreur de récupération');
    });
  });

  describe('read_user', () => {
    it('devrait récupérer un utilisateur par son ID', async () => {
      const mockUser = { id: 1, name: 'Test User' };
      http.get.mockResolvedValueOnce(mockUser);

      const result = await read_user(1);
      expect(result).toEqual(mockUser);
      expect(http.get).toHaveBeenCalledWith('/user/1');
    });

    it('devrait gérer les erreurs de lecture utilisateur', async () => {
      const mockError = new Error('Utilisateur non trouvé');
      http.get.mockRejectedValueOnce(mockError);

      await expect(read_user(999)).rejects.toThrow('Utilisateur non trouvé');
    });
  });

  describe('update_user', () => {
    it('devrait mettre à jour un utilisateur avec avatar', async () => {
      const mockResponse = { id: 1, name: 'Updated User' };
      http.put.mockResolvedValueOnce(mockResponse);

      const userData = {
        avatar: 'file:///test.jpg',
        name: 'Updated User',
        email: 'test@test.com'
      };

      const result = await update_user(1, userData);
      expect(result).toEqual(mockResponse);
      expect(http.put).toHaveBeenCalledWith(
        '/user/1/',
        expect.any(FormData),
        expect.objectContaining({
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
      );
    });

    it('devrait mettre à jour un utilisateur sans avatar', async () => {
      const mockResponse = { id: 1, name: 'Updated User' };
      http.put.mockResolvedValueOnce(mockResponse);

      const userData = {
        name: 'Updated User',
        email: 'test@test.com'
      };

      const result = await update_user(1, userData);
      expect(result).toEqual(mockResponse);
    });

    it('devrait mettre à jour un utilisateur avec token personnalisé', async () => {
      const mockResponse = { id: 1, name: 'Updated User' };
      http.put.mockResolvedValueOnce(mockResponse);

      const userData = {
        name: 'Updated User'
      };
      const customToken = 'custom-token';

      const result = await update_user(1, userData, customToken);
      expect(result).toEqual(mockResponse);
      expect(http.put).toHaveBeenCalledWith(
        '/user/1/',
        expect.any(FormData),
        expect.objectContaining({
          headers: {
            'Authorization': 'Bearer custom-token'
          }
        })
      );
    });

    it('devrait gérer les erreurs de mise à jour', async () => {
      const mockError = new Error('Erreur de mise à jour');
      http.put.mockRejectedValueOnce(mockError);

      await expect(update_user(1, { name: 'Test' }))
        .rejects.toThrow('Erreur de mise à jour');
    });
  });
});