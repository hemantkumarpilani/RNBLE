import {
  NativeEventEmitter,
  NativeModules,
  PermissionsAndroid,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import Renter1View from "./Renter1View";
import { goBack, navigate, resetAndNavigate } from "../../utils/NavigationUtil";
import { showConfirmation } from "../../utils/Alert";
import { useDispatch, useSelector } from "react-redux";
import { hideLoader, showLoader } from "../../store/slices/loaderSlice";
import BleManager, { BleState } from "react-native-ble-manager";
import { DeviceDetailsSlice } from "../../store/slices/DeviceDetails";
import showToast from "../../utils/toastmessage";
import UUID from "../../utils/UUID";
import { RootState } from "../../store/reducers";
import { Buffer } from "buffer";
import { cupName } from "../../store/slices/SerialKeySlice";
import { useIsFocused } from "@react-navigation/core";
import { renterDeviceConnect } from "../../store/slices/RenterSlice";

const Renter1Controller = ({ route }) => {
  const [state, setState] = useState({
    serialKey: "",
    batteryLevel: "0%",
  });

  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const BleManagerModule = NativeModules.BleManager;
  const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

  const { data, serialkey, renterDetailss, cupNmae, renterDeviceConnection } = useSelector(
    (state: RootState) => ({
      data: state.devicedetails.data,
      serialkey: state.SerialKey.key,
      renterDetailss: state.renter,
      cupNmae: state.SerialKey.cupNmae,
      renterDeviceConnection : state.renter.renterDeviceConnect
    })
  );

  console.log('hemant puneet',data)

  useEffect(() => {
    if(renterDeviceConnection == false){
      dispatch(showLoader())
    }
    else{
      isDeviceConnect(data)
    }
 
  }, []);

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

  useEffect(() => {}, []);

  useEffect(() => {
    if(renterDeviceConnection == false){
      BleManager.start({ showAlert: false })
      .then(() => {
        // Success code
        console.log("Module initialized");
      })
      .catch((error) => {
        console.log("BleManager.start", error);
      });
    }
    
  }, []);

  useEffect(() => {
    if(renterDeviceConnection == false){
      BleManager.enableBluetooth()
      .then(() => {
        requestPermission();
        // startScanning()
        // Success code
        console.log("The bluetooth is already enabled or the user confirm");
      })
      .catch((error) => {
        // Failure code
        console.log("The user refuse to enable bluetooth");
      });
    }
  
  }, []);

  const startScanning = () => {
    BleManager.scan([], 10, false)
      .then(() => {
        console.log("scan started");
      })
      .catch((error) => {
        console.log("startScanning", error);
      });
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
          if (deviceData?.length > 0) {
            dispatch(DeviceDetailsSlice(deviceData[0]?.id));
            deviceConnect(deviceData[0]?.id);
            dispatch(hideLoader());
          } else {
            dispatch(hideLoader());
            navigate('Login')
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
        // dispatch(hideLoader())
        //if connected successfully, stop the previous set timer.
        // clearTimeout(failedToConnectTimer);
      })
      .catch((error) => {
        console.log("connect error", error);
        goBack();
      });

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
        isDeviceConnect(deviceId);
      } catch (error) {
        console.log("startNotification", error);
      }
    }
  };

  const isDeviceConnected = async (deviceId: string) => {
    const deviceCOnnected = await BleManager.isPeripheralConnected(deviceId);
    console.log("deviceCOnnected", deviceCOnnected);
    showToast("Bluetooth device has connected successfully", "success");
    return await BleManager.isPeripheralConnected(deviceId);
  };

  const isDeviceConnect = async (data) => {
    const deviceCOnnected = await BleManager.isPeripheralConnected(data);
    // console.log("deviceCOnnected", deviceCOnnected);
    console.log('abhishek vaabhiav',deviceCOnnected )
    if (deviceCOnnected) {
      try {
        const response = await BleManager.read(
          data,
          UUID.BatteryLevel.serviceUUID,
          UUID.BatteryLevel.characteristicUUID
        );
        console.log("read notification response", JSON.stringify(response));

        const batteryLevel = Buffer.from(response, "base64").readUInt8(0);
        console.log("Battery level:", batteryLevel, "%");
        setState(() => ({ ...state, batteryLevel: batteryLevel + "%" }));
      } catch (error) {}
    }
  };

  const unlockMug = async () => {
    console.log("unlockMug");
    if(state?.serialKey === ''){
      showToast('Please enter serial key', 'danger')
      return
    }
    if (state?.serialKey === renterDetailss?.renterSerialKey) {
      const buffer1 = Buffer.from(`${state?.serialKey}00000`);
      try {
        const response = await BleManager.write(
          data,
          UUID.CupUnlock.serviceUUID,
          UUID.CupUnlock.characteristicUUID,
          buffer1.toJSON().data // Data to write (byte array)
        );
        console.log("unlockMug cup unlock response", response);
      } catch (error) {
        console.log("unlockMug cup unlock error", error);
      }
    }
    // checkBiometrics().then((bt)=>{
    //   console.log('checkBiometrics')
    //   handleBiometricVerification()
    //   setBiometricType(bt)
    // }).catch(error=>{
    //   console.log('error error', error)
    // })
    // const buffer1 = Buffer.from(masterkey);
    // try {
    //   const response = await BleManager.write(
    //     data,
    //     UUID.CupUnlock.serviceUUID,
    //     UUID.CupUnlock.characteristicUUID,
    //     buffer1.toJSON().data // Data to write (byte array)
    //   );
    //   console.log("unlockMug cup unlock response", response);
    // } catch (error) {
    //   console.log("unlockMug cup unlock error", error);
    // }
    else {
      showToast("Incorrect Password", "danger");
    }
  };

  const handleChange = (name, value) => {
    setState(() => ({ ...state, [name]: value }));
  };
  const logoutPress = () => {
    console.log("logoutPress");
    showConfirmation(
      "Logout",
      `Are you sure you want to logout? You won 't need to scan the QR code again and the cup will show in your app`,
      "CANCEL",
      "LOGOUT",
      () => {
        dispatch(renterDeviceConnect(true));
        navigate("Login");
      },
      ()=>{
        console.log('cancel pressed')
      }
    );
  };

  const disconnectPress = () => {
    console.log("disconnectPress");
    showConfirmation(
      "Disconnect Cup ?",
      `You will have to rescan the code again if you disconnect. Do you want to proceed ?`,
      "CANCEL",
      "DISCONNECT",
      () => {
        BleManager.disconnect(data)
          .then((deviceDisconnect) => {
            console.log("deviceDisconnect", data);
            console.log("disconnected");
            dispatch(renterDeviceConnect(false));
            resetAndNavigate("Login");
            // dispatch(DeviceDetailsSlice(''))
            // dispatch(cupName(''))
          })
          .catch((error) => {
            console.log("onDisconnect error", error);
          });
      },
      ()=>{
        console.log('cancel pressed')
      }
    );
  };
  return (
    <Renter1View
      logoutPress={logoutPress}
      value={state}
      handleChange={handleChange}
      unlockMug={unlockMug}
      disconnectPress={disconnectPress}
    />
  );
};

export default Renter1Controller;

const styles = StyleSheet.create({});
