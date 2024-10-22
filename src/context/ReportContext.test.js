
import React from "react";
import { render, act } from "@testing-library/react-native";
import { ReportProvider } from "./ReportContext";
import * as SyncUtils from "../utils/SyncUtils";
import * as ToastUtils from "../utils/ToastUtils";
import NetInfo from '@react-native-community/netinfo';

jest.mock('expo-sqlite/next', () => ({
  openDatabaseSync: jest.fn(() => ({
    transaction: jest.fn(),
    exec: jest.fn(),
  })),
}));

jest.mock("@react-native-community/netinfo", () => ({
  fetch: jest.fn(() => Promise.resolve({ isConnected: true })),
  addEventListener: jest.fn((callback) => callback({ isConnected: true })),
}));

jest.mock("../utils/SyncUtils");
jest.mock("../utils/ToastUtils");

// TestComponent simulé
const TestComponent = () => null;

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
      await submitReport(mockReport);  // Assurez-vous que submitReport est défini
    });

    expect(mockSave).toHaveBeenCalledWith(mockReport);
    expect(ToastUtils.showToast).toHaveBeenCalledWith(
      false,
      "Rapport enregistré localement."
    );
  });
});
