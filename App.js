import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { thunk } from "redux-thunk";
import logger from "redux-logger";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import Toast from "react-native-toast-message";
import { StatusBar } from "expo-status-bar";

import StackNavigation from "./src/components/StackNavigation";
import rootReducer from "./src/redux/root";
import { registerBackgroundTask } from "./utils/backgroundTask";
import { ReportProvider } from "./context/ReportContext";

const store = createStore(rootReducer, applyMiddleware(thunk, logger));
export default function App() {
  
  useEffect(() => {
    initDatabase(); // Initialize SQLite database
    registerBackgroundTask(); // Register background sync task
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2D9CDB" />
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }}>
          <Provider store={store}>
            <ReportProvider>
              <StackNavigation />
              <Toast ref={(ref) => Toast.setRef(ref)} />
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
