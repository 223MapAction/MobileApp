import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Profil from '../../../screens/newScreen/Profil'; 
import moment from 'moment';

const mockStore = configureStore([]);
const mockUser = {
  id: 1,
  first_name: 'John',
  last_name: 'Doe',
  date_joined: '2023-01-01T00:00:00Z',
  points: 100,
  user_type: 'Standard',
};

describe('Profil Component', () => {
  let store;
  let component;
  let instance
  beforeEach(() => {
    store = mockStore({
      user: {
        token: 'dummy_token',
        user: mockUser,
      },
      incidents: [{ id: 1, user_id: 1, photo: 'photo1.jpg' }],
      challenges: [],
    });

    component = render(
      <Provider store={store}>
        <Profil />
      </Provider>
    );
  });

  it('renders user profile information', () => {
    const { getByText } = component;
    expect(getByText(`${mockUser.first_name} ${mockUser.last_name}`)).toBeTruthy();
    expect(getByText(`Inscrit depuis ${moment(mockUser.date_joined).format('MMMM YYYY')}`)).toBeTruthy();
  });

  it('displays the correct number of incidents', () => {
    const { getByText } = component;
    expect(getByText('Vous avez reporté')).toBeTruthy();
    expect(getByText('1')).toBeTruthy(); // Nombre d'incidents pour l'utilisateur
  });

  it('shows a login message if token is missing', () => {
    store = mockStore({
      user: {
        token: null,
        user: {},
      },
      incidents: [],
      challenges: [],
    });

    const { getByText } = render(
      <Provider store={store}>
        <Profil />
      </Provider>
    );

    expect(getByText('Veuillez vous connecter pour voir votre profil')).toBeTruthy();
  });

  it('calls fetchData on refresh', async () => {
    instance.fetchData = jest.fn();

    fireEvent(instance.getByTestId('scrollView'), 'refresh');

    expect(instance.fetchData).toHaveBeenCalled();
  });
});
