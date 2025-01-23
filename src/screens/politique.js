import React from 'react';
import { View, ScrollView, StyleSheet, Dimensions } from 'react-native';
import Markdown from 'react-native-markdown-display';
import PolitiqueText from './newScreen/PolitiqueText';
import CguText from './newScreen/cguText';
 

const { width } = Dimensions.get('window');

export default function Politique() {
  return (
    <View style={styles.container} testID="politique-container">
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Markdown style={markdownStyles} testID="politique-markdown">
          {PolitiqueText}
        </Markdown>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  scrollViewContent: {
    paddingVertical: 20,
  },
});

const markdownStyles = {
  heading1: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C9CDB', 
  },
  strong: {
    fontWeight: 'bold',
  },
  text: {
    fontSize: 16,
    color: '#858585',
  },
  link: {
    color: '#2C9CDB', 
  },
};
