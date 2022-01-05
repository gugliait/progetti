import React, { useState, useEffect, useRef } from 'react';
import { EvilIcons, Ionicons, MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons'; 

/*
export const Icona = {
    ico: (type, name, color, size) => {        
        if (type === 'EvilIcons') {
            return (<EvilIcons name={name} size={size} color={color} />) 
        } else if (type === 'Ionicons') {
            return(<Ionicons name={name} size={size} color={color} />)
        } else if (type === 'MaterialCommunityIcons') {
            return(<MaterialCommunityIcons name={name} size={size} color={color} />)
        } else if (type === 'FontAwesome') {
            return(<FontAwesome name={name} size={size} color={color} />)
        }          
    }
}
*/

export default Icona = (props) => {
  

    return(
        (props.type === 'EvilIcons') ?
            <EvilIcons name={props.name} size={props.size} color={props.color} />
        : (props.type === 'Ionicons') ?
            <Ionicons name={props.name} size={props.size} color={props.color} />
        : (props.type === 'MaterialCommunityIcons') ?
            <MaterialCommunityIcons name={props.name} size={props.size} color={props.color} />
        : (props.type === 'FontAwesome') ?
            <FontAwesome name={props.name} size={props.size} color={props.color} />
        : <View/>
    )

        

}