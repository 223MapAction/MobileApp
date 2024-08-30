import React, { useEffect } from "react";
import { Alert, Dimensions, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";

const { width, height } = Dimensions.get("window");
const [WIDTH, HEIGHT] = [width, height * 0.78];
const btnHeight = (height - HEIGHT) * 0.5;

export default function Scan({ navigation }) {
  useEffect(() => {
    async function requestCameraPermissionAndLaunch() {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('', 'Les autorisations pour accèder à la caméra sont refusées');
        onCancel();
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.5,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      });

      if (result.canceled) {
        onCancel();
      } else {
        onSave(result.uri);
      }
    }

    requestCameraPermissionAndLaunch().catch(() => {
      Alert.alert('', 'An error occurred while accessing the camera.');
      onCancel();
    });
  }, []);

  const onSave = (uri) => {
    navigation.replace('IncidentForm', { image: uri });
  };

  const onCancel = () => {
    navigation.pop();
  };

  return null;
}
