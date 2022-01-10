import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions, Alert, TouchableOpacity, Modal, Image,TextInput, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Camera } from "expo-camera";

const CameraModule = (props) => {
    const [cameraRef, setCameraRef] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);
   
 return (
     <Modal
       animationType="slide"
       transparent={true}
       autoFocus='on'
       zoom={1}
       visible={true}
       onRequestClose={() => {
        if (props.Mode==1) {
          props.WatchPositionStart();
        }          
        props.SetCameraVisible(false);         
       }}
       onShow={(e) => {props.WatchPositionStop()}}
     >
       <Camera
         style={{ flex: 1 }}
         ratio="16:9"
         flashMode={Camera.Constants.FlashMode.off}
         type={type}
         ref={(ref) => {
           setCameraRef(ref);
         }}
       >
         <View
           style={{
             flex: 1,
             backgroundColor: "transparent",
             justifyContent: "flex-end",
           }}
         >
           <View
             style={{
               backgroundColor: "black",
               flexDirection: "row",
               alignItems: "center",
               justifyContent: "space-between",
             }}
           >
             <TouchableOpacity
               onPress={() => {
               props.SetCameraVisible(false);
               }}>
                   
               <Text style={{color:'white', marginLeft:8}}><Ionicons name="md-close" size={16} color="white" /> Close</Text>       
             </TouchableOpacity>
            <TouchableOpacity
               onPress={async () => {
                 if (cameraRef) {
                   const options = {quality: 1, base64: true, skipProcessing: true};
                   let photo = await cameraRef.takePictureAsync(options);
                   props.SetImageSelected(photo.uri);
                   props.SetPreviewImageVisible(true);
                   props.SetCameraVisible(false);               
                 }
               }}
             >
               <View
                 style={{
                   borderWidth: 2,
                   borderRadius: 50,
                   borderColor: "white",
                   height: 50,
                   width: 50,
                   display: "flex",
                   justifyContent: "center",
                   alignItems: "center",
                   marginBottom: 16,
                   marginTop: 16,
                 }}
               >
                 <View
                   style={{
                     borderWidth: 2,
                     borderRadius: 50,
                     borderColor: "white",
                     height: 40,
                     width: 40,
                     backgroundColor: "white",
                   }}
                 ></View>
               </View>
             </TouchableOpacity>
        <TouchableOpacity
               icon="axis-z-rotate-clockwise"
               style={{ marginRight: 12 }}
               mode="outlined"
               color="white"
               onPress={() => {
                 setType(
                   type === Camera.Constants.Type.back
                     ? Camera.Constants.Type.front
                     : Camera.Constants.Type.back
                 );
               }}
             >
            <Text style={{color:'white', marginRight:8}}> <Ionicons name="md-swap-horizontal" size={16} color="white" />  {type === Camera.Constants.Type.back ? "Front" : "Back "}</Text>
             </TouchableOpacity>
           </View>
         </View>
       </Camera>
     </Modal>
   );
 };

 export default CameraModule