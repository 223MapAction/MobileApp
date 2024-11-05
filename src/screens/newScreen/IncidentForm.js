import React, { useContext, useState, useEffect } from "react";
import Slider from "@react-native-community/slider";
import {
  ActivityIndicator,
  Alert,
  Button,
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Modal,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";
import { Audio, Video } from "expo-av";
import { ReportContext } from "../../context/ReportContext";
import { useRoute, useNavigation } from "@react-navigation/native";
import { getImage } from "../../api/http";
import { Camera, CameraType } from "expo-camera/legacy";
import { ScrollView } from "react-native-gesture-handler";

export default function IncidentForm() {
  const { isSyncing, submitReport } = useContext(ReportContext);
  const route = useRoute();
  const navigation = useNavigation();
  const { report } = route.params;
  const [currentReport, setCurrentReport] = useState(report);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [recording, setRecording] = useState(null);
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [sound, setSound] = useState();
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [cameraRef, setCameraRef] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [videoUri, setVideoUri] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [type, setType] = useState(CameraType.back);

  useEffect(() => {
    if (report) {
      setCurrentReport(report);
      // console.log("Report reçu dans IncidentForm:", report);
    }
  }, [report]);

  useEffect(() => {
    if (!currentReport.zone) {
      getLocation();
    }
    if (currentReport.audio) {
      playSound();
    }
    return () => (sound ? sound.unloadAsync() : undefined);
  }, [currentReport.audio]);

  const requestAllPermissions = async () => {
    const { status: cameraStatus } =
      await ImagePicker.requestCameraPermissionsAsync();
    const { status: locationStatus } =
      await Location.requestForegroundPermissionsAsync();
    const { status: audioStatus } = await Audio.requestPermissionsAsync();

    if (
      cameraStatus !== "granted" ||
      locationStatus !== "granted" ||
      audioStatus !== "granted"
    ) {
      Alert.alert(
        "Permissions manquantes",
        "Toutes les permissions (caméra, localisation, micro) sont requises."
      );
      return false;
    }
    return true;
  };

  useEffect(() => {
    requestAllPermissions();
  }, []);

  const startVideoRecording = async () => {
    if (cameraRef) {
      try {
        setIsRecording(true);
        const video = await cameraRef.recordAsync({
          quality: Camera.Constants.VideoQuality["480p"],
          maxDuration: 10,
        });
        setVideoUri(video.uri);
        setIsRecording(false);
        setShowCamera(false);
        setCurrentReport((currentReport) => ({
          ...currentReport,
          video: video.uri,
        }));
        console.log("Vidéo enregistrée à : ", video.uri);
      } catch (error) {
        console.error("Erreur lors de l'enregistrement vidéo :", error);
        setIsRecording(false);
      }
    }
  };

  console.log("La video enregistré", currentReport.video);
  // Arrêter l'enregistrement vidéo
  const stopVideoRecording = async () => {
    if (cameraRef && isRecording) {
      await cameraRef.stopRecording();
      setIsRecording(false);
    }
  };

  async function playSound() {
    if (!currentReport.audio) return;
    const { sound } = await Audio.Sound.createAsync(
      { uri: currentReport.audio },
      { shouldPlay: false }
    );
    setSound(sound);
    sound.setOnPlaybackStatusUpdate((status) => {
      setIsPlaying(status.isPlaying);
      setDuration(status.durationMillis || 0);
      setPosition(status.positionMillis || 0);
    });
  }

  const handlePlayPause = async () => {
    if (sound) {
      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
    }
  };

  const formatTime = (millis) => {
    const minutes = Math.floor(millis / 60000);
    const seconds = Math.floor((millis % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const getZoneFromCoordinates = async (latitude, longitude) => {
    // console.log("Latitude:", latitude, "Longitude:", longitude);
    const mapboxToken =
      "sk.eyJ1IjoiYTc1NDJzIiwiYSI6ImNtMXFlY3UzYzBjZ2wya3NiNXYwb2tkeXMifQ.CMP-g6skERWuRRR6jeHMkA";
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${mapboxToken}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);
      const data = await response.json();
      return data.features?.[0]?.place_name || "Zone inconnue";
    } catch (error) {
      console.error("Erreur lors de la récupération de la zone:", error);
      return "Zone inconnue";
    }
  };

  const getLocation = async () => {
    setLoadingLocation(true);
    try {
      let location = await Location.getCurrentPositionAsync({});
      const lattitude = location.coords.latitude.toString();
      const longitude = location.coords.longitude.toString();
      const zone = await getZoneFromCoordinates(lattitude, longitude);

      setCurrentReport({
        ...currentReport,
        lattitude,
        longitude,
        zone,
      });
    } catch (error) {
      console.error(
        "Erreur lors de la récupération de la localisation:",
        error
      );
      Alert.alert("Erreur", "Impossible de récupérer la localisation");
    }
    setLoadingLocation(false);
  };

  const pickVideo = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission refusée",
        "La caméra est nécessaire pour enregistrer une vidéo"
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      videoMaxDuration: 60,
      quality: 1,
    });

    if (!result.cancelled) {
      setCurrentReport((currentReport) => ({
        ...currentReport,
        video: result.uri,
      }));
    } else {
      console.log("Enregistrement vidéo annulé");
    }
  };

  const startRecording = async () => {
    try {
      if (permissionResponse.status !== "granted") {
        console.log("Requesting permission..");
        await requestPermission();
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log("Starting recording..");
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      console.log("Recording started");
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  };

  const stopRecording = async () => {
    console.log("Stopping recording..");
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    const uri = recording.getURI();
    console.log("Recording stopped and stored at", uri);
    setCurrentReport({ ...currentReport, audio: uri });
  };

  const submitForm = async () => {
    try {
      if (!currentReport.title || !currentReport.photo) {
        Alert.alert("Erreur", "Veuillez remplir tous les champs obligatoires");
        return;
      }

      const response = await submitReport(currentReport);
      console.log("La réponse du serveur", response);
      Alert.alert(
        "Succès",
        `Votre rapport d’incident à ${currentReport.zone} a été envoyé avec succès. Merci pour votre contribution !`,
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("DrawerNavigation"),
          },
        ]
      );
    } catch (error) {
      console.log("voici l'erreur en question uwaish", error);
      Alert.alert("Erreur", "Une erreur est survenue lors de l'envoi.");
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.inputGroup}>
          <Icon name="title" size={24} color="#2C9CDB" />
          <TextInput
            style={styles.input}
            placeholder="Titre de l'incident"
            onChangeText={(text) =>
              setCurrentReport({ ...currentReport, title: text })
            }
            value={currentReport.title}
          />
        </View>

        <View style={styles.inputGroup}>
          <Icon name="description" size={24} color="#2C9CDB" />
          <TextInput
            style={styles.descriptionInput}
            placeholder="Description"
            onChangeText={(text) =>
              setCurrentReport({ ...currentReport, description: text })
            }
            value={currentReport.description}
            multiline={true}
            numberOfLines={6}
            textAlignVertical="top"
          />
        </View>

        {loadingLocation ? (
          <ActivityIndicator size="large" color="#ff6347" />
        ) : (
          <View style={styles.zoneContainer}>
            <Icon name="place" size={40} color="#38A0DB" />
            <View style={{ flexDirection: "column" }}>
              <Text style={styles.position}>Votre position actuelle</Text>
              <Text style={styles.zone}>
                {" "}
                {currentReport.zone
                  ? currentReport.zone
                  : "Récupération en cours..."}
              </Text>
            </View>
          </View>
        )}
        <View style={styles.recordContainer}>
          {currentReport.photo ? (
            <Image
              source={{ uri: currentReport.photo }}
              style={styles.imagePreview}
            />
          ) : (
            <Text>Photo non disponible</Text>
          )}

          {currentReport.video ? (
            <Video
              source={{ uri: currentReport.video }}
              rate={1.0}
              volume={1.0}
              isMuted={false}
              resizeMode="cover"
              shouldPlay
              isLooping
              style={styles.videoPreview}
            />
          ) : null}

          {currentReport.audio && (
            <View style={styles.audioContainer}>
              <TouchableOpacity onPress={handlePlayPause}>
                <Icon
                  name={isPlaying ? "pause" : "play-arrow"}
                  size={32}
                  color="#2C9CDB"
                />
              </TouchableOpacity>

              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={duration}
                minimumTrackTintColor="blue"
                maximumTrackTintColor="red"
                value={position}
                onValueChange={async (value) => {
                  if (sound) {
                    await sound.setPositionAsync(value);
                  }
                }}
              />
              <View style={styles.timeContainer}>
                <Text>{formatTime(position)}</Text>
                <Text>{formatTime(duration)}</Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
      <View style={styles.flexibleSpace} />
      <View style={styles.sendContainer}>
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => setShowCamera(true)}
        >
          <Icon name="videocam" size={24} color="#fff" />
        </TouchableOpacity>

        {showCamera && (
          <Modal
            animationType="slide"
            transparent={false}
            visible={showCamera}
            onRequestClose={() => setShowCamera(false)}
          >
            <Camera
              style={styles.camera}
              type={type}
              ref={(ref) => setCameraRef(ref)}
            >
              <View style={styles.cameraControls}>
                <TouchableOpacity
                  style={styles.recordButton}
                  onPress={
                    isRecording ? stopVideoRecording : startVideoRecording
                  }
                >
                  <Icon
                    name={isRecording ? "stop" : "videocam"}
                    size={60}
                    color={isRecording ? "red" : "white"}
                  />
                </TouchableOpacity>
              </View>
            </Camera>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowCamera(false)}
            >
              <Text style={styles.closeButtonText}>Fermer</Text>
            </TouchableOpacity>
          </Modal>
        )}
        <View style={styles.iconContainer}>
          <TouchableOpacity
            onPress={recording ? stopRecording : startRecording}
          >
            <Icon name={recording ? "stop" : "mic"} size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        {showPopup && (
          <Modal
            animationType="slide"
            transparent={true}
            visible={showPopup}
            onRequestClose={handleClosePopup}
          >
            <View style={styles.popupContainer}>
              <View style={styles.popupContent}>
                <Text
                  style={
                    isSuccess ? styles.successMessage : styles.errorMessage
                  }
                >
                  {popupMessage}
                </Text>
                <TouchableOpacity
                  onPress={handleClosePopup}
                  style={styles.closeButton}
                >
                  <Text style={styles.closeButtonText}>Fermer</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}
        <SubmitButton isSyncing={isSyncing} handleSubmit={submitForm} />
      </View>
    </View>
  );
}

