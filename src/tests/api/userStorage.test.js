import AsyncStorage from '@react-native-async-storage/async-storage';
import storage, { 
  getUser, 
  setUser, 
  getData, 
  setData, 
  deleteData, 
  setIncident,
  getIncidents,
  logout,
  APP_STORAGE_KEY,
  USER_STORAGE_KEY
} from '../../api/userStorage';

jest.mock('@react-native-async-storage/async-storage');
jest.mock('react-native/Libraries/Alert/Alert', () => ({ alert: jest.fn() }));

describe('UserStorage Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test direct des constantes
  it('devrait avoir les bonnes clés de stockage', () => {
    expect(APP_STORAGE_KEY).toBe("123456544GGGFGGFFFGFGFGFG");
    expect(USER_STORAGE_KEY).toBe("12345654DBGFHRGGSGSG");
  });

  describe('getData', () => {
    it('devrait retourner les données parsées', async () => {
      const testData = { test: 'value' };
      AsyncStorage.getItem.mockResolvedValue(JSON.stringify(testData));
      
      const result = await getData('test-key');
      expect(result).toEqual(testData);
    });

    it('devrait retourner defaultValue quand pas de données', async () => {
      AsyncStorage.getItem.mockResolvedValue(null);
      const defaultValue = { default: true };
      
      const result = await getData('test-key', defaultValue);
      expect(result).toBe(defaultValue);
    });

    it('devrait retourner defaultValue en cas d\'erreur', async () => {
      AsyncStorage.getItem.mockImplementation(() => {
        throw new Error('Test error');
      });
      const defaultValue = { default: true };
      
      const result = await getData('test-key', defaultValue);
      expect(result).toBe(defaultValue);
    });
  });

  describe('setData', () => {
    it('devrait appeler AsyncStorage.setItem avec les bonnes données', async () => {
      const testData = { test: 'value' };
      await setData('test-key', testData);
      
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'test-key',
        JSON.stringify(testData)
      );
    });
  });

  describe('deleteData', () => {
    it('devrait appeler AsyncStorage.removeItem', async () => {
      await deleteData('test-key');
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('test-key');
    });
  });

  describe('getUser', () => {
    it('devrait appeler getData avec USER_STORAGE_KEY', async () => {
      const mockUser = { token: 'test-token', user: { id: 1 } };
      AsyncStorage.getItem.mockResolvedValue(JSON.stringify(mockUser));
      
      const result = await getUser();
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(USER_STORAGE_KEY);
      expect(result).toEqual(mockUser);
    });

    it('devrait retourner les valeurs par défaut si pas de données', async () => {
      AsyncStorage.getItem.mockResolvedValue(null);
      
      const result = await getUser();
      expect(result).toEqual({ token: null, user: {} });
    });
  });

  describe('setUser', () => {
    it('devrait appeler setData avec USER_STORAGE_KEY', async () => {
      const userData = { token: 'test-token', user: { id: 1 } };
      await setUser(userData);
      
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        USER_STORAGE_KEY,
        JSON.stringify(userData)
      );
    });
  });

  describe('setIncident', () => {
    beforeEach(() => {
      // Reset les mocks avant chaque test
      AsyncStorage.getItem.mockReset();
      AsyncStorage.setItem.mockReset();
    });

    it('devrait ajouter un incident à la liste existante', async () => {
      const existingIncidents = [{ id: 1 }];
      AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(existingIncidents));
      
      const newIncident = { id: 2 };
      await setIncident(newIncident);
      
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'inc',
        JSON.stringify([...existingIncidents, newIncident])
      );
    });

    it('devrait créer une nouvelle liste si aucun incident n\'existe', async () => {
      AsyncStorage.getItem.mockResolvedValueOnce(null);
      
      const newIncident = { id: 1 };
      await setIncident(newIncident);
      
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'inc',
        JSON.stringify([newIncident])
      );
    });
  });

  describe('getIncidents', () => {
    it('devrait retourner la liste des incidents', async () => {
      const mockIncidents = [{ id: 1 }, { id: 2 }];
      AsyncStorage.getItem.mockResolvedValue(JSON.stringify(mockIncidents));
      
      const result = await getIncidents();
      expect(result).toEqual(mockIncidents);
    });

    it('devrait retourner un tableau vide si pas d\'incidents', async () => {
      AsyncStorage.getItem.mockResolvedValue(null);
      
      const result = await getIncidents();
      expect(result).toEqual([]);
    });
  });

  describe('logout', () => {
    it('devrait appeler deleteData avec USER_STORAGE_KEY', async () => {
      await logout();
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(USER_STORAGE_KEY);
    });
  });

  describe('default export', () => {
    it('devrait exporter les bonnes méthodes', () => {
      expect(storage.logout).toBe(logout);
      expect(storage.setUser).toBe(setUser);
      expect(storage.getUser).toBe(getUser);
    });
  });
});
