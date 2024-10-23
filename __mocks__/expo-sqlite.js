// __mocks__/expo-sqlite.js
const mockOpenDatabaseSync = jest.fn().mockReturnValue({
    transaction: jest.fn((cb) => cb({
      executeSql: jest.fn(),
    })),
  });
  
  export const openDatabaseSync = mockOpenDatabaseSync;
  