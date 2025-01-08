import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  Alert,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Avatar, Icon } from "react-native-elements";
import validator from "../utils/Validator";
import { Button } from "react-native-elements";
import { connect } from "react-redux";
import { onLogin } from "../redux/user/action";

import { getImage } from "../api/http";
import { MaterialIcons } from "@expo/vector-icons";
import pickImage from "../utils/Image";
import { update_user } from "../api/user";
import { setUser } from "../api/userStorage";

//page d'inscriptions
class Account extends Component {
  
  state = {
    first_name: this.props.user.first_name,
    last_name: this.props.user.last_name,
    adress: this.props.user.adress,
    photo: "",
    email: this.props.user.email,

    showModal: false,
    phone: this.props.user.phone,
    loading: false,
    errors: {},
  };

  Schema = validator.object().shape({
    email: validator
      .string()
      .email()
      .required()
      .label("Adresse Mail")
      .lowercase(),
    phone: validator.string().label("téléphone"),
    first_name: validator.string().min(2).required().max(30).label("Prénom"),
    last_name: validator.string().min(2).required().max(30).label("Nom"),
    adress: validator.string().max(250).label("Adresse"),
  });

  submit = async () => {
    const { errors: _, loading, showModal, photo, ...data } = this.state;
    if (loading) return;
    this.Schema.validate(data, { abortEarly: false })
      .then(async () => {
        this.setState({ errors: {} });
        if (photo !== "") {
          data.avatar = photo;
        }
        await this.update_user(data);
      })
      .catch((ex) => {
        const errors = {};
        ex.inner.forEach((error) => {
          errors[error.path] = error.errors[0];
        });
        this.setState({ errors });
      });
  };
  async update_user(data) {
    this.setState({ loading: true });
    try {
      // data.password = "12345";
      data.is_active = true;
      console.log("user", this.props)
      const res = await update_user(this.props.user.id, data);
      console.log("user modifié",res)
      Alert.alert("", "données modifiées");
      this.props.onLogin({
        user: { ...this.props.user, ...res },
        token: this.props.token,
      });
      setUser({
        user: { ...this.props.user, ...res },
        token: this.props.token,
      });
      this.props.navigation.goBack();
    } catch (error) {
      console.log(error);
      if (error) {
        const errors = {};
        Object.keys(error).map((field) => {
          const err = error[field];
          errors[field] = err[0];
        });
        this.setState({ errors });
      }
    }
    this.setState({ loading: false });
  }
  renderInput(name, label, icon = "Person", options = {}) {
    const error = this.state.errors[name];
    return (
      <>
        <View style={styles.section}>
          <MaterialIcons name={icon} color={"#666666"} size={20} />
          <TextInput
            style={{
              width: "90%",
              paddingLeft: 10,
            }}
            {...options}
            value={this.state[name]}
            placeholder={label}
            placeholderTextColor="#888787"
            keyboardType="default"
            onChangeText={(first_name) => this.setState({ [name]: first_name })}
          />
        </View>
        {error && (
          <Text
            style={{
              color: "#F00",
              marginBottom: 5,
              marginLeft: 20,
              fontSize: 12,
            }}
          >
            {error}
          </Text>
        )}
      </>
    );
  }
  async pickImage() {
    console.log("La fonction pickImage est appelée.");
    const { uri } = await pickImage();

    if (uri) {
      this.setState({ photo: uri });
    }
  }

  render() {
    console.log("photo,", this.state.photo);

    return (
      <View style={styles.container}>
        <ScrollView
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ marginBottom: 20 }}
        >
          
          <View style={styles.container}>
            <View style={{ alignItems: "center", position:'relative' }}>
                <Avatar
                    size="large"
                    rounded
                    source={
                    this.state.photo !== ""
                        ? { uri: this.state.photo }
                        : getImage(this.props.user.avatar, "d")
                    }
                    containerStyle={{ margin: 10 }}
                />
                <Icon
                    name="edit"
                    type="font-awesome"
                    color="#fff"
                    size={15}
                    containerStyle={{
                    position: 'absolute',
                    bottom: 5,
                    right: 150,
                    backgroundColor: '#2C9CDB',
                    borderRadius: 5,
                    padding: 5,
                    }}
                    onPress={() => this.pickImage()}
                />
            </View> 
            <Text style={styles.text}>
              {this.props.user.first_name} {this.props.user.last_name}
            </Text>
            <View style={styles.center}>
              {this.renderInput("last_name", "Nom", "person")}
              {this.renderInput("first_name", "Prenom", "person")}
              
              <View style={{ marginTop: 30 }}>
                <TouchableOpacity
                  onPress={() => this.submit()}
                  style={{
                    backgroundColor: "#49DD7B",
                    borderRadius: 35,
                    alignItems: "center",
                    height: 50,
                    justifyContent: "center",
                  }}
                >
                  {this.state.loading && (
                    <ActivityIndicator color={"#fff"} size="small" />
                  )}
                  {!this.state.loading && (
                    <Text
                      style={{
                        fontSize: 20,
                        lineHeight: 24,
                        color: "#fff",
                        fontWeight: "bold",
                      }}
                    >
                      Modifier
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
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
  center: {
    flex: 1,
    //alignItems: 'center',
    marginTop: 15,
    padding: 15,
    // justifyContent: 'center',
  },
  text: {
    color: "rgba(0,0,0,.5)",
    alignSelf: "center",
    fontSize: 18,
    paddingTop: 20,
    fontWeight: "bold",
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
    paddingHorizontal: 30,
    marginTop: 20,
    borderRadius: 35,
    shadowColor: "#ccc",
    shadowOpacity: 0.5,
    elevation: 5,
    shadowRadius: 1,
    height: 50,
    shadowOffset: {
      width: 3,
      height: 3,
    },
  },
  searchIcon: {
    padding: 10,
  },
  itemStyle: {
    marginBottom: 10,
    flex: 1,
  },
});

const mapStateToProps = ({ user }) => {
  return {
    user: user.user,
    token: user.token,
  };
};

export default connect(mapStateToProps, { onLogin })(Account);
