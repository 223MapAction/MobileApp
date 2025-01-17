import React, { createContext, useState, useEffect } from "react";
import NetInfo from "@react-native-community/netinfo";
import Toast from "react-native-toast-message";

import { showToast } from "../utils/ToastUtils";
import { fetchPendingReports, syncReportsToServer } from "../utils/SyncUtils";
import { saveReportLocally, updateReportStatus} from "../db/dbOperations";

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
    try {
      // Sauvegarder localement d'abord dans tous les cas
      const localSaveSuccess = await saveReportLocally(report);
      
      if (!localSaveSuccess) {
        showToast(false, "Erreur lors de l'enregistrement local.");
        return { success: false };
      }

      // Si connecté, synchroniser avec le serveur
      if (isConnected) {
        console.log("Données avant conversion:", {
          originalLatitude: report.latitude,
          originalLongitude: report.longitude
        });

        const reportToSync = {
          ...report,
          lattitude: report.latitude, // Conversion de latitude vers lattitude
        };
        delete reportToSync.latitude; // Supprimer l'ancienne propriété

        console.log("Données à envoyer au serveur:", reportToSync);

        await syncReportsToServer(reportToSync, setIsSyncing, onUploadProgress);
        if (report.id) {
          await updateReportStatus(report.id);
        }
        showToast(true, "Rapport synchronisé avec succès.");
        return { success: true };
      } else {
        showToast(false, "Rapport enregistré localement.");
        return { success: true };
      }
    } catch (error) {
      console.log("Erreur lors de la soumission:", error);
      return { success: false, error };
    }
  };
  
  const synchronizeOfflineData = async () => {
    console.log("Debut sync");
    
    try {
      // Ne récupérer que les rapports non synchronisés
      const pendingReports = await fetchPendingReports();
      console.log("rapports en attente:", pendingReports);
      
      if (pendingReports.length > 0) {
        for (const report of pendingReports) {
          try {
            const {
              status,
              category_ids, 
              category_id, 
              taken_by, 
              indicateur_id,
              zone,
              user_id,
              latitude,
              ...rest
            } = report;
  
            const reportToSync = {
              ...rest,
              lattitude: latitude,
              zone: zone || "zone inconnue"
            };
  
            // Synchroniser le rapport
            await syncReportsToServer(reportToSync, () => {});
            
            // Marquer le rapport comme synchronisé
            await updateReportStatus(report.id);
            
            console.log(`Rapport ${report.id} synchronisé avec succès`);
          } catch (error) {
            console.error(`Erreur lors de la synchronisation du rapport ${report.id}:`, error);
            // Continue avec le prochain rapport même si celui-ci échoue
          }
        }
        console.log("Synchronisation terminée");
      } else {
        Toast.show({
          type: "info",
          text1: "Synchronisation",
          text2: "Aucun nouveau rapport à synchroniser",
        });
      }
    } catch (error) {
      console.error("Erreur lors de la synchronisation:", error);
    }
  };

  return (
    <ReportContext.Provider value={{ submitReport, isSyncing }}>
      {children}
    </ReportContext.Provider>
  );
};
