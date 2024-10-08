import React, { Component } from 'react'
import { Text, StyleSheet, View } from 'react-native'

export default function Politique()  {
    return (
      <View style={styles.container}>
        <Text> Nos politiques d'utilisation </Text>
      </View>
    )

}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#fff'
    }
})
