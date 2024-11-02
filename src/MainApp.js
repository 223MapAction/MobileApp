import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { thunk } from "redux-thunk";
import logger from "redux-logger";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import Toast from "react-native-toast-message";
import { StatusBar } from "expo-status-bar";

import StackNavigation from "./components/StackNavigation";
import rootReducer from "./redux/root";
import { registerBackgroundTask } from "./utils/backgroundTask";
import { ReportProvider } from "./context/ReportContext";
import { initDB } from "./db/dbOperations";

const store = createStore(rootReducer, applyMiddleware(thunk, logger));

export default function App() {
  useEffect(() => {
    registerBackgroundTask(); // Register background sync task
  }, []);

  return (
    <View style={styles.container} testID="app-container">
      <StatusBar barStyle="light-content" backgroundColor="#2D9CDB" />
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }}>
          <Provider store={store}>
            <ReportProvider>
              <StackNavigation />
              <Toast position="bottom" testID="toast"/>
            </ReportProvider>
          </Provider>
        </SafeAreaView>
      </SafeAreaProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2D9CDB",
  },
});

// import React, { useEffect } from "react";
// import { StyleSheet, View, Alert } from "react-native";
// import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
// import { thunk } from "redux-thunk";
// import logger from "redux-logger";
// import { createStore, applyMiddleware } from "redux";
// import { Provider } from "react-redux";
// import Toast from "react-native-toast-message";
// import { StatusBar } from "expo-status-bar";
// import axios from "axios";
// import * as Linking from "expo-linking";
// import http from "./api/http";
// import StackNavigation from "./components/StackNavigation";
// import rootReducer from "./redux/root";
// import { registerBackgroundTask } from "./utils/backgroundTask";
// import { ReportProvider } from "./context/ReportContext";
// import { initDB } from "./db/dbOperations";

// const store = createStore(rootReducer, applyMiddleware(thunk, logger));

// export default function App() {
//   useEffect(() => {
//     // Enregistrer la tâche de synchronisation en arrière-plan
//     registerBackgroundTask();

//     const handleDeepLink = async (event) => {
//       const url = event.url;
//       const token = url.split("/").pop(); 

//       try {
//         const response = await http.get(`/verify-email/${token}`);
//         Alert.alert("Succès", response.data.message);
        
//         navigation.navigate("passwordStep");
//       } catch (error) {
//         Alert.alert("Erreur", "Lien de vérification invalide ou expiré.");
//       }
//     };

//     Linking.addEventListener("url", handleDeepLink);

//     Linking.getInitialURL().then((url) => {
//       if (url) handleDeepLink({ url });
//     });

//     return () => {
//       Linking.removeEventListener("url", handleDeepLink);
//     };
//   }, []);

//   return (
//     <View style={styles.container} testID="app-container">
//       <StatusBar barStyle="light-content" backgroundColor="#2D9CDB" />
//       <SafeAreaProvider>
//         <SafeAreaView style={{ flex: 1 }}>
//           <Provider store={store}>
//             <ReportProvider>
//               <StackNavigation />
//               <Toast position="bottom" testID="toast"/>
//             </ReportProvider>
//           </Provider>
//         </SafeAreaView>
//       </SafeAreaProvider>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#2D9CDB",
//   },
// });
