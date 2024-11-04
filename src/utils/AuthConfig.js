import { Platform } from "react-native";
import { authorize, refresh, revoke, prefetchConfiguration } from "react-native-app-auth";
import * as AppleAuthentication from "expo-apple-authentication";
import {jwtDecode} from "jwt-decode";
import { register, get_token } from "../api/auth";

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

export async function loginWithGoogle() {
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
    

    return userInfo; 
  } catch (error) {
    console.error("Google login failed", error);
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



export async function loginWithApple() {
  if (Platform.OS !== "ios") {
    console.error("Apple authentication is only available on iOS.");
    return;
  }

  try {
    const appleAuthResult = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });
    console.log("Apple Auth Result:", appleAuthResult);
    return appleAuthResult;
  } catch (error) {
    console.error("Apple login failed", error);
    throw error;
  }
}