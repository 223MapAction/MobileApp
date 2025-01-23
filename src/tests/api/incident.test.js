import { create_incident, list_incident, my_list_incident } from '../../api/incident';
import http from '../../api/http';

jest.mock('../../api/http');

describe('Service Incident', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create_incident', () => {
    it('devrait créer un incident avec succès', async () => {
      const mockResponse = { status: 201, data: { id: 1 } };
      http.upload.mockResolvedValueOnce(mockResponse);

      const incidentData = {
        title: 'Test',
        description: 'Description test',
        photo: 'file:///test.jpg'
      };

      const result = await create_incident(incidentData);
      expect(result.ok).toBe(true);
      expect(result.data).toEqual(mockResponse.data);
    });
  });

  describe('list_incident', () => {
    it('devrait retourner la liste des incidents', async () => {
      const mockIncidents = {
        results: [
          { id: 1, user_id: { id: 1, name: 'Test' } }
        ]
      };
      http.get.mockResolvedValueOnce(mockIncidents);

      const result = await list_incident();
      expect(result).toHaveLength(1);
      expect(result[0].user_id).toBe(1);
    });
  });
}); 