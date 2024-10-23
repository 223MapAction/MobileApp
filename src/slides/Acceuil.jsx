import {React, Component } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import AppIntroSlider from "react-native-app-intro-slider";
import Slide1 from "./Slide1";
import Slide2 from "./Slide2";
import Slide3 from "./Slide3";
const actionmap = require('../../assets/images/logo.webp');
class Accueil extends Component {
  items = [
    { Content: Slide1, key: "0" },
    { Content: Slide2, key: "1" },
    // { Content: Slide3, key: "2" },
  ];
  renderItem = ({ item }) => {
    const { Content } = item;
    return (
      <View style={{ paddingHorizontal: 15 }}>
        <View style={{ marginBottom: 15, marginTop: '20%', alignItems: "center" }}>
          <Image
            source={actionmap}
            resizeMode="contain"
            style={{
              width: 125,
              height: 50,
            }}
          />
        </View>
        <Content />
      </View>
    );
  };
  renderButton = (title, testID) => {
    return (
      <View style={styles.ellipse} testID={testID}>
        <Text style={{ color: "#fff", fontWeight: "bold" }}>{title}</Text>
      </View>
    );
  };
  onDone = () => {
    this.props.navigation.replace("cgu");
  };
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "#FFF" }}>
        <AppIntroSlider
          renderItem={this.renderItem}
          data={this.items}
          bottomButton
          dotStyle={{ backgroundColor: "#eee" }}
          activeDotStyle={{ backgroundColor: "#2D9CDB" }}
          keyExtractor={(item) => item.key}
          renderNextButton={() => this.renderButton("SUIVANT", "nextButton")}
          renderDoneButton={() => this.renderButton("COMMENCER", "doneButton")}
          onDone={this.onDone}
        />
        <View style={{ marginBottom: 10, alignItems: "center" }}>
          <TouchableOpacity onPress={() => this.props.navigation.push("Login")}>
            <Text style={{ fontSize: 15, color: "rgba(0,0,0,.5)" }} testID="inscrit">
              Déjà inscrit ?{" "}
              <Text style={{ fontWeight: "bold" }}>Se connecter</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  ellipse: {
    width: 282,
    height: 45,
    alignSelf: "center",
    justifyContent: "center",
    borderRadius: 100,
    alignItems: "center",
    backgroundColor: "#49DD7B",
    borderColor: "#FFF",
    borderWidth: 1,
  },
});
export default Accueil;
