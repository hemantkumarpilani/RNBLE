import { NativeEventEmitter, NativeModules, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useRef, useState } from "react";
import MasterKeyView from "./MasterKeyView";
import { goBack, navigate } from "../../utils/NavigationUtil";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/reducers";
import UUID from "../../utils/UUID";
import BleManager, { BleState } from "react-native-ble-manager";
import { cupName, serialKeyUpdate } from "../../store/slices/SerialKeySlice";
import showToast from "../../utils/toastmessage";
import { Buffer } from "buffer";
import { deviceConnectionUpdate } from "../../store/slices/DeviceConnectSlice";
import { DeviceDetailsSlice } from "../../store/slices/DeviceDetails";

const MasterKeyController = ({route}) => {
  const BleManagerModule = NativeModules.BleManager;
  const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

  const { data, masterKey, renterDetailss } = useSelector((state: RootState) => ({
    data: state.devicedetails.data,
    masterKey: state.SerialKey.key,
    renterDetailss: state.renter,
  }));

  const dispatch = useDispatch();
  const textInputRef1 = useRef();
  const textInputRef2 = useRef();
  const textInputRef3 = useRef();
  const [state, setState] = useState({
    value1: "",
    value2: "",
    value3: "",
  });

  const backPress = () => {
    navigate("HomeScreen")
  };

  const handleChange = (name, value) => {
    console.log('handleChange', name, value)
    setState(() => ({ ...state, [name]: value }));
    if(name ==='value1' && value !='' ){
      textInputRef1.current?.blur()
      textInputRef2.current?.focus()
    }
    else if (name ==='value2' && value !=''){
      textInputRef2.current?.blur()
      textInputRef3.current?.focus()
    }
    else if (name ==='value3' && value !=''){
      textInputRef3.current?.blur()
    }
    else if(name ==='value3' && value ==''){
      textInputRef3.current?.blur()
      textInputRef2.current?.focus()
    }
    else if (name ==='value2' && value ==''){
      textInputRef2.current?.blur()
      textInputRef1.current?.focus()
    }
    else if (name ==='value1' && value ==''){
      textInputRef1.current?.blur()
    }
    
  };

  const submitPress = async ()=>{
    // console.log('submitPress MasterKeyController',route?.params?.newSerialKey, masterKey==(state?.value1+state?.value2+state?.value3).trim())
    const masterkey1 = state?.value1+state?.value2+state?.value3
    console.log('jasdbkax', typeof(masterkey1), masterkey1, masterKey, masterKey===masterkey1)
    if(masterKey === (state?.value1+state?.value2+state?.value3)){
      const buffer1 = Buffer.from(`${masterKey}00000${route?.params?.newSerialKey}00000`);
      try {
        const response = await BleManager.write(
          route?.params?.deviceId,
          UUID.SetMasterOrOwnerCode.serviceUUID,
          UUID.SetMasterOrOwnerCode.characteristicUUID, 
          buffer1.toJSON().data // Data to write (byte array)
        );
        console.log(' submitPress SetMasterOrOwnerCode response', response)
        dispatch(DeviceDetailsSlice(route?.params?.deviceId));
        dispatch(serialKeyUpdate(route?.params?.newSerialKey));
      dispatch(cupName(route?.params?.cupName))
        showToast('Master code has changed successfully', 'success')
        dispatch(deviceConnectionUpdate(true))
        // dispatch(serialKeyUpdate(state?.newSerialkey));
        // dispatch(cupName(state?.cupName))
      navigate('HomeScreen')
      } catch (error) {
        console.log('SetMasterOrOwnerCode error',error)
      }
    }
    else{
      showToast('Incorrect password', 'danger')
    }
    
    
  }

  return (
    <MasterKeyView
      backPress={backPress}
      values={state}
      handleChange={handleChange}
      ref1={textInputRef1}
      ref2={textInputRef2}
      ref3={textInputRef3}
      submitPress={submitPress}
    />
  );
};

export default MasterKeyController;

const styles = StyleSheet.create({});
