import * as SQLite from "expo-sqlite";
import { db } from "./client";
import { reports } from "./schema";
import { saveFileWithUniqueName } from "../utils/fileUtils";
import { eq } from "drizzle-orm";

// Save the report locally in SQLite
export const saveReportLocally = async (report) => {
  console.log("Données reçues pour sauvegarde:", {
    latitude: report.latitude,
    longitude: report.longitude
  });

  const videoPath = report.video
    ? await saveFileWithUniqueName(report.video, "video")
    : null;
  const audioPath = report.audio
    ? await saveFileWithUniqueName(report.audio, "audio")
    : null;

  try {
    const reportData = {
      title: report.title,
      zone: report.zone ?? "zone inconnue ",
      description: report.description,
      photo: report.photo,
      video: videoPath,
      audio: audioPath,
      latitude: report.latitude,
      longitude: report.longitude,
      etat: report.etat,
      slug: report.slug,
      status: "pending",
    };

    console.log("Données à sauvegarder:", reportData);

    if (report.user_id) {
      reportData.user_id = report.user_id;
    }

    await db.insert(reports).values(reportData);
    return true;
  } catch (error) {
    console.error("Error saving report locally:", error);
    return false;
  }
};

// Update report status once synced
export const updateReportStatus = async (reportId) => {
  try {
    console.log("🟡 DÉBUT mise à jour status pour rapport ID:", reportId);

    // 1. Vérifier l'état avant la mise à jour
    const beforeUpdate = await db
      .select()
      .from(reports)
      .where(eq(reports.id, reportId))
      .get();
    console.log("📝 AVANT mise à jour:", {
      id: beforeUpdate.id,
      status: beforeUpdate.status
    });

    // 2. Faire la mise à jour
    await db
      .update(reports)
      .set({ status: "synced" })
      .where(eq(reports.id, reportId))
      .execute();
    
    // 3. Vérifier l'état après la mise à jour
    const afterUpdate = await db
      .select()
      .from(reports)
      .where(eq(reports.id, reportId))
      .get();
    console.log("✅ APRÈS mise à jour:", {
      id: afterUpdate.id,
      status: afterUpdate.status
    });

    // 4. Vérifier si la mise à jour a réussi
    if (afterUpdate.status === "synced") {
      console.log("✨ Mise à jour réussie pour rapport ID:", reportId);
    } else {
      console.log("❌ ÉCHEC de mise à jour pour rapport ID:", reportId);
    }

    return afterUpdate.status === "synced";
  } catch (error) {
    console.error("🔴 ERREUR lors de la mise à jour:", error);
    throw error;
  }
};

// Fetch all pending reports (not yet synced)
export const getPendingReports = async () => {
  try {
    console.log("🔍 Recherche des rapports en attente...");
    
    const pendingReports = await db
      .select()
      .from(reports)
      .where(eq(reports.status, "pending"));
    
    console.log("📊 Nombre de rapports en attente:", pendingReports.length);
    console.log("📋 IDs des rapports en attente:", 
      pendingReports.map(report => ({
        id: report.id,
        status: report.status
      }))
    );
    
    return pendingReports;
  } catch (error) {
    console.error("🔴 Erreur getPendingReports:", error);
    throw error;
  }
};

// Function to get all reports from the local database
export const getAllReports = async () => {
  try {
    const allReports = await db.select().from(reports).all(); // Fetch all records from the reports table
    return allReports;
  } catch (error) {
    console.error("Error fetching all reports:", error);
    throw error;
  }
};