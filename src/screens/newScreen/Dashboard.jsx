import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  RefreshControl,
} from "react-native";
import { connect } from "react-redux";
import { list_incident, my_list_incident } from "../../api/incident";
import { onGetIncidents } from "../../redux/incidents/action";
import { getImage } from "../../api/http";
import { list_user } from "../../api/user";
import { onGetUsers } from "../../redux/user/action";
import Constants from "../../utils/Constants";
import _ from "lodash";
import { Avatar } from "react-native-elements";
import { jwtDecode } from "jwt-decode";

class Dashboard extends Component {
  state = {
    refreshing: false,
  };
  componentDidMount() {
    // if (this.props.token) {
      this.loadData();
    // }
    // this.intervalId = setInterval(() => {
    //   if (this.props.token) {
    //     this.myLoadData();
    //   }
    // }, 30000);
  }
  componentWillUnmount() {
    clearInterval(this.intervalId);
  }
  componentDidUpdate(prevProps) {
    if (prevProps.token !== this.props.token && this.props.token) {
      this.props.onGetIncidents([]);
      this.loadData();
    }
  }
  async myLoadData() {
    this.setState({ refreshing: true });
    try {
      const token = this.props.token;
      console.log('le token', token)
      if (!token || typeof token !== "string") {
        console.log("Token invalide ou manquant :", token);
        return;
      }
      
      
      const decodedToken = jwtDecode(token); 
      const userId = decodedToken.user_id; 
      console.log("ID utilisateur décodé:", userId);
      
      if (this.props.incidents.length === 0) {
        try {
          const incidents = await my_list_incident(userId); 
          this.props.onGetIncidents(incidents);
        } catch (ex) {
          console.log("Error Incident", ex);
        }
      }
      if (this.props.users.length === 0) {
        try {
          const users = await list_user();
          this.props.onGetUsers(users);
        } catch (ex) {
          console.log("Error Incident", ex);
        }
      }
    } catch (ex) {
      console.error("Erreur lors de la récupération des données", ex);
    }
    this.setState({ refreshing: false });
  }

  async fetchAllData() {
    if (this.props.incidents.length === 0) {
      try {
        const incidents = await list_incident();
        this.props.onGetIncidents(incidents);
      } catch (ex) {
        console.log("Error Incident", ex);
      }
    }
    if (this.props.users.length === 0) {
      try {
        const users = await list_user();
        this.props.onGetUsers(users);
      } catch (ex) {
        console.log("Error User", ex);
      }
    }
  }

  async loadData() {
    this.setState({ refreshing: true });
  
    try {
      if (this.props.token) {
        await this.myLoadData();
      } else {
        this.props.onGetIncidents([])
        await this.fetchAllData();
      }
    } catch (ex) {
      console.error("Erreur lors de la récupération des données", ex);
    }
  
    this.setState({ refreshing: false });
  }
  getUsers = () => {
    let users = [];
    const incidents = this.props.incidents;
    incidents.map((i) => {
      if (!i.user_id) return;
      if (users.findIndex((user) => user.id === i.user_id) === -1) {
        users.push(i.user);
      }
    });
    return users;
  };
  getUser = () => {
    let users = [];
    const incidents = this.props.incidents;
    incidents.map((i) => {
      if (users.findIndex((user) => user && user.id === i.user_id && i.user_id) === -1) {
        users.push(i.user);
      }
    });
    return users
      .filter((user) => user && user.id)
      .map((user) => {
        const obj = { ...user };
        obj.incidents = incidents.filter((i) => i.user_id === user.id);
        obj.nbIncidents = obj.incidents.length;
        return obj;
      });
  };
  
  getNumberIncidentsResolved() {
    return this.props.incidents.filter(
      (i) => i.etat === Constants.incidents.state.resolved
    ).length;
  }

  render() {
    const incidents = this.props.incidents;
    const users = this.getUser();
    const usersData = _(users)
      .orderBy(["nbIncidents"], ["desc"])
      .take(15)
      .value();
    return (
      <View style={styles.container}>
        <ScrollView
          refreshControl={
            <RefreshControl
              onRefresh={() => this.loadData()}
              refreshing={this.state.refreshing}
              colors={["#56EC92"]}
              backgroundColor="#FFF"
            />
          }
        >
          <View style={styles.text}>
            <TouchableOpacity
              onPress={() => {
                if (this.props.token) {
                  this.props.navigation.navigate("ListeIncident");
                } else {
                  alert("Veuillez vous connecter pour voir la liste des incidents que vous avez reporté.");
                }
              }}
              style={{
                backgroundColor: "#38A3D0",
                borderRadius: 15,
                height: 95,
                width: "97%",
                paddingHorizontal: 20,
                alignSelf: "center",
                justifyContent: "space-around",
              }}
            >
              <Text style={{ fontSize: 16, color: "#fff" }}>
                Nombre de problèmes reportés
              </Text>
              <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
                <Text
                  style={{
                    fontSize: 35,
                    fontWeight: "bold",
                    color: "#56EC92",
                  }}
                >
                  {incidents.length}
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    color: "#fff",
                    marginLeft: 20,
                    lineHeight: 34,
                  }}
                >
                  {this.getNumberIncidentsResolved()}
                </Text>
                <Text style={{ fontSize: 16, color: "#fff", lineHeight: 34 }}>
                  {"   "}
                  résolus
                </Text>
              </View>
            </TouchableOpacity>

          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
    backgroundColor: "#fff",
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
});

const mapState = ({ user, incidents }) => ({
  token: user.token ? user.token : null,
  users: user.users,
  incidents,
});
export default connect(mapState, { onGetIncidents, onGetUsers })(Dashboard);
