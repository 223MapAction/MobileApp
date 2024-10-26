import { syncReportsToServer } from "./SyncUtils";
import * as Toast from "react-native-toast-message";
import { create_incident } from "../api/incident";
import * as SyncUtils from "./SyncUtils";
import { openDatabaseSync } from "expo-sqlite/next";

jest.mock("expo-sqlite/next", () => ({
  openDatabaseSync: jest.fn(() => ({
    transaction: jest.fn((callback) => callback({
      executeSql: jest.fn(),
    })),
  })),
}));

jest.mock("../api/incident");
jest.mock("react-native-toast-message", () => ({
  show: jest.fn(),
}));

describe("Sync Utils", () => {
  beforeEach(() => {
    jest.clearAllMocks(); 
  });

  it("should sync reports to the server successfully", async () => {
    const mockReport = { id: 1, title: "Test Report" };
    const mockResponse = { ok: true };
    create_incident.mockResolvedValueOnce(mockResponse);

    const mockSetIsSyncing = jest.fn();

    await syncReportsToServer(mockReport, mockSetIsSyncing, () => {});

    expect(mockSetIsSyncing).toHaveBeenCalledWith(false);
    expect(Toast.show).toHaveBeenCalledWith({
      type: "success",
      text1: "Rapport synchronisé",
      text2: `Le rapport "${mockReport.title}" a été synchronisé avec succès.`,
    });
  });

  it("should handle failed sync and save report locally", async () => {
    const mockReport = { id: 1, title: "Failed Report" };
    const mockResponse = { ok: false };
    create_incident.mockResolvedValueOnce(mockResponse);

    const mockSetIsSyncing = jest.fn();
    const mockSave = jest.fn().mockResolvedValueOnce(true);
    jest.spyOn(SyncUtils, "saveReportLocally").mockImplementation(mockSave);

    await syncReportsToServer(mockReport, mockSetIsSyncing, () => {});

    expect(mockSetIsSyncing).toHaveBeenCalledWith(false);
    expect(mockSave).toHaveBeenCalledWith(mockReport);
    expect(Toast.show).toHaveBeenCalledWith({
      type: "error",
      text1: "Échec de synchronisation",
      text2: "Impossible de soumettre le rapport en ligne.",
    });
  });
});
