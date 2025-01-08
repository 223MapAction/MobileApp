import { useEffect } from 'react';
import { Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const useDeepLinking = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const handleDeepLink = (event) => {
      const url = event.url;
      const parsedUrl = Linking.parse(url);

      if (parsedUrl.path === 'verify-email') {
        const token = parsedUrl.queryParams.token;
        navigation.navigate('passwordStep', { token });
      }
    };

    const subscription = Linking.addEventListener('url', handleDeepLink);

    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url });
    });

    return () => {
      subscription.remove();
    };
  }, [navigation]);
};

export default useDeepLinking;
