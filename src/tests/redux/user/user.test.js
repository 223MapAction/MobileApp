import reducer from '../../../src/redux/user/reducer';
import constants from '../../../src/redux/user/constants';
import { onLogin, onGetUsers, onLogout } from '../../../src/redux/user/actions';

describe('User Redux', () => {
  // Tests des actions
  describe('Actions', () => {
    it('devrait créer une action de login', () => {
      const payload = {
        token: 'test-token',
        user: { id: 1, name: 'Test User' }
      };
      const expectedAction = {
        type: constants.LOGIN,
        payload
      };
      expect(onLogin(payload)).toEqual(expectedAction);
    });

    it('devrait créer une action de liste des utilisateurs', () => {
      const users = [{ id: 1, name: 'User 1' }];
      const expectedAction = {
        type: constants.LIST,
        users
      };
      expect(onGetUsers(users)).toEqual(expectedAction);
    });

    it('devrait créer une action de logout', () => {
      const expectedAction = {
        type: constants.LOGOUT
      };
      expect(onLogout()).toEqual(expectedAction);
    });
  });

  // Tests du reducer
  describe('Reducer', () => {
    const initialState = {
      users: [],
      token: null,
      user: {}
    };

    it('devrait retourner l\'état initial', () => {
      expect(reducer(undefined, {})).toEqual(initialState);
    });

    it('devrait gérer LOGIN', () => {
      const payload = {
        token: 'test-token',
        user: { id: 1, name: 'Test User' }
      };
      const action = onLogin(payload);
      const expectedState = {
        ...initialState,
        token: payload.token,
        user: payload.user
      };
      expect(reducer(initialState, action)).toEqual(expectedState);
    });

    it('devrait gérer LIST', () => {
      const users = [{ id: 1, name: 'User 1' }];
      const action = onGetUsers(users);
      const expectedState = {
        ...initialState,
        users
      };
      expect(reducer(initialState, action)).toEqual(expectedState);
    });

    it('devrait gérer LOGOUT', () => {
      const currentState = {
        users: [{ id: 1 }],
        token: 'test-token',
        user: { id: 1 }
      };
      const action = onLogout();
      const expectedState = {
        users: currentState.users,
        token: null,
        user: {}
      };
      expect(reducer(currentState, action)).toEqual(expectedState);
    });

    it('devrait préserver l\'état pour une action inconnue', () => {
      const state = {
        users: [{ id: 1 }],
        token: 'test-token',
        user: { id: 1 }
      };
      expect(reducer(state, { type: 'UNKNOWN' })).toEqual(state);
    });
  });
});
