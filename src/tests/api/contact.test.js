import { create_contact } from '../../api/contact';
import http from '../../api/http';

jest.mock('../../api/http');

describe('Contact Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create_contact', () => {
    it('devrait créer un contact avec succès', async () => {
      // Préparer les données de mock
      const mockResponse = { 
        id: 1, 
        success: true, 
        message: 'Contact créé avec succès' 
      };
      http.post.mockResolvedValueOnce(mockResponse);

      // Données de test
      const contactData = {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Test message'
      };

      // Exécuter la fonction
      const result = await create_contact(contactData);

      // Vérifications
      expect(result).toEqual(mockResponse);
      expect(http.post).toHaveBeenCalledWith('/contact/', contactData);
      expect(http.post).toHaveBeenCalledTimes(1);
    });

    it('devrait gérer les erreurs lors de la création du contact', async () => {
      // Préparer l'erreur mock
      const mockError = new Error('Erreur de création du contact');
      http.post.mockRejectedValueOnce(mockError);

      // Données de test
      const contactData = {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Test message'
      };

      // Vérifier que l'erreur est bien propagée
      await expect(create_contact(contactData)).rejects.toThrow('Erreur de création du contact');
      expect(http.post).toHaveBeenCalledWith('/contact/', contactData);
    });
  });
});
