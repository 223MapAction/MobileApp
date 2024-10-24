import React from 'react';
import { render } from '@testing-library/react-native';
import DataJourney from '../../../screens/newScreen/DataJourney'; 
import { getImage } from '../../../api/http'; 

jest.mock('../../../api/http', () => ({
  getImage: jest.fn(() => require('../../../../assets/icon.png')), 
}));

describe('DataJourney', () => {
  const incidentMock = {
    etat: 'taken_into_account',
    zone: 'Zone de test',
    description: 'Description de test',
    created_at: '2024-10-24T00:00:00Z',
    photo: 'test.jpg',
  };

  it('renders incident details correctly', () => {
    const { getByText, getByTestId } = render(<DataJourney route={{ params: { incident: incidentMock } }} />);

    expect(getByText('Zone de test')).toBeTruthy();
    expect(getByText('10/24/2024')).toBeTruthy(); 

    const progressBar = getByTestId('progress-bar');
    expect(progressBar).toBeTruthy();

    expect(progressBar.props.progress).toBe(2 / 3); 
    
  });

});
