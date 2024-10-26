import Constants from '../../utils/Constants';

describe('Constants', () => {
  it('should have correct roles', () => {
    expect(Constants.roles).toEqual({
      reporter: 'reporter',
      admin: 'admin',
      visitor: 'visitor',
      citizen: 'citizen',
      business: 'business',
      elu: 'elu',
    });
  });

  it('should have correct permissions', () => {
    expect(Constants.permissions).toEqual({
      add_challenge: 1,
      participate_challenge: 2,
      promouvoir_acte_citoyen: 3,
      discussion: 4,
    });
  });

  describe('badges', () => {
    it('should have correct properties for "aucun" badge', () => {
      expect(Constants.badges.aucun).toEqual({
        label: 'pas de Badge',
        color: '#000',
        count: 0,
        permissions: [],
      });
    });

    it('should have correct properties for "cuivre" badge', () => {
      expect(Constants.badges.cuivre).toEqual({
        label: 'Badge cuivre',
        color: 'rgb(178, 54, 20)',
        count: 1,
        permissions: [Constants.permissions.participate_challenge],
      });
    });

    it('should have correct properties for "bronze" badge', () => {
      expect(Constants.badges.bronze).toEqual({
        label: 'Badge bronze',
        color: '#F0C016',
        count: 3,
        permissions: [
          Constants.permissions.participate_challenge,
          Constants.permissions.promouvoir_acte_citoyen,
        ],
      });
    });

    it('should have correct properties for "argent" badge', () => {
      expect(Constants.badges.argent).toEqual({
        label: 'Badge argent',
        color: '#DBDBDB',
        count: 5,
        permissions: [
          Constants.permissions.add_challenge,
          Constants.permissions.participate_challenge,
          Constants.permissions.promouvoir_acte_citoyen,
        ],
      });
    });

    it('should have correct properties for "gold" badge', () => {
      expect(Constants.badges.gold).toEqual({
        label: 'Badge gold',
        color: '#F8F14F',
        count: 10,
        permissions: [
          Constants.permissions.add_challenge,
          Constants.permissions.discussion,
          Constants.permissions.participate_challenge,
          Constants.permissions.promouvoir_acte_citoyen,
        ],
      });
    });
  });

  it('should have correct incident states', () => {
    expect(Constants.incidents.state).toEqual({
      declared: 'declared',
      resolved: 'resolved',
    });
  });
});
