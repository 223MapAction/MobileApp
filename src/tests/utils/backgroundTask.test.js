import * as TaskManager from "expo-task-manager";
import * as BackgroundFetch from "expo-background-fetch";
import NetInfo from "@react-native-community/netinfo";
import { registerBackgroundTask } from "../../utils/backgroundTask";
import { fetchPendingReports, syncReportsToServer } from "../../utils/SyncUtils";

jest.mock("expo-task-manager", () => ({
  defineTask: jest.fn((taskName, callback) => {
    global.taskCallback = callback;
    return callback;
  }),
  isTaskRegisteredAsync: jest.fn(),
  unregisterTaskAsync: jest.fn(),
}));
jest.mock("expo-background-fetch", () => ({
  registerTaskAsync: jest.fn(),
  unregisterTaskAsync: jest.fn(),
  BackgroundFetchResult: {
    NewData: "newData",
    NoData: "noData",
    Failed: "failed",
  },
  getStatusAsync: jest.fn(),
}));
jest.mock("@react-native-community/netinfo", () => ({
  fetch: jest.fn(),
  addEventListener: jest.fn(),
}));
jest.mock("../../utils/SyncUtils", () => ({
  fetchPendingReports: jest.fn(),
  syncReportsToServer: jest.fn(),
}));

describe("Background Sync Task", () => {
  const BACKGROUND_SYNC_TASK = "mapaction-background-sync-task";

  beforeEach(() => {
    jest.clearAllMocks();
    console.error = jest.fn();
    console.log = jest.fn();
  });

  describe("Task Definition", () => {
    it("devrait définir la tâche avec le bon nom", () => {
      expect(TaskManager.defineTask).toHaveBeenCalledWith(
        BACKGROUND_SYNC_TASK,
        expect.any(Function)
      );
    });

    it("devrait synchroniser les rapports avec succès", async () => {
      NetInfo.fetch.mockResolvedValueOnce({ isConnected: true });
      fetchPendingReports.mockResolvedValueOnce([
        { id: 1, data: 'test1' },
        { id: 2, data: 'test2' }
      ]);
      syncReportsToServer.mockResolvedValue(true);

      const result = await global.taskCallback();

      expect(NetInfo.fetch).toHaveBeenCalled();
      expect(fetchPendingReports).toHaveBeenCalled();
      expect(syncReportsToServer).toHaveBeenCalledTimes(2);
      expect(console.log).toHaveBeenCalledWith("Background sync complete");
      expect(result).toBe(BackgroundFetch.BackgroundFetchResult.NewData);
    });

    it("devrait gérer l'échec de synchronisation", async () => {
      NetInfo.fetch.mockResolvedValueOnce({ isConnected: true });
      fetchPendingReports.mockResolvedValueOnce([{ id: 1 }]);
      syncReportsToServer.mockRejectedValue(new Error('Sync failed'));

      const result = await global.taskCallback();

      expect(console.error).toHaveBeenCalledWith(
        'Background task failed:',
        expect.any(Error)
      );
      expect(result).toBe(BackgroundFetch.BackgroundFetchResult.Failed);
    });

    it("devrait gérer l'absence de connexion", async () => {
      NetInfo.fetch.mockResolvedValueOnce({ isConnected: false });

      const result = await global.taskCallback();

      expect(fetchPendingReports).not.toHaveBeenCalled();
      expect(result).toBe(BackgroundFetch.BackgroundFetchResult.NewData);
    });

    it("devrait gérer l'erreur de vérification de connexion", async () => {
      NetInfo.fetch.mockRejectedValue(new Error('Network check failed'));

      const result = await global.taskCallback();

      expect(console.error).toHaveBeenCalledWith(
        'Background task failed:',
        expect.any(Error)
      );
      expect(result).toBe(BackgroundFetch.BackgroundFetchResult.Failed);
    });
  });

  describe("Task Registration", () => {
    it("devrait enregistrer la tâche avec succès", async () => {
      BackgroundFetch.getStatusAsync.mockResolvedValueOnce(3); // Available
      await registerBackgroundTask();

      expect(BackgroundFetch.registerTaskAsync).toHaveBeenCalledWith(
        BACKGROUND_SYNC_TASK,
        {
          minimumInterval: 30,
          stopOnTerminate: true,
          startOnBoot: true,
        }
      );
      expect(console.log).toHaveBeenCalledWith("Background sync task registered");
    });

    it("devrait gérer l'erreur d'enregistrement", async () => {
      BackgroundFetch.registerTaskAsync.mockRejectedValueOnce(
        new Error("Registration failed")
      );

      await registerBackgroundTask();

      expect(console.error).toHaveBeenCalledWith(
        "Failed to register background task:",
        expect.any(Error)
      );
    });

    it("devrait gérer l'erreur de vérification du statut", async () => {
      BackgroundFetch.getStatusAsync.mockRejectedValueOnce(
        new Error("Status check failed")
      );

      await registerBackgroundTask();

      expect(console.error).toHaveBeenCalled();
    });
  });
});