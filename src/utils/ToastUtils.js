// import Toast from 'react-native-toast-message';

// export const showToast = (isConnected, customMessage) => {
//   if (customMessage) {
//     Toast.show({
//       type: 'info',
//       text1: customMessage,
//     });
//   } else if (isConnected) {
//     Toast.show({
//       type: 'success',
//       text1: 'Connecté',
//       text2: 'Vous êtes en ligne. Les rapports seront soumis directement.'
//     });
//   } else {
//     Toast.show({
//       type: 'error',
//       text1: 'Hors ligne',
//       text2: 'Vous êtes hors ligne. Les rapports seront enregistrés localement.'
//     });
//   }
// };

import Toast from 'react-native-toast-message';

export const showToast = (isConnected, customMessage) => {
  const toastStyle = {
    success: {
      containerStyle: {
        backgroundColor: 'green', 
        padding: 15,
        borderRadius: 10,
      },
      text1Style: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'green',
      },
      text2Style: {
        fontSize: 14,
        color: '#ccc',
      },
      position: 'top', 
    },
    error: {
      containerStyle: {
        backgroundColor: 'red',
        padding: 15,
        borderRadius: 10,
      },
      text1Style: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ccc',
      },
      text2Style: {
        fontSize: 14,
        color: '#ccc',
      },
      position: 'center', 
    },
    info: {
      containerStyle: {
        backgroundColor: 'blue', 
        padding: 15,
        borderRadius: 10,
      },
      text1Style: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ccc',
      },
      text2Style: {
        fontSize: 14,
        color: '#ccc',
      },
      position: 'center', 
    }
  };

  if (customMessage) {
    Toast.show({
      type: 'info',
      text1: customMessage,
      ...toastStyle.info
    });
  } else if (isConnected) {
    Toast.show({
      type: 'success',
      text1: 'Connecté',
      text2: 'Vous êtes en ligne.',
      ...toastStyle.success,
      duration: 30
    });
  } else {
    Toast.show({
      type: 'error',
      text1: 'Hors ligne',
      text2: 'Vous êtes hors ligne. Les rapports seront enregistrés localement.',
      ...toastStyle.error,
      duration: 30
    });
  }
};
