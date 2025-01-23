import { create_challenge, list_challenge, participate, un_participate, makeid } from '../../api/challenge';
import http from '../../api/http';
import { list_user } from '../../api/user';

jest.mock('../../api/http');
jest.mock('../../api/user');

describe('Challenge Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create_challenge', () => {
    it('devrait créer un challenge avec photo et vidéo', async () => {
      const mockResponse = { id: 1, title: 'Test Challenge' };
      http.upload.mockResolvedValueOnce(mockResponse);

      const challengeData = {
        title: 'Test Challenge',
        photo: 'file:///test.jpg',
        video: 'file:///test.mp4'
      };

      const result = await create_challenge(challengeData);
      expect(result).toEqual(mockResponse);
      expect(http.upload).toHaveBeenCalled();
    });
  });

  describe('list_challenge', () => {
    it('devrait retourner la liste des challenges avec les participants', async () => {
      const mockEvents = { results: [{ id: 1, user_id: 1 }] };
      const mockUsers = [{ id: 1, name: 'Test User' }];
      const mockParticipates = [{ evenement_id: 1, user_id: 2 }];

      http.get.mockResolvedValueOnce(mockEvents);
      list_user.mockResolvedValueOnce(mockUsers);
      http.get.mockResolvedValueOnce({ results: mockParticipates });

      const result = await list_challenge();
      expect(result[0].user).toBeDefined();
      expect(result[0].participates).toHaveLength(1);
    });
  });

  describe('makeid', () => {
    it('devrait générer une chaîne de la longueur spécifiée', () => {
      const length = 10;
      const result = makeid(length);
      expect(result).toHaveLength(length);
    });
  });
});
