import { showToast } from '../../utils/ToastUtils';
import Toast from 'react-native-toast-message';

jest.mock('react-native-toast-message', () => ({
  show: jest.fn(),
}));

describe('showToast', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('affiche le message personnalisé lorsque customMessage est défini', () => {
    showToast(true, 'Message personnalisé');
    expect(Toast.show).toHaveBeenCalledWith({
      type: 'info',
      text1: 'Message personnalisé',
    });
  });

  it('affiche le message de succès lorsque isConnected est true et customMessage est non défini', () => {
    showToast(true);
    expect(Toast.show).toHaveBeenCalledWith({
      type: 'success',
      text1: 'Connecté',
      text2: 'Vous êtes en ligne. Les rapports seront soumis directement.',
    });
  });

  it('affiche le message d\'erreur lorsque isConnected est false et customMessage est non défini', () => {
    showToast(false);
    expect(Toast.show).toHaveBeenCalledWith({
      type: 'error',
      text1: 'Hors ligne',
      text2: 'Vous êtes hors ligne. Les rapports seront enregistrés localement.',
    });
  });
});
