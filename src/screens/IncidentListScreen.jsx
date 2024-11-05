import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { getAllReports } from "../db/dbOperations";
import { ReportContext } from "../context/ReportContext";

const IncidentListScreen = ({ navigation }) => {
  const [incidents, setIncidents] = useState([]);
  const { isSyncing } = useContext(ReportContext);

  useEffect(() => {
    // Fetch incidents from the local database
    const fetchIncidents = async () => {
      try {
        const pendingIncidents = await getAllReports();
        setIncidents(pendingIncidents);
      } catch (error) {
        console.error("Failed to fetch incidents:", error);
      }
    };

    fetchIncidents();
  }, [isSyncing]); // Reload when syncing status changes

  const renderIncident = ({ item }) => (
    <TouchableOpacity
      style={styles.incidentItem}
      onPress={() => navigation.navigate("IncidentDetails", { incident: item })}
    >
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.zone}>Zone: {item.zone}</Text>
      <Text style={styles.status}>Status: {item.status}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Local Incidents</Text>
      {incidents.length > 0 ? (
        <FlatList
          data={incidents}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderIncident}
        />
      ) : (
        <Text style={styles.noDataText}>
          No incidents found in local storage.
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  incidentItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  zone: {
    color: "#555",
  },
  status: {
    fontSize: 14,
    color: "gray",
  },
  noDataText: {
    textAlign: "center",
    fontSize: 16,
    color: "gray",
    marginTop: 20,
  },
});

export default IncidentListScreen;
