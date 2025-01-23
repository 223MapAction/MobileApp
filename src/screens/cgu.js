import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, View, Button, ActivityIndicator, Dimensions, ScrollView} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Markdown from 'react-native-markdown-display';
import CguText from './newScreen/cguText';
const { width } = Dimensions.get('window');

export default function Cgu() {
  const [isLoading, setIsLoading] = useState(true); 
  const navigation = useNavigation();

  const handleAccept = async () => {
    try {
      await AsyncStorage.setItem('acceptedCgu', 'true'); 
      navigation.navigate('DrawerNavigation'); 
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement des CGU', error);
    }
  };

  const handleDecline = () => {
    navigation.navigate('Welcome'); 
  };

  useEffect(() => {
    const checkCgu = async () => {
      const value = await AsyncStorage.getItem('acceptedCgu');
      if (value === 'true') {
        navigation.navigate('DrawerNavigation'); 
      } else {
        setIsLoading(false); 
      }
    };

    checkCgu();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.container} testID="cgu-container">
        <ActivityIndicator size="large" color="#0000ff" testID="loading-indicator" />
      </View>
    );
  }

  return (
    <View style={styles.container} testID="cgu-container">
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Markdown style={markdownStyles} testID="cgu-markdown">
          {CguText}
        </Markdown>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <Button title="Accepter" onPress={handleAccept} />
        <Button title="Refuser" onPress={handleDecline} color="red" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20, 
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    width: width * 0.8, 
  },
  buttonContainer: {
    width: width * 0.8, 
    flexDirection: 'row',
    justifyContent: 'space-between', 
  },
  scrollViewContent: {
    paddingVertical: 20,
  },
});
const markdownStyles = {
  heading1: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C9CDB', 
  },
  strong: {
    fontWeight: 'bold',
  },
  text: {
    fontSize: 16,
    color: '#858585',
  },
  link: {
    color: '#2C9CDB', 
  },
};
