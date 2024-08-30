import React from "react";
import { Text, View, TextInput, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useNavigation } from '@react-navigation/native';

export default function Login() {
    const navigation = useNavigation();
    return (
        <View style={styles.container}>
            <View style={styles.start}>
                <View style={styles.rectangle}></View>
                <View style={{flexDirection:''}}>
                    <Image
                        source={require('../../assets/images/logo.webp')}
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
                <TouchableOpacity style={styles.button} onPress={() => navigation.push("email")}>
                    <Text style={styles.buttonText}>Email</Text>
                </TouchableOpacity>
                <Text>Ou</Text>
                <TouchableOpacity style={styles.button} onPress={() => navigation.push("phone")}>
                    <Text style={styles.buttonText}>Numéro de Téléphone</Text>
                </TouchableOpacity>
                <Text>Ou</Text>
                <TouchableOpacity style={styles.button} onPress={() => navigation.push("social_login")}>
                    <Text style={styles.buttonText}>Réseaux sociaux</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={{}} onPress={() => navigation.push("Inscription")}>
                <Text style={styles.register}>Je n'ai pas de compte {'\n'} S'inscrire</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        position: 'relative',
    },
    title: {
        fontSize: 40,
        marginBottom: 2,
        fontWeight:"bold",
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
    },
    buttonText: {
        color: "white",
        fontSize: 16,
    },
    line:{
        height:9,
        backgroundColor: "#38A0DB",
        width:100,
    },
    loginview:{
        marginTop:40,
        marginBottom:40,
        marginLeft:150
    },
    logo: {
        // position: 'absolute',
        top: -120,
        right: -100,
        width: 110,
        height: 45,
         
    },
    rectangle:{
        position:'absolute',
        top:-210,
        left:-310,
        width:360.75,
        height:290.36,
        backgroundColor: "#38A0DB",
        transform:[{rotate:'54deg'}]
    },
    register: {
       marginTop:20,
       color:"#38A0DB"
    },
});
