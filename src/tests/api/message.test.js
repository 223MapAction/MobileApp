import { create_message, list_messages, responsebymessage } from '../../api/message';
import http from '../../api/http';

jest.mock('../../api/http');

describe('Message Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create_message', () => {
    it('devrait créer un message', async () => {
      const mockResponse = { id: 1, content: 'Test message' };
      http.post.mockResolvedValueOnce(mockResponse);

      const messageData = { content: 'Test message' };
      const result = await create_message(messageData);
      
      expect(result).toEqual(mockResponse);
      expect(http.post).toHaveBeenCalledWith('/message/', messageData);
    });
  });

  describe('list_messages', () => {
    it('devrait retourner les messages d\'un utilisateur', async () => {
      const mockMessages = { messages: [{ id: 1, content: 'Test' }] };
      http.get.mockResolvedValueOnce(mockMessages);

      const result = await list_messages(1);
      expect(result).toEqual(mockMessages);
    });
  });
});
