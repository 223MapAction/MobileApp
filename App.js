import * as SplashScreen from "expo-splash-screen";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import MainApp from "./src/MainApp";
import migrations from "./drizzle/migrations";
import { db } from "./src/db/client";
import { Text, View } from "react-native";
import { useCallback } from "react";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
  const { success, error } = useMigrations(db, migrations);

  const onLayoutRootView = useCallback(async () => {
    if (success) {
      // This tells the splash screen to hide immediately! If we call this after
      await SplashScreen.hideAsync();
    }
  }, [success]);

  // The error and !success clauses can be removed or at least logged
  // to the backedn for better trackeing before going to prod
  if (error) {
    console.log(error);

    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Migration erreur: {error.message}</Text>
      </View>
    );
  }

  if (!success) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Migration en cours...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <MainApp />
    </View>
  );
}
