import { saveReportLocally, getPendingReports } from "./dbOperations";
import { db } from "./client";

jest.mock("./client");

describe("Database Operations", () => {
  it("should save a report locally", async () => {
    const mockReport = { title: "Test Report" };
    db.insert = jest.fn().mockResolvedValueOnce();

    const result = await saveReportLocally(mockReport);
    expect(result).toBe(true);
    expect(db.insert).toHaveBeenCalledWith(expect.objectContaining(mockReport));
  });

  it("should fetch pending reports", async () => {
    const mockReports = [{ id: 1, title: "Pending Report" }];
    db.select = jest.fn().mockResolvedValueOnce(mockReports);

    const reports = await getPendingReports();
    expect(reports).toEqual(mockReports);
  });
});
