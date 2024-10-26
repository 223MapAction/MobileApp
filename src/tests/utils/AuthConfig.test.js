import { Platform } from "react-native";
import { authorize, refresh, revoke } from "react-native-app-auth";
import { GoogleAuthConfig, loginWithGoogle, refreshGoogleAuth, logoutWithGoogle } from "../../utils/AuthConfig";

jest.mock("react-native-app-auth", () => ({
    authorize: jest.fn(),
    refresh: jest.fn(),
    revoke: jest.fn(),
  }));
  
  describe("Google Authentication", () => {
    describe("GoogleAuthConfig", () => {
      it("should set clientId based on platform (Android)", () => {
        Platform.OS = "android";
        jest.resetModules(); // Reset module to update platform value
        const { GoogleAuthConfig } = require("../../utils/AuthConfig");
        expect(GoogleAuthConfig.clientId).toBe("1094350890225-8slhm17l5scns62u21fs771ef6t630e3.apps.googleusercontent.com");
      });
  
      it("should set clientId based on platform (iOS)", () => {
        Platform.OS = "ios";
        jest.resetModules();
        const { GoogleAuthConfig } = require("../../utils/AuthConfig");
        expect(GoogleAuthConfig.clientId).toBe("1094350890225-6d469l4tlgojeqgel06okuf6n4fc968k.apps.googleusercontent.com");
      });
    });
  
    describe("loginWithGoogle", () => {
      it("should call authorize with GoogleAuthConfig", async () => {
        authorize.mockResolvedValueOnce({ accessToken: "mock_access_token" });
        const result = await loginWithGoogle();
        expect(authorize).toHaveBeenCalledWith(GoogleAuthConfig);
        expect(result).toEqual({ accessToken: "mock_access_token" });
      });
    });
  
    describe("refreshGoogleAuth", () => {
      it("should call refresh with GoogleAuthConfig and authState", async () => {
        const mockAuthState = { refreshToken: "mock_refresh_token" };
        const mockRefreshedState = { accessToken: "new_access_token" };
        refresh.mockResolvedValueOnce(mockRefreshedState);
        const result = await refreshGoogleAuth(mockAuthState);
        expect(refresh).toHaveBeenCalledWith(GoogleAuthConfig, { refreshToken: mockAuthState.refreshToken });
        expect(result).toEqual(mockRefreshedState);
      });
    });
  
    describe("logoutWithGoogle", () => {
      it("should call revoke with GoogleAuthConfig and authState", async () => {
        const mockAuthState = { refreshToken: "mock_refresh_token" };
        await logoutWithGoogle(mockAuthState);
        expect(revoke).toHaveBeenCalledWith(GoogleAuthConfig, { tokenToRevoke: mockAuthState.refreshToken });
      });
    });
  });