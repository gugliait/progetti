import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,  
  TouchableOpacity,
  Modal,
  Image,
  TextInput,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Button,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Camera } from 'expo-camera';
import CameraModule from '../src/common/CameraModule';
import ViewImageModule from '../src/common/ViewImageModule';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {ModalSelectorCustom} from '../src/common/ModalSelectorCustom'
import {DbManager} from './database/DbManager'
import {Helper} from '../src/common/Helper'

const PlaceModule = (props) => {
  const [hasPermission, setHasPermission] = useState(null);  
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [date, setDate] = useState(new Date());
  const [optionSelected, setOptionSelected] = useState(null);
  const [valueDescription, setValueDescription] = useState('')
  const [valuePlace, setValuePlace] = useState('');
  const [coordsSelected, setCoordsSelected] = useState(props.CoordsSelected);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setDate(date);
    hideDatePicker();
  };

  const getDate = () => {
    let tempDate = date.toString().split(' ');
    return date !== ''
      ? `${tempDate[0]} ${tempDate[1]} ${tempDate[2]} ${tempDate[3]}`
      : '';
  };

  const defaultPoint = {
    coords:{
      latitude:0,
      longitude:0
    }
  };

  const data = [
    // { key: Math.random().toString(16).slice(2), label: 'Cherries' },
    // { key: Math.random().toString(16).slice(2), label: 'Cranberries', accessibilityLabel: 'Tap here for cranberries' },    
    // { key: Math.random().toString(16).slice(2), label: 'Vegetable pasqua pippo ciccio 2027', customKey: 'Not a fruit' },        
  ] ;  

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);
  if (hasPermission === null) {
    // return <View />;
  }
  if (hasPermission === false) {
    alert('No access to camera');
  }

  useEffect(() => {
    DbManager.executeQuery(
    'select * from circumstances', 
    [],   
      (result) => {    
        console.log('righe: ' + result.rows.length);       
        if (result.rows.length > 0) {
          let res = null;
          for(let i = 0; i < result.rows.length; i++) {
            res = result.rows.item(i);
            let d = {key: res.crcId, label: res.crcDescription};
            data.push(d);
          }
          
          console.log('Descrizione = ' + res.crcDescription);
          console.log('select completed');              
        }
    });     
  }, []);  

  console.log('creato place module')
  console.log(global.username)


