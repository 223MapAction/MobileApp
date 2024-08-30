import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "../shared/Icon";
import Dashboard from "../screens/newScreen/Dashboard";
import Header from "../shared/Header";
import { View, Platform } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import Picture from "../screens/CameraScreen";
import TabBar from "./TabBar";
import { connect } from "react-redux";
import ProfilStackNavigation from "./ProfilStackNavigation";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
class TabNavigation extends React.Component {
  render() {
    return (
      <Tab.Navigator
        initialRouteName="Dashboard"
        activeColor="#39DF72"
        inactiveColor="rgba(0,0,0,.5)"
        backBehavior="initialRoute"
        shifting={false}
        ScreenOptions={{
          showLabel: false,
          style: { height: Platform.OS === "ios" ? 60 : 55 },
          tabStyle: { justifyContent: "center" },
        }}
      >
        <Tab.Screen
          name="Dashboard"
          options={{ tabBarLabel: "", tabBarIcon: this.renderIcon("home"), headerShown:false }}
          component={DashboardStack}
        />
        
        <Tab.Screen
          name="Camera"
          options={{
            tabBarLabel: "",
            tabBarIcon: ({ props }) => (
              <TabBar {...props} navigation={this.props.navigation} />
            ),

          }}
          component={CameraStack}
        />

        <Tab.Screen
          name="ProfilStackNavigation"
          options={{ tabBarLabel: "", tabBarIcon: this.renderIcon("user"), headerShown:false }}
          component={ProfilStackNavigation}
        />
        
      </Tab.Navigator>
    );
  }
  renderIcon(name) {
    return ({ focused, color }) => (
      <View style={{ marginTop: Platform.OS === "ios" ? 10 : 0 }}>
        <Icon focused={focused} name={name} size={24} color={color} />
      </View>
    );
  }
}

const mapState = ({ user }) => ({
  token: user.token ? user.token : null,
  user: user.user ? user.user : null,
});

const CameraStack = (props) => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Picture"
        component={Picture}
        options={{
          title: "",
          headerStyle: { backgroundColor: "#2D9CDB" },
          headerShown: false
        }}
      />
    </Stack.Navigator>
  );
};
const DashboardStack = connect(
  mapState,
  null
)((props) => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="DashboardStack"
        component={Dashboard}
        options={{
          header: () => (
            <Header navigation={props.navigation} user={props.user} />
          ),
        }}
      />
      
    </Stack.Navigator>
  );
});




export default connect(mapState, null)(TabNavigation);
