import { Platform, Alert } from "react-native";
import { authorize, refresh, revoke, prefetchConfiguration } from "react-native-app-auth";
import * as AppleAuthentication from "expo-apple-authentication";
import {jwtDecode} from "jwt-decode";
import { register, get_token, getTokenByEmail } from "../api/auth";
import { getData, setData } from "../api/userStorage";
import { read_user } from "../api/user";
import storage from "../api/userStorage";
import { onLogin } from "../redux/user/action";

const GOOGLE_OAUTH_APP_GUID =
  Platform.OS == "android"
    ? "1094350890225-8slhm17l5scns62u21fs771ef6t630e3"
    : "1094350890225-6d469l4tlgojeqgel06okuf6n4fc968k"; 
export const GoogleAuthConfig = {
  issuer: "https://accounts.google.com",
  clientId: `${GOOGLE_OAUTH_APP_GUID}.apps.googleusercontent.com`,
  redirectUrl: `com.googleusercontent.apps.${GOOGLE_OAUTH_APP_GUID}:/oauth2redirect/google/`,
  scopes: ["openid", "profile", "email"],
};

export async function registerWithGoogle() {
  try {
    const authState = await authorize(GoogleAuthConfig);
    const idTokenPayload = jwtDecode(authState.idToken);
    
    const userInfo = {
      email: idTokenPayload?.email,
      first_name: idTokenPayload?.given_name,
      last_name: idTokenPayload?.family_name,
      avatar: idTokenPayload?.picture,
      address: "",
      phone: "",
      provider: "Google",
    };

    console.log("User Info:", userInfo);

    const response = await register(userInfo);
    console.log("Utilisateur enregistré avec succès :", response);
    

    return response; 
  } catch (error) {
    console.error("Google login failed", error);
    throw error; 
  }
}

export async function loginWithGoogle() {
  try {
    const authState = await authorize(GoogleAuthConfig);
    const idTokenPayload = jwtDecode(authState.idToken);
    
    const email = idTokenPayload?.email;
    console.log("Tentative de connexion pour l'email :", email);

    // Récupération du token via getTokenByEmail
    const data = await getTokenByEmail(email);
    const token = data.token;

    if (!token) {
      Alert.alert("Votre compte est introuvable, inscrivez-vous maintenant.");
      return null;
    }

    const { user_id } = jwtDecode(token);
    const user = await read_user(user_id);
    const avatar = user?.avatar || "/uploads/avatars/default.png"; 
    await storage.setUser({ token: token, user });
    console.log("Utilisateur connecté et informations stockées :", { token, user });
    return { token, user, avatar };
    
  } catch (error) {
    console.error("Échec de la connexion avec Google", error);
    throw error;
  }
}


// Refresh token
export async function refreshGoogleAuth(authState) {
  try {
    const refreshedState = await refresh(GoogleAuthConfig, {
      refreshToken: authState.refreshToken,
    });
    return refreshedState;
  } catch (error) {
    console.error("Failed to refresh token", error);
    throw error;
  }
}

// Revoke token
export async function logoutWithGoogle(authState) {
  try {
    await revoke(GoogleAuthConfig, {
      tokenToRevoke: authState.refreshToken,
    });
  } catch (error) {
    console.error("Failed to revoke token", error);
    throw error;
  }
}



// export async function loginWithApple() {
//   if (Platform.OS !== "ios") {
//     console.error("La connexion avec ios est disponible uniquement sur iOS.");
//     return;
//   }

//   try {
//     const credential = await AppleAuthentication.signInAsync({
//       requestedScopes: [
//         AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
//         AppleAuthentication.AppleAuthenticationScope.EMAIL,
//       ],
//     });
    
//     const token = credential.identityToken;
//     const { email } = jwtDecode(token);
//     if (email){
//       const userInfo = {
//         first_name: credential.fullName?.givenName || "empty",
//         last_name: credential.fullName?.familyName || "empty",
//         address: "",
//         email: email || credential.email || "empty@example.com",
//         phone: "",
//         provider: "Apple",
//       };
      
//       await register(userInfo);
//       setData("apple", credential);
//     }else{
//         const credential = await getData("apple", { fullName: {} });
//         const userInfo = {
//           email: credential.email,
//           first_name: credential.fullName.givenName,
//           last_name: credential.fullName.familyName,
//           adress: "",
//           phone: "",
//           provider: "Apple",
//         };
//     }
//     console.log("Apple Auth Result:", credential);
//     return credential;
//   } catch (error) {
//     console.error("Apple login failed", error);
//     throw error;
//   }
// }

// export function loginWithApple(){
//   const navigation = useNavigation()
// }
export async function loginWithApple( dispatch, navigation, onFinish) {
  
  if (Platform.OS !== "ios") {
    Alert.alert("Erreur", "La connexion avec Apple est disponible uniquement sur iOS.");
    return;
  }

  try {
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });

    const token = credential.identityToken;
    const email = token ? jwtDecode(token).email : null;
    console.log("voyons voir si l'email est là", email)

    const userInfo = {
      first_name: credential.fullName.givenName || "empty",
      last_name: credential.fullName.familyName || "empty",
      address: "",
      email: email || credential.email || "empty@example.com",
      phone: "",
      provider: "Apple",
    };

    let tokenFromApi;
    try {
      const data = await getTokenByEmail(userInfo.email);
      console.log(data)
      tokenFromApi = data.token;
    } catch (error) {
      console.error("Erreur lors de la récupération du token", error);
    }
    
    if (!tokenFromApi) {
      await onFinishRegistration(userInfo);
      Alert.alert("Succès", "Inscription réussie!");
      setData("apple", credential); 
      navigation.navigate("DrawerNavigation")
    } else {
      await onFinishLogin(userInfo, dispatch, () => navigation.navigate("DrawerNavigation"));
    }

     

  } catch (error) {
    console.error("Erreur de connexion Apple", error);
    if (error.code !== "ERR_CANCELED") {
      Alert.alert("Erreur", "Erreur lors de la connexion avec Apple.");
    }
  }
}


export async function onFinishRegistration(data) {
  if (!data.email) {
    Alert.alert("", `Votre compte ${data.provider} ne contient pas d'email!`);
    return;
  }

  delete data.avatar;

  await register({
    ...data,
    password: data.provider, 
  }, true);
}
export async function onFinishLogin(userInfo, dispatch, redirect ) {
  let token;
  try {
    const data = await getTokenByEmail(userInfo.email);
    token = data.token;
    console.log("Token récupéré :", token);
  } catch (error) {
    console.error("Erreur lors de la récupération du token", error);
  }

  if (!token) {
    Alert.alert("Compte introuvable", "Veuillez vous inscrire d'abord.");
    return;
  }

  try {
    const { user_id } = jwtDecode(token);
    const user = await read_user(user_id);
    console.log("Utilisateur récupéré :", user);
    dispatch(onLogin({ token, user }));

    await storage.setUser({ token, user });
    const storedUser = await storage.getUser();
    console.log("Utilisateur stocké :", storedUser);
    redirect();
  } catch (error) {
    console.error("Erreur lors de la connexion", error);
  }
}
