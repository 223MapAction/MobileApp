import * as TaskManager from "expo-task-manager";
import * as BackgroundFetch from "expo-background-fetch";
import NetInfo from "@react-native-community/netinfo";
import { fetchPendingReports, syncReportsToServer } from "../utils/SyncUtils";

// Task name for background sync
const BACKGROUND_SYNC_TASK = "mapaction-background-sync-task";

// Register the background task
TaskManager.defineTask(BACKGROUND_SYNC_TASK, async () => {
  try {
    const netInfo = await NetInfo.fetch();
    if (netInfo.isConnected) {
      // Fetch pending reports from SQLite
      const pendingReports = await fetchPendingReports();

      if (pendingReports.length > 0) {
        // Sync pending reports
        for (const report of pendingReports) {
          await syncReportsToServer(report, () => {});
        }
        console.log("Background sync complete");
      }
    }

    // Return result to indicate whether the task was successful
    return BackgroundFetch.Result.NewData;
  } catch (error) {
    console.error("Background task failed:", error);
    return BackgroundFetch.Result.Failed;
  }
});

// Register periodic sync with the system
export const registerBackgroundTask = async () => {
  try {
    await BackgroundFetch.registerTaskAsync(BACKGROUND_SYNC_TASK, {
      minimumInterval: 60 * 15, // Run every 15 minutes
      stopOnTerminate: true, // Continue after app is closed
      startOnBoot: true, // Start on device boot
    });
    console.log("Background sync task registered");
  } catch (error) {
    console.error("Failed to register background task:", error);
  }
};
