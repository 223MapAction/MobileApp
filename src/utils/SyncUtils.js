import Toast from "react-native-toast-message";
import {
  getPendingReports,
  saveReportLocally,
  updateReportStatus,
} from "../db/dbOperations";
import { create_incident } from "../api/incident";
export const syncReportsToServer = async (
  report,
  setIsSyncing,
  onUploadProgress
) => {
  setIsSyncing(true);

  try {
    const response = await create_incident(report, onUploadProgress);

    if (response.ok) {
      // Update report status to 'synced' in the database
      await updateReportStatus(report.id);

      Toast.show({
        type: "success",
        text1: "Rapport synchronisé",
        text2: `Le rapport "${report.title}" a été synchronisé avec succès.`,
      });
    } else {
      await saveReportLocally(report);
      Toast.show({
        type: "error",
        text1: "Échec de synchronisation",
        text2: "Impossible de soumettre le rapport en ligne.",
      });
    }
  } catch (error) {
    console.error("Error submitting report:", error);
    await saveReportLocally(report);
  } finally {
    setIsSyncing(false);
  }
};

// Fetch pending reports (those with 'pending' status)
export const fetchPendingReports = async () => {
  try {
    const reports = await getPendingReports();
    return reports;
  } catch (error) {
    console.error("Error fetching pending reports:", error);
    throw error; // Rethrow error for handling elsewhere
  }
};