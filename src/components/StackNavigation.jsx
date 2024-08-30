import Welcome from "../slides/Welcome";
// import Image from "../screens/newScreen/Image";
// import Gallery from "../screens/newScreen/Gallery";
// import Camera from "../screens/newScreen/Camera";
// import IncidentForm from "../screens/newScreen/IncidentForm";
// import ForgotPassword from "../screens/ForgotPassword";
// import Register from "../screens/newScreen/register";
// import Contact from "../screens/newScreen/Contact";
// import Communaute from "../screens/newScreen/communaute";
// import Inscription from "../screens/inscription";
// import Logout from "../screens/Logout";
// import Account from "../screens/account";
// import ChangePassword from "../screens/newScreen/ChangePassword";
// import ListIncidents from "../screens/newScreen/ListIncidents";
// import DetailIncident from "../screens/newScreen/DetailIncident";
import CameraComponent from "../screens/CameraScreen";
// import Camera from "../screens/newScreen/Camera";
import Header from "../shared/Header";
import { Animated, Text } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import Accueil from "../slides/Acceuil";
import DrawerNavigation from "./DrawerNavigation";
import { NavigationContainer } from '@react-navigation/native';
import HeaderLeft from "../utils/HeaderLeft";
import PhoneLogin from "../pages/PhoneLogin";
import EmailLogin from "../pages/EmailLogin";
import Login from "../pages/Login";
import SocialLogin from "../pages/SocialLogin";
import Inscription from "../pages/Inscription";


const Stack = createStackNavigator();

const config = {
  animation: "spring",
  config: {
    stiffness: 1000,
    damping: 500,
    mass: 3,
    overshootClamping: true,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  },
};
const MyHeader = ({ route, navigation, ...otherProps }) => {
  if (!route || !route.name) {
    console.error("Nom de route manquant ou incorrect");
    return null;
  }

  const { options } = otherProps;

  if (!options || typeof options.headerShown !== 'boolean') {
    console.error("Erreur dans les options ou headerShown manquant");
    return null;
  }

  const title = options.title || '';

  if (options.headerShown === false) return null;

  const showImage = [
    "Register",
    "ForgotPassword",
    "Inscription",
    // "Login",
  ].includes(route.name);

  return (
    <Header
      navigation={navigation}
      style={options.headerStyle}
      showImage={showImage}
      title={title}
      leftButton={() => {""}}
    />
  );
};
const screenOptions = {
  header: MyHeader,
  headerMode: "screen",
  gestureEnabled: true,
  transitionSpec: {
    open: config,
    close: config,
  },
  gestureDirection: "vertical",
  cardStyleInterpolator: ({ current, layouts }) => {
    const translateY = current.progress.interpolate({
      inputRange: [0, 1],
      outputRange: [layouts.screen.height, 0],
    });
    const scale = Animated.divide(translateY, 1.5).interpolate({
      inputRange: [0, layouts.screen.height],
      outputRange: [1, 0.6],
    });
    const opacity = translateY.interpolate({
      inputRange: [0, layouts.screen.height],
      outputRange: [1, 0],
    });

    return {
      cardStyle: {
        transform: [{ translateY }, { scale }],
        opacity,
      },
    };
  },
};

const StackNavigation = () => {
  let initialRouteName = "Welcome";
  return (
    <NavigationContainer>
    <Stack.Navigator
        initialRouteName={initialRouteName}
        screenOptions={screenOptions}
    >
      <Stack.Screen
          name="Welcome"
          component={(Welcome)}
          options={{ headerShown: false }}
      />
        <Stack.Screen
            name="Accueil"
            component={Accueil}
            options={{ headerShown: false }}
        />
        <Stack.Screen
          name="DrawerNavigation"
          component={DrawerNavigation}
          options={{
            headerShown: false,
          }}
        />
        {/* <Stack.Screen
          name="IncidentForm"
          component={IncidentForm}
          options={{
            headerShown: false,
          }}
        /> */}
      <Stack.Screen
          name="Picture"
          component={CameraComponent}
          options={{
            headerShown: false,
          }}
      />
      {/* <Stack.Screen
          name="Picture"
          component={Camera}
          options={{
            headerShown: false,
          }}
      /> */}
      {/* <Stack.Screen
          name="Image"
          component={Image}
          options={{
            title: "",
          }}
      /> */}
      {/* <Stack.Screen
          name="Gallery"
          component={Gallery}
          options={{
            title: "Galerie",
          }}
      /> */}
      
       {/* <Stack.Screen
          name="Communaute"
          component={Communaute}
          options={{
            title: "Communautés",
          }}
        /> */}
        {/* <Stack.Screen
          name="Account"
          component={Account}
          options={{
            title: "Modifier mon profile",
          }}
        /> */}
      {/* <Stack.Screen
          name="ChangePassword"
          component={ChangePassword}
          options={{
            title: "Modifier mon mot de passe",
          }}
      /> */}
      
      {/* <Stack.Screen
          name="ListIncidents"
          component={ListIncidents}
          options={{
            title: "",
          }}
      /> */}
      {/* <Stack.Screen
          name="DetailIncident"
          component={DetailIncident}
          options={{
            headerShown: false,
          }}
      /> */}
      
      {/* <Stack.Screen
          name="Contact"
          component={Contact}
          options={{
            title: "Nous contacter",
          }}
      /> */}
      
      
      {/* <Stack.Screen name="Register" component={Register} /> */}
      <Stack.Screen name="Login" component={Login} options={{ headerShown: false }}/>
      {/* <Stack.Screen name="ForgotPassword" component={ForgotPassword} /> */}
      <Stack.Screen name="Inscription" component={Inscription} options={{ headerShown: false }}/>
      <Stack.Screen name="social_login" component={SocialLogin} options={{ headerShown: false }} />
      <Stack.Screen name="phone" component={PhoneLogin} options={{ headerShown: false }}/>
      <Stack.Screen name="email" component={EmailLogin} options={{ headerShown: false }}/>


      {/* <Stack.Screen
          name="Logout"
          component={Logout}
          options={{ headerShown: false }}
      /> */}
    </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigation;
