import { CameraView } from "expo-camera";
import React, { useContext, useState, useEffect } from "react";
import Slider from '@react-native-community/slider'; 
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
  Modal
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";
import {Audio, Video} from "expo-av";
import { ReportContext } from "../context/ReportContext";

export default function App() {
  const { isSyncing, submitReport } = useContext(ReportContext);
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
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [recording, setRecording] = useState(null);
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [sound, setSound] = useState();
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [showPopup, setShowPopup] = useState(false); 
  const [popupMessage, setPopupMessage] = useState(''); 
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    getLocation(); 
    playSound();
    return sound
    ? () => {
        sound.unloadAsync(); 
      }
    : undefined;
  }, []);

  async function playSound() {
    const { sound } = await Audio.Sound.createAsync(
      { uri: report.audio },
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
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const getZoneFromCoordinates = async (latitude, longitude) => {
    const mapboxToken = "sk.eyJ1IjoiYTc1NDJzIiwiYSI6ImNtMXFlY3UzYzBjZ2wya3NiNXYwb2tkeXMifQ.CMP-g6skERWuRRR6jeHMkA"; // Remplace par ton token Mapbox
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${mapboxToken}`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
  
      if (data.features && data.features.length > 0) {
        const zone = data.features[0].place_name;
        return zone;
      } else {
        return "Zone inconnue";
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du nom de la zone:", error);
      return "Zone inconnue";
    }
  };
  
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
      const lattitude = location.coords.latitude.toString();
      const longitude = location.coords.longitude.toString();
      const zone = await getZoneFromCoordinates(lattitude, longitude);
      
      setReport({
        ...report,
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
  // Handle video recording
  const pickVideo = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,  
      videoMaxDuration: 60,  
      quality: ImagePicker.VideoQualityType.High,  
    });
  
    if (result.cancelled) {
      console.log("Enregistrement vidéo annulé");
    } else {
      const videoUri = result.uri;
      setReport({ ...report, video: videoUri });
    }
  };

  // Handle audio recording
  const startRecording = async () => {
    try {
      if (permissionResponse.status !== 'granted') {
        console.log('Requesting permission..');
        await requestPermission();
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log('Starting recording..');
      const { recording } = await Audio.Recording.createAsync( Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    console.log('Stopping recording..');
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync(
      {
        allowsRecordingIOS: false,
      }
    );
    const uri = recording.getURI();
    console.log('Recording stopped and stored at', uri);
    setReport({ ...report, audio: uri });
  };
  

  const submitForm = async () => {
    
    try {
      if (!report.title || !report.zone || !report.photo) {
        Alert.alert("Erreur", "Veuillez remplir tous les champs obligatoires");
        return;
      }
      const response = await submitReport(report); 
      if (response.status === 200) {
        setPopupMessage(`Votre report d’incident à ${zone} a été envoyé avec succès. Merci pour votre contribution !`);
        setIsSuccess(true);
      } else {
        setPopupMessage('Échec de l\'envoi de l\'incident.');
        setIsSuccess(false);
      }
    } catch (error) {
      setPopupMessage('Une erreur est survenue lors de l\'envoi.');
      setIsSuccess(false);
    } finally {
      setShowPopup(true); 
    }
    await submitReport(report);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <View style={styles.container}>
      
      <View style={styles.inputGroup}>
        <Icon name="title" size={24} color="#2C9CDB" />
        <TextInput
          style={styles.input}
          placeholder="Titre de l'incident"
          onChangeText={(text) => setReport({ ...report, title: text })}
          value={report.title}
        />
      </View>

      <View style={styles.inputGroup}>
        <Icon name="description" size={24} color="#2C9CDB" />
        <TextInput
          style={styles.descriptionInput}
          placeholder="Description"
          onChangeText={(text) => setReport({ ...report, description: text })}
          value={report.description}
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
            <View style={{flexDirection:'column'}}>
              <Text style={styles.position}>Votre position actuelle</Text>
              <Text style={styles.zone}> {report.zone || "Récupération en cours..."}</Text>
            </View>
            
          </View>
        )}
        <View style={styles.recordContainer}>
          {report.photo ? (
            <Image source={{ uri: report.photo }} style={styles.imagePreview} />
          ) : null}
          
          {report.video ? (
            <Video
              source={{ uri: report.video }}
              rate={1.0}
              volume={1.0}
              isMuted={false}
              resizeMode="cover"
              shouldPlay
              isLooping
              style={styles.videoPreview}
            />
          ) : null}
          
          {report.audio && (
            <View style={styles.audioContainer}>
              <TouchableOpacity onPress={handlePlayPause}>
                <Icon name={isPlaying ? "pause" : "play-arrow"} size={32} color="#2C9CDB" />
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
        
        <View style={styles.flexibleSpace} />
        <View style={styles.sendContainer}>
          <View style={styles.iconContainer}>
            <TouchableOpacity onPress={pickImage}>
              <Icon name="photo-camera" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          <View style={styles.iconContainer}>
            <TouchableOpacity onPress={pickVideo}>
              <Icon name="videocam" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
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
                  <Text style={isSuccess ? styles.successMessage : styles.errorMessage}>
                    {popupMessage}
                  </Text>
                  <TouchableOpacity onPress={handleClosePopup} style={styles.closeButton}>
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
    <TouchableOpacity style={styles.submittButton} onPress={handleSubmit} disabled={isSyncing}>
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color:'#858585'
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
    color:'#858585'
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
    height:40,
    marginLeft:30
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
    color:'#858585',
    lineHeight:'16px'  
  },
  zoneContainer: {
    flexDirection: "row",  
    alignItems: "center",  
    marginTop: 10,
    padding:5
  },
  position:{
    color:'#858585',
    textAlign:'left',
    lineHeight:'12px',
  },
  zone:{
    color:'#2C9CDB',
    fontSize:'20px',
    fontWeight:'bold',
    lineHeight:'12px',
    fontFamily:'poppins'
  },
  sendContainer:{
    width:350,
    height:69,
    borderRadius:10,
    backgroundColor:'white',
    borderColor:'#2C9CDB',
    borderWidth:0.5,
    alignItems:'center',
    padding:15,
    flexDirection:'row'
  },
  iconContainer:{
    width:42,
    height:40,
    backgroundColor:"#2C9CDB",
    borderRadius:50,
    marginRight:10,
    padding:8
  },
  recordContainer:{
    flexDirection:'row',
    padding:10
  },
  audioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  slider: {
    flex: 1,
    marginHorizontal: 10,
    width:200,
    height:40,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 80,
  },
  popupContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  popupContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  successMessage: {
    color: 'green',
    fontSize: 18,
    marginBottom: 20,
  },
  errorMessage: {
    color: 'red',
    fontSize: 18,
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#2C9CDB',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});