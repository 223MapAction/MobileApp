import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, FlatList, ActivityIndicator, ScrollView } from "react-native";
import { getImage } from "../api/http";
import { useSelector } from "react-redux";
import { MaterialIcons } from "@expo/vector-icons";
import moment from "moment";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as Location from "expo-location";
import { useNavigation, useRoute } from "@react-navigation/native";

const deltas = {
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

const ListIncident = () => {
  const [region, setRegion] = useState(null);
  const incidents = useSelector((state) => state.incidents);
  const navigation = useNavigation();
  const route = useRoute();
  
  const staticIncidents = [
    {
      id: '1',
      title: 'Woulouloudji',
      zone: 'Sabalibougou Courani',
      photo: 'https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg', 
      created_at: new Date().toISOString(),
      user_id: '123',
      etat:'resolved'
    },
    {
      id: '2',
      title: 'Botolidji',
      zone: 'Kalaban coura',
      photo: 'https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg', 
      created_at: new Date().toISOString(),
      user_id: '123',
      etat:'taken_into_account'
    },
    {
      id: '3',
      title: 'Inondations',
      zone: 'Kalaban Coro',
      photo: 'https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg', 
      created_at: new Date().toISOString(),
      user_id: '456',
      etat:'declared'
    },
  ];

  useEffect(() => {
    const title = route?.params?.title;
    if (title) {
      navigation.setOptions({ title });
    }
    // getLocationAsync();
  }, []);

  const getLocationAsync = async () => {
    let { status } = await Location.getForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("La permission d'accéder à l'emplacement a été refusée");
      return;
    }
    let location = await Location.getCurrentPositionAsync({});
    const region = {
      latittude: location.coords.latitude,
      longitude: location.coords.longitude,
      ...deltas,
    };
    setRegion(region);
  };

  const getIncidents = () => {
    const item = route?.params?.item;
    if (item) {
      navigation.setOptions({ title: item.month || item.zone });
      return item.incidents || staticIncidents;;
    }
    const user_id = route?.params?.user_id || null;
    if (user_id === null) return incidents;
    return incidents.filter((i) => i.user_id === user_id);
  };

  if (!incidents.length) {
    return (
      <View style={styles.container}>
        <ActivityIndicator color="#000" size="large" />
      </View>
    );
  }
  const stateTranslations = {
    declared: 'Déclaré',
    taken_into_account: 'Pris en compte',
    resolved: 'Résolu',
  };
  const renderItem = ({ item }) => {
        let backgroundColor;

    switch (item.etat) {
        case 'declared':
        backgroundColor = '#2d9cdb'; 
        break;
        case 'taken_into_account':
        backgroundColor = '#F3D155'; 
        break;
        case 'resolved':
        backgroundColor = '#1DD000';
        break;
        default:
        backgroundColor = 'white'; 
    }
    return (
        <TouchableOpacity onPress={() => navigation.navigate("DetailIncident", { incident: item })}>
            <View style={styles.incidentContainer}>
                <View style={styles.incidentContent}>
                <Image
                    resizeMode="cover"
                    style={styles.incidentImage}
                    // source={{ uri: item.photo }}
                    source={getImage(item.photo)}
                />
                <View style={styles.incidentInfo}>
                    <Text style={styles.incidentTitle}>{item.title}</Text>
                    <View style={styles.incidentLocation}>
                    <Text style={styles.incidentZone}>{item.zone}</Text>
                    </View>
                    <View style={styles.incidentDate}>
                        <Text style={[styles.statut, { backgroundColor }]}>{stateTranslations[item.etat]}</Text>
                        <Text style={{ color: "#858585", marginLeft:10 }}>
                            {moment(item.created_at).format("L")}
                        </Text>
                    </View>
                </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

  return (
    <View style={styles.container}>
      <FlatList
        data={getIncidents()}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Aucun résultat</Text>
          </View>
        }
        renderItem={renderItem}
      />
      <TouchableOpacity onPress={() => navigation.navigate("Picture")} style={styles.new}>
        <MaterialIcons name="add" size={24} color="#fff" />
        <Text style={styles.newText}>Nouvel Incident</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  incidentContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    borderColor: "#ccc",
    borderBottomWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 10,
  },
  incidentContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  incidentImage: {
    width: 76,
    height: 76,
    borderRadius:4
  },
  incidentInfo: {
    flexDirection: "column",
    alignItems: 'flex-start',
    justifyContent: "space-between",
    marginLeft: 10,
  },
  incidentTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#817979",
    marginLeft:10
  },
  incidentLocation: {
    flexDirection: "row",
    alignItems: "center",
  },
  incidentZone: {
    fontSize: 16,
    color: "#817979",
    marginLeft: 10,
  },
  incidentDate: {
    paddingVertical: 8,
    flexDirection:'row',
    padding:5,
    marginLeft:10
  },
  emptyContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  emptyText: {
    color: "#2d9cdb",
    fontSize: 16,
  },
  statut:{
    backgroundColor:"#2d9cdb",
    color:'#fff',
    minWidth:53,
    minHeight:17,
    borderRadius:3,
    padding:5,
  },
  new:{
    backgroundColor:'#2C9CDB',
    width:250,
    height:47,
    borderRadius:8,
    padding:10,
    marginBottom:10,
    marginLeft:60,
    flexDirection:'row',
    alignItems:'center',
    paddingHorizontal:35,
  },
  newText:{
    color:'#fff',
    fontSize:20,
    textAlign:'center',
    fontWeight:'medium'
  }
});

export default ListIncident;

