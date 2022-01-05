import React, { useEffect } from 'react';
import { Text, View, StyleSheet, BackHandler, Alert } from 'react-native';
import Login from '../../src/Login/Login'

export default Places = ({navigation, route}) => {
  useEffect(() => {
    const backAction = () => {
       // navigation.navigate('Login')
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Click Back button!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});