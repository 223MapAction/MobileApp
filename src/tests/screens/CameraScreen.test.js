import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { ReportContext } from '../../context/ReportContext';
import App from '../../screens/CameraScreen';

jest.mock('expo-image-picker', () => ({
  requestCameraPermissionsAsync: jest.fn().mockResolvedValue({ granted: true }),
  launchCameraAsync: jest.fn().mockResolvedValue({
    canceled: false,
    assets: [{ uri: 'mockImageUri' }],
  }),
}));

jest.mock('react-native', () => {
    const RN = jest.requireActual('react-native');
    return {
      ...RN,
      Alert: {
        alert: jest.fn(),
      },
      NativeModules: {
        ...RN.NativeModules,
      },
    };
  });

const mockReportContext = {
  isSyncing: false,
  submitReport: jest.fn(),
};

describe('CameraScreen tests', () => {
  it('should request camera permission and handle image picking', async () => {
    const { getByTestId } = render(
      <ReportContext.Provider value={mockReportContext}>
        <App />
      </ReportContext.Provider>
    );

    await waitFor(() => {
      expect(require('expo-image-picker').launchCameraAsync).toHaveBeenCalled();
      expect(mockReportContext.submitReport).toHaveBeenCalled(); 
    });
  });

  it('should show an ActivityIndicator while loading', () => {
    const { getByTestId } = render(
      <ReportContext.Provider value={mockReportContext}>
        <App />
      </ReportContext.Provider>
    );

    expect(getByTestId("loading-indicator")).toBeTruthy();
  });

  it('should alert if camera permission is denied', async () => {
    require('expo-image-picker').requestCameraPermissionsAsync.mockResolvedValueOnce({ granted: false });
    
    const { getByTestId } = render(
      <ReportContext.Provider value={mockReportContext}>
        <App />
      </ReportContext.Provider>
    );

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        "Permission refusée",
        "Vous devez accorder l'accès à la caméra pour utiliser cette fonctionnalité."
      );
    });
  });
});
