import React, { useState, useEffect, useRef } from 'react';
import { Animated, SafeAreaView,StyleSheet, Text, View, Dimensions, Alert, TouchableOpacity, Modal, Image,TextInput, Button, Platform, PointPropType } from 'react-native';
import { Camera } from "expo-camera";
import PlaceModule from "../../src/PlaceModule"
import CameraModule from "../../src/common/CameraModule"
import ViewImageModule from "../../src/common/ViewImageModule"
import WatchPosition from "../map/WatchPosition"
import SubMenu from "../Login/SubMenu"
import Mappa from '../map/Mappa';
import Icona from '../common/Icona'
// import axios from 'axios';
import { DbManager } from '../database/DbManager';
import * as ScreenOrientation from 'expo-screen-orientation';

const api = 'http://192.168.178.103:1337/gruppi';

export default Login = ({navigation, route}) => {    
    const [image, setImage] = useState(null);
    const [camera, setShowCamera] = useState(false);
    const [hasPermission, setHasPermission] = useState(null);     
    const [place, setShowPlace] = useState(false);
    const [viewImage, setShowViewImageModule] = useState(false);
    const [didMount, setDidMount] = useState(false); 
    const [coordsText, setCoordsText] = useState("");

    const [mode, setMode] = useState(1); //1 = location, 2 = flag, 3 = manuale

    const [iconType, setIconType] = useState("Ionicons");
    const [iconName, setIconName] = useState("location");
    const [iconColor, setIconColor] = useState("red");
    const [iconSize, setIconSize] = useState(28);    

    const [watchPosition, setWatchPosition] = useState('start');
    const [region, setRegion] = useState({
        latitude: 1,
        longitude:1,
        latitudeDelta:0.004,
        longitudeDelta:0.004,
    });

    const [coordsSelected, setCoordsSelected] = useState({
        latitude: 1,
        longitude:1,        
    });    

    const [markers, setMarkers] = useState([]);
    const [zoom, setZoom] = useState(12);

    const [mapDimensions, setMapDimensions] = useState(
        {
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height,
        }
    );

    useEffect(() => {
        (async () => {
           const { status } = await Camera.requestCameraPermissionsAsync();
           setHasPermission(status === "granted");
        })();                          
        setDidMount(true);
        return () => setDidMount(false);
    }, []);

    useEffect(() => {
        const subscription = ScreenOrientation.addOrientationChangeListener((e) => {
            console.log('e ', e);
            setMapDimensions({
                width: Dimensions.get('window').width,
                height: Dimensions.get('window').height,
              }            
            )
        });                   
        return ()=>{
            ScreenOrientation.removeOrientationChangeListener(subscription);
        }
    },[]);

    useEffect(() => {
        console.log('Modalità: ' + mode);

        if (mode == 1) { //Location
            setIconType("Ionicons");
            setIconName("location");
            setIconColor("red");
            setIconSize(28);
       } else if(mode == 2) { //Flag
            setIconType("Ionicons");
            setIconName("flag");
            setIconColor("#2DC653");
            setIconSize(28);                        
       } else if(mode == 3) { //Manuale
            setIconType("Ionicons");
            setIconName("pin");
            setIconColor("#0066ff");
            setIconSize(28);
            setCoordsSelected(null);
            setCoordsText("Lat: - Long: - ");      
       }
       onActiveWatchPositionHandler();
    }, [mode]);  
         
    if (hasPermission === null) {
    // return <View />;
    }
    if (hasPermission === false) {
        alert('No access to camera');
    }

    useEffect(() => {                              
        console.log("updateLocation");
        return () => setDidMount(false);
      }, []);

    useEffect(() => {        
        setDidMount(true);
        return () => setDidMount(false);   
    }, []); 


    // axios.get(api).then(response => {
    //     alert(response.data[1].id);
      
    //   });

   
    const onActiveWatchPositionHandler = () => {      
        if (mode == 1) {  
            setWatchPosition('start');        
            console.log(1);
        } else if (mode == 2){        
            setWatchPosition('stop');
            loadLocationData();
            console.log(2);
        }  else if(mode == 3) {
            setMarkers([]);
            setWatchPosition('stop');
        }                       
    }

    if(!didMount) {
        return null;
    }
    
    /**
     * Legge dal db tutti i luoghi e chiama la funzione per creare i punti sulla mappa
     */
    function loadLocationData() {
        const sql = 'SELECT * FROM Place ' +
                    'INNER JOIN PLACES ON plsPlcId = plcId ' + 
                    'INNER JOIN Circumstances ON crcId = plsCrcId ORDER BY plcDateAdd DESC'   
        DbManager.executeQuery(sql, [], (resultQuery) => { 
            let m = [];   
            if (resultQuery!= null && typeof resultQuery != 'undefined') {     
                var objPoint = {};
                let primo = true;
                for(let i=0; i<resultQuery.rows.length; i++){
                    objPoint =  JSON.parse(resultQuery.rows.item(i).plcPoint);
                    let obj={};
                    obj.latitude = objPoint.coords.latitude;
                    obj.longitude =objPoint.coords.longitude;
                    obj.description = resultQuery.rows.item(i).plcDescription;
                    obj.title = resultQuery.rows.item(i).crcDescription;

                    if (primo) {
                        const r = {
                            latitude: objPoint.coords.latitude,
                            longitude: objPoint.coords.longitude,
                            latitudeDelta: region.latitudeDelta,
                            longitudeDelta: region.longitudeDelta,   
                        }
                        setRegion(r);                                              
                        formatCoordsText(objPoint.coords.latitude, objPoint.coords.longitude);
                        primo = false;
                    }                    
                    m.push(obj);                        
                }                 
            }

            setMarkers(m);
         });
    }

    function formatCoordsText(ln, lt) {
        setCoordsText("Lat: " + ln + " Long: " + lt);
    }

    function errUpdateLocation() {
        setCoordsText("Error location. Passare modalità manuale");
    }

    function updateLocation(location) {   
        console.log('updateLocation');
        let m = []; 
        let obj={};
        obj.latitude = location.coords.latitude
        obj.longitude = location.coords.longitude;
        obj.description = "";
        obj.title = "Sei qui";
               
        const r = {
            latitude: location.coords.latitude,
            longitude:location.coords.longitude,
            latitudeDelta:0.004,
            longitudeDelta:0.004,            
        }
        setRegion(r);

        const s = {
            latitude: location.coords.latitude,
            longitude:location.coords.longitude,                    
        }
        setCoordsSelected(s);        
              
        m.push(obj);   
        setMarkers(m);
        formatCoordsText(location.coords.latitude, location.coords.longitude);
    }

    let onActiveManualPositionHandler = () => {
        //WatchPosition.stop();
    }

    const onMarkerPressHandler = (lt, ln) => {
        console.log('onMarkerPressHandler');
        let m = []; 
        let obj={};
        obj.latitude = lt;
        obj.longitude = ln;
        obj.description = "";
        obj.title = "Sei qui";        
        const r = {
            latitude: lt,
            longitude: ln,
            latitudeDelta: region.latitudeDelta,
            longitudeDelta: region.longitudeDelta,   
        }
        setRegion(r); 

        const s = {
            latitude: lt,
            longitude:ln,                     
        }
        setCoordsSelected(s);
        
        m.push(obj);   
        setMarkers(m);
        formatCoordsText(lt, ln);
    }

    const zoomOut = () => {
        if (Math.trunc(zoom) < 19) {
            const r = {
                latitude: region.latitude,
                longitude: region.longitude,
                latitudeDelta: region.latitudeDelta / 5,
                longitudeDelta: region.longitudeDelta / 5,   
            }
            setRegion(r); 
        }        
    }

    const zoomIn = () => {
        console.log('zoom: ' + Math.trunc(zoom));
        if (Math.trunc(zoom) > 5) {
            const r = {
                latitude: region.latitude,
                longitude: region.longitude,
                latitudeDelta: region.latitudeDelta * 5,
                longitudeDelta: region.longitudeDelta * 5,   
            }
            setRegion(r);    
        }
     
    }

    const openCamera = () => {
        if (mode != 2) {
            if (mode == 3 && coordsSelected == null) {
                alert("Indicare un punto sulla mappa.");
            } else {
                setWatchPosition('stop'); 
                setShowCamera(true);  
            }                       
        } else {
            alert("Per eseguire questa operazione bisogna essere in modalità manuale o location!");
        }
    }

    return (
        <View style={styles.container}>
            <Mappa 
                Region={region} 
                SetRegion={(region) => setRegion(region)}
                Markers={markers} 
                IconType={iconType} 
                IconName={iconName} 
                IconColor={iconColor} 
                IconSize={iconSize}
                OnPress={(lt, ln) => onMarkerPressHandler(lt, ln)}
                Mode={mode}
                SetZoom={(z) => setZoom(z)}                
                ZoomRegion={region}
                MapDimensions = {mapDimensions}

                />
            <WatchPosition action={watchPosition} fun={(l) => updateLocation(l)} err={() => errUpdateLocation()} />
            <View style={styles.menuContainer}>
              
                <View style={styles.menuCamera}>
                    <TouchableOpacity onPress={() => {zoomOut()}}
                                      style={styles.button}>
                                          <Icona type={'FontAwesome'} name={"search-plus"} color={"#0077B6"} size={28} />
                        {/* {Icona.ico("FontAwesome", "search-plus", "#0077B6", 28)}                                                                */}
                    </TouchableOpacity>                
                </View>                       
                <View style={styles.menuCamera}>                    
                    <TouchableOpacity onPress={() => { zoomIn()}}
                                      style={styles.button}>
                                          <Icona type={'FontAwesome'} name={"search-minus"} color={"#0077B6"} size={28} />
                        {/* {Icona.ico("FontAwesome", "search-minus", "#0077B6", 28)}                            */}
                    </TouchableOpacity>   
                </View>               
                
                {/*Code for Accordion/Expandable List starts here*/}

                <SubMenu SetMode={(mod) => setMode(mod)} Mode={mode}  />

                <View style={styles.menuCamera}>
                    <TouchableOpacity onPress={() => {openCamera()}} style={styles.button}>
                        <Icona type={'Ionicons'} name={"md-camera"} color={"green"} size={32} />
                        {/* {Icona.ico("Ionicons", "md-camera", "green", 32)}          */}
                    </TouchableOpacity>                        
                </View>
            </View>  
            {camera && (
                        <CameraModule
                        showModal={camera}
                        setModalVisible={() => {setShowCamera(false); if (mode==1) setWatchPosition('start');}}
                        setImage={(result) => setImage(result.uri)}
                        setViewImageModuleVisible={() => { setShowPlace(true)}}
                        onShow={(e) => {setWatchPosition('stop')}}
                        />
                    )}   
            {place && (
                        <ViewImageModule
                        showModal={place}
                        setImage={() => image}     
                        SetShowCamera={() => {setShowCamera(true); setWatchPosition('stop');}}                   
                        setViewImageModuleVisible={() => {setShowPlace(false                                                                                            ); if (mode==1) setWatchPosition('start');}}
                        setPlaceModuleVisible={() => {setShowViewImageModule(true)}}
                        onShow={(e) => {setWatchPosition('stop')}}
                        />
                    )}       
            {viewImage && (
                <PlaceModule
                    CoordsSelected={coordsSelected}
                    navigation={navigation}
                    showModal={viewImage}
                    setImage={() => image}
                    onShow={(e) => {setWatchPosition('stop')}}
                    Route={route}
                    SetMode={(m) => setMode(m)}
                    Navigation={navigation}
                    setPlaceModuleVisible={() => {                        
                        setShowViewImageModule(false);
                        if (mode==1) setWatchPosition('start');
                    }} />
            )}              
                <View style={styles.bottomView}>
                    <Text style={styles.textStyle}>{coordsText}</Text>
                </View>                                       
        </View>);
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },

    menuContainer: {
        position: 'absolute',
        flex: 1, 
        right: 10, 
        bottom: 30, 
        width: 'auto',
        justifyContent: 'flex-end', 
        alignItems: 'center',
        // backgroundColor:'red',
        flexDirection: 'column'
    },
    menuCamera: {
        borderWidth: 1,
        borderColor: '#FFFFFF',
        backgroundColor: '#FFFFFF70',

        justifyContent: 'center',
        marginTop: 5,
        marginBottom: 5,
        marginLeft:10,
        marginRight: 10,
        borderRadius: 5,
        paddingLeft:5,
        paddingRight: 5,
        // shadowColor: "#FFFFFF",
        // shadowOffset: {
        //     width: 5,
        //     height: 3,
        // },
        // shadowOpacity: 100,
        // shadowRadius: 3,

        // elevation: 1,
    },
    button: {    
        alignItems: 'center',    
        borderRadius: 5,
      },
      buttonText: {
        fontSize: 20,
        color: '#fff',
      }, 

    bottomView: {
        width: '100%',
        height: 20,
        borderWidth: 1,
        borderColor: '#FFFFFF',        
        backgroundColor: '#FFFFFF80',
        justifyContent: 'center',
        alignItems: 'flex-start',
        position: 'absolute', //Here is the trick
        bottom: 0, //Here is the trick       
        borderRadius:2
    },
    textStyle: { 
        marginLeft:10,
        color: '#000',
        fontSize: 11,
    },     
    
    buttonVisible: {
        display:'flex', 
        
        // visibility: 'visible'
    },

    buttonHidden: {
        display:'none',
        // visibility: 'hidden'
    }
  });