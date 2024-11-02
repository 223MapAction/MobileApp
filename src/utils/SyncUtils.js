import Toast from "react-native-toast-message";
import {
  getPendingReports,
  saveReportLocally,
  updateReportStatus,
} from "../db/dbOperations";
import { create_incident } from "../api/incident";

const getZoneFromCoordinates = async (latitude, longitude) => {
  // console.log("Latitude:", latitude, "Longitude:", longitude);
  const mapboxToken = "sk.eyJ1IjoiYTc1NDJzIiwiYSI6ImNtMXFlY3UzYzBjZ2wya3NiNXYwb2tkeXMifQ.CMP-g6skERWuRRR6jeHMkA";  
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${mapboxToken}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000); 

  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    const data = await response.json();
    return data.features?.[0]?.place_name || "Zone inconnue";
  } catch (error) {
    console.error("Erreur lors de la récupération de la zone:", error);
    return "Zone inconnue";
  }
};

export const syncReportsToServer = async (
  report,
  setIsSyncing,
  onUploadProgress
) => {
  setIsSyncing(true);

  try {
    // Fetch file data if needed
    const videoData = report.video
      ? await FileSystem.readAsStringAsync(report.video, {
          encoding: FileSystem.EncodingType.Base64,
        })
      : null;
    const audioData = report.audio
      ? await FileSystem.readAsStringAsync(report.audio, {
          encoding: FileSystem.EncodingType.Base64,
        })
      : null;

       // Retrieve zone based on coordinates if not already set
    if (!report.zone || report.zone === "Zone inconnue") {
      report.zone = await getZoneFromCoordinates(report.latitude, report.longitude);
    }
    const payload = {
      ...report,
      video: videoData,
      audio: audioData,
    };

    const response = await create_incident(payload, onUploadProgress);

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
