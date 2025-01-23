import React from 'react';
import { render } from '@testing-library/react-native';
import DataJourney from '../../../screens/newScreen/DataJourney';
import moment from 'moment';
import { getImage } from '../../../api/http';

// Mocks
jest.mock('../../../api/http', () => ({
  getImage: jest.fn(),
}));

jest.mock('react-native-progress', () => ({
  Bar: 'ProgressBar',
}));

jest.mock('@expo/vector-icons', () => ({
  MaterialIcons: 'MaterialIcons',
  FontAwesome: 'FontAwesome',
}));

describe('DataJourney Component', () => {
  const mockRoute = {
    params: {
      incident: {
        photo: 'test.jpg',
        zone: 'Test Zone',
        description: 'Test Description',
        created_at: '2024-01-01',
        etat: 'declared'
      }
    }
  };

  describe('getProgressDetails', () => {
    it('devrait retourner les détails corrects pour l\'état declared', () => {
      const { getByTestId } = render(
        <DataJourney route={mockRoute} navigation={{}} />
      );
      const progressBar = getByTestId('progress-bar');
      expect(progressBar.props.progress).toBe(1/3);
      expect(progressBar.props.color).toBe('#2C9CDB');
    });

    it('devrait retourner les détails corrects pour l\'état taken_into_account', () => {
      const route = {
        params: {
          incident: { ...mockRoute.params.incident, etat: 'taken_into_account' }
        }
      };
      const { getByTestId } = render(
        <DataJourney route={route} navigation={{}} />
      );
      const progressBar = getByTestId('progress-bar');
      expect(progressBar.props.progress).toBe(2/3);
      expect(progressBar.props.color).toBe('#F3D155');
    });

    it('devrait retourner les détails corrects pour l\'état resolved', () => {
      const route = {
        params: {
          incident: { ...mockRoute.params.incident, etat: 'resolved' }
        }
      };
      const { getByTestId } = render(
        <DataJourney route={route} navigation={{}} />
      );
      const progressBar = getByTestId('progress-bar');
      expect(progressBar.props.progress).toBe(1);
      expect(progressBar.props.color).toBe('#1DD000');
    });

    it('devrait retourner les détails par défaut pour un état inconnu', () => {
      const route = {
        params: {
          incident: { ...mockRoute.params.incident, etat: 'unknown' }
        }
      };
      const { getByTestId } = render(
        <DataJourney route={route} navigation={{}} />
      );
      const progressBar = getByTestId('progress-bar');
      expect(progressBar.props.progress).toBe(0);
      expect(progressBar.props.color).toBe('#D3D3D3');
    });
  });

  describe('getCheckIcon', () => {
    it('devrait afficher les icônes correctes pour l\'état declared', () => {
      const { getAllByText } = render(
        <DataJourney route={mockRoute} navigation={{}} />
      );
      const checkIcons = getAllByText('FontAwesome');
      expect(checkIcons).toHaveLength(3);
    });

    it('devrait afficher les icônes correctes pour l\'état taken_into_account', () => {
      const route = {
        params: {
          incident: { ...mockRoute.params.incident, etat: 'taken_into_account' }
        }
      };
      const { getAllByText } = render(
        <DataJourney route={route} navigation={{}} />
      );
      const checkIcons = getAllByText('FontAwesome');
      expect(checkIcons).toHaveLength(3);
    });

    it('devrait afficher les icônes correctes pour l\'état resolved', () => {
      const route = {
        params: {
          incident: { ...mockRoute.params.incident, etat: 'resolved' }
        }
      };
      const { getAllByText } = render(
        <DataJourney route={route} navigation={{}} />
      );
      const checkIcons = getAllByText('FontAwesome');
      expect(checkIcons).toHaveLength(3);
    });
  });

  describe('Rendu des détails de l\'incident', () => {
    it('devrait afficher correctement les détails de l\'incident', () => {
      const { getByText } = render(
        <DataJourney route={mockRoute} navigation={{}} />
      );
      
      expect(getByText(/Test Zone/)).toBeTruthy();
      expect(getByText(/Test Description/)).toBeTruthy();
      expect(getByText(moment('2024-01-01').format('L'))).toBeTruthy();
    });

    it('devrait gérer l\'image de l\'incident', () => {
      getImage.mockReturnValueOnce({ uri: 'mocked-image.jpg' });
      
      const { getByTestId } = render(
        <DataJourney route={mockRoute} navigation={{}} />
      );
      
      expect(getImage).toHaveBeenCalledWith('test.jpg', true);
    });
  });

  describe('translateState', () => {
    it('devrait traduire correctement les états', () => {
      const states = ['declared', 'taken_into_account', 'resolved', 'unknown'];
      const expected = ['Déclaré', 'Pris en compte', 'Résolu', 'Inconnu'];
      
      states.forEach((state, index) => {
        const route = {
          params: {
            incident: { ...mockRoute.params.incident, etat: state }
          }
        };
        const { getByText } = render(
          <DataJourney route={route} navigation={{}} />
        );
        expect(getByText(expected[index])).toBeTruthy();
      });
    });
  });
});
