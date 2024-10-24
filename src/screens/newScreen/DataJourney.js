import React from 'react';
import { Text, StyleSheet, View, Image, Button, TouchableOpacity, TextInput } from 'react-native';
import moment from 'moment';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import Icon from "react-native-vector-icons/MaterialIcons";
import * as Progress from 'react-native-progress';
import { getImage } from '../../api/http';

const DataJourney = ({ route, navigation }) => {
    const { incident } = route.params;
    console.log(incident); 
    const getProgressDetails = (state) => {
      switch (state) {
          case 'declared':
              return { progress: 1 / 3, color: '#2C9CDB' }; 
          case 'taken_into_account':
              return { progress: 2 / 3, color: '#F3D155' }; 
          case 'resolved':
              return { progress: 1, color: '#1DD000' }; 
          default:
              return { progress: 0, color: '#D3D3D3' }; 
      }
  };
  const getCheckIcon = (state, step) => {
    switch (state) {
        case 'declared':
          return step === 'declared' ? <FontAwesome name="check-circle" size={24} color="#2C9CDB" /> : <FontAwesome name="circle-thin" size={24} color="#D3D3D3" />;
        case 'taken_into_account':
          return step === 'declared' || step === 'taken_into_account' ? <FontAwesome name="check-circle" size={24} color={step === 'declared' ? '#ADD8E6' : '#F3D155'} /> : <FontAwesome name="circle-thin" size={24} color="#D3D3D3" />;
        case 'resolved':
          return <FontAwesome name="check-circle" size={24} color={step === 'declared' ? '#2C9CDB' : step === 'taken_into_account' ? '#F3D155' : '#1DD000'} />;
        default:
         return <FontAwesome name="circle-thin" size={24} color="#D3D3D3" />;
    }
  };

  const progressDetails = getProgressDetails(incident.etat);
    return (
        <View style={styles.container}>
            <Image
              source={getImage(incident.photo, true)} 
              style={styles.incidentImage}
            />
            <View style={styles.detailsContainer}>
              <View style={styles.actionsContainer}>
                <Icon name="place" size={24} color="#38A0DB" />
                <Text style={styles.detailZone}> {incident?.zone}</Text>
              </View>
              <View style={styles.recordContainer}>
              </View>
              <View style={styles.inputGroup}>
                <Icon name="description" size={24} color="#2C9CDB" />
                <Text style={styles.descriptionInput}>Description  {incident?.description}</Text>
              </View>  
              <View style={styles.detailText}>
                <Text style={styles.detailText}>{moment(incident.created_at).format('L')}</Text>
              </View>
              <Progress.Bar
                testID="progress-bar"
                progress={progressDetails.progress}
                width={340}
                color={progressDetails.color}
                unfilledColor="#ADD8E6" 
                borderWidth={0}
                borderColor="#000"
              />
              <View style={styles.stepsContainer}>
                <View style={styles.step}>
                    {getCheckIcon(incident.etat, 'declared')}
                    <Text style={styles.stepText}>Déclaré</Text>
                </View>
                <View style={styles.step}>
                    {getCheckIcon(incident.etat, 'taken_into_account')}
                    <Text style={styles.stepText}>Pris en compte</Text>
                </View>
                <View style={styles.step}>
                    {getCheckIcon(incident.etat, 'resolved')}
                    <Text style={styles.stepText}>Résolu</Text>
                </View>
              </View>
            </View>
        </View>
    );
};

const translateState = (etat) => {
    switch (etat) {
        case 'declared':
            return 'Déclaré';
        case 'taken_into_account':
            return 'Pris en compte';
        case 'resolved':
            return 'Résolu';
        default:
            return 'Inconnu';
    }
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      padding: 20,
    },
    incidentImage: {
      width: '100%',
      height: 200,
      borderRadius: 10,
      marginBottom: 10,
    },
    progressContainer: {
      marginTop: 20,
      marginBottom: 20,
    },
    stepsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 10,
      borderWidth:0
    },
    step: {
      flexDirection: 'column',
      alignItems: 'center',
    },
    stepText: {
      marginTop: 5,
      fontSize: 14,
      color: '#000',
    },
    detailsContainer: {
      marginBottom: 20,
    },
    detailTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    detailZone: {
      fontSize: 16,
      marginVertical: 5,
      color:'#38A0DB',
      fontWeight:'bold'
    },
    detailText: {
      fontSize: 16,
      marginVertical: 5,
      color:'#858585'
    },
    actionsContainer: {
      flexDirection: 'row',
      alignItems:'center',
      marginBottom:10
    },
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#2D9CDB',
      padding: 10,
      borderRadius: 5,
      flex: 1,
      justifyContent: 'center',
      marginHorizontal: 5,
    },
    buttonText: {
      color: '#fff',
      marginLeft: 5,
    },
    recordContainer:{
      flex:1
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
    descriptionInput: {
      borderColor: "#ccc",
      padding: 5, 
      borderRadius: 5,
      minHeight: 120,  
      textAlignVertical: "top",  
      fontSize: 16,
      color:'#858585',
      // lineHeight:'16px'  
    },
});

export default DataJourney;
