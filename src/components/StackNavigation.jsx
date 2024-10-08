import Welcome from "../slides/Welcome";
import CameraComponent from "../screens/CameraScreen";
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
import ListeIncident from "../screens/ListeIncident";
import DataJourney from "../screens/newScreen/DataJourney";

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
      leftButton={() => <HeaderLeft colors="#2D9CDB" />}
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
        
        <Stack.Screen
          name="Picture"
          component={CameraComponent}
          options={{
            headerShown: true,
            title: "Signaler un incident",
            
          }}
        />
        <Stack.Screen
          name="ListeIncident"
          component={ListeIncident}
          options={{
            headerShown: true,
            title: "Mes incidents signalés",
          }}
        />
        <Stack.Screen
          name="cgu"
          component={ListeIncident}
          options={{
            headerShown: true,
            title: "CGU",
          }}
        />
        <Stack.Screen
          name="politique"
          component={ListeIncident}
          options={{
            headerShown: true,
            title: "Nos Politiques de Confidentialités",
          }}
        />
        <Stack.Screen
          name="DetailIncident"
          component={DataJourney}
          options={({ route }) => ({
            headerShown: true,
            title: route.params?.incident?.title || "Détail de l'incident",
          })}
        />
      <Stack.Screen name="Login" component={Login} options={{ headerShown: true, title:'Se connecter' }}/>
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
