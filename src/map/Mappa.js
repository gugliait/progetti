import React, { useState, useEffect, useRef } from 'react';

import { StyleSheet, Text, View, Dimensions, Alert, TouchableOpacity, Modal, Image,TextInput, Button, Platform } from 'react-native';
import MapView from 'react-native-maps';
import { Marker } from "react-native-maps";
import { Fragment } from 'react';
import { Ionicons } from '@expo/vector-icons';
import Icona from '../common/Icona'


import axios from 'axios';

const api = 'http://192.168.178.103:1337/gruppi';



/*MapView */
export default Mappa = (props) => {  
    const [zoomIn, setZoomIn] = useState(false);
    const [zoomOut, setZoomOut] = useState(false);
    const [objMapView, setObjMapView] = useState(null);
    const [latitudeDelta, setLatitudeDelta] = useState(null);
 
 
    const getZoom = (region) => {
        objMapView.getCamera().then((e) => {
            console.log(e.zoom);
            props.SetZoom(e.zoom);
        })

        console.log('GetZoom');
        props.Region.latitude = region.latitude;
        props.Region.longitude = region.longitude;
        props.Region.latitudeDelta = region.latitudeDelta;
        props.Region.longitudeDelta = region.longitudeDelta;
        props.SetRegion(props.Region);
    }    

    const onPressHandler = (coords) => {
        console.log('onPressHandler');
        if (props.Mode == 3) {
            props.OnPress(coords.latitude, coords.longitude);
        }        
    }
             
    return (
        <MapView
        onRegionChangeComplete={region => {getZoom(region)}}
        onPress={e => onPressHandler(e.nativeEvent.coordinate)}
        showsMyLocationButton={false}
        toolbarEnabled={false}
        zoomEnabled = {true}
        minZoomLevel={5}  // default => 0
        maxZoomLevel={19} // default => 20        
        showsMyLocationButton = {false}
        zoomControlEnabled = {false}
        moveOnMarkerPress = {true}
        scrollDuringRotateOrZoomEnabled={false}
        ref={ map => { setObjMapView(map); }}
        mapType={Platform.OS == "android" ? "standard" : "standard"}
        style={styles.map}                 
        region={{
            latitude:props.Region.latitude,
            longitude: props.Region.longitude,
            latitudeDelta: props.Region.latitudeDelta,
            longitudeDelta: props.Region.longitudeDelta,
        } } >

            {   
                (Array.from(props.Markers))?.map((mrk, index) => {return(
                <MapView.Marker    
                    key={index}  
                    anchor={{x: 0, y: 1}}
                    coordinate={{
                        latitude: mrk.latitude,
                        longitude: mrk.longitude,
                    }}
                    title={mrk.title}
                    description={mrk.description}
                >
                    <Icona type={props.IconType} name={props.IconName} color={props.IconColor} size={ props.IconSize} />
                    {/* {Icona.ico(props.IconType, props.IconName, props.IconColor, props.IconSize)}     */}
                </MapView.Marker>
            )})}                      
        </MapView>
    );
};    

const styles = StyleSheet.create({
    map: {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
    }
});

