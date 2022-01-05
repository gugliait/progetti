import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions, Alert, TouchableOpacity, Modal, Image,TextInput, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ViewImageModule = (props) => {
    return (
        <Modal
        animationType="slide"
        transparent={false}
        visible={true}
        onShow={(e) => {props.onShow(e)}}
        onRequestClose={() => {
            props.setViewImageModuleVisible();       
        }}>
            <Image
                style={{width: '100%', height: '100%'}}
                source={{ uri: props.setImage() }}
            /> 
            <View style={{ width:'100%', flex:1,  position:'absolute', bottom:20, flexDirection:'row', alignItems:'center'}}>
                <View style={{flex: 1, backgroundColor: "transparent", justifyContent: "flex-end",}}>
                    <View style={{  backgroundColor: "transparent", flexDirection: "row", alignItems: "center",  justifyContent: "space-between",}} >
                        <TouchableOpacity onPress={() => {props.setViewImageModuleVisible(); props.SetShowCamera()}} style={{flexDirection: "row"}}>
                            <Ionicons name="md-arrow-back" size={28} color="white" style={{ marginLeft:18, }} /> 
                            <Text style={{color:'white', marginLeft:4, fontSize:20, padding:0, margin:0, fontWeight:'bold'}}>                                
                                Back
                            </Text>       
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>{
                                            props.setViewImageModuleVisible();  
                                            props.setPlaceModuleVisible();
                                            }} style={{flexDirection: "row", marginRight:18}}>
                            <Ionicons name="md-checkmark" size={28} color="white" style={{fontWeight:'bold'}}/>
                            <Text style={{color:'white', marginRight:2, fontSize:20, padding:0, margin:0, fontWeight:'bold'}}>  OK </Text>
                        </TouchableOpacity>
                        {/* <TouchableOpacity icon="axis-z-rotate-clockwise" style={{ marginRight: 12 }} mode="outlined" color="white">
                            <Text style={{color:'white', marginRight:8}}> <Ionicons name="md-swap-horizontal" size={16} color="white" /> Ciao</Text>
                        </TouchableOpacity> */}
                </View>         
            </View>
                {/* <TextInput 
                    style={{ backgroundColor:'white', height:50, paddingLeft:20, paddingRight:50, fontSize:18,
                    borderColor: 'gray', marginLeft:'5%', marginRight:'5%', borderRadius:25, 
                    borderWidth: 1, justifyContent: 'center', flexDirection: 'column', flex:1}} />                        
                <TouchableOpacity style={{right:'5%', position:'absolute'}} onPress={()=>{
                    props.setViewImageModuleVisible();  
                    props.setPlaceModuleVisible();
                    }}>
                    <Ionicons name="md-play-circle" size={50} color="green" />
                </TouchableOpacity>                     */}

        </View>

        {/* <TouchableOpacity
               onPress={() => {
               props.setViewImageModuleVisible();
               }}>
                   
               <Text style={{color:'black', marginLeft:8}}><Ionicons name="md-close" size={16} color="black" /> Close</Text>       
             </TouchableOpacity> */}
            
        </Modal>
    )
}

export default ViewImageModule