/*
L'inserimento avviene con questo ordine:
1) Circostanza: nel caso viene inserita una circostanza nuova
2) Inserimento del Place
3) Inserimento dell'immagine
4) Inserimento Places

*/

  const insertCircumstancesAsync = async (crcId, crcDescription, crcDate, callback) => {
    console.log('insertCircumstancesAsync');  
    let result = crcId
    if (crcId.substr(0, 1) === '_') {
      crcId = crcId.substr(1, crcId.length);
      result = crcId;
      DbManager.executeQuery(
        'INSERT INTO circumstances (crcId, crcDescription, crcDate) VALUES (?, ?, ?); ', 
        [result, crcDescription, crcDate],   
        (resultQuery) => {    
          callback(result);
          return;     
        }
      );         
    } 
    callback(result);
  }

  const insertImagesAsync =  async(imgFileName,callback) => {
    console.log('insertImagesAsync');  
    let imgId = Math.random().toString(16).slice(2);
    let result = imgId;
    DbManager.executeQuery(
      'INSERT INTO Images (imgId, imgFileName) VALUES (?, ?)', 
      [imgId, imgFileName],   
      (resultQuery) => {    
        callback(result)          
      }
    );  
  }  

  const insertPlaceAsync = async (plcDateAdd, plcDate, plcPlace, plcDescription, plcPoint, callback) => {  
    let plcId = Math.random().toString(16).slice(2);
    let result = plcId; 
    DbManager.executeQuery(
      'INSERT INTO Place (plcId, plcDateAdd, plcDate, plcPlace, plcDescription, plcPoint) VALUES (?, ?, ?, ?, ?, ?)', 
      [plcId, plcDateAdd, plcDate, plcPlace, plcDescription, plcPoint],   
      (resultQuery) => {  
        console.log('insertPlaceAsync Inserimento eseguito');  
        callback(result);
      }
    );
  }

  const insertPlacesAsync = async (plsUsrId, plsCrcId, plcId, callback) => {
    console.log('insertPlacesAsync');  
    let plsId = Math.random().toString(16).slice(2);
    let result = plsId;
    DbManager.executeQuery(
      'INSERT INTO Places (plsId, plsUsrId, plsCrcId, plsPlcId) VALUES (?, ?, ?, ?)', 
      [plsId, plsUsrId, plsCrcId, plcId],   
      (resultQuery) => {    
        callback(result);               
      }
    ); 
  }  

  /*VALIDAZIONI */
  /*Validazione Circumstances */
  function validateInputCircumstancesId(crcId) {
    let result = true;
    if(Helper.isEmpty(crcId)) {
      alert('Indicare la "Circostanza"');
      result = false;
    }   
    return result;
  }
  
  function validateInputCircumstancesoptionSelected() {
    let result = true;
    if (Helper.isEmpty(optionSelected)) {
      alert('Indicare la "Circostanza"');
      result = false;
    }   
    return result;
  }

  /*Validazione Images */
  /*
  function validateInputImage() {
    let result = true
    if(Helper.isEmpty(image)) {
      alert('Inserire una immagine');
      result = false;
    } 
    return result;    
  }
  */  

  function validateInputImageId(imgId) {
    let result = true;
    if(Helper.isEmpty(imgId)) {
      alert('Si è verificato un problema con l id dell imamgine');
      result = false;
    }   
    return result;
  }

  /*Validazione Place */
  function validatePlace() {
    let result = true;
    if(Helper.isEmpty(valuePlace)) {
      alert('Indicare il "luogo"');
      result = false;
    } 
    return result;
  }

  function validatePlaceId(plcId) {
    let result = true;
    if(Helper.isEmpty(plcId)) {
      alert('Si è verificato un problema con l\' id del luogo');
      result = false;
    }       
    return result;
  }  

  /*FINE VALIDAZIONI */

  onPressSaveHandler = () => {
    if(!validateInputCircumstancesoptionSelected()) {return false;} 
    let crcId = optionSelected.key;    
    let fileName; let imgId; let plcId;

    if (!validateInputCircumstancesId(crcId)) { return false; }
    if (!validatePlace()) { return false; }
    fileName = ""; //image.substr(image.lastIndexOf("/")+1);} 

    insertCircumstancesAsync(crcId, optionSelected.label, '2021-09-14', (resCrcId) => {
      crcId = resCrcId; 
      if (!validateInputCircumstancesId(crcId)) { return; }    
      defaultPoint.coords.latitude = coordsSelected.latitude;
      defaultPoint.coords.longitude = coordsSelected.longitude;
      insertPlaceAsync(Helper.toIsoStringInLocalTime(new Date()), Helper.toIsoStringInLocalTime(new Date()), valuePlace, valueDescription, JSON.stringify(defaultPoint), (resPlcId)=>{
        plcId = resPlcId;
        console.log(plcId);
        if (!validatePlaceId(plcId)) { return false;}
        //TODO PER ADESSO L'INSERIMENTO DELL'IMMAGINE VIENE SALTATO (Sistemare la query inserimento manca un campo)
        if(false) {
          insertImagesAsync(fileName, plcId, (resImgId) => {
            imgId = resImgId;
            //if (!validateInputImageId(imgId)) { return false; }   
            console.log(JSON.stringify(JSON.stringify(region)));        
          });          
        }
      //TODO SISTEMARE LA GESTIONE DELL'UTENTE DOPO IL LOGIN
        insertPlacesAsync('1', crcId, plcId, (resPlsId)=>{
          props.SetPlaceVisible(false);          
          props.Navigation.navigate('places'); 
        })          
      });      
     
    });  
  };

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={true}
      onShow={(e) => {props.WatchPositionStop();}}
      onRequestClose={() => {
        console.log('placemodule = onRequestClose');
        props.SetPlaceVisible(false);
      }}>
      <View
        style={{
          flexGrow: 1,
          height: '100%',
          backgroundColor: '#f0f2f5',
          alignItems: 'center',
          padding: 16,     
          alignContent:'stretch'     
        }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}
          style={{            
            flex: 1,
            width: '100%',
            marginTop: 16,
            marginBottom: 16,
            backgroundColor: '#f0f2f5',
          }}>
          <View
            style={{

              borderRadius: 16,
              paddingTop: 16,
              paddingBottom: 16,
              backgroundColor: 'white',
              height:'100%',
              width: '100%',
            }}>
            <View
              style={{
                paddingLeft: 0,
                paddingRight: 0,
                justifyContent: 'flex-start',
                marginLeft: 16,
                marginRight: 16,
                paddingBottom: 8,
                paddingTop:0,
              }}>
              <Text style={{color:'#007017', fontWeight:'bold'}}>Foto</Text>
              <View style={{
                  borderWidth: 1,
                  borderRadius: 1,
                  borderColor: '#007017'
                }}>
              </View>
            </View>

            <View
              style={{
                flexDirection: 'row',
                paddingLeft: 8,
                paddingRight: 8,
                alignItems: 'center',
              }}>
              <View style={{ flex: 1, padding: 5 }}>
                <View
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    position: 'absolute',
                    top: 8,
                    zIndex: 1,
                    left: 0,
                    right: 0,
                    alignItems: 'flex-start',
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      props.SetImageSelected(props.Images.images.img1.src);
                      props.SetButtonBackVisible(false);
                      props.SetPreviewImageVisible(true);
                    }}
                    style={{ flex: 1, marginLeft: 10 }}>
                    <Ionicons
                      name="md-image"
                      size={20}
                      style={{ color: '#BBB', marginRight: 0 }}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => alert(2)}
                    style={{ flex: 0 }}>
                    <Ionicons
                      name="md-folder-open"
                      size={20}
                      style={{ color: '#BBB', marginRight: 0 }}
                    />
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    position: 'absolute',
                    zIndex: 2,
                    top: 40,
                    left: 0,
                    right: 0,
                    bottom: 40,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      props.Images.setImg = 'Img1';
                      props.SetImages(props.Images);
                      props.SetCameraVisible(true);
                    }}>
                    <Ionicons
                      name="md-camera"
                      size={30}
                      style={{ color: '#BBBBBB', marginRight: 0 }}
                    />
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    position: 'absolute',
                    zIndex: 3,
                    left: 0,
                    right: 0,
                    bottom: 10,
                    justifyContent: 'flex-end',
                    alignItems: 'baseline',
                  }}>
                  <TouchableOpacity onPress={() => {
                    const updatedObjectImg1 = Object.assign({}, props.Images)
                    updatedObjectImg1.setImg = 'Img1';
                    updatedObjectImg1.images.img1.src = null;
                    props.SetImages(updatedObjectImg1);   
                  }}>
                    <Ionicons
                      name="md-trash"
                      size={20}
                      style={{ color: '#BBB', marginRight: 0 }}
                    />
                  </TouchableOpacity>
                </View>
                <View>
                  <Image
                    source={{ uri: props.Images.images.img1.src }}
                    style={{
                      borderRadius: 5,
                      height: 120,
                      borderWidth: 1,
                      borderColor: '#BBB',
                    }}
                  />
                </View>
              </View>
              <View style={{ flex: 1, padding: 5 }}>
                <View
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    position: 'absolute',
                    top: 8,
                    zIndex: 1,
                    left: 0,
                    right: 0,
                    alignItems: 'flex-start',
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      props.SetImageSelected(props.Images.images.img2.src);
                      props.SetButtonBackVisible(false);
                      props.SetPreviewImageVisible(true);
                    }}
                    style={{ flex: 1, marginLeft: 10 }}>
                    <Ionicons
                      name="md-image"
                      size={20}
                      style={{ color: '#BBB', marginRight: 0 }}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => alert(2)}
                    style={{ flex: 0 }}>
                    <Ionicons
                      name="md-folder-open"
                      size={20}
                      style={{ color: '#BBB', marginRight: 0 }}
                    />
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    position: 'absolute',
                    zIndex: 2,
                    top: 40,
                    left: 0,
                    right: 0,
                    bottom: 40,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity
                    style={{}}
                    onPress={() => {
                      props.Images.setImg = 'Img2';
                      props.SetImages(props.Images);
                      props.SetCameraVisible(true);
                    }}>
                    <Ionicons
                      name="md-camera"
                      size={30}
                      style={{ color: '#BBBBBB', marginRight: 0 }}
                    />
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    position: 'absolute',
                    zIndex: 3,
                    left: 0,
                    right: 0,
                    bottom: 10,
                    justifyContent: 'flex-end',
                    alignItems: 'baseline',
                  }}>
                  <TouchableOpacity style={{}} onPress={() => {
                    const updatedObjectImg2 = Object.assign({}, props.Images)
                    updatedObjectImg2.setImg = 'Img2';
                    updatedObjectImg2.images.img2.src = null;
                    props.SetImages(updatedObjectImg2);   
                  }}>
                    <Ionicons
                      name="md-trash"
                      size={20}
                      style={{ color: '#BBB', marginRight: 0 }}
                    />
                  </TouchableOpacity>
                </View>
                <View>
                  <Image
                    source={{ uri: props.Images.images.img2.src }}
                    style={{
                      borderRadius: 5,
                      height: 120,
                      borderWidth: 1,
                      borderColor: '#BBB',
                    }}
                  />
                </View>
              </View>
              <View style={{ flex: 1, padding: 5 }}>
                <View
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    position: 'absolute',
                    top: 8,
                    zIndex: 1,
                    left: 0,
                    right: 0,
                    alignItems: 'flex-start',
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      props.SetImageSelected(props.Images.images.img3.src);
                      props.SetButtonBackVisible(false);
                      props.SetPreviewImageVisible(true);
                    }}
                    style={{ flex: 1, marginLeft: 10 }}>
                    <Ionicons
                      name="md-image"
                      size={20}
                      style={{ color: '#BBB', marginRight: 0 }}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => alert(2)}
                    style={{ flex: 0 }}>
                    <Ionicons
                      name="md-folder-open"
                      size={20}
                      style={{ color: '#BBB', marginRight: 0 }}
                    />
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    position: 'absolute',
                    zIndex: 2,
                    top: 40,
                    left: 0,
                    right: 0,
                    bottom: 40,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity
                    style={{}}
                    onPress={() => {
                      props.Images.setImg = 'Img3';
                      props.SetImages(props.Images);
                      props.SetCameraVisible(true);
                    }}>
                    <Ionicons
                      name="md-camera"
                      size={30}
                      style={{ color: '#BBBBBB', marginRight: 0 }}
                    />
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    position: 'absolute',
                    zIndex: 3,
                    left: 0,
                    right: 0,
                    bottom: 10,
                    justifyContent: 'flex-end',
                    alignItems: 'baseline',
                  }}>
                  <TouchableOpacity style={{}} onPress={() => {
                    const updatedObjectImg3 = Object.assign({}, props.Images)
                    updatedObjectImg3.setImg = 'Img3';
                    updatedObjectImg3.images.img3.src = null;
                    props.SetImages(updatedObjectImg3);                    
                  }}>
                    <Ionicons
                      name="md-trash"
                      size={20}
                      style={{ color: '#BBB', marginRight: 0 }}
                    />
                  </TouchableOpacity>
                </View>
                <View>
                  <Image
                    source={{ uri: props.Images.images.img3.src }}
                    style={{
                      borderRadius: 5,
                      height: 120,
                      borderWidth: 1,
                      borderColor: '#BBB',
                    }}
                  />
                </View>
              </View>
            </View>
            <View
              style={{
                paddingLeft: 0,
                paddingRight: 0,
                justifyContent: 'flex-start',
                marginLeft: 16,
                marginRight: 16,
                paddingBottom:16,
                paddingTop:16
              }}>
              <View style={{flexDirection: 'row', alignItems: 'center', }}>
                <Text style={{color:'#007017', fontWeight:'bold'}}>Info del luogo</Text>
                <Text style={{color:'#007017', fontSize:10 }}> ({coordsSelected.latitude} {coordsSelected.longitude})</Text>
              </View>              
              <View style={{
                  borderWidth: 1,
                  borderRadius: 1,
                  borderColor: '#007017'
                }}>
              </View>
            </View>

            <View
              style={{
                paddingLeft: 16,
                paddingRight: 16,
                justifyContent: 'center',
                flexDirection: 'row',
                alignItems: 'center',
                marginLeft: 16,
                marginRight: 16,
              }}>
              <Ionicons
                name="md-today"
                size={24}
                style={{ color: 'orange', marginRight: 16 }}
              />
              <View
                style={{
                  flex: 1,
                  width: '100%',
                  alignItems: 'flex-start',
                  marginBottom: 8,
                }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <TextInput
                    style={styles.textInput}
                    value={getDate()}
                    placeholder="Date..."
                  />
                  <TouchableOpacity onPress={showDatePicker}>
                    <Ionicons
                      name="md-calendar-sharp"
                      size={24}
                      style={{ color: '#408DF7' }}
                    />
                  </TouchableOpacity>
                </View>
                <DateTimePickerModal
                  isVisible={isDatePickerVisible}
                  mode="date"
                  onConfirm={handleConfirm}
                  onCancel={hideDatePicker}
                  date={new Date()}
                />
                {/* <TextInput 
                                style={{width:'100%', backgroundColor:'white', fontSize:14, padding:5,
                                borderColor: '#AAAAAA', borderRadius:5, 
                                borderWidth: 1, justifyContent: 'center'}} />                   */}
              </View>
            </View>

            <View
              style={{
                paddingLeft: 16,
                paddingRight: 16,
                justifyContent: 'center',
                flexDirection: 'row',
                alignItems: 'center',
                marginLeft: 16,
                marginRight: 16,
              }}>
              <Ionicons
                name="md-map"
                size={24}
                style={{ color: 'orange', marginRight: 16 }}
              />
              <View
                style={{
                  flex: 1,
                  width: '100%',
                  alignItems: 'flex-start',
                  marginBottom: 8,
                }}>
                <Text style={{ color: '#444444', fontWeight: 'bold'}}>Circostanza</Text>
                <ModalSelectorCustom data={data} onOptionSelected={(option) => setOptionSelected(option)} />
                {/* <TextInput 
                                style={{width:'100%', backgroundColor:'white', fontSize:14, padding:5,
                                borderColor: '#AAAAAA', borderRadius:5, 
                                borderWidth: 1, justifyContent: 'center'}} />                   */}
              </View>
            </View>

            <View
              style={{
                paddingLeft: 16,
                paddingRight: 16,
                justifyContent: 'center',
                flexDirection: 'row',
                alignItems: 'center',
                marginLeft: 16,
                marginRight: 16,
              }}>
              <Ionicons
                name="md-newspaper"
                size={24}
                style={{ color: 'orange', marginRight: 16 }}
              />
              <View
                style={{
                  flex: 1,
                  width: '100%',
                  alignItems: 'flex-start',
                  marginBottom: 8,
                }}>
                <Text style={{ color: '#444444', fontWeight: 'bold'}}>Luogo</Text>
                <TextInput placeholder='Info sul luogo' onChangeText={(text) => {console.log(text); setValuePlace(text)}}
                  style={{
                    width: '100%',
                    backgroundColor: 'white',
                    fontSize: 14,
                    borderColor: '#AAAAAA',
                    borderRadius: 5,
                    padding: 5,
                    borderWidth: 1,
                    justifyContent: 'center',
                    marginRight: 32,
                    
                  }}
                />
              </View>
            </View>

            <View
              style={{
                paddingLeft: 16,
                paddingRight: 16,
                justifyContent: 'center',
                flexDirection: 'row',
                alignItems: 'center',
                marginLeft: 16,
                marginRight: 16,
              }}>
              <Ionicons
                name="md-information-circle-sharp"
                size={24}
                style={{ color: 'orange', marginRight: 16 }}
              />
              <View
                style={{
                  flex: 1,
                  width: '100%',
                  alignItems: 'flex-start',
                  marginBottom: 16,
                }}>
                <Text style={{ color: '#444444' }}>Descrizione</Text>
                <TextInput
                  placeholder='Descrizione sul luogo'
                  multiline={true}
                  numberOfLines={2}
                  onChangeText={(text) => {console.log(text); setValueDescription(text)}}
                  style={{
                    width: '100%',
                    backgroundColor: 'white',
                    fontSize: 14,
                    borderColor: '#AAAAAA',
                    borderRadius: 5,
                    padding: 5,
                    borderWidth: 1,
                    marginRight: 32,                    
                  }}
                />
              </View>
            </View>

            <View
              style={{
                paddingLeft: 16,
                paddingRight: 16,
                justifyContent: 'center',
                flexDirection: 'row',
                alignItems: 'center',
                marginLeft: 16,
                marginRight: 16,
              }}>
              <View
                style={{
                  flex: 1,
                  width: '100%',
                  alignItems: 'flex-start',
                  paddingLeft: 40,
                  flexDirection: 'row',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    onPressSaveHandler();
                  }}
                  style={[styles.buttonSubmit, styles.buttonSubmitSave]}>
                  <Ionicons
                    name="md-save"
                    size={20}
                    style={styles.buttonIconSave}
                  />
                  <Text style={{ color: 'white' }}>Salva</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {}}
                  style={[styles.buttonSubmit, styles.buttonSubmitPublish]}>
                  <Ionicons
                    name="md-share-social"
                    size={20}
                    style={styles.buttonIconPublish}
                  />
                  <Text style={{ color: 'white' }}>Pubblica</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>

      {/*camera && (
        <CameraModule
          img={img}
          showModal={camera}
          SetModalVisible={(value) => setShowCamera(value)}             
          SetImage={(result, img) => {
            if (img) {
              if (img == 'img1') {
                console.log('setImage ', img);
                setImage(result.uri);
              } else if (img == 'img2') {
                console.log('setImage ', img);
                setImage2(result.uri);
              } else if (img == 'img3') {
                console.log('setImage ', img);
                setImage3(result.uri);
              }
            } else {
              console.log('setImage = null ', img);
              setImage(result.uri);
            }
          }}
          setViewImageModuleVisible={() => setShowPlace(true)}
        />
      )}
      { {place && (
        <ViewImageModule
          showModal={place}
          SetShowCamera={() => setShowCamera(true)}  
          setImage={() => {
            if (img) {
              if (img == 'img1') {
                console.log('setImage ', img);
                return image;
              } else if (img == 'img2') {
                console.log('setImage ', img);
                return image2;
              } else if (img == 'img3') {
                console.log('setImage ', img);
                return image3;
              }
            } else {
              console.log('setImage = null ', img);
              return image;
            }
          }}
          setViewImageModuleVisible={() => setShowPlace(false)}
          setPlaceModuleVisible={() => {}}
        />
      )} */}
    </Modal>
  );
};

const styles = StyleSheet.create({
  /*Button  */
  buttonSubmit: {
    borderWidth: 1,
    padding: 10,
    flex: 1,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'center',
  },

  buttonSubmitPublish: {
    marginLeft: 10,
    backgroundColor: '#007017',
    borderColor: '#007017',
  },

  buttonSubmitSave: {
    marginRight: 10,
    backgroundColor: '#408DF7',
    borderColor: '#408DF7',
  },

  buttonIcon: {
    color: '#1B1B1B',
    marginRight: 5,
  },

  buttonIconPublish: {
    color: '#1B1B1B',
    marginRight: 5,
    color: 'white',
  },

  buttonIconSave: {
    color: '#1B1B1B',
    marginRight: 5,
    color: 'white',
  },

  textInput: {
    backgroundColor: 'white',
    fontSize: 14,
    borderColor: '#AAAAAA',
    borderRadius: 5,
    padding: 5,
    borderWidth: 1,
    justifyContent: 'center',
    marginRight: 8,
  },

  container: {
    width: '100%'
  },
  scrollView: {
    height: '100%',
    backgroundColor: '#f0f2f5',
  },
});

export default PlaceModule;
