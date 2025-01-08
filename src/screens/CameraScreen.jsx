import React, { useContext, useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ReportContext } from "../context/ReportContext";
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import IncidentForm from "./newScreen/IncidentForm";

export default function App() {
  const { isSyncing, submitReport } = useContext(ReportContext);
  const navigation = useNavigation();
  const [report, setReport] = useState({
    title: "",
    description: "",
    lattitude: "",
    longitude: "",
    zone: "",
    photo: "",
    audio: "",
    video: "",
    etat: "declared",
  });

  const [hasCapturedPhoto, setHasCapturedPhoto] = useState(false);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert(
        "Accès à la caméra requis",
        "Map Action nécessite l'accès à votre caméra pour capturer des images des incidents et les inclure dans les rapports soumis aux autorités. Veuillez autoriser l'accès dans les paramètres."
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.5,
    });

    if (!result.canceled && result.assets) {
      const imageUri = result.assets[0].uri;
      setReport((prevReport) => ({ ...prevReport, photo: imageUri }));
      console.log("Image URI capturée:", imageUri);

      setHasCapturedPhoto(true);
      navigation.navigate("IncidentForm", { report: { ...report, photo: imageUri } });
    }
    else{
      navigation.goBack();
    }
  };

  useEffect(() => {
    pickImage();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      if (hasCapturedPhoto) {
        navigation.navigate("DrawerNavigation");
      }
    }, [hasCapturedPhoto, navigation])
  );

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
});
