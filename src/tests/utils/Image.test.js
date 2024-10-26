import pickImage from '../../utils/Image';
import * as ImagePicker from 'expo-image-picker';

jest.mock('expo-image-picker', () => ({
    requestMediaLibraryPermissionsAsync: jest.fn(),
    launchImageLibraryAsync: jest.fn(),
    MediaTypeOptions: {
      Images: 'Images',
    },
  }));
  
  describe('pickImage', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    test('should return image data when permission is granted and image is selected', async () => {
      // Mock permission granted
      ImagePicker.requestMediaLibraryPermissionsAsync.mockResolvedValue({
        status: 'granted',
      });
  
      // Mock image selected
      const mockResult = { cancelled: false, uri: 'image-uri' };
      ImagePicker.launchImageLibraryAsync.mockResolvedValue(mockResult);
  
      const result = await pickImage();
  
      expect(ImagePicker.requestMediaLibraryPermissionsAsync).toHaveBeenCalled();
      expect(ImagePicker.launchImageLibraryAsync).toHaveBeenCalledWith({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });
      expect(result).toEqual(mockResult);
    });
  
    test('should return an empty object when permission is denied', async () => {
      // Mock permission denied
      ImagePicker.requestMediaLibraryPermissionsAsync.mockResolvedValue({
        status: 'denied',
      });
  
      const result = await pickImage();
  
      expect(ImagePicker.requestMediaLibraryPermissionsAsync).toHaveBeenCalled();
      expect(result).toEqual({});
    });
  
    test('should return an empty object when image selection is cancelled', async () => {
      // Mock permission granted
      ImagePicker.requestMediaLibraryPermissionsAsync.mockResolvedValue({
        status: 'granted',
      });
  
      // Mock image selection cancelled
      const mockResult = { cancelled: true };
      ImagePicker.launchImageLibraryAsync.mockResolvedValue(mockResult);
  
      const result = await pickImage();
  
      expect(ImagePicker.requestMediaLibraryPermissionsAsync).toHaveBeenCalled();
      expect(ImagePicker.launchImageLibraryAsync).toHaveBeenCalled();
      expect(result).toEqual({});
    });
  });