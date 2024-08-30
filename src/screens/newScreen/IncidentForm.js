import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  TextInput,
  Alert,
  ImageBackground,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { create_incident } from "../../api/incident";
import { Input, Icon } from "react-native-elements";
import { onAddIncident } from "../../redux/incidents/action";
import HeaderLeft from "../../utils/HeaderLeft";
import * as ImagePicker from "expo-image-picker";
import { setIncident, setUser } from "../../api/userStorage";
import { ScrollView } from "react-native-gesture-handler";
import { read_user } from "../../api/user";
import { onLogin } from "../../redux/user/action";

const IncidentForm = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.token);
  const user = useSelector((state) => state.user.user);

  const [zone, setZone] = useState(route?.params?.zone || "");
  const [title, setTitle] = useState(route?.params?.title || "");
  const [description, setDescription] = useState(route?.params?.description || "");
  const [photo, setPhoto] = useState(route.params?.photo || route.params?.image);
  const [errors, setErrors] = useState({});
  const [audio, setAudio] = useState(route?.params?.audio || null);
  const [loading, setLoading] = useState(false);
  const [video, setVideo] = useState(route?.params?.video || "");
  const [askCategories, setAskCategories] = useState(false);
  const [pourcent, setPourcent] = useState(null);
  const [playStatus, setPlayStatus] = useState({});
  const [recordVideo, setRecordVideo] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [status, setStatus] = useState({});
  const [latitude, setLatitude] = useState(0);
  const [audioProgress] = useState(new Animated.Value(0));
  const [longitude, setLongitude] = useState(0);

  const pickVideo = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        quality: 1,
      });
      if (!result.canceled) {
        setVideo(result.assets);
      }
    } catch (E) {
      console.log(E);
    }
  };

  const askAsync = () => {
    return new Promise((resolve) => {
      Alert.alert(
        "",
        "Vous n'êtes pas connecté voulez-vous continuer ?",
        [
          {
            text: "Se connecter",
            onPress: () => {
              navigation.replace("Login", {
                nextRoute: "IncidentForm",
                params: { zone, title, description, photo, audio, video },
              });
              resolve(false);
            },
          },
          { text: "Oui continuer", onPress: () => resolve(true) },
        ],
        { cancelable: false }
      );
    });
  };

  const create_incident = async (data) => {
    setLoading(true);
    try {
      const res = await create_incident(data, uploadProgress);
      dispatch(onAddIncident({ ...res, user }));
      setIsModalVisible(true);
      if (token) {
        const user = await read_user(user.id);
        await setUser({ token, user });
        dispatch(onLogin({ token, user }));
      }
    } catch (error) {
      console.log("error", error);
      if (error.message && error.message.includes("Network Error")) {
        Alert.alert("", "Échec de l'enregistrement de l'incident", [
          {
            text: "Réessayer",
            onPress: () => {
              setPourcent(null);
              create_incident(data);
            },
          },
          { text: "Annuler", style: "cancel" },
        ]);
      } else {
        Alert.alert("", `Error: ${error.message}`);
        setPourcent(null);
        if (error) {
          const errors = {};
          setErrors(errors);
        }
      }
    }
    setLoading(false);
  };

  const uploadProgress = (pourcent) => {
    setPourcent(pourcent);
  };

  const renderError = (field) => {
    const error = errors[field];
    if (!error) return null;
    return (
      <Text style={styles.errorText}>
        {error}
      </Text>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <ScrollView>
          <ImageBackground
            source={{ uri: photo }}
            style={styles.imageBackground}
          >
            <View style={styles.header}>
              <HeaderLeft colors="#FFF" />
              <Text style={styles.headerText}>Ajouter des détails</Text>
            </View>
            <View style={styles.details}>
              <View style={styles.zone}>
                <Icon name="location-dot" color={"#fff"} size={20} />
                <Text style={styles.zoneText} testID="zone">
                  {zone}
                </Text>
              </View>
              <View>
                <Text style={styles.titleText}>
                  {title}
                </Text>
              </View>
            </View>
          </ImageBackground>
          <View style={styles.section}>
            <TextInput
              style={styles.input}
              placeholder="Titre"
              value={title}
              placeholderTextColor="rgba(74, 72, 72, 0.83)"
              onChangeText={setTitle}
            />
          </View>
          {renderError("title")}
          {renderError("zone")}
          <View>
            <Input
              inputStyle={styles.descriptionInput}
              multiline
              inputContainerStyle={styles.descriptionInputContainer}
              placeholder="Description"
              labelStyle={styles.labelStyle}
              errorMessage={null}
              onChangeText={setDescription}
              value={description}
              placeholderTextColor="#8E8E8E"
            />
          </View>
          {renderError("description")}
          <View style={styles.submitContainer}>
            <TouchableOpacity
              onPress={() => {}}
              style={styles.submitButton}
            >
              {!loading && (
                <>
                  <Text style={styles.submitText}>ENVOYER</Text>
                  <Icon name="send" color={"#fff"} size={30} />
                </>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingBottom: 20,
  },
  imageBackground: {
    justifyContent: "space-around",
    height: 300,
    paddingTop: 5,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#FFF",
    marginLeft: 20,
  },
  details: {
    marginHorizontal: 10,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around",
    flex: 1,
    paddingBottom: 20,
  },
  zone: {
    flexDirection: "row",
    flex: 1,
  },
  zoneText: {
    fontWeight: "bold",
    color: "#fff",
    marginStart: 6,
  },
  titleText: {
    fontSize: 14,
    textAlign: "center",
    fontWeight: "bold",
    color: "#fff",
  },
  section: {
    backgroundColor: "#fff",
    marginTop: 14,
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    shadowColor: "#ccc",
    shadowOpacity: 0.5,
    shadowRadius: 1,
    elevation: 2,
    shadowOffset: {
      width: 3,
      height: 3,
    },
  },
  input: {
    marginLeft: 20,
    width: "100%",
  },
  descriptionInput: {
    color: "#8E8E8E",
    paddingHorizontal: 5,
    paddingVertical: 5,
    fontSize: 14,
    height: 140,
    textAlignVertical: "top",
  },
  descriptionInputContainer: {
    width: "100%",
    borderBottomWidth: 0,
    borderRadius: 10,
    backgroundColor: "#F4F4F4",
    paddingHorizontal: 10,
  },
  labelStyle: {
    color: "#707070",
  },
  submitContainer: {
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  submitButton: {
    height: 40,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0F6DBD",
    paddingHorizontal: 40,
    borderRadius: 20,
    shadowColor: "#0F6DBD",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
  submitText: {
    color: "#fff",
    fontWeight: "bold",
    marginEnd: 10,
  },
  errorText: {
    color: "red",
    paddingLeft: 20,
  },
});

export default IncidentForm;
