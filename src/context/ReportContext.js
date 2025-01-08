import React, { createContext, useState, useEffect } from "react";
import NetInfo from "@react-native-community/netinfo";
import { showToast } from "../utils/ToastUtils";
import { syncReportsToServer } from "../utils/SyncUtils";
import { saveReportLocally } from "../db/dbOperations";

export const ReportContext = createContext();

export const ReportProvider = ({ children }) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [isConnected, setIsConnected] = useState(true);

  // Monitor network status
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
      showToast(state.isConnected);
    });

    return () => unsubscribe();
  }, []);
  const submitReport = async (report, onUploadProgress) => {
    if (isConnected) {
      // Envoi à l'API en ligne
      try {
        await syncReportsToServer(report, setIsSyncing, onUploadProgress);
        return { success: true }; // Retourne un indicateur de succès
      } catch (error) {
        console.log("Erreur lors de la synchronisation:", error);
        return { success: false, error }; // En cas d'erreur, retourne un indicateur d'échec
      }
    } else {
      // Sauvegarde locale en mode hors-ligne
      const success = await saveReportLocally(report);
      if (success) {
        showToast(false, "Rapport enregistré localement.");
        return { success: true };
      } else {
        showToast(false, "Erreur lors de l’enregistrement local.");
        return { success: false };
      }
    }
  };
  

  return (
    <ReportContext.Provider value={{ submitReport, isSyncing }}>
      {children}
    </ReportContext.Provider>
  );
};
