import React, { useState } from "react";
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { GoogleAuthConfig } from "../utils/AuthConfig";
import { authorize } from "react-native-app-auth";

export default function SocialLogin() {
  const [authState, setAuthState] = useState(null);

  const loginWithGoogle = async () => {
    const authState = await authorize(GoogleAuthConfig);
    console.log("google auth result: ", authState);
    return authState;
  };

  const handleLogin = async () => {
    try {
      const result = await authorize(GoogleAuthConfig); // This starts the OAuth flow
      setAuthState(result);
    } catch (error) {
      console.error("Failed to log in", error);
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.start}>
        <View style={styles.rectangle}></View>
        <View style={{ flexDirection: "" }}>
          <Image
            source={require("../../assets/images/logo.webp")}
            style={styles.logo}
          />
        </View>
      </View>
      <View style={styles.loginview}>
        <Text style={styles.title}>Login</Text>
        <View style={styles.line}></View>
      </View>
      <Text style={styles.orText}>Se connecter avec</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Icon name="google" size={18} style={styles.icon} />
          <Text style={styles.buttonText}>Google</Text>
        </TouchableOpacity>
        {/* TODO  Supprimer cette partie avant production*/}
        <Text style={{ fontSize: 20 }}>key: {GoogleAuthConfig.clientId}</Text>

        <Text>Ou</Text>
        <TouchableOpacity style={styles.button} onPress={() => {}}>
          <Icon name="facebook" size={18} style={styles.icon} />
          <Text style={styles.buttonText}>Facebook</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    position: "relative",
  },
  title: {
    fontSize: 40,
    marginBottom: 2,
    fontWeight: "bold",
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
  },
  orText: {
    marginVertical: 10,
  },
  button: {
    backgroundColor: "#38A0DB",
    width: 250,
    padding: 15,
    borderRadius: 20,
    alignItems: "center",
    marginVertical: 10,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  line: {
    height: 9,
    backgroundColor: "#38A0DB",
    width: 100,
  },
  loginview: {
    marginTop: 40,
    marginBottom: 40,
    marginLeft: 150,
  },
  logo: {
    // position: 'absolute',
    top: -120,
    right: -100,
    width: 110,
    height: 45,
  },
  rectangle: {
    position: "absolute",
    top: -210,
    left: -310,
    width: 360.75,
    height: 290.36,
    backgroundColor: "#38A0DB",
    transform: [{ rotate: "54deg" }],
  },
  start: {
    //    marginBottom:30
  },
  icon: {
    color: "#fff",
  },
});
