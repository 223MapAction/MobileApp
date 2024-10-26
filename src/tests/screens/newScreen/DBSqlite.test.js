import React from 'react';
import { act } from 'react-test-renderer';
import SQLite from 'react-native-sqlite-storage';
import { createTable, insertIncident } from '../../../screens/newScreen/DBSqlite'; 

jest.mock('react-native-sqlite-storage', () => ({
    openDatabase: jest.fn(() => ({
      transaction: jest.fn(callback => {
        const tx = {
          executeSql: jest.fn((sql, params, onSuccess, onError) => {
            if (sql.includes('CREATE TABLE')) {
              onSuccess && onSuccess();
            } else if (sql.includes('INSERT INTO')) {
              onSuccess && onSuccess();
            } else {
              onError && onError(new Error('Query failed'));
            }
          }),
        };
        callback(tx);
      }),
    })),
  }));
  
  describe('Database Functions', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    test('createTable creates the incidents table successfully', () => {
      act(() => {
        createTable();
      });
  
      expect(SQLite.openDatabase).toHaveBeenCalledTimes(1);
  
      const dbInstance = SQLite.openDatabase.mock.results[0].value;
      expect(dbInstance.transaction).toHaveBeenCalledTimes(1);
  
      const txInstance = dbInstance.transaction.mock.calls[0][0];
      expect(txInstance.executeSql).toHaveBeenCalledWith(
        'CREATE TABLE IF NOT EXISTS incidents (id INTEGER PRIMARY KEY AUTOINCREMENT, photo TEXT, video TEXT, audio TEXT, latitude REAL, longitude REAL)',
        [],
        expect.any(Function),
        expect.any(Function),
      );
    });
  
    test('insertIncident adds an incident successfully', () => {
      const photo = 'photo_url';
      const video = 'video_url';
      const audio = 'audio_url';
      const latitude = 12.3456;
      const longitude = 65.4321;
  
      act(() => {
        insertIncident(photo, video, audio, latitude, longitude);
      });
  
      expect(SQLite.openDatabase).toHaveBeenCalledTimes(1);
  
      const dbInstance = SQLite.openDatabase.mock.results[0].value;
      expect(dbInstance.transaction).toHaveBeenCalledTimes(1);
  
      const txInstance = dbInstance.transaction.mock.calls[0][0];
      expect(txInstance.executeSql).toHaveBeenCalledWith(
        'INSERT INTO incidents (photo, video, audio, latitude, longitude) VALUES (?, ?, ?, ?, ?)',
        [photo, video, audio, latitude, longitude],
        expect.any(Function),
        expect.any(Function),
      );
    });
  });