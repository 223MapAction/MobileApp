import React, { createContext, useState, useEffect } from "react";
import NetInfo from "@react-native-community/netinfo";
import { showToast } from "../utils/ToastUtils";
import { syncReportsToServer } from "../utils/SyncUtils";
import { initDB, saveReportLocally } from "../db/dbOperations";

export const ReportContext = createContext();

export const ReportProvider = ({ children }) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [isConnected, setIsConnected] = useState(true);

  //This is for testing purposes only
  //TODO TO delete before going to prod
  // Initialize the database table on mount
  useEffect(() => {
    initDB();
  }, []);

  // Monitor network status
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
      showToast(state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  // Submit the report based on network state
  const submitReport = async (report, onUploadProgress) => {
    if (isConnected) {
      // Direct API submission when online
      await syncReportsToServer(report, setIsSyncing, onUploadProgress);
    } else {
      // Save report locally if offline
      const success = await saveReportLocally(report);
      if (success) {
        showToast(false, "Rapport enregistré localement.");
      } else {
        showToast(false, "Erreur lors de l’enregistrement local.");
      }
    }
  };

  return (
    <ReportContext.Provider value={{ submitReport, isSyncing }}>
      {children}
    </ReportContext.Provider>
  );
};
