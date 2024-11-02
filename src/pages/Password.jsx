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
import http from "../api/http";
export default function PasswordStep() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false); 
    const [passwordFocused, setPasswordFocused] = useState(false); 
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false); 
    const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false); 
    const [message, setMessage] = useState('');
    const navigation = useNavigation();
  
    const handleSetPassword = async () => {
      try {
        await http.put('/set-password/', { password });
        setMessage("Mot de passe créé avec succès !");
        navigation.navigate("DrawerNavigation")
      } catch (error) {
        console.error("Erreur lors de la création du mot de passe :", error);
        setMessage("Une erreur s'est produite.");
      }
    };

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible); 
    };

    const toggleConfirmPasswordVisibility = () => {
        setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
    };

    const Schema = Validator.object().shape({
        password: Validator.string().min(5).required().label("Mot De Passe"),
    });

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
                        <Text style={styles.title}>Mot de passe</Text>
                        <View style={styles.line}></View>
                    </View>
                    <View style={styles.buttonContainer}>
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
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={[
                                    styles.input,
                                    confirmPasswordFocused ? styles.inputFocused : null
                                ]}
                                onChangeText={setConfirmPassword}
                                value={confirmPassword}
                                placeholder={confirmPasswordFocused ? "" : "Confirmer le mot de passe"}
                                secureTextEntry={!isConfirmPasswordVisible} 
                                onFocus={() => setConfirmPasswordFocused(true)}
                                onBlur={() => setConfirmPasswordFocused(false)}
                            />
                            <TouchableOpacity onPress={toggleConfirmPasswordVisibility}>
                                <Icon
                                    name={isConfirmPasswordVisible ? "eye" : "eye-slash"} 
                                    size={18}
                                    style={styles.icon}
                                />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={styles.button} testID="login-button" onPress={handleSetPassword}>
                            <Text style={styles.buttonText}>S'enregistrer</Text>
                        </TouchableOpacity>
                        {message ? <Text>{message}</Text> : null}
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
        fontSize: 30,
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
    
});
