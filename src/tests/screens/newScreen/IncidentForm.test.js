import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import IncidentForm from '../../../screens/newScreen/IncidentForm';
import { ReportContext } from '../../../context/ReportContext';
import { useRoute } from '@react-navigation/native';

jest.mock('expo-av', () => ({
  Audio: {
    usePermissions: jest.fn().mockReturnValue([{}, jest.fn()]),
    requestPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
    Sound: {
      createAsync: jest.fn().mockResolvedValue({
        sound: {
          setOnPlaybackStatusUpdate: jest.fn(),
          pauseAsync: jest.fn(),
          playAsync: jest.fn(),
          setPositionAsync: jest.fn(),
        },
      }),
    },
  },
  Video: jest.fn(),
}));
jest.mock('expo-sqlite/next', () => ({
  openDatabaseSync: jest.fn().mockReturnValue({
    transaction: jest.fn((callback) => callback({
      executeSql: jest.fn(),
    })),
  }),
}));

jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  getCurrentPositionAsync: jest.fn(),
}));

jest.mock('expo-image-picker', () => ({
  requestCameraPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  launchImageLibraryAsync: jest.fn(),
}));

jest.mock('react-native-vector-icons/MaterialIcons', () => 'Icon');
jest.mock('@react-navigation/native', () => ({
  useRoute: jest.fn(),
}));

describe('IncidentForm', () => {
  const mockSubmitReport = jest.fn();
  
  beforeEach(() => {
    useRoute.mockReturnValue({
      params: {
        report: {
          title: '',
          description: '',
          audio: null,
          photo: null,
          video: null,
          zone:'zone automatique'
        },
      },
    });
    mockSubmitReport.mockClear();
  });

  it('affiche le titre et la description de base', () => {
    const { getByPlaceholderText } = render(
      <ReportContext.Provider value={{ submitReport: mockSubmitReport, isSyncing: false }}>
        <IncidentForm />
      </ReportContext.Provider>
    );

    expect(getByPlaceholderText("Titre de l'incident")).toBeTruthy();
    expect(getByPlaceholderText("Description")).toBeTruthy();
  });

  it('soumet le formulaire avec succès', async () => {
    const { getByPlaceholderText, getByText, getByLabelText } = render(
      <ReportContext.Provider value={{ submitReport: mockSubmitReport, isSyncing: false }}>
        <IncidentForm />
      </ReportContext.Provider>
    );

    fireEvent.changeText(getByPlaceholderText("Titre de l'incident"), 'Test Incident');
    fireEvent.changeText(getByPlaceholderText('Description'), 'Test Description');

    fireEvent.press(getByText('Envoyer'));

    await waitFor(() => {
      console.log('Formulaire soumis');
      expect(mockSubmitReport).toHaveBeenCalled();
    }, { timeout: 3000 }); 
  });
  
  it('affiche un message d\'erreur si le titre ou la description est manquant', async () => {
    const { getByText, queryByText } = render(
      <ReportContext.Provider value={{ submitReport: mockSubmitReport, isSyncing: false }}>
        <IncidentForm />
      </ReportContext.Provider>
    );

    fireEvent.press(getByText('Envoyer'));

    await waitFor(() => {
      expect(queryByText("Veuillez remplir tous les champs obligatoires")).toBeTruthy();
    }, { timeout: 3000 }); 
  });
  
});
