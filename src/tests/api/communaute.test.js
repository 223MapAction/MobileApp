import { create_communaute, list_communaute } from '../../api/communaute';
import http from '../../api/http';

jest.mock('../../api/http');

describe('Communaute Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create_communaute', () => {
    it('devrait créer une communauté', async () => {
      const mockResponse = { id: 1, name: 'Test Community' };
      http.post.mockResolvedValueOnce(mockResponse);

      const communauteData = { name: 'Test Community' };
      const result = await create_communaute(communauteData);
      
      expect(result).toEqual(mockResponse);
      expect(http.post).toHaveBeenCalledWith('/community/', communauteData);
    });
  });

  describe('list_communaute', () => {
    it('devrait retourner la liste des communautés', async () => {
      const mockCommunautes = { results: [{ id: 1, name: 'Community 1' }] };
      http.get.mockResolvedValueOnce(mockCommunautes);

      const result = await list_communaute();
      expect(result).toEqual(mockCommunautes.results);
    });
  });
});
