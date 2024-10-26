import * as ImagePicker from "expo-image-picker";

export default async function pickImage() {
  console.log("La fonction pickImage est appelée.");

  const hasPermission = await getCameraPermission();
  if (hasPermission) {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.cancelled) {
      console.log("Image sélectionnée :", result.uri);
      return result;
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
