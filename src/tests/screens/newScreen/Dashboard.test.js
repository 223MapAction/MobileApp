import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Dashboard from '../../../screens/newScreen/Dashboard'; 

// Configurez le mock store
const mockStore = configureStore([]);
let store;

describe('Dashboard Component', () => {
  beforeEach(() => {
    store = mockStore({
      user: {
        token: 'mockToken',
        users: [],
      },
      incidents: [],
    });
  });

  it('renders correctly', () => {
    const { getByText } = render(
      <Provider store={store}>
        <Dashboard />
      </Provider>
    );

    expect(getByText('Nombre de problèmes reportés')).toBeTruthy();
  });

  it('loads incidents and users on mount', async () => {
    const incidentsMock = [{ id: 1, user_id: 'mockUserId', etat: 'declared' }];
    const usersMock = [{ id: 'mockUserId', first_name: 'John', last_name: 'Doe', avatar: 'mockAvatar' }];

    store = mockStore({
      user: {
        token: 'mockToken',
        users: usersMock,
      },
      incidents: incidentsMock,
    });

    const { getByText } = render(
      <Provider store={store}>
        <Dashboard />
      </Provider>
    );

    await waitFor(() => {
      expect(getByText('Nombre de problèmes reportés')).toBeTruthy();
      expect(getByText('1')).toBeTruthy();
      expect(getByText('résolus')).toBeTruthy(); 
    });
  });

  it('navigates to the incident list on button press', () => {
    const mockNavigate = jest.fn();
    const { getByText } = render(
      <Provider store={store}>
        <Dashboard navigation={{ navigate: mockNavigate }}/>
      </Provider>
    );

    const button = getByText('Nombre de problèmes reportés');
    fireEvent.press(button); 

  });
});
