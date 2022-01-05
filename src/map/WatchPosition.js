import React, { useState, useEffect, useRef } from 'react';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import { View } from 'react-native';

export default WatchPosition = (props) => {
    const [loc, setLoc] = useState(null);

    useEffect(() => {
        if (props.action == 'start') {
            console.log('start');
            start(props.fun, props.err);
        }            
        else {
            console.log('stop: ' + loc);
            stop();
        }
    }, [props.action]);     
     
    
    const stop = () => {        
        if (loc != null) {
            console.log('stoped');
            loc.remove();
        }
    };

    const start = (fun, err) => {
        console.log("start");
        let mounted = true;
        (async () => {
            if (Platform.OS === 'android' && !Constants.isDevice) {
                setErrorMsg(
                    'Oops, this will not work on Snack in an Android emulator. Try it on your device!'
                );
                return;
            }
    
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }
    
            await Location.watchPositionAsync({accuracy: Location.Accuracy.Balanced,
                timeInterval: 3000,
                enableHighAccuracy: true,
                distanceInterval: 0,}, (location) => {
                    if (location != null) {
                        if (mounted) {
                            //console.log(JSON.stringify(location));
                            fun(location)
                           //valueLocation = JSON.stringify(location);
                            // //setLocation(location);
                            //setMap(getRegion(location.coords.latitude, location.coords.longitude));
                        }
                    }            
            }).then((locationWatcher) => {               
                setLoc(locationWatcher);
              }).catch(err());
            return () => mounted = false;
        })();          
      } 
      
      return (<View></View>);
}
