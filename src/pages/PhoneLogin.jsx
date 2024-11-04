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
import { LoginWithApple, loginWithGoogle } from "../utils/AuthConfig";
import * as AppleAuthentication from "expo-apple-authentication";
import http from "../api/http";
export default function PhoneLogin() {
    const [phone, setPhone] = React.useState('');
    const [emailFocused, setEmailFocused] = useState(false); 
    const [otpSent, setOtpSent] = useState(false);
    const navigation = useNavigation();
    const [authState, setAuthState] = useState(null);
    
    const Schema = Validator.object().shape({
        email: Validator.string().email().required().label("Email"),
        password: Validator.string().min(5).required().label("Mot De Passe"),
    });

    const handleRegister = async () => {
        try {
          const response = await http.post('/otpRequest/', { phone });
          Alert.alert('OTP envoyé !', 'Veuillez vérifier votre téléphone pour l\'OTP.');
          navigation.navigate("otp")
        } catch (error) {
          console.error("Erreur lors de l'inscription :", error);
          Alert.alert("Erreur", "Une erreur est survenue.");
        }
    };
    const handleGoogleLogin = async () => {
        try {
          const result = await loginWithGoogle(); 
          setAuthState(result);
          
        } catch (error) {
          console.error("Failed to log in", error);
        }
    }
    const handleAppleLogin = async () => {
        try {
          const credential = await LoginWithApple();
          console.log(credential);
          Alert.alert("Login Successful!", `User ID: ${credential.user}`);
          const { identityToken, user, email, fullName } = credential;
          
        } catch (error) {
          if (error.code === "ERR_CANCELED") {
            Alert.alert("Sign in cancelled", "The user canceled the sign-in flow.");
          } else {
            Alert.alert("Error", "An error occurred while signing in.");
            console.error(error);
          }
        }
      };

      const handleSendOTP = async () => {
        setIsLoading(true);
        try {
            await axios.post('https://yourapi.com/otpRequest/', { phone });
            setOtpSent(true);
            Alert.alert('OTP envoyé !', 'Veuillez vérifier votre téléphone pour l\'OTP.');
        } catch (error) {
            console.error(error);
            Alert.alert('Erreur', 'Impossible d\'envoyer l\'OTP. Veuillez réessayer.');
        } finally {
            setIsLoading(false);
        }
    };
    
    
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
                        <Text style={styles.title}>S'inscrire</Text>
                        <View style={styles.line}></View>
                    </View>
                    <View style={styles.buttonContainer}>
                        <View style={styles.inputContainer}>
                            <Icon name="phone" size={18} style={styles.icon} />

                            <TextInput
                                style={[
                                    styles.input,
                                    emailFocused ? styles.inputFocused : null
                                ]}
                                onChangeText={setPhone}
                                value={phone}
                                placeholder={emailFocused ? "" : "Numéro de téléphone"} 
                                onFocus={() => setEmailFocused(true)}
                                onBlur={() => setEmailFocused(false)}
                                keyboardType="numeric"
                            />
                            
                        </View>

                        <TouchableOpacity style={styles.button} testID="login-button" onPress={handleRegister}>
                            <Text style={styles.buttonText}>Suivant</Text>
                        </TouchableOpacity>
                        <View style={styles.or}>
                            <View style={styles.tiret} />
                            <Text style={styles.orText}>  Ou s'inscrire avec  </Text>
                            <View style={styles.tiret}/>
                        </View>
                        <View style={styles.socialContainer}>
                            <View style={styles.google}>
                                <TouchableOpacity onPress={handleGoogleLogin}>
                                    <Icon name="google" size={18} color='#fff' />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.google}>
                                <TouchableOpacity onPress={() => navigation.navigate("Inscription")}>
                                    <Icon name="envelope" size={18} color='#fff' />
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
                            <Text style={styles.deja}>Vous avez déjà un compte? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                            <Text style={styles.login}>Se connecter</Text>
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
        backgroundColor: "#2C9CDB",
        width: 320,
        padding: 15,
        borderRadius: 20,
        alignItems: "center",
        marginVertical: 15,
        marginTop:30
    },
    buttonText: {
        color: "white",
        fontSize: 16,
    },
    line: {
        height: 9,
        backgroundColor: "#2C9CDB",
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
        backgroundColor: "#2C9CDB",
        transform: [{ rotate: '54deg' }],
    },
    start: {},
    input: {
        flex: 1,
        margin: 12,
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#2C9CDB", 
    },
    inputFocused: {
        borderBottomColor: "#2C9CDB", 
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: 335,
    },
    icon: {
        marginRight: -15,
        color:"#2C9CDB",
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
       backgroundColor:'#2C9CDB',
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
