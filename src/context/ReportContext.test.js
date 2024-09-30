import React from "react";
import { render, act } from "@testing-library/react-native";
import { ReportProvider } from "./ReportContext";
import * as SyncUtils from "../utils/SyncUtils";
import * as ToastUtils from "../utils/ToastUtils";

jest.mock("../utils/SyncUtils");
jest.mock("../utils/ToastUtils");

describe("ReportContext", () => {
  it("should call submitReport and show success toast when online", async () => {
    const mockReport = { title: "Test Report" };
    const mockSync = jest.fn().mockResolvedValueOnce();
    SyncUtils.syncReportsToServer = mockSync;

    const { getByText } = render(
      <ReportProvider>
        <TestComponent />
      </ReportProvider>
    );

    await act(async () => {
      await submitReport(mockReport);
    });

    expect(mockSync).toHaveBeenCalledWith(mockReport, expect.any(Function));
    expect(ToastUtils.showToast).toHaveBeenCalledWith(true);
  });

  it("should call saveReportLocally when offline", async () => {
    // Mock offline scenario
    NetInfo.fetch = jest.fn().mockResolvedValueOnce({ isConnected: false });

    const mockReport = { title: "Offline Report" };
    const mockSave = jest.fn().mockResolvedValueOnce(true);
    SyncUtils.saveReportLocally = mockSave;

    const { getByText } = render(
      <ReportProvider>
        <TestComponent />
      </ReportProvider>
    );

    await act(async () => {
      await submitReport(mockReport);
    });

    expect(mockSave).toHaveBeenCalledWith(mockReport);
    expect(ToastUtils.showToast).toHaveBeenCalledWith(
      false,
      "Rapport enregistré localement."
    );
  });
});
