import * as ImagePicker from "expo-image-picker";
import { useCameraPermissions } from "expo-camera";

export default async function pickImage() {
  console.log("La fonction pickImage est appelée.");
  const hasPermission = await getCameraPermission();
  let result;
  if (hasPermission) {
    result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.cancelled) {
      return result;
    }
  }

  return {};
}

export async function getCameraPermission() {
  const [permission, requestPermission] = useCameraPermissions();
  if (permission?.status !== "granted") {
    const { status } = await requestPermission();
    return status === "granted";
  }
  return true;
}
