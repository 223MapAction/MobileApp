import React, { useState, useRef } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import http from '../api/http';
import { onLogin } from '../redux/user/action';
import { useDispatch } from "react-redux";
import { setUser } from '../api/userStorage';

const VerifyOtp = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation()
    const route = useRoute();
    const { phone } = route.params;
    const [otp, setOtp] = useState(['', '', '', '', '', '']); 
    const inputs = useRef([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (text, index) => {
        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);

        if (text && index < otp.length - 1) {
            inputs.current[index + 1].focus();
        }
    };

    const handleVerifyOTP = async () => {
        setIsLoading(true);
        const otpCode = otp.join(''); 
        if (otpCode.length !== 6) {
            Alert.alert('Erreur', 'Veuillez entrer un OTP complet.');
            return;
        }
        try {
            const response = await http.post('/verifyOtp/', { phone, otp: otpCode });
            console.log('response', response)
            const { access, refresh, user } = response;
            dispatch(onLogin({token: access, user}));
            setUser({token: access, user})
            navigation.navigate("DrawerNavigation");
            Alert.alert('Succès', 'OTP vérifié avec succès !');
        } catch (error) {
            console.error(error);
            Alert.alert('Erreur', 'OTP incorrect ou expiré. Veuillez réessayer.');
        } finally {
            setIsLoading(false);
        }
    };
    

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Vérification OTP</Text>
            <Text style={styles.subtitle}>Un code a été envoyé à : {phone}</Text>
            <View style={styles.otpContainer}>
                {otp.map((value, index) => (
                    <TextInput
                        key={index}
                        style={styles.otpInput}
                        keyboardType="number-pad"
                        maxLength={1}
                        onChangeText={(text) => handleChange(text, index)}
                        value={value}
                        ref={(ref) => inputs.current[index] = ref}
                    />
                ))}
            </View>
            <TouchableOpacity 
                style={styles.button} 
                onPress={handleVerifyOTP}
                disabled={otp.join('').length !== 6}
            >
                <Text style={styles.buttonText}>Vérifier OTP</Text>
            </TouchableOpacity>
        </View>
    );

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
        color:'#2C9CDB'
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        color: '#555',
        marginBottom: 20,
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    otpInput: {
        width: 40,
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        fontSize: 18,
        textAlign: 'center',
    },
    button:{
        backgroundColor: "#2C9CDB",
        width: 200,
        padding: 15,
        borderRadius: 20,
        alignItems: "center",
        marginTop:30,
        marginHorizontal:60
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default VerifyOtp;
