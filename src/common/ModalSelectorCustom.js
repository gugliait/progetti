import React, { useState, useEffect, useRef } from 'react';
import { Switch, StyleSheet, Text, View, Dimensions, Alert, TouchableOpacity, Modal, Image,TextInput, Button, Platform } from 'react-native';
import ModalSelector from 'react-native-modal-selector'
import Icon from 'react-native-vector-icons/FontAwesome';

const opt = { key: Math.random().toString(16).slice(2), label: '' }

export const ModalSelectorCustom = (pr) => {
    const [textNewValue, setTextNewValue] = useState('');
    const [textInputValue, setTextInputValue] = useState('');
    const refModalSelector = useRef(null);
    const refNewInputText = useRef(null);

    const [data, setData] = useState(pr.data)
    
    useEffect(() => {
        createData(data);
    }, [])
    
    const onChangeTextHandler = (value) => {
        opt.label = value;
        opt.key = '_' + Math.random().toString(16).slice(2);
        console.log(value);
        setTextNewValue(value);                 
    }  

    function onPressHandler() {
        refModalSelector.current.onChange(opt)      
    }

    function createData(arr) {
        const optTitle = { key: Math.random().toString(16).slice(2), section: true, label: 'Circostanze' };
        const optNew = { key: Math.random().toString(16).slice(2), label: '', component: 
                            <View style={{flexDirection: 'row', padding: 0, margin: 0 }}>
                                <TextInput
                                    ref={refNewInputText}
                                    style={{borderColor:'#ccc', padding: 0, flex:1, margin:0}}
                                    onChangeText={(value) => onChangeTextHandler(value)}    
                                    editable={true}
                                    placeholder="Nuova circostanza"
                                    >                        
                                    </TextInput>
                                    <TouchableOpacity                        
                                        onPress={() => {onPressHandler();}}
                                        >
                                        <Icon name="plus-circle" size={30} color="#111"  />
                                    </TouchableOpacity> 
                            </View>
                        };
        arr.unshift(optNew);
        arr.unshift(optTitle);
        setData(arr);
        return arr;
    }    
    
    return (
        <View style={{flex:1,  padding:0}}>           
            <ModalSelector
                ref = {refModalSelector}
                data={data}
                initValue="Seleziona il periodo!"
                supportedOrientations={['landscape']}
                accessible={true}
                optionStyle={{padding:0 }}
                optionTextStyle={{padding:10}}
                onModalOpen={() => {setTextNewValue(''); opt.label=''; opt.key=''}}
                scrollViewAccessibilityLabel={'Scrollable options'}
                cancelButtonAccessibilityLabel={'Cancel Button'}
                onChange={(option)=>{ setTextInputValue(option.label); pr.onOptionSelected(option)}}>
                
                <View style={{flexDirection: 'column',  padding: 0, margin: 0}}>
                    <View style={{borderWidth:1, borderRadius:5, padding:5, borderColor:'#AAAAAA',flexDirection: 'row',  margin: 0 }}>
                        <TextInput
                            style={{borderColor:'#ccc',  padding: 0, marginRight:10}}
                            editable={false}
                            placeholder="Seleziona il periodo"
                            maxLength={35}
                            value={textInputValue} >                        
                            </TextInput>
                            <Icon name="sort-desc" size={20} color="#111" />
                    </View>
                    <Text style={{fontSize:1,   padding: 0, margin: 0}}  />
                </View>

            </ModalSelector>
        </View>
    );
}