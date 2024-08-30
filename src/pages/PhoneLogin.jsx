import React from "react";
import { Text, View, TextInput, StyleSheet, TouchableOpacity, Image } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';

export default function PhoneLogin() {
    const [number, onChangeNumber] = React.useState('');
    return (
        <View style={styles.container}>
            <View style={styles.start}>
                <View style={styles.rectangle}></View>
                <View style={{ flexDirection: '' }}>
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
            <View style={styles.buttonContainer}>
                
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        onChangeText={onChangeNumber}
                        value={number}
                        placeholder="Numéro de téléphone"
                        keyboardType="numeric"
                    />
                    <Icon name="phone" size={18} style={styles.icon} />
                </View>
                <TouchableOpacity style={styles.button} onPress={() => { }}>
                    <Text style={styles.buttonText}>Se connecter</Text>
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
        position: 'relative',
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
        width: 250,
        padding: 15,
        borderRadius: 20,
        alignItems: "center",
        marginVertical: 10,
        marginTop:70
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
        top: -210,
        left: -310,
        width: 360.75,
        height: 290.36,
        backgroundColor: "#38A0DB",
        transform: [{ rotate: '54deg' }]
    },
    start: {},
    input: {
        flex: 1,
        margin: 12,
        padding: 10,
        borderBottomWidth: 1,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: 335,
    },
    icon: {
        marginRight: 15,
    },
});
