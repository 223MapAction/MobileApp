import { CameraView, useCameraPermissions } from "expo-camera";
import React, { useContext, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";
import { ReportContext } from "../context/ReportContext";

export default function App() {
  const { isSyncing, submitReport } = useContext(ReportContext);
  const [report, setReport] = useState({
    title: "",
    zone: "",
    photo: "",
    etat: "declared",
  });
  const [loadingLocation, setLoadingLocation] = useState(false);

  // Handle location fetching
  const getLocation = async () => {
    setLoadingLocation(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission refusée",
          "La localisation est nécessaire pour cette fonctionnalité"
        );
        setLoadingLocation(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const latitude = location.coords.latitude.toString();
      const longitude = location.coords.longitude.toString();

      setReport({ ...report, latitude, longitude });
    } catch (error) {
      console.error(
        "Erreur lors de la récupération de la localisation:",
        error
      );
      Alert.alert("Erreur", "Impossible de récupérer la localisation");
    }
    setLoadingLocation(false);
  };

  // Handle image picking
  const pickImage = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaType: ImagePicker.MediaTypeOptions.Images,
    });

    if (result.didCancel) {
      console.log("Image picking cancelled");
    } else if (result.errorCode) {
      console.error("Erreur lors du choix de l’image:", result.errorMessage);
    } else if (result.assets) {
      const imageUri = result.assets[0].uri;
      setReport({ ...report, photo: imageUri });
    }
  };

  const submitForm = async () => {
    if (!report.title || !report.zone || !report.photo) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs obligatoires");
      return;
    }
    await submitReport(report);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Titre du rapport</Text>
      <TextInput
        style={styles.input}
        placeholder="Titre"
        onChangeText={(text) => setReport({ ...report, title: text })}
        value={report.title}
      />

      <Text style={styles.label}>Zone</Text>
      <TextInput
        style={styles.input}
        placeholder="Zone"
        onChangeText={(text) => setReport({ ...report, zone: text })}
        value={report.zone}
      />

      <Text style={styles.label}>Localisation</Text>
      <Button
        title={
          loadingLocation
            ? "Récupération en cours..."
            : "Obtenir la localisation"
        }
        onPress={getLocation}
        disabled={loadingLocation}
      />
      {report.zone ? (
        <Text style={styles.zoneText}>Zone: {report.zone}</Text>
      ) : null}

      <Text style={styles.label}>Photo</Text>
      <Button title="Choisir une image" onPress={pickImage} />
      {report.photo ? (
        <Image source={{ uri: report.photo }} style={styles.imagePreview} />
      ) : null}

      <SubmitButton isSyncing={isSyncing} handleSubmit={submitForm} />
    </View>
  );
}

const SubmitButton = ({ isSyncing, handleSubmit }) => {
  return (
    <View>
      {isSyncing ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Soumettre" onPress={handleSubmit} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  zoneText: {
    marginTop: 10,
    fontSize: 14,
    fontStyle: "italic",
  },
  imagePreview: {
    marginTop: 10,
    width: 100,
    height: 100,
    borderRadius: 5,
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    // flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#38A0DB",
    borderRadius: 50,
    width: 50,
    height: 50,
    marginHorizontal: "40%",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});
