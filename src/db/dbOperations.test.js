import { saveReportLocally, getPendingReports } from "./dbOperations";
import { db } from "./client";

jest.mock("./client", () => ({
  db: {
    insert: jest.fn().mockImplementation(() => ({
      values: jest.fn().mockReturnValue(Promise.resolve()), 
    })),
    update: jest.fn().mockReturnValue(Promise.resolve()),
    select: jest.fn().mockReturnValue(Promise.resolve([])), 
  },
}));

describe("Database Operations", () => {
  it("should save a report locally", async () => {
    const mockReport = { title: "Test Report" };
    
    const result = await saveReportLocally(mockReport);
    
    expect(result).toBe(true);
    expect(db.insert).toHaveBeenCalledTimes(1); 
    expect(db.insert).toHaveBeenCalledWith(expect.objectContaining(mockReport)); 
  });

  it("should fetch pending reports", async () => {
    const mockReports = [{ id: 1, title: "Pending Report" }];
    db.select.mockResolvedValueOnce(mockReports); 

    const reports = await getPendingReports();
    
    expect(reports).toEqual(mockReports); 
  });

  it("should return an empty array if no pending reports", async () => {
    db.select.mockResolvedValueOnce([]); 

    const reports = await getPendingReports();
    
    expect(reports).toEqual([]); 
  });

  it("should handle insertion failure", async () => {
    db.insert.mockImplementationOnce(() => ({
      values: jest.fn().mockReturnValue(Promise.reject(new Error("Insertion failed"))), 
    }));

    const mockReport = { title: "Test Report" };
    
    await expect(saveReportLocally(mockReport)).rejects.toThrow("Insertion failed"); 
  });
});
