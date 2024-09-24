import Toast from 'react-native-toast-message';

export const showToast = (isConnected, customMessage) => {
  if (customMessage) {
    Toast.show({
      type: 'info',
      text1: customMessage,
    });
  } else if (isConnected) {
    Toast.show({
      type: 'success',
      text1: 'Connecté',
      text2: 'Vous êtes en ligne. Les rapports seront soumis directement.'
    });
  } else {
    Toast.show({
      type: 'error',
      text1: 'Hors ligne',
      text2: 'Vous êtes hors ligne. Les rapports seront enregistrés localement.'
    });
  }
};
