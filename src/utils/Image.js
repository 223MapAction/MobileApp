import * as ImagePicker from "expo-image-picker";

export default async function pickImage() {
  console.log("La fonction pickImage est appelée.");

  const hasPermission = await getCameraPermission();
  if (hasPermission) {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.5,
    });

    if (!result.canceled && result.assets) {
      const imageUri = result.assets[0].uri;
      console.log("Image sélectionnée :", imageUri);
      return { uri: imageUri };
    }
  } else {
    console.log("Permission refusée.");
  }

  return {};
}

async function getCameraPermission() {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  return status === "granted";
}
