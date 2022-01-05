import React, { useState, useEffect, useRef} from 'react';
import './global.js';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, PermissionsAndroid, TouchableHighlight} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './src/Login/Login';
import places from './src/places/places';
import * as FileSystem from 'expo-file-system';
import * as SQLite from 'expo-sqlite'
import { Asset } from 'expo-asset';
import {DbManager} from './src/database/DbManager';

import Dropdown from 'react-native-modal-select-option';
import {ModalSelectorCustom} from './src/common/ModalSelectorCustom'

import { Ionicons } from '@expo/vector-icons';

import Icon from 'react-native-vector-icons/FontAwesome5';

const Stack = createNativeStackNavigator();


export default function App() {
  const [values, setValues] = useState(null);
  const [isShowingOptions, setIsShowingOptions] = useState(false);

  const [visible, setVisible] = useState(false);

  
    useEffect(() => {  
      
    }, []);

    DbManager.Initialize({pathFileName: '../../assets/SQLite/PlacesBook.sqlite3', fileName: 'PlacesBook.sqlite3' });

  const HomeScreen = ({navigation}) => {  
    
    return (
      <View style={styles.containerMain}>
        <View style={styles.containerCenter}>
          <Text style={styles.logoHome}>PlacesBook</Text>
          <Text style={styles.sloganHome1}>Condividi su placebook i luoghi  che ti hanno colpito e incantato  per la loro naturale bellezza.</Text>
          <TouchableOpacity
          style={styles.button}
          onPress={() => {
            //insert();
              navigation.push('Login');              
          }} >
          <Text>    Entra    </Text>          
          </TouchableOpacity>

         {/* <ModalSelectorCustom data={data}/> */}

        </View>
        <View style={styles.containerFooter}>
          <Text style={styles.sloganHome2} >"La felicità è reale solo quando condivisa"</Text>
          <Text style={{textAlign: 'right', marginBottom:32, marginTop:4, marginRight: 16}} >Christopher McCandless</Text>
        </View>
      </View>
    );
  };
  console.log('Ciccio');return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="HomeScreen" >
        <Stack.Screen name="Home" component={HomeScreen} options={{headerShown: false}} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="places" component={places} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  containerMain: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f2f5'
  },

  containerCenter: {
    alignItems:'center',
    flex: 1,
    justifyContent: 'center',
  },

  containerFooter: {
    width:'100%',
  },

  logoHome: {
    color: '#007017',
    fontWeight: 'bold',
    fontSize:40
  },

  sloganHome1: {
    fontFamily: 'sans-serif',
    marginTop: 8,
    marginBottom: 8,
    marginLeft: 32,
    marginRight: 32,
    textAlign: 'center',
    fontSize:16,
  },

  sloganHome2: {
    textAlign: 'right',
    marginRight: 16,
  },

  button: {
    alignItems: 'center',
    backgroundColor: '#f0f2f5',
    padding: 10,
    borderWidth: 1,
    borderColor: '#007017',
    borderRadius: 5,
    marginTop: 16
  },


});
