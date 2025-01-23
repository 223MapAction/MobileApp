import * as ImagePicker from 'expo-image-picker';
import pickImage, { getCameraPermission } from '../../utils/Image';

jest.mock('expo-image-picker', () => ({
  launchImageLibraryAsync: jest.fn(),
  requestMediaLibraryPermissionsAsync: jest.fn(),
  MediaTypeOptions: {
    Images: 'Images'
  }
}));

describe('Image Picker Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    console.log = jest.fn();
  });

  describe('pickImage', () => {
    it('devrait retourner l\'URI de l\'image quand la sélection réussit', async () => {
      // Mock des permissions accordées
      ImagePicker.requestMediaLibraryPermissionsAsync.mockResolvedValueOnce({
        status: 'granted'
      });

      // Mock de la sélection d'image réussie
      ImagePicker.launchImageLibraryAsync.mockResolvedValueOnce({
        canceled: false,
        assets: [{ uri: 'test-uri' }]
      });

      const result = await pickImage();

      expect(ImagePicker.launchImageLibraryAsync).toHaveBeenCalledWith({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.5
      });
      expect(result).toEqual({ uri: 'test-uri' });
      expect(console.log).toHaveBeenCalledWith('Image sélectionnée :', 'test-uri');
    });

    it('devrait retourner un objet vide si la sélection est annulée', async () => {
      ImagePicker.requestMediaLibraryPermissionsAsync.mockResolvedValueOnce({
        status: 'granted'
      });

      ImagePicker.launchImageLibraryAsync.mockResolvedValueOnce({
        canceled: true
      });

      const result = await pickImage();

      expect(result).toEqual({});
    });

    it('devrait retourner un objet vide si les assets sont manquants', async () => {
      ImagePicker.requestMediaLibraryPermissionsAsync.mockResolvedValueOnce({
        status: 'granted'
      });

      ImagePicker.launchImageLibraryAsync.mockResolvedValueOnce({
        canceled: false,
        assets: null
      });

      const result = await pickImage();

      expect(result).toEqual({});
    });

    it('devrait retourner un objet vide si la permission est refusée', async () => {
      ImagePicker.requestMediaLibraryPermissionsAsync.mockResolvedValueOnce({
        status: 'denied'
      });

      const result = await pickImage();

      expect(result).toEqual({});
      expect(console.log).toHaveBeenCalledWith('Permission refusée.');
    });

    it('devrait gérer les erreurs de lancement du picker', async () => {
      ImagePicker.requestMediaLibraryPermissionsAsync.mockResolvedValueOnce({
        status: 'granted'
      });

      ImagePicker.launchImageLibraryAsync.mockRejectedValueOnce(
        new Error('Picker error')
      );

      const result = await pickImage();

      expect(result).toEqual({});
    });

    it('devrait gérer les erreurs de demande de permission', async () => {
      ImagePicker.requestMediaLibraryPermissionsAsync.mockRejectedValueOnce(
        new Error('Permission error')
      );

      const result = await pickImage();

      expect(result).toEqual({});
    });
  });

  describe('getCameraPermission', () => {
    it('devrait retourner true si la permission est accordée', async () => {
      ImagePicker.requestMediaLibraryPermissionsAsync.mockResolvedValueOnce({
        status: 'granted'
      });

      const result = await getCameraPermission();

      expect(result).toBe(true);
    });

    it('devrait retourner false si la permission est refusée', async () => {
      ImagePicker.requestMediaLibraryPermissionsAsync.mockResolvedValueOnce({
        status: 'denied'
      });

      const result = await getCameraPermission();

      expect(result).toBe(false);
    });

    it('devrait gérer les autres statuts de permission', async () => {
      ImagePicker.requestMediaLibraryPermissionsAsync.mockResolvedValueOnce({
        status: 'undetermined'
      });

      const result = await getCameraPermission();

      expect(result).toBe(false);
    });
  });
});