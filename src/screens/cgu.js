import React, { Component } from 'react'
import { Text, StyleSheet, View } from 'react-native'

export default function Cgu()  {
    return (
      <View style={styles.container}>
        <Text> textInComponent </Text>
      </View>
    )

}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#fff'
    }
})
