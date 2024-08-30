import React from "react";

import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

import Header from "../shared/Header";
import profil from "../screens/newScreen/Profil";

export default class ProfilStackNavigation extends React.Component {
  render() {
    let initialRouteName = "Profil";
    return (
      <Stack.Navigator initialRouteName={initialRouteName}>
        <Stack.Screen
          name="Profil"
          component={profil}
          options={{
            header: () => (
              <Header navigation={this.props.navigation} title={"Mon profil"} />
            ),
          }}
        />
      </Stack.Navigator>
    );
  }
}
