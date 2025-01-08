import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Alert,
  TouchableOpacity,
  ScrollView,
  FlatList,
  RefreshControl,
} from "react-native";
import { connect } from "react-redux";
import moment from "moment";
import { Icon } from "react-native-elements";
import http from "../../api/http";

class Profil extends Component {
  state = {
    user: {},
    points: 0,
    nbre_incidents: 0,
    photos: [],
    nbre_challenges: 0,
    nbre_challenges_created: 0,
    loading: false,
    badge: {},
  };
  async componentDidMount() {
    console.log("user information", this.props);
    
    if (this.props.user) {
      await this.fetchData(this.props.user);
    }
  }
  componentDidUpdate(prevProps) {
    if (prevProps.user !== this.props.user) {
      this.fetchData(this.props.user);
    }
  }
  
  async UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.user) {
      console.log("fetching data");
      await this.fetchData(nextProps.user);
    }
  }
  handleDeleteAccount = async () => {
    console.log('testt', this.props);
    
    const { user, token, navigation } = this.props;
  
    if (!user || !user.id || !token) {
      Alert.alert("Erreur", "Impossible de supprimer le compte.");
      return;
    }
  
    try {
      const response = await http.delete(`/user/${user.id}/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Statut de la réponse :", response);
      if (response.status === 204) {
        Alert.alert(
          "Compte supprimé",
          "Votre compte a été supprimé avec succès.",
          [
            {
              text: "OK",
              onPress: () => {
                navigation.replace("Login");
              },
            },
          ]
        );
      } else {
        Alert.alert("Erreur", "Une erreur est survenue lors de la suppression.");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du compte :", error);
      Alert.alert("Erreur", "Impossible de contacter le serveur.");
    }
  };
  
  async fetchData(user = null) {
    if (null === user) return;
    const { id: user_id } = user;
    this.setState({ loading: true });
    let { incidents: incs, challenges } = this.props;
    console.log('les props', incs)
    const nbre_incidents = incs.length;
    this.setState({
      nbre_incidents: nbre_incidents,
    });
   
    let points = user?.points || 0;
    this.setState({
      points: points,
      loading: false,
      photos: [
        ...incs.map((i) => i.photo),
      ],
    });
  }
  render() {
    const {
      points,
      nbre_incidents,
      nbre_challenges,
      nbre_challenges_created,
      loading,
      badge,
    } = this.state;
    const { user } = this.props;
    const userFullName = user?.first_name && user?.last_name ? `${user.first_name} ${user.last_name}` : "Utilisateur inconnu";
    return (
      <View style={styles.container}>
        {this.props.token !== null && (
          <ScrollView
            testID="scrollView"
            contentContainerStyle={{ marginBottom: 40 }}
            refreshControl={
              <RefreshControl
                onRefresh={() => this.fetchData(user)}
                refreshing={loading}
              />
            }
          >
            <View>
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  paddingTop: 20,
                }}
               >
                
                <View style={{}}>
                  <Text style={{ fontSize: 20, fontWeight: "600", color: "#757474", alignSelf: "center", justifyContent: "center" }}>
                    {userFullName}
                  </Text>
                  {user && user.date_joined && (
                    <Text
                      style={{
                        fontSize: 10,
                        fontWeight: "300",
                        color: "#858585",
                        alignSelf: "center",
                      }}
                    >
                      Inscrit depuis{" "}
                      {moment(user.date_joined).format("MMMM YYYY")}
                    </Text>
                  )}
                </View>
                <View
                  style={{
                    flexDirection: "row",
                  }}
                >
                  <TouchableOpacity
                    style={styles.modifier}
                    onPress={() => this.props.navigation.push("Account")}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        color: "#38A3D0",
                        fontWeight: "bold",
                      }}
                    >
                      Modifier votre profil
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.delete}
                    onPress={() => {
                      Alert.alert(
                        "Confirmer la suppression",
                        "Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.",
                        [
                          { text: "Annuler", style: "cancel" },
                          {
                            text: "Supprimer",
                            style: "destructive",
                            onPress: () => this.handleDeleteAccount(),
                          },
                        ]
                      );
                    }}
                  >
                    <Text style={{ fontSize: 12, color: "#FF4C4C", fontWeight: "bold" }}>
                      Supprimer mon compte
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.text}>
                <View
                  style={{
                    backgroundColor: "#38A3D0",
                    borderRadius: 15,
                    height: 95,
                    width: "97%",
                    paddingHorizontal: 20,
                    flexDirection: "row",
                    justifyContent: "space-around",
                    alignItems: "center",
                  }}
                >
                  {user && user.id &&(
                    <TouchableOpacity
                      onPress={() =>
                        this.props.navigation.navigate("ListeIncident", {
                          user_id: user.id,
                        })
                      }
                    >
                      <Text style={{ fontSize: 14, color: "#fff" }}>
                        Vous avez reporté
                      </Text>
                      <Text
                        style={{
                          fontSize: 35,
                          fontWeight: "bold",
                          color: "#56EC92",
                        }}
                      >
                        {nbre_incidents}
                      </Text>
                      <Text style={{ fontSize: 12, color: "#fff" }}>
                        Problèmes
                      </Text>
                    </TouchableOpacity>
                  )}
                  
                  
                </View>

                
              </View>
            </View>
          </ScrollView>
        )}
        {this.props.token === null && (
          <View
            style={{ alignItems: "center", justifyContent: "center", flex: 1 }}
          >
            <Text
              style={{
                color: "#2d9cdb",
                fontSize: 18,
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Veuillez vous connecter pour voir votre profil
            </Text>
            <TouchableOpacity
              onPress={() => this.props.navigation.push("Login")}
              style={{
                marginTop: 20,
                height: 70,
                alignSelf: "center",
                borderColor: "#49DD7B",
                borderWidth: 1,
                justifyContent: "center",
                alignItems: "center",
                width: 70,
                borderRadius: 100,
              }}
            >
              <Icon name="login" color={"#49DD7B"} size={30} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingStart: 10,
    backgroundColor: "#fff",
    /*  backgroundColor: '#2d9cdb' */
  },
  calendrier: {
    backgroundColor: "#fff",
    borderRadius: 15,
    width: 89,
    height: 95,
    shadowColor: "#ccc",
    shadowOpacity: 0.5,
    shadowRadius: 1,
    shadowOffset: {
      width: 3,
      height: 3,
    },
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    marginTop: 20,
  },
  text: {
    marginHorizontal: 10,
    justifyContent: "center",
    flex: 1,
    marginTop: 50,
  },
  iconStyle: {
    color: "#5a52a5",
    fontSize: 28,
    marginLeft: 15,
  },

  ellipse: {
    width: 50,
    height: 50,
    alignSelf: "center",
    justifyContent: "center",
    borderRadius: 50,
    alignItems: "center",
    backgroundColor: "#49DD7B",
    borderColor: "#FFF",
    borderWidth: 1,
  },
  ellipse2: {
    width: 10,
    height: 10,
    alignSelf: "center",
    justifyContent: "center",
    borderRadius: 10,
    marginStart: 8,
    backgroundColor: "rgba(196, 196, 196, 0.45)",
    borderColor: "#FFF",
    borderWidth: 1,
  },

  section: {
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  searchIcon: {
    padding: 10,
  },
  itemStyle: {
    marginBottom: 10,
    flex: 1,
  },
  bg: {
    width: "100%",
    backgroundColor: "#F8F8F8",
    alignItems: "center",
    height: 130,
    overflow: "hidden",
    marginVertical: 3,
    borderRadius: 3,
    flex: 1,
  },
  modifier: {
    marginTop: 10,
    borderRadius: 15,
    backgroundColor: "#fff",
    width: 150,
    height: 38,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 2.5,
    shadowColor: "#ccc",
    shadowOpacity: 0.5,
    shadowRadius: 1,
    elevation: 5,
    shadowOffset: {
      width: 3,
      height: 3,
    },
  },
  delete: {
    marginTop: 10,
    borderRadius: 15,
    backgroundColor: "#fff",
    width: 150,
    height: 38,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 2.5,
    shadowColor: "#ccc",
    shadowOpacity: 0.5,
    shadowRadius: 1,
    elevation: 5,
    shadowOffset: {
      width: 3,
      height: 3,
    },
  },
});

const mapState = ({ user, incidents, challenges }) => ({
  token: user.token ? user.token : null,
  user: user.token ? user.user : {},
  incidents,
  challenges,
});
export default connect(mapState, {  })(Profil);
