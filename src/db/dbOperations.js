import * as SQLite from "expo-sqlite";

// Open or create SQLite database
const db = SQLite.openDatabaseSync("incidentReports.db");

// Initialize the database table
export const initDB = () => {
  db.transaction((tx) => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS reports (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT, zone TEXT, description TEXT, photo TEXT, video TEXT, audio TEXT,
        latitude TEXT, longitude TEXT, etat TEXT, slug TEXT,
        user_id INTEGER, category_id INTEGER, indicateur_id INTEGER, 
        taken_by INTEGER, category_ids TEXT, status TEXT
      );`
    );
  });
};

// Save the report locally in SQLite
export const saveReportLocally = (report, callback) => {
  db.transaction((tx) => {
    tx.executeSql(
      `INSERT INTO reports (title, zone, description, photo, video, audio, latitude, longitude, etat, slug,
       user_id, category_id, indicateur_id, taken_by, category_ids, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        report.title,
        report.zone,
        report.description,
        report.photo,
        report.video,
        report.audio,
        report.latitude,
        report.longitude,
        report.etat,
        report.slug,
        report.user_id,
        report.category_id,
        report.indicateur_id,
        report.taken_by,
        JSON.stringify(report.category_ids),
        "pending",
      ],
      () => {
        callback(true); // Success callback
      },
      (_, error) => {
        console.error("Error saving report locally:", error);
        callback(false); // Failure callback
      }
    );
  });
};

// Update report status once synced
export const updateReportStatus = (reportId) => {
  db.transaction((tx) => {
    tx.executeSql("UPDATE reports SET status = ? WHERE id = ?", [
      "synced",
      reportId,
    ]);
  });
};

// Fetch all pending reports (not yet synced)
export const getPendingReports = (callback, errorCallback) => {
  db.transaction((tx) => {
    tx.executeSql(
      `SELECT * FROM reports WHERE status = 'pending'`,
      [],
      (_, { rows: { _array } }) => {
        callback(_array); // Pass back the pending reports
      },
      (_, error) => {
        console.error("Error fetching pending reports:", error);
        errorCallback(error);
      }
    );
  });
};
