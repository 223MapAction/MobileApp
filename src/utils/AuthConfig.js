import { Platform } from "react-native";
import { authorize, refresh, revoke } from "react-native-app-auth";
import * as AppleAuthentication from "expo-apple-authentication";
const GOOGLE_OAUTH_APP_GUID =
  Platform.OS == "android"
    ? "1094350890225-8slhm17l5scns62u21fs771ef6t630e3"
    : "1094350890225-6d469l4tlgojeqgel06okuf6n4fc968k"; // it looks something like 12345678912 - k50abcdefghijkabcdefghijkabcdefv

export const GoogleAuthConfig = {
  issuer: "https://accounts.google.com",
  clientId: `${GOOGLE_OAUTH_APP_GUID}.apps.googleusercontent.com`,
  redirectUrl: `com.googleusercontent.apps.${GOOGLE_OAUTH_APP_GUID}:/oauth2redirect/google/`,
  scopes: ["openid", "profile", "email"],
};

// Log in to get an authentication token
export async function loginWithGoogle() {
  return await authorize(GoogleAuthConfig);
}

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

export async function LoginWithApple() {
  return await AppleAuthentication.signInAsync({
    requestedScopes: [
      AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
      AppleAuthentication.AppleAuthenticationScope.EMAIL,
    ],
  });
}