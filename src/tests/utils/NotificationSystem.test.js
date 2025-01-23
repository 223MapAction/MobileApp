import * as Notifications from 'expo-notifications';
import { 
  requestPermissionAndGetToken, 
  listenForNotifications, 
  listenForNotificationResponse 
} from '../../utils/NotificationSystem';

jest.mock('expo-notifications');

describe('NotificationSystem', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('requestPermissionAndGetToken', () => {
    it('devrait retourner le token quand la permission est accordée', async () => {
      Notifications.requestPermissionsAsync.mockResolvedValue({ status: 'granted' });
      Notifications.getExpoPushTokenAsync.mockResolvedValue({ data: 'mock-token' });

      const result = await requestPermissionAndGetToken();
      expect(result).toBe('mock-token');
    });

    it('devrait retourner null quand la permission est refusée', async () => {
      Notifications.requestPermissionsAsync.mockResolvedValue({ status: 'denied' });

      const result = await requestPermissionAndGetToken();
      expect(result).toBeNull();
    });
  });

  describe('listenForNotifications', () => {
    it('devrait appeler le callback quand une notification est reçue', () => {
      const mockCallback = jest.fn();
      const mockNotification = { title: 'Test' };
      
      listenForNotifications(mockCallback);
      
      // Simuler la réception d'une notification
      const listener = Notifications.addNotificationReceivedListener.mock.calls[0][0];
      listener(mockNotification);

      expect(mockCallback).toHaveBeenCalledWith(mockNotification);
    });
  });

  describe('listenForNotificationResponse', () => {
    it('devrait appeler le callback quand une réponse de notification est reçue', () => {
      const mockCallback = jest.fn();
      const mockResponse = { notification: { title: 'Test' } };
      
      listenForNotificationResponse(mockCallback);
      
      // Simuler la réception d'une réponse
      const listener = Notifications.addNotificationResponseReceivedListener.mock.calls[0][0];
      listener(mockResponse);

      expect(mockCallback).toHaveBeenCalledWith(mockResponse);
    });
  });
});
