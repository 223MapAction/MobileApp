import Welcome from "../slides/Welcome";
import CameraComponent from "../screens/CameraScreen";
import Header from "../shared/Header";
import { Animated, Text } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import React, {useEffect} from "react";
import { Linking } from 'react-native';
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
import Logout from "../pages/Logout";
import Contact from "../screens/newScreen/Contact";
import Politique from "../screens/politique";
import Cgu from "../screens/cgu";
import IncidentForm from "../screens/newScreen/IncidentForm";
import SignUp from "../pages/Signup";
import VerifyOtp from "../pages/VerifyOtp";
import PasswordStep from "../pages/Password";
import Account from "../screens/Account";
import UrlParse from 'url-parse';


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
  useEffect(() => {
    const handleDeepLink = (event) => {
      const url = event.url;
      console.log('Deep link received:', url); 
      const parsedUrl = new UrlParse(event.url, true); // true enables query string parsing

      const { pathname, query } = parsedUrl;

      console.log('Parsed URL:', pathname, query);

      if (parsedUrl.path === 'verify-email') {
        const token = parsedUrl.path.split('/')[1];
        navigationRef.current?.navigate('passwordStep', { token });
      }
    };

    // Écouter les événements de deep linking
    const subscription = Linking.addEventListener('url', handleDeepLink);

    // Gérer l'URL initiale (si l'application a été ouverte à partir d'un lien)
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url });
    });

    return () => {
      subscription.remove(); // Nettoyage
    };
  }, []);
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
          options={{ headerShown: false }}
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
          component={Cgu}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="politique"
          component={Politique}
          options={{
            headerShown: true,
            title: "Mentions Légales",
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
        <Stack.Screen
          name="IncidentForm"
          component={IncidentForm}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="Contact"
          component={Contact}
          options={{
            title: "Nous contacter",
          }}
        />
        <Stack.Screen
          name="Account"
          component={Account}
          options={{
            title: "Modifier mon profile",
          }}
        />
      {/* <Stack.Screen name="Login" component={Login} options={{ headerShown: true, title:'Se connecter' }}/> */}
      {/* <Stack.Screen name="ForgotPassword" component={ForgotPassword} /> */}
      {/* <Stack.Screen name="Inscription" component={Inscription} options={{ headerShown: true }}/> */}
      <Stack.Screen name="Inscription" component={SignUp} options={{ headerShown: true }}/>
      <Stack.Screen name="passwordStep" component={PasswordStep} options={{ headerShown: true }}/>
      <Stack.Screen name="otp" component={VerifyOtp} options={{ headerShown: true }}/>
      <Stack.Screen name="social_login" component={SocialLogin} options={{ headerShown: false }} />
      <Stack.Screen name="phone" component={PhoneLogin} options={{ headerShown: true }}/>
      <Stack.Screen name="Login" component={EmailLogin} options={{ headerShown: true }}/>
      <Stack.Screen
          name="Logout"
          component={Logout}
          options={{ headerShown: false }}
      />
    </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigation;
