import * as Notifications from 'expo-notifications';

// Fonction pour demander la permission et obtenir le token
export const requestPermissionAndGetToken = async () => {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status === 'granted') {
    const token = await Notifications.getExpoPushTokenAsync();
    return token.data;
  }
  return null;
};

// Fonction pour écouter les notifications reçues
export const listenForNotifications = (callback) => {
  return Notifications.addNotificationReceivedListener(notification => {
    callback(notification);
  });
};

// Fonction pour gérer la réponse aux notifications
export const listenForNotificationResponse = (callback) => {
  return Notifications.addNotificationResponseReceivedListener(response => {
    callback(response);
  });
};
