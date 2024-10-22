import React, { Component } from "react";
import { View, Text, Dimensions } from "react-native";
import { MyImage } from "./Slide3";
const { width, height } = Dimensions.get("window");

export default class Slide1 extends Component {
  render() {
    return (
      <View style={{ alignItems: "center" }}>
        <MyImage
          testID="myImage"
          resizeMode="contain"
          source={require("../../assets/ill1.gif")}
          style={{
            width: width * 0.8,
            height: height * 0.3,
            marginBottom: 22,
          }}
        />
        <Text
          style={{
            color: "#2D9CDB",
            width: width * 0.7,
            textAlign: "center",
            fontSize: 20,
            marginBottom: 10,
          }}
          numberOfLines={2}
        >
          <Text style={{ fontWeight: "bold" }}>Signalez un incident</Text> en
           3 clics.
        </Text>
        <Text
          style={{ color: "rgba(0,0,0,.7)", textAlign: "center", fontSize: 14 }}
        >
          Aidez à protéger l'environnement en rapportant des décharges sauvages, 
          infrastructures endommagées ou autres incidents via l'application MAP ACTION. 
          Capturez et envoyez en un clic aux autorités compétentes.
        </Text>
      </View>
    );
  }
}
