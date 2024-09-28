import * as SQLite from "expo-sqlite";
import { db } from "./client";
import { reports } from "./schema";

//This is for testing purposes only
//TODO TO delete before going to prod
export const initDB = async () => {
  try {
    await db.transaction(async (tx) => {
      // Create the reports table if it does not exist

      // Insert sample data
      await tx.insert(reports).values({
        title: "Sample Report 1",
        zone: "Zone A",
        description: "Description for Sample Report 1",
        photo: "sample1.jpg",
        video: "sample1.mp4",
        audio: "sample1.mp3",
        latitude: "12.34",
        longitude: "56.78",
        etat: "new",
        slug: "sample-report-1",
        user_id: 1,
        category_id: 1,
        indicateur_id: 1,
        taken_by: 1,
        category_ids: JSON.stringify([1, 2]),
        status: "pending",
      });

      await tx.insert(reports).values({
        title: "Sample Report 2",
        zone: "Zone B",
        description: "Description for Sample Report 2",
        photo: "sample2.jpg",
        video: "sample2.mp4",
        audio: "sample2.mp3",
        latitude: "23.45",
        longitude: "67.89",
        etat: "new",
        slug: "sample-report-2",
        user_id: 2,
        category_id: 2,
        indicateur_id: 2,
        taken_by: 2,
        category_ids: JSON.stringify([3, 4]),
        status: "pending",
      });

      // Read the inserted sample data
      const sampleReports = await tx.select().from(reports);
      console.log("Sample Reports:", sampleReports);
    });
  } catch (error) {
    console.error("Error initializing database:", error);
  }
};

// Save the report locally in SQLite
export const saveReportLocally = async (report) => {
  try {
    await db.insert(reports).values({
      title: report.title,
      zone: report.zone,
      description: report.description,
      photo: report.photo,
      video: report.video,
      audio: report.audio,
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
