import * as SQLite from "expo-sqlite";
import { db } from "./client";
import { reports } from "./schema";
import { saveFileWithUniqueName } from "../utils/fileUtils";

// Save the report locally in SQLite
export const saveReportLocally = async (report) => {
  // Save media files to local storage and get paths
  const videoPath = report.video
    ? await saveFileWithUniqueName(report.video, "video")
    : null;
  const audioPath = report.audio
    ? await saveFileWithUniqueName(report.audio, "audio")
    : null;

  try {
    await db.insert(reports).values({
      title: report.title,
      zone: report.zone,
      description: report.description,
      photo: report.photo,
      video: videoPath, // Sav  e path instead of binary data
      audio: audioPath,
      latitude: report.latitude,
      longitude: report.longitude,
      etat: report.etat,
      slug: report.slug,
      user_id: report.user_id,
      category_id: report.category_id,
      indicateur_id: report.indicateur_id,
      taken_by: report.taken_by,
      category_ids: JSON.stringify(report.category_ids),
      status: "pending",
    });
    return true; // Success
  } catch (error) {
    console.error("Error saving report locally:", error);
    return false; // Failure
  }
};

// Update report status once synced
export const updateReportStatus = async (reportId) => {
  try {
    await db
      .update(reports)
      .set({ status: "synced" })
      .where("id", reportId)
      .execute();
  } catch (error) {
    console.error("Error updating report status:", error);
  }
};

// Fetch all pending reports (not yet synced)
export const getPendingReports = async () => {
  try {
    const pendingReports = await db
      .select()
      .from(reports)
      .where("status", "pending");
    return pendingReports;
  } catch (error) {
    console.error("Error fetching pending reports:", error);
    throw error; // Rethrow error for handling elsewhere
  }
};
