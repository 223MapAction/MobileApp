import React from 'react';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase({ name: 'mapAction.db', location: 'default' });

export const createTable = () => {
  db.transaction(tx => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS incidents (id INTEGER PRIMARY KEY AUTOINCREMENT, photo TEXT, video TEXT, audio TEXT, latitude REAL, longitude REAL)',
      [],
      () => console.log('Table created successfully'),
      error => console.log('Error occurred while creating the table', error)
    );
  });
};

export const insertIncident = (photo, video, audio, latitude, longitude) => {
  db.transaction(tx => {
    tx.executeSql(
      'INSERT INTO incidents (photo, video, audio, latitude, longitude) VALUES (?, ?, ?, ?, ?)',
      [photo, video, audio, latitude, longitude],
      () => console.log('Incident added successfully'),
      error => console.log('Error occurred while adding the incident', error)
    );
  });
};
