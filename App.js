import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import StackNavigation from './src/components/StackNavigation';
import { Provider } from 'react-redux';
import rootReducer from "./src/redux/root";
import {thunk} from 'redux-thunk'
import logger from 'redux-logger'
import { createStore, applyMiddleware } from "redux";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';


const store = createStore(rootReducer, applyMiddleware(thunk, logger));
export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2D9CDB" />
      <SafeAreaProvider>
          <SafeAreaView style={{ flex: 1 }}>
              <Provider store={store}>
                <StackNavigation />
              </Provider>
          </SafeAreaView>
      </SafeAreaProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2D9CDB',
  },
});
