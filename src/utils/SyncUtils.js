import { syncReportsToServer } from './SyncUtils';
import * as api from '../api/incident';
import * as dbOperations from '../db/dbOperations';
import Toast from 'react-native-toast-message';

jest.mock('react-native-toast-message', () => ({
  show: jest.fn(),
}));

jest.spyOn(dbOperations, 'updateReportStatus').mockResolvedValue(true);

describe('syncReportsToServer', () => {
  it('should sync reports to the server successfully', async () => {
    const mockReport = { id: 1, title: 'Test Report' };
    const mockSetIsSyncing = jest.fn();
    jest.spyOn(api, 'create_incident').mockResolvedValue({ ok: true });

    await syncReportsToServer(mockReport, mockSetIsSyncing, jest.fn());

    expect(mockSetIsSyncing).toHaveBeenCalledWith(false);
    expect(Toast.show).toHaveBeenCalledWith({
      type: 'success',
      text1: 'Rapport synchronisé',
      text2: `Le rapport "${mockReport.title}" a été synchronisé avec succès.`,
    });
  });
  it('should handle errors and save report locally', async () => {
    const mockReport = { id: 1, title: 'Test Report' };
    const mockSetIsSyncing = jest.fn();
    jest.spyOn(api, 'create_incident').mockRejectedValue(new Error('Network Error'));
    jest.spyOn(dbOperations, 'saveReportLocally').mockResolvedValue(true);
  
    await syncReportsToServer(mockReport, mockSetIsSyncing, jest.fn());
  
    expect(mockSetIsSyncing).toHaveBeenCalledWith(false);
    expect(dbOperations.saveReportLocally).toHaveBeenCalledWith(mockReport);
    expect(Toast.show).toHaveBeenCalledWith({
      type: 'error',
      text1: 'Échec de synchronisation',
      text2: 'Impossible de soumettre le rapport en ligne.',
    });
  });
  
});
