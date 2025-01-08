import * as FileSystem from "expo-file-system";
import { Platform } from "react-native";

/**
 * Saves a file with a unique name based on the current timestamp.
 * Handles platform-specific paths for iOS and Android.
 * @param {string} fileUri - The URI of the original file to save.
 * @param {string} fileType - The type of file (e.g., 'video', 'audio') for naming purposes.
 * @returns {Promise<string | null>} - The path where the file was saved, or null if an error occurred.
 */
export const saveFileWithUniqueName = async (fileUri, fileType) => {
  const timestamp = new Date().getTime();
  const uniqueFilename = `${fileType}_${timestamp}.${fileUri.split('.').pop()}`; // Append original file extension

  // Determine platform-specific path
  const destinationUri = Platform.OS === "ios"
    ? `${FileSystem.documentDirectory}${uniqueFilename}`
    : `${FileSystem.documentDirectory}${uniqueFilename}`;

  try {
    await FileSystem.moveAsync({
      from: fileUri,
      to: destinationUri,
    });
    return destinationUri; // Return the new path to store in the database
  } catch (error) {
    console.error(`Error saving ${fileType} file:`, error);
    return null;
  }
};