import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import Icon from 'react-native-vector-icons/Entypo';
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { register, get_token } from "../api/auth";
import Validator from "../utils/Validator";
import Popup from "../shared/Popup";
import { setUser } from "../api/userStorage";
import { update_incident } from "../api/incident";
import { onLogin } from "../redux/user/action";
import { connect } from "react-redux";
import { update_user } from "../api/user";

class Inscription extends Component {
  state = {
    errors: {},
    phone: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    password_confirmation: "",
    address: "",
    loading: false,
    isModalVisible: false,
    userInfo: {},
  };

  renderError(field) {
    const error = this.state.errors[field];
    if (!error) return null;
    return (
      <Text
        style={{
          color: "#F00",
          fontSize: 12,
          marginLeft: 30,
          marginVertical: 5,
        }}
      >
        {error}
      </Text>
    );
  }

  Schema = Validator.object().shape({
    email: Validator.string().email().required().label("Adresse Mail"),
    phone: Validator.string().label("N° de téléphone du citoyen"),
    first_name: Validator.string().min(2).required().max(100).label("Prénom"),
    last_name: Validator.string().min(2).required().max(100).label("Nom"),
    address: Validator.string().max(255).label("Adresse"),
    password: Validator.string().min(5).required().label("Mot De Passe"),
    password_confirmation: Validator.string()
      .label("Confirmer mot de passe")
      .required()
      .test(
        "passwords-match",
        "les mots de passes ne sont pas identiques",
        function (value) {
          return this.parent.password === value;
        }
      ),
  });

  async submit() {
    const {
      errors: _,
      loading,
      userInfo,
      isModalVisible,
      linkedInModal,
      choicePasswordVisible,
      ...data
    } = this.state;
    if (loading) return;
    this.Schema.validate(data, { abortEarly: false })
      .then(async () => {
        this.setState({ errors: {} });
        data.provider = "Form";
        await this.register(data);
      })
      .catch((ex) => {
        const errors = {};
        ex.inner.forEach((error) => {
          errors[error.path] = error.errors[0];
        });
        this.setState({ errors });
      });
  }

  async register(data, flag = false) {
    console.log("data To send", data);
    this.setState({ loading: true });
    try {
      console.log("Avant l'appel de la fonction register");
      const response = await register(data);
      console.log("Après l'appel de la fonction register, réponse :", response.user.email);
      const { token } = response;
      const accessToken = token.access;
      data.password = response.password;
      data.is_active = true;
      const res = await update_user(response.user.id, data, accessToken);
      await setUser({ token, user: res });
      this.props.onLogin({ token, user: res });
      this.setState({
        isModalVisible: true,
        onFinish: () => this.props.navigation.navigate("DrawerNavigation"),
      });
    } catch (ex) {
      console.log("Register error", ex);
      const { error } = ex;
      if (error) {
        const errors = {};
        Object.keys(error).forEach((field) => {
          const err = error[field];
          errors[field] = err[0];
        });
        console.log(errors);
        if (flag) {
          const errorMessage = errors["email"] || "An error occurred";
          Alert.alert("Erreur", errorMessage, [{ text: "Ok", style: "cancel" }]);
        } else {
          this.setState({ errors });
        }
      }
    }
    this.setState({ loading: false });
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.isModalVisible && this.renderModal()}
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
              {/* <Image
                source={require('../../assets/images/logo.webp')}
                style={styles.logo}
              /> */}
            </View>
            <View style={styles.loginview}>
              <Text style={styles.title}>S'inscrire</Text>
              <View style={styles.line}></View>
            </View>
            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  onChangeText={(first_name) => this.setState({ first_name })}
                  value={this.state.first_name}
                  placeholder="Prénom"
                  placeholderTextColor="#888787"
                />
                <MaterialIcons name="person" size={18} style={styles.icon} />
              </View>
              {this.renderError("first_name")}

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  onChangeText={(last_name) => this.setState({ last_name })}
                  value={this.state.last_name}
                  placeholder="Nom"
                  placeholderTextColor="#888787"
                />
                <MaterialIcons name="person" size={18} style={styles.icon} />
              </View>
              {this.renderError("last_name")}

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  onChangeText={(phone) => this.setState({ phone })}
                  value={this.state.phone}
                  placeholder="N° de téléphone"
                  placeholderTextColor="#888787"
                  keyboardType="number-pad"
                />
                <MaterialIcons name="settings-phone" size={18} style={styles.icon} />
              </View>
              {this.renderError("phone")}

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  onChangeText={(address) => this.setState({ address })}
                  value={this.state.address}
                  placeholder="Votre Adresse"
                  placeholderTextColor="#888787"
                />
                <Icon name="address" size={18} style={styles.icon} />
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  onChangeText={(email) => this.setState({ email })}
                  value={this.state.email}
                  placeholder="Adresse mail"
                  placeholderTextColor="#888787"
                  keyboardType="email-address"
                />
                <Icon name="email" size={18} style={styles.icon} />
              </View>
              {this.renderError("email")}

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  onChangeText={(password) => this.setState({ password })}
                  value={this.state.password}
                  placeholder="Mot de passe"
                  placeholderTextColor="#888787"
                  secureTextEntry={true}
                />
                <Icon name="lock" size={18} style={styles.icon} />
              </View>
              {this.renderError("password")}

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  onChangeText={(password_confirmation) => this.setState({ password_confirmation })}
                  value={this.state.password_confirmation}
                  placeholder="Confirmer mot de passe"
                  placeholderTextColor="#888787"
                  secureTextEntry={true}
                />
                <Icon name="lock" size={18} style={styles.icon} />
              </View>
              {this.renderError("password_confirmation")}

              <TouchableOpacity style={styles.submitButton} onPress={() => this.submit()}>
                <Text style={styles.submitButtonText}>Créer un compte</Text>
              </TouchableOpacity>
              <View style={styles.or}>
                <View style={styles.tiret} />
                <Text style={styles.orText}>  Ou s'inscrire avec  </Text>
                <View style={styles.tiret}/>
              </View>
              <View style={styles.socialContainer}>
                  <View style={styles.google}>
                      <TouchableOpacity>
                          <FontAwesome name="google" size={18} color='#fff' />
                      </TouchableOpacity>
                  </View>
                  <View style={styles.google}>
                      <TouchableOpacity>
                          <FontAwesome name="facebook" size={18} color='#fff' />
                      </TouchableOpacity>
                  </View>
                  {Platform.OS === "ios" && (
                      <View style={styles.google}>
                          <TouchableOpacity>
                              <FontAwesome name="apple" size={18} color='#fff' />
                          </TouchableOpacity>
                      </View>
                  )}
              </View>
              <View style={styles.connecte}>
                <Text style={styles.deja}>Vous avez déjà un compte? </Text>
                <TouchableOpacity onPress={() => this.props.navigation.navigate("Login")}>
                  <Text style={styles.login}>Se connecter</Text>
                </TouchableOpacity>
              </View>

            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    );
  }

  renderModal() {
    return (
      <Popup onHide={() => this.setState({ isModalVisible: false })}>
        <TouchableOpacity
          onPress={() => this.setState({ isModalVisible: false })}
          style={{
            zIndex: 10,
            alignSelf: "flex-end",
            paddingRight: 20,
            paddingTop: 10,
          }}
        >
          <MaterialIcons name="cancel" size={30} color="red" />
        </TouchableOpacity>

        <View style={{ alignItems: "center", padding: 20 }}>
          <MaterialIcons
            name="check-circle"
            size={50}
            color="green"
          />
          <Text style={{ fontSize: 18, marginVertical: 10 }}>
            Inscription réussie !
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: "#2D9CDB",
              borderRadius: 10,
              width: 70,
              height: 53,
              marginTop: 20,
              alignSelf: "center",
            }}
            onPress={() => {
              this.setState({ isModalVisible: false });
              this.state.onFinish();
            }}
          >
            <Text
              style={{
                textAlign: "center",
                color: "#fff",
                fontSize: 20,
                marginTop: 10,
              }}
            >
              OK
            </Text>
          </TouchableOpacity>
        </View>

      </Popup>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  start: {
    alignItems: "center",
  },
  rectangle: {
    position: 'absolute',
    top: -90,
    left: -200,
    width: 360.75,
    height: 290.36,
    backgroundColor: "#38A0DB",
    transform: [{ rotate: '54deg' }],
    zIndex: 1,
  },
  logo: {
    position: 'absolute',
    // top: -120,
    right: 90,
    width: 110,
    height: 45,
  },
  loginview: {
    position: 'absolute',
    top: 150,  
    left: 180,  
    zIndex: 2, 
    // marginBottom: 20,
  },
  title: {
    fontSize: 40,
    marginBottom: 2,
    fontWeight: "bold",
  },
  line: {
    height: 9,
    backgroundColor: "#38A0DB",
    width: 100,
    marginLeft:40
  },
  formContainer: {
    paddingHorizontal: 30,
    paddingVertical: 20,
    marginTop: 250,
  },
  inputContainer: {
    marginVertical: 10,
    position: "relative",
  },
  input: {
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    padding: 10,
    fontSize: 16,
    color: "#444",
  },
  icon: {
    position: "absolute",
    right: 0,
    bottom: 12,
    color: "#888787",
  },
  submitButton: {
    backgroundColor: "#38A0DB",
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 5,
    marginVertical: 20,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  tiret:{
    backgroundColor:"#2C9CDB",
    width:89,
    borderWidth:0,
    height:2,
    marginTop:9, 
  },
  or:{
    flexDirection:'row',
    top:30,
    justifyContent:"center"
  },
  orText:{
    color:'#858585'
  },
  google:{
    backgroundColor:'#38A0DB',
    width:100,
    height:43,
    padding:10,
    marginLeft:10,
    borderRadius:8,
    alignItems:'center',
     
  },
  socialContainer:{
    flexDirection:'row',
    padding:10,
    top:30,
    marginBottom:50,
    justifyContent:"center"

  },
  login:{
    color:'#2CDB40',
    fontSize:14,
  },
  connecte:{
    flexDirection:'row',
    justifyContent:'center',
  },
  deja:{
    color:'#2D9CDB'
  }
});

export default connect(null, { onLogin })(Inscription);
