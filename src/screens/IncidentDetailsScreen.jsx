import React from "react";
import { View, Text, StyleSheet } from "react-native";

const IncidentDetailsScreen = ({ route }) => {
  const { incident } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{incident.title}</Text>
      <Text>Zone: {incident.zone}</Text>
      <Text>Description: {incident.description}</Text>
      <Text>Status: {incident.status}</Text>
      {/* Additional details as needed */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
});

export default IncidentDetailsScreen;
