import Toast from "react-native-toast-message";
import { getPendingReports } from "../db/dbOperations";

export const syncReportsToServer = (
  report,
  db,
  saveReportLocally,
  setIsSyncing,
  onUploadProgress
) => {
  setIsSyncing(true);

  create_incident(report, onUploadProgress)
    .then((response) => {
      if (response.ok) {
        db.transaction((tx) => {
          tx.executeSql("UPDATE reports SET status = ? WHERE id = ?", [
            "synced",
            report.id,
          ]);
        });

        Toast.show({
          type: "success",
          text1: "Rapport synchronisé",
          text2: `Le rapport "${report.title}" a été synchronisé avec succès.`,
        });
      } else {
        saveReportLocally(report);
        Toast.show({
          type: "error",
          text1: "Échec de synchronisation",
          text2: "Impossible de soumettre le rapport en ligne.",
        });
      }
    })
    .catch((error) => {
      console.error("Error submitting report:", error);
      saveReportLocally(report);
    })
    .finally(() => {
      setIsSyncing(false);
    });
};

// Fetch pending reports (those with 'pending' status)
export const fetchPendingReports = () => {
  return new Promise((resolve, reject) => {
    getPendingReports((reports) => {
      resolve(reports);
    }, reject);
  });
};
