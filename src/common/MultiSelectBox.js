import React, { useState } from 'react'
import { Text, View } from 'react-native'
import {Picker} from '@react-native-picker/picker';

const MultiSelectBoxModule = (props) => {
    const [selectedLanguage, setSelectedLanguage] = useState();
  return (
    <View style={{width:'100%', backgroundColor:'white', fontSize:14,
                    borderColor: '#AAAAAA', borderRadius:5, padding:5,
                    borderWidth: 1, justifyContent: 'center', marginRight:32}}>
        <Picker
            selectedValue={selectedLanguage}
            onValueChange={(itemValue, itemIndex) =>
            setSelectedLanguage(itemValue) } style={{width: '100%'}}>
            <Picker.Item label="Vacanza estate 2021" value="1" />
            <Picker.Item label="Vacanza Pasqua 2021" value="2" />
        </Picker>
    </View>
  )
}

export default MultiSelectBoxModule