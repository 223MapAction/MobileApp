// import { syncReportsToServer } from "./SyncUtils";
// import * as ToastUtils from "./ToastUtils";
// import { create_incident } from "../api/incident";

// jest.mock("../api/incident");

// describe("Sync Utils", () => {
//   it("should sync reports to the server successfully", async () => {
//     const mockReport = { id: 1, title: "Test Report" };
//     const mockResponse = { ok: true };
//     create_incident.mockResolvedValueOnce(mockResponse);

//     const mockSetIsSyncing = jest.fn();

//     await syncReportsToServer(mockReport, mockSetIsSyncing, () => {});

//     expect(mockSetIsSyncing).toHaveBeenCalledWith(false);
//     expect(ToastUtils.showToast).toHaveBeenCalledWith(
//       true,
//       "Rapport synchronisé"
//     );
//   });

//   it("should handle failed sync and save report locally", async () => {
//     const mockReport = { id: 1, title: "Failed Report" };
//     const mockResponse = { ok: false };
//     create_incident.mockResolvedValueOnce(mockResponse);

//     const mockSetIsSyncing = jest.fn();
//     const mockSave = jest.fn().mockResolvedValueOnce(true);
//     jest.spyOn(SyncUtils, "saveReportLocally").mockImplementation(mockSave);

//     await syncReportsToServer(mockReport, mockSetIsSyncing, () => {});

//     expect(mockSetIsSyncing).toHaveBeenCalledWith(false);
//     expect(mockSave).toHaveBeenCalledWith(mockReport);
//     expect(ToastUtils.showToast).toHaveBeenCalledWith(
//       false,
//       "Impossible de soumettre le rapport en ligne."
//     );
//   });
// });
import { syncReportsToServer } from "./SyncUtils";
import * as ToastUtils from "./ToastUtils";
import { create_incident } from "../api/incident";
import * as SyncUtils from "./SyncUtils"; // Assurez-vous d'importer SyncUtils correctement
import { openDatabaseSync } from "expo-sqlite/next";

// Mock des modules nécessaires
jest.mock("expo-sqlite/next", () => ({
  openDatabaseSync: jest.fn(() => ({
    transaction: jest.fn((callback) => callback({
      executeSql: jest.fn(),
    })),
  })),
}));

jest.mock("../api/incident");
jest.mock("./ToastUtils", () => ({
  showToast: jest.fn(),
}));

describe("Sync Utils", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Réinitialise les mocks avant chaque test
  });

  it("should sync reports to the server successfully", async () => {
    const mockReport = { id: 1, title: "Test Report" };
    const mockResponse = { ok: true };
    create_incident.mockResolvedValueOnce(mockResponse);

    const mockSetIsSyncing = jest.fn();

    await syncReportsToServer(mockReport, mockSetIsSyncing, () => {});

    expect(mockSetIsSyncing).toHaveBeenCalledWith(false);
    expect(ToastUtils.showToast).toHaveBeenCalledWith(
      true,
      "Rapport synchronisé"
    );
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
    expect(ToastUtils.showToast).toHaveBeenCalledWith(
      false,
      "Impossible de soumettre le rapport en ligne."
    );
  });
});
