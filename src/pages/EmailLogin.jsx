import React, {useState} from "react";
import { View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
    KeyboardAvoidingView,
    Platform,
 } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import { login } from "../api/auth";
import { useNavigation } from '@react-navigation/native';
import Validator from "../utils/Validator";
import { loginWithApple, loginWithGoogle } from "../utils/AuthConfig";
import * as AppleAuthentication from "expo-apple-authentication";
import { onLogin } from "../redux/user/action";
import { connect } from "react-redux";
import { update_user } from "../api/user";
import {jwtDecode} from "jwt-decode";
import { useDispatch } from 'react-redux';
import { setUser } from "../api/userStorage";

export default function EmailLogin() {
    const dispatch = useDispatch()
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false); 
    const [emailFocused, setEmailFocused] = useState(false); 
    const [passwordFocused, setPasswordFocused] = useState(false); 
    const navigation = useNavigation();
    const [authState, setAuthState] = useState(null);
    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible); 
    };

    const Schema = Validator.object().shape({
        email: Validator.string().email().required().label("Email"),
        password: Validator.string().min(5).required().label("Mot De Passe"),
    });
    const handleGoogleLogin = async () => {
        try {
          const response = await loginWithGoogle();
          console.log("reponse recu",response);
          
          let {token, user} = response
          let accessToken = token
        //   const res = await update_user(response.user.id, accessToken);
        //   console.log("User updated",res)
          await setUser({ token, user });
          dispatch(onLogin({ token, user}));
          navigation.navigate("DrawerNavigation");
        } catch (error) {
          console.error("Failed to log in", error);
        }
    };
    const handleAppleLogin = async () => {
        try {
          const credential = await loginWithApple();
          console.log(credential);
          Alert.alert("Succès", "Connexion réussie!");
          navigation.navigate("DrawerNavigation")
        } catch (error) {
          if (error.code === "ERR_CANCELED") {
            Alert.alert("Connexion annulée", "Vous avez annulé le processus de connexion.");
          } else {
            Alert.alert("Erreur", "Une erreur est survenue lors de la connexion.");
            console.error(error);
          }
        }
    };
    
    const submit = async () => {
        try {
            await Schema.validate({ email, password });
            const user = { email, password };
            const response = await login(user);
            if (response.status === 200) {
                Alert.alert("Connexion réussie", "Vous êtes maintenant connecté.");
                navigation.navigate("DrawerNavigation");
            } else {
                Alert.alert("Erreur", "Connexion échouée.");
            }
        } catch (error) {
            Alert.alert("Erreur", error.message || "Une erreur est survenue lors de la connexion.");
        }
    }
    
    return (
        <View style={styles.container}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <ScrollView
                    keyboardShouldPersistTaps="always"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
                >
                    <View style={styles.start}>
                        <View style={styles.rectangle}></View>
                    </View>
                    <View style={styles.loginview}>
                        <Text style={styles.title}>Se connecter</Text>
                        <View style={styles.line}></View>
                    </View>
                    <View style={styles.buttonContainer}>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={[
                                    styles.input,
                                    emailFocused ? styles.inputFocused : null
                                ]}
                                onChangeText={setEmail}
                                value={email}
                                placeholder={emailFocused ? "" : "Email"} 
                                onFocus={() => setEmailFocused(true)}
                                onBlur={() => setEmailFocused(false)}
                            />
                            <Icon name="envelope" size={18} style={styles.icon} />
                        </View>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={[
                                    styles.input,
                                    passwordFocused ? styles.inputFocused : null
                                ]}
                                onChangeText={setPassword}
                                value={password}
                                placeholder={passwordFocused ? "" : "Mot de passe"}
                                secureTextEntry={!isPasswordVisible} 
                                onFocus={() => setPasswordFocused(true)}
                                onBlur={() => setPasswordFocused(false)}
                            />
                            <TouchableOpacity onPress={togglePasswordVisibility}>
                                <Icon
                                    name={isPasswordVisible ? "eye" : "eye-slash"} 
                                    size={18}
                                    style={styles.icon}
                                />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={styles.button} testID="login-button" onPress={submit}>
                            <Text style={styles.buttonText}>Se connecter</Text>
                        </TouchableOpacity>
                        <View style={styles.or}>
                            <View style={styles.tiret} />
                            <Text style={styles.orText}>  Ou se connecter avec  </Text>
                            <View style={styles.tiret}/>
                        </View>
                        <View style={styles.socialContainer}>
                            <View style={styles.google}>
                                <TouchableOpacity onPress={handleGoogleLogin}>
                                    <Icon name="google" size={18} color='#fff' />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.google}>
                                <TouchableOpacity onPress={() => navigation.navigate("phone")}>
                                    <Icon name="phone" size={18} color='#fff' />
                                </TouchableOpacity>
                            </View>
                            {Platform.OS === "ios" && (
                                <AppleAuthentication.AppleAuthenticationButton
                                buttonType={
                                    AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN
                                }
                                buttonStyle={
                                    AppleAuthentication.AppleAuthenticationButtonStyle.BLACK
                                }
                                cornerRadius={5}
                                style={styles.google}
                                onPress={handleAppleLogin}
                                />
                            )}
                        </View>
                        <View style={styles.connecte}>
                            <Text style={styles.deja}>Vous n'avez pas de compte? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate("Inscription")}>
                            <Text style={styles.login}>S'inscrire</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'#fff'
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
    button: {
        backgroundColor: "#38A0DB",
        width: 320,
        padding: 15,
        borderRadius: 20,
        alignItems: "center",
        marginVertical: 10,
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
        marginLeft: 150
    },
    logo: {
        top: -120,
        right: -100,
        width: 110,
        height: 45,
    },
    rectangle: {
        position: 'absolute',
        top: -220,
        left: -200,
        width: 360.75,
        height: 290.36,
        backgroundColor: "#38A0DB",
        transform: [{ rotate: '54deg' }],
    },
    start: {},
    input: {
        flex: 1,
        margin: 12,
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc", 
    },
    inputFocused: {
        borderBottomColor: "#38A0DB", 
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: 335,
    },
    icon: {
        marginRight: 15,
    },
    tiret:{
      backgroundColor:"#2C9CDB",
      width:89,
      borderWidth:0,
      height:2,
      marginTop:9
    },
    or:{
        flexDirection:'row',
        top:30
    },
    orText:{
        color:'#858585'
    },
    google:{
       backgroundColor:'#38A0DB',
       width:100,
       height:43,
       padding:10,
       marginLeft:10,
       borderRadius:8,
       alignItems:'center',
        
    },
    socialContainer:{
        flexDirection:'row',
        padding:10,
        top:30,
        marginBottom:50
    },
    login:{
        color:'#2CDB40',
        fontSize:14,
    },
    connecte:{
        flexDirection:'row',
        justifyContent:'center',
      },
      deja:{
        color:'#2D9CDB'
      }
});
