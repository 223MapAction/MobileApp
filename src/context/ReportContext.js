import React, { createContext, useState, useEffect } from "react";
import NetInfo from "@react-native-community/netinfo";
import Toast from "react-native-toast-message";

import { showToast } from "../utils/ToastUtils";
import { fetchPendingReports, syncReportsToServer } from "../utils/SyncUtils";
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

  useEffect(() => {
    const syncData = async () => {

      if (isConnected) await synchronizeOfflineData();
    };

    syncData();
  }, [isConnected]);

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

  const synchronizeOfflineData = async () => {
    console.log("Debut sync");
    
    try {
      const pendingReports = await fetchPendingReports();
      console.log("pendings reports", pendingReports);
      
      
      if (pendingReports.length > 0) {
        for (const report of pendingReports) {
          const {category_ids, category_id, taken_by, indicateur_id,zone,user_id,...reportToSync}=report
          zone? reportToSync.zone=zone:reportToSync.zone="zone inconnue"
          await syncReportsToServer(reportToSync, () => {});
        }
        console.log("Background sync complete");
      } else {
        Toast.show({
          type: "error",
          text1: "synchronisation",
          text2: "0 rapport a synchronise",
        });
      }
    } catch (error) {
      console.error("Error during synchronization:", error);
    }
  };

  return (
    <ReportContext.Provider value={{ submitReport, isSyncing }}>
      {children}
    </ReportContext.Provider>
  );
};
