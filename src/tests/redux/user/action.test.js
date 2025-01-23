import { onLogin, onGetUsers, onLogout } from '../../../redux/user/action';
import constants from '../../../redux/user/constantes';

describe('User Actions', () => {
  describe('onLogin', () => {
    it('devrait créer une action LOGIN avec le payload correct', () => {
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

    it('devrait gérer un payload vide', () => {
      const expectedAction = {
        type: constants.LOGIN,
        payload: undefined
      };

      expect(onLogin()).toEqual(expectedAction);
    });
  });

  describe('onGetUsers', () => {
    it('devrait créer une action LIST avec les utilisateurs', () => {
      const users = [
        { id: 1, name: 'User 1' },
        { id: 2, name: 'User 2' }
      ];

      const expectedAction = {
        type: constants.LIST,
        users
      };

      expect(onGetUsers(users)).toEqual(expectedAction);
    });

    it('devrait gérer un tableau vide', () => {
      const expectedAction = {
        type: constants.LIST,
        users: []
      };

      expect(onGetUsers([])).toEqual(expectedAction);
    });
  });

  describe('onLogout', () => {
    it('devrait créer une action LOGOUT', () => {
      const expectedAction = {
        type: constants.LOGOUT
      };

      expect(onLogout()).toEqual(expectedAction);
    });
  });
});