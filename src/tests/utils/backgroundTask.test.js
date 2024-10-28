import * as TaskManager from "expo-task-manager";
import * as BackgroundFetch from "expo-background-fetch";
import NetInfo from "@react-native-community/netinfo";
import { registerBackgroundTask } from "../../utils/backgroundTask";
import { fetchPendingReports, syncReportsToServer } from "../../utils/SyncUtils";

jest.mock("expo-task-manager", () => ({
  defineTask: jest.fn(),
}));
jest.mock("expo-background-fetch", () => ({
  registerTaskAsync: jest.fn(),
  BackgroundFetchResult: {
    NewData: "new-data",
    Failed: "failed",
  },
}));
jest.mock("@react-native-community/netinfo", () => ({
  fetch: jest.fn(),
}));
jest.mock("../../utils/SyncUtils", () => ({
  fetchPendingReports: jest.fn(),
  syncReportsToServer: jest.fn(),
}));

describe("Background Sync Task", () => {
  let taskFunction;

  beforeAll(async () => {
    await registerBackgroundTask(); 
    TaskManager.defineTask.mockImplementation((_, taskFn) => {
      taskFunction = taskFn; 
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("définit la tâche de synchronisation en arrière-plan", () => {
    expect(TaskManager.defineTask).toHaveBeenCalledWith(
      "mapaction-background-sync-task",
      expect.any(Function)
    );
  });

  it("enregistre la tâche de synchronisation périodique", async () => {
    await registerBackgroundTask();
    expect(BackgroundFetch.registerTaskAsync).toHaveBeenCalledWith(
      "mapaction-background-sync-task",
      {
        minimumInterval: 60 * 15,
        stopOnTerminate: true,
        startOnBoot: true,
      }
    );
  });

  // it("exécute la tâche de synchronisation en arrière-plan lorsque le réseau est connecté et qu'il y a des rapports en attente", async () => {
  //   const mockPendingReports = [{ id: 1 }, { id: 2 }];
  //   NetInfo.fetch.mockResolvedValue({ isConnected: true });
  //   fetchPendingReports.mockResolvedValue(mockPendingReports);
  //   syncReportsToServer.mockResolvedValue();

  //   // expect(taskFunction).toBeDefined();

  //   const result = await taskFunction();

  //   expect(fetchPendingReports).toHaveBeenCalled();
  //   expect(syncReportsToServer).toHaveBeenCalledTimes(mockPendingReports.length);
  //   expect(result).toBe(BackgroundFetch.BackgroundFetchResult.NewData);
  // });

  // it("retourne un échec si une erreur se produit lors de la tâche de synchronisation", async () => {
  //   NetInfo.fetch.mockResolvedValue({ isConnected: true });
  //   fetchPendingReports.mockRejectedValue(new Error("Database error"));

  //   // expect(taskFunction).toBeDefined();

  //   const result = await taskFunction();

  //   expect(result).toBe(BackgroundFetch.BackgroundFetchResult.Failed);
  // });

  // it("ne synchronise pas les rapports si le réseau est déconnecté", async () => {
  //   NetInfo.fetch.mockResolvedValue({ isConnected: false });

  //   // expect(taskFunction).toBeDefined();

  //   const result = await taskFunction();

  //   expect(fetchPendingReports).not.toHaveBeenCalled();
  //   expect(syncReportsToServer).not.toHaveBeenCalled();
  //   expect(result).toBe(BackgroundFetch.BackgroundFetchResult.NewData);
  // });
});