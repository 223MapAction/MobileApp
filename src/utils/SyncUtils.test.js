import { syncReportsToServer } from "./SyncUtils";
import * as ToastUtils from "./ToastUtils";
import { create_incident } from "../api/incident";

jest.mock("../api/incident");

describe("Sync Utils", () => {
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
