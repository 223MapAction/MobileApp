import { Platform } from "react-native";
import { authorize } from "react-native-app-auth";

const GOOGLE_OAUTH_APP_GUID =
  Platform.OS == "android"
    ? process.env.EXPO_GOOGLE_CLIENT_ID_ANDROID
    : process.env.EXPO_GOOGLE_CLIENT_ID_IOS; // it looks something like 12345678912 - k50abcdefghijkabcdefghijkabcdefv

export const GoogleAuthConfig = {
  issuer: "https://accounts.google.com",
  clientId: `${GOOGLE_OAUTH_APP_GUID}.apps.googleusercontent.com`,
  redirectUrl: `com.googleusercontent.apps.${GOOGLE_OAUTH_APP_GUID}:/oauth2redirect/google`,
  scopes: ["openid", "profile"],
};

// Log in to get an authentication token
export async function loginWithGoogle() {}

// Refresh token
export async function refreshGoogleAuth(authState) {
  const refreshedState = await refresh(GoogleAuthConfig, {
    refreshToken: authState.refreshToken,
  });
  return refreshedState;
}

// Revoke token
export async function logoutWithGoogle(authState) {
  await revoke(GoogleAuthConfig, {
    tokenToRevoke: authState.refreshToken,
  });
}
