import React, { useState, useEffect, useRef } from 'react';
import { Animated, SafeAreaView,StyleSheet, Text, View, Dimensions, Alert, TouchableOpacity, Modal, Image,TextInput, Button, Platform, PointPropType } from 'react-native';
import { EvilIcons, Ionicons, MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons'; 
import Icona from '../common/Icona'
import Accordion from 'react-native-collapsible/Accordion';

export default SubMenu = (props) => {
    const [collapsed, setCollapsed] = useState(true);
    const [activeSections, setActiveSections] = useState([]);
    const [iconFlagVisible, setIconFlagVisible] = useState(true);
    const [iconManualVisible, setIconManualVisible] = useState(true);
    const [iconLocationVisible, setIconLocationVisible] = useState(false);
    const [iconType, setIconType] = useState("Ionicons");
    const [iconName, setIconName] = useState("location");
    const [iconColor, setIconColor] = useState("red");
    const [iconSize, setIconSize] = useState(28);   

    const setSections = (sections) => {
        //setting up a active section state
        setActiveSections(sections.includes(undefined) ? [] : sections);
    }; 

    const CONTENT = [
        {
            title: 'Terms and Conditions',
            content:
            'The following terms and conditions, together with any referenced documents (collectively, "Terms of Use") form a legal agreement between you and your employer, employees, agents, contractors and any other entity on whose behalf you accept these terms (collectively, “you” and “your”), and ServiceNow, Inc. (“ServiceNow,” “we,” “us” and “our”).',
        }
    ];   

    const locationSelected = () => {        
        setCollapsed(true);             
        setIconFlagVisible(true);
        setIconManualVisible(true);
        setIconLocationVisible(false);        
        setIconType("Ionicons");
        setIconName("location");
        setIconColor("red");
        setIconSize(28);
        props.SetMode(1);
    }   

    const flagSelected = () => {
        setCollapsed(true);             
        setIconFlagVisible(false);
        setIconManualVisible(true);
        setIconLocationVisible(true);
        setIconType("FontAwesome");
        setIconName("pinterest-p");
        setIconColor("#2DC653");
        setIconSize(28);
        props.SetMode(2);
    }

    const manualSelected = () => {
        setCollapsed(true);             
        setIconFlagVisible(true);
        setIconManualVisible(false);
        setIconLocationVisible(true);        
        setIconType("Ionicons");
        setIconName("pin");
        setIconColor("#0066ff");
        setIconSize(28);
        props.SetMode(3);
    }  
    
    const renderContent =() => { 
        return (
          <View
            duration={200}
            transition="backgroundColor">
                <View style={[(iconFlagVisible)? styles.buttonVisible : styles.buttonHidden, styles.menuCamera]} >                   
                    <TouchableOpacity onPress={() => {flagSelected()}} style={styles.button}>
                        <Icona type={"Ionicons"} name={"flag"} color={"#2DC653"} size={28} />
                    </TouchableOpacity>  
                </View> 
                <View style={[styles.menuCamera, (iconManualVisible)? styles.buttonVisible : styles.buttonHidden]} > 
                    <TouchableOpacity onPress={() => {manualSelected()}} style={styles.button}>
                        <Icona type={"Ionicons"} name={"pin"} color={"#0066ff"} size={28} />
                    </TouchableOpacity>  
                </View>
                <View style={[styles.menuCamera, (iconLocationVisible)? styles.buttonVisible : styles.buttonHidden]} > 
                    <TouchableOpacity onPress={() => {locationSelected()}} style={styles.button}>
                        <Icona type={"Ionicons"} name={"location"} color={"red"} size={28} />
                    </TouchableOpacity>   
                </View>                                                     
          </View>
        );
      }

      const renderHeader = (section, _, isActive) => {
        //Accordion Header view
        return (
          <View
            duration={4000}
            // style={[styles.header, isActive ? styles.active : styles.inactive]}
            transition="backgroundColor"
            style={styles.menuCamera}>
            <TouchableOpacity onPress={() => {
                                                setCollapsed(!collapsed);
                                            }
                                        } style={styles.button}>
                                            <Icona type={iconType} name={iconName} color={iconColor} size={iconSize} />
            </TouchableOpacity>                                     
          </View>
        );
      }
      
      return (
            <Accordion
                    collapsed={collapsed}
                    expandFromBottom = {true}
                    activeSections={activeSections}
                    sections={CONTENT}
                    touchableComponent={TouchableOpacity}
                    expandMultiple={false}
                    renderHeader={renderHeader}
                    renderContent={renderContent}
                    duration={400}
                    onChange={setSections}
                    />         
      )    
}

const styles = StyleSheet.create({
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
    },

    button: {    
        alignItems: 'center',    
        borderRadius: 5,
      },

    buttonVisible: {
        display:'flex', 
    },

    buttonHidden: {
        display:'none',
    },

    menuContainer: {
        position: 'absolute',
        flex: 1, 
        right: 10, 
        bottom: 30, 
        width: 'auto',
        justifyContent: 'flex-end', 
        alignItems: 'center',
        flexDirection: 'column'
    },    
  });  