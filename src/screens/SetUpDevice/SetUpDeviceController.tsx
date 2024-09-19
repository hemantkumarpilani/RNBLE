import {
  NativeEventEmitter,
  NativeModules,
  PermissionsAndroid,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import SetUpDeviceView from "./SetUpDeviceView";
import { goBack, navigate } from "../../utils/NavigationUtil";
import BleManager, { BleState } from "react-native-ble-manager";
import { useDispatch, useSelector } from "react-redux";
import { DeviceDetailsSlice } from "../../store/slices/DeviceDetails";
import { RootState } from "../../store/reducers";
import { hideLoader, showLoader } from "../../store/slices/loaderSlice";
import showToast from "../../utils/toastmessage";
import UUID from "../../utils/UUID";
import { cupName, serialKeyUpdate } from "../../store/slices/SerialKeySlice";
import { Buffer } from "buffer";

const SetUpDeviceController = ({ route }) => {
  const BleManagerModule = NativeModules.BleManager;
  const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

  const dispatch = useDispatch();
  const textInputRef1 = useRef();
  const textInputRef2 = useRef();
  const [deviceId, setDeviceId] = useState()

  const { data, key, renterDetailss } = useSelector((state: RootState) => ({
    data: state.devicedetails.data,
    key: state.SerialKey.key,
    renterDetailss: state.renter,
  }));

  console.log("data", data);
  console.log("key key", key);

  const { loading } = useSelector((state: RootState) => ({
    loading: state?.loader?.loading,
  }));

  useEffect(()=>{
    dispatch(showLoader())
  },[])

  const [state, setState] = useState({
    cupName: "",
    newSerialkey: "",
    focused1: false,
    focused2: false,
  });

  useEffect(() => {
    const handleDisconnectedPeripheral = (data) => {
      console.log("Device disconnected", data.peripheral);
    };

    let stopListener = bleManagerEmitter.addListener(
      "BleManagerStopScan",
      () => {
        // setScanning(false);
        console.log("stopListener");
        handleGetConnectedDevices();
      }
    );

    const disconnectListener = bleManagerEmitter.addListener(
      "BleManagerDisconnectPeripheral",
      handleDisconnectedPeripheral
    );

    // Cleanup listeners on component unmount
    return () => {
      disconnectListener.remove();
      stopListener.remove();
    };
  }, []);

  useEffect(() => {
    BleManager.start({ showAlert: false })
      .then(() => {
        // Success code
        console.log("Module initialized");
      })
      .catch((error) => {
        console.log("BleManager.start", error);
      });
  }, []);

  useEffect(() => {
    BleManager.enableBluetooth()
      .then(() => {
        requestPermission()
        // startScanning()
        // Success code
        console.log("The bluetooth is already enabled or the user confirm")
      })
      .catch((error) => {
        // Failure code
        console.log("The user refuse to enable bluetooth");
      });
  }, []);

  const startScanning = () => {
    BleManager.scan([], 10, false).then(() => {
        console.log("scan started");
      }).catch((error) => {
        console.log("startScanning", error);
      })
  };

  const requestPermission = async () => {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        // PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
      ]);
      console.log("granted", granted);

      if (granted) {
        startScanning();
      }
    } catch (error) {
      console.log("requestPermission error");
    }
  };

  const handleGetConnectedDevices = () => {
    BleManager.getDiscoveredPeripherals()
      .then((result: any) => {
        if (result.length === 0) {
          console.log("No devices found");
          dispatch(hideLoader());
        } else {
          const allDevices = result.filter((item: any) => item.name !== null);

          const deviceData = allDevices?.filter(
            (item: any) => item.name === route?.params?.deviceName
          );
          console.log("deviceData", JSON.stringify(deviceData));
            if(deviceData?.length > 0){
              setDeviceId(deviceData[0]?.id)
              deviceConnect(deviceData[0]?.id);
            }
            else{
              dispatch(hideLoader());
              goBack()
            }
          
        }
      })
      .catch((error) => {
        console.log("error getDiscoveredPeripherals", error);
      });
  };

  const deviceConnect = async (deviceId) => {
    await BleManager.connect(deviceId)
      .then((deviceconnect) => {
        console.log("deviceconnect", deviceconnect);
        // dispatch(DeviceDetailsSlice(deviceId));
        // dispatch(hideLoader())
        //if connected successfully, stop the previous set timer.
        // clearTimeout(failedToConnectTimer);
      })
      .catch((error) => {console.log("connect error", error)
      goBack()
    }
      );

    //before connecting, ensure if app is already connected to device or not.
    let isConnected = await isDeviceConnected(deviceId);
    if (isConnected) {
      try {
        const peripheralInformation = await BleManager.retrieveServices(
          deviceId
        );
        console.log("retrieveServices successfully");
      } catch (error) {
        console.log("peripheralInformation error", error);
      }

      try {
        await BleManager.startNotification(
          deviceId,
          UUID.NotifyCharacteristics.serviceUUID,
          UUID.NotifyCharacteristics.characteristicUUID
        );

        console.log("notification starting");
        dispatch(hideLoader());
        showToast("Bluetooth device has connected successfully", "success");
      } catch (error) {
        console.log("startNotification", error);
      }
    }
  };

  const isDeviceConnected = async (deviceId: string) => {
    const deviceCOnnected = await BleManager.isPeripheralConnected(deviceId);
    console.log("deviceCOnnected", deviceCOnnected);
    return await BleManager.isPeripheralConnected(deviceId);
  };
  const handleChange = (name, value) => {
    setState(() => ({ ...state, [name]: value }));
  };

  const backPress = () => {
    // BleManager.disconnect(data)
    //   .then((deviceDisconnect) => {
    //     console.log("deviceDisconnect", data);
    //     console.log("disconnected");
    //     dispatch(serialKeyUpdate(''));
    //   })
    //   .catch((error) => {
    //     console.log("onDisconnect error", error);
    //   });
    goBack();
  };

  const buttonPress = async () => {
    if (state?.cupName === "") {
      showToast("Please enter cup name", "danger");
      return;
    }

    if (state?.newSerialkey === "") {
      showToast("Please enter serial key", "danger");
      return;
    }

    if (state?.newSerialkey?.length !== 3) {
      showToast("Serial key must be 3 digits", "danger");
      return;
    }

    // dispatch(serialKeyUpdate(state?.newSerialkey));
    //   dispatch(cupName(state?.cupName))
    // console.log('SetUpDeviceController button press')
    navigate('MasterKey', {newSerialKey : state.newSerialkey, cupName : state?.cupName, deviceId : deviceId})

    // const buffer1 = Buffer.from(`12300000${state.newSerialkey}00000`);
    // // console.log("buffer1", buffer1.toJSON().data);

    // try {
    //   const response = await BleManager.write(
    //     data,
    //     UUID.SetMasterOrOwnerCode.serviceUUID,
    //     UUID.SetMasterOrOwnerCode.characteristicUUID, 
    //     buffer1.toJSON().data // Data to write (byte array)
    //   );
    //   console.log('SetMasterOrOwnerCode response', response)
    //   dispatch(serialKeyUpdate(state?.newSerialkey));
    //   dispatch(cupName(state?.cupName))
    // // goBack()
    // navigate('MasterKey', {newSerialKey : state.newSerialkey})
    // } catch (error) {
    //   console.log('SetMasterOrOwnerCode error',error)
    // }
  };

  const onFocus1 = () => {
    setState(() => ({ ...state, focused1: true }));
  };

  const onFocus2 = () => {
    setState(() => ({ ...state, focused2: true }));
  };

  const onBlur1 = () => {
    setState(() => ({ ...state, focused1: false }));
  };

  const onBlur2 = () => {
    setState(() => ({ ...state, focused2: false }));
  };
  return (
    <SetUpDeviceView
      backPress={backPress}
      values={state}
      handleChange={handleChange}
      buttonPress={buttonPress}
      loading={loading}
      textInputRef1={textInputRef1}
      textInputRef2={textInputRef2}
      onFocus1={onFocus1}
      onFocus2={onFocus2}
      onBlur1={onBlur1}
      onBlur2={onBlur2}
    />
  );
};

export default SetUpDeviceController;

const styles = StyleSheet.create({});