const SubmitButton = ({ isSyncing, handleSubmit }) => {
  return (
    <TouchableOpacity
      style={styles.submittButton}
      onPress={handleSubmit}
      disabled={isSyncing}
    >
      <Icon name="send" size={24} color="#fff" />
      <Text style={styles.submittButtonText}>
        {isSyncing ? "Envoi..." : "Envoyer"}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#858585",
  },
  inputGroup: {
    flexDirection: "row",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#2C9CDB",
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: "#858585",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  zoneText: {
    fontSize: 14,
    fontStyle: "italic",
    marginBottom: 20,
    color: "#555",
    marginLeft: 10,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#38A0DB",
    padding: 10,
    borderRadius: 8,
    width: "30%",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    marginLeft: 5,
    fontWeight: "bold",
  },
  submitContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  submitButton: {
    backgroundColor: "#008CBA",
    padding: 15,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  flexibleSpace: {
    flex: 1,
  },
  submittButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2C9CDB",
    padding: 5,
    borderRadius: 8,
    width: 130,
    height: 40,
    marginLeft: 30,
  },
  submittButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  descriptionInput: {
    borderColor: "#ccc",
    padding: 5,
    borderRadius: 5,
    minHeight: 120,
    textAlignVertical: "top",
    fontSize: 16,
    color: "#858585",
    // lineHeight:'16px'
  },
  zoneContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    padding: 5,
  },
  position: {
    color: "#858585",
    textAlign: "left",
    // lineHeight:'12px',
  },
  zone: {
    color: "#2C9CDB",
    fontSize: 20,
    fontWeight: "bold",
    // lineHeight:'12px',
    // fontFamily:'poppins'
  },
  sendContainer: {
    width: 350,
    height: 69,
    borderRadius: 10,
    backgroundColor: "white",
    borderColor: "#2C9CDB",
    borderWidth: 0.5,
    alignItems: "center",
    padding: 15,
    flexDirection: "row",
  },
  iconContainer: {
    width: 42,
    height: 40,
    backgroundColor: "#2C9CDB",
    borderRadius: 50,
    marginRight: 10,
    padding: 8,
  },
  recordContainer: {
    flexDirection: "column",
    paddingBottom: 15,
    // padding:10
  },
  audioContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  slider: {
    flex: 1,
    marginHorizontal: 10,
    width: 200,
    height: 40,
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 80,
  },
  popupContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  popupContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
  },
  successMessage: {
    color: "green",
    fontSize: 18,
    marginBottom: 20,
  },
  errorMessage: {
    color: "red",
    fontSize: 18,
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: "#2C9CDB",
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  camera: {
    flex: 1,
    justifyContent: "flex-end",
  },
  cameraControls: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  recordButton: {
    alignSelf: "center",
  },
  closeButton: {
    position: "absolute",
    top: 50,
    right: 20,
  },
  closeButtonText: {
    fontSize: 18,
    color: "#fff",
  },
  imagePreview: {
    width: 345,
    height: 240,
    marginBottom: 20,
  },
  videoPreview: {
    width: 345,
    height: 240,
  },
});
