import {
  FlatList,
  NativeEventEmitter,
  NativeModules,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import BleManager, { BleState } from "react-native-ble-manager";
import RippleEffect from "../../components/RippleEffect";
import { colors } from "../../utils/colors";
import { FlatListIndicator } from "@fanchenbao/react-native-scroll-indicator";

const ConnectDevice = () => {
  const [isScanning, setScanning] = useState(false);
  const [bleDevices, setBleDevices] = useState([]);

  const BleManagerModule = NativeModules.BleManager;
  const BleManagerEmitter = new NativeEventEmitter(BleManagerModule);
  const [currentDevice, setCurrentDevice] = useState<any>(null);

  const MAX_CONNECT_WAITING_PERIOD = 5000;
  const serviceReadinIdentifier = "";
  const charNotificationIdentifier = "";
  const connectedDeviceId = useRef("");

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
        requestPermission();
        // Success code
        console.log("The bluetooth is already enabled or the user confirm");
      })
      .catch((error) => {
        // Failure code
        console.log("The user refuse to enable bluetooth");
      });
  }, []);

  useEffect(() => {
    let stopListener = BleManagerEmitter.addListener(
      "BleManagerStopScan",
      () => {
        setScanning(false);
        console.log("stopListener");
        handleGetConnectedDevices();
      }
    );

    let disconnected = BleManagerEmitter.addListener(
      "BleManager DIsconnect Peripheral",
      (peripheral) => {
        console.log("disconnected", peripheral);
      }
    );

    let charactersticValueUpdate = BleManagerEmitter.addListener(
      "BLEManagerdisupdateValueForCharacterstic",
      (data) => {
        console.log("charactersticValueUpdate", data);
        readCharacteristicFromEvent(data);
      }
    );

    let bleManagerDidUpdateState = BleManagerEmitter.addListener(
      "bleManagerDidUpdateState",
      (data) => {
        console.log("bleManagerDidUpdateState", data);
      }
    );

    return () => {
      stopListener.remove();
      disconnected.remove();
      charactersticValueUpdate.remove();
      bleManagerDidUpdateState.remove();
    };
  }, []);

  const requestPermission = async () => {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      // PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      // PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
    ]);
    console.log("granted", granted);

    if (granted) {
      startScanning();
    }
  };

  const startScanning = () => {
    if (!isScanning) {
      BleManager.scan([], 10, false)
        .then(() => {
          console.log("scan started");
          setScanning(true);
        })
        .catch((error) => {
          console.log("startScanning", error);
        });
    }
  };

  const handleGetConnectedDevices = () => {
    BleManager.getDiscoveredPeripherals()
      .then((result: any) => {
        // success code
        // console.log("getDiscoveredPeripherals",JSON.stringify( result ));
        // console.log('length',result?.length )
        if (result.length === 0) {
          console.log("No devices found");
          // startScanning()
        } else {
          // console.log("RESULTS", JSON.stringify(result));
          const allDevices = result.filter((item: any) => item.name !== null);
          setBleDevices(allDevices);
        }
      })
      .catch((error) => {
        console.log("error getDiscoveredPeripherals", error);
      });
  };

  const enableBluetooth = async () => {
    //before connecting try to enable bluetooth if not enabled already
    console.log('enableBluetooth', await BleManager.checkState() === BleState.Off)
    if (
      Platform.OS === "android" &&
      (await BleManager.checkState()) === BleState.Off
    ) {
      try {
        await BleManager.enableBluetooth().then(() =>
          console.info("Bluetooth is enabled")
        );
        //go ahead to connect to the device.
        return true;
      } catch (e) {
        console.error("Bluetooth is disabled");
        //prompt user to enable bluetooth manually and also give them the option to navigate to bluetooth settings directly.
        return false;
      }
    } else if (
      Platform.OS === "ios" &&
      (await BleManager.checkState()) === BleState.Off
    ) {
      //For ios, if bluetooth is disabled, don't let user connect to device.
      return false;
    }
    return true
  };

  const isDeviceConnected = async (deviceId: string) => {
    const deviceCOnnected = await BleManager.isPeripheralConnected(deviceId);
    // console.log('deviceCOnnected', deviceCOnnected)
    return await BleManager.isPeripheralConnected(deviceId);
  };

  // const onConnect = async (item) => {
  //   console.log('onConnect', item)
  //   try {
  //     await BleManager.connect(item.id);
  //     setCurrentDevice(item);

  //     const result = await BleManager.retrieveServices(item.id);
  //     // console.log("onConnect result", result);
  //     // console.log("services", result?.services);
  //     // console.log("characterstics", result?.characteristics);
  //     onServiceDiscovered(result, item);
  //   } catch (error) {
  //     console.log("onConnect error", error);
  //   }
  // };

  const onServiceDiscovered = (result, item) => {
    const services = result.services;
    // console.log('services', services)
    const characterstics = result.characteristics;
    console.log("characterstics", JSON.stringify(characterstics));
    services.forEach((service) => {
      // console.log('fserviceirst', service)
      const serviceUUID = service.uuid;

      onChangeCharacterstics(serviceUUID, characterstics, item);
    });
  };

  const onChangeCharacterstics = (serviceUUID, characterstics, item) => {
    // console.log('onChangeCharacterstics',JSON.stringify( characterstics ))
    characterstics?.forEach((characterstic) => {
      const characteristicsUDID = characterstic.characteristic;
      // console.log('characteristicsUDID', characteristicsUDID)
      const serviceUUID__ = characterstic.service;
      // console.log('serviceUUID__', serviceUUID__)
      //   if (characteristicsUDID === "00002a01-0000-1000-8000-00805f9b34fb") {
      //     readCharacteristic(characteristicsUDID, serviceUUID, item)
      // }

      if (characteristicsUDID?.includes === "2a01") {
        readCharacteristic(characteristicsUDID, serviceUUID, item);
      }

      // if(characteristicsUDID==="00002a19-0000-1000-8000-00805f9b34fb")
      // {
      //   const serviceUUID__ = characterstic.service;
      //   // console.log('characteristicsUDID', characteristicsUDID)

      //   if (characteristicsUDID) {
      //     BleManager.startNotification(
      //       item.id,
      //       serviceUUID__,
      //       characteristicsUDID
      //     ).then(() => {
      //       console.log("notification started");
      //     }).catch(error =>{
      //       console.log('notification error', error)
      //     });
      //   }
      // }
    });
  };

  const readCharacteristic = (
    characteristicUUID: any,
    serviceUUID: any,
    item: any
  ) => {
    console.log("CURRENT DEVICE ID:::", item?.id);

    BleManager.read(item.id, serviceUUID, characteristicUUID)
      .then((result) => {
        if (characteristicUUID === "2a01") {
          console.log("CHARACTERISTIC " + characteristicUUID, result);
          extractDeviceName(result);
        }
      })
      .catch((error) => {
        console.error("Error during BLE read:", error);
      });
  };

  const extractDeviceName = (valueArray: any) => {
    const deviceName = bytesToString(valueArray);
    console.log("DEVICE NAME", deviceName);
  };

  const bytesToString = (bytes: any) => {
    return String.fromCharCode(...bytes);
  };

  const renderItem = ({ item, index }: any) => {
    return (
      <View style={styles.bleCard}>
        <Text style={styles.bleText}>{item.name}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={async () =>
            // onConnect(item)
            {
            currentDevice === item?.id
                ? onDisconnect(item)
                : await connect(item);
            }
            
          }
        >
          <Text style={styles.btnText}>
            {currentDevice === item?.id ? "Disconnect" : "Connect"}
            {/* Connect */}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
  const readCharacteristicFromEvent = (data) => {
    const { service, characteristic, value } = data;

    if (characteristic) {
      const temperature = byteToString(value);
    }
  };

  const byteToString = (bytes) => {
    return String.fromCharCode(...bytes);
  };

  const onDisconnect = (item) => {
    BleManager.disconnect(currentDevice)
      .then(() => {
        setCurrentDevice(null);
        console.log("disconnected");
      })
      .catch((error) => {
        console.log("onDisconnect error", error);
      });
  };

  const connect = (item): Promise<boolean> => {
    // deviceId: string,
    const deviceId = item?.id
    return new Promise<boolean>(async (resolve, reject) => {
      
      let failedToConnectTimer: NodeJS.Timeout;
      

      //For android always ensure to enable the bluetooth again before connecting.
      const isEnabled = await enableBluetooth();
      
      if (!isEnabled) {
        //if blutooth is somehow off, first prompt user to turn on the bluetooth
        return resolve(false);
      }

      //before connecting, ensure if app is already connected to device or not.
      let isConnected = await isDeviceConnected(deviceId);

      if (!isConnected) {
        //if not connected already, set the timer such that after some time connection process automatically stops if its failed to connect.
        failedToConnectTimer = setTimeout(() => {
          return resolve(false);
        }, MAX_CONNECT_WAITING_PERIOD);

        await BleManager.connect(deviceId).then(() => {
          //if connected successfully, stop the previous set timer.
          clearTimeout(failedToConnectTimer);
        });
        // isConnected = await isConnected(deviceId);
      }

      if (!isConnected) {
        //now if its not connected somehow, just close the process.
        return resolve(false);
      } else {
        //Connection success
        connectedDeviceId.current = deviceId;

        //get the services and characteristics information for the connected hardware device.
        const peripheralInformation = await BleManager.retrieveServices(
          deviceId
        );

        // console.log('peripheralInformation', JSON.stringify( peripheralInformation ))

        /**
         * Check for supported services and characteristics from device info
         */
        const deviceSupportedServices = (
          peripheralInformation.services || []
        ).map((item) => item?.uuid?.toUpperCase());
        const deviceSupportedCharacteristics = (
          peripheralInformation.characteristics || []
        ).map((_char) => _char.characteristic.toUpperCase());
        // console.log('deviceSupportedServices', deviceSupportedServices)
        // console.log('deviceSupportedCharacteristics', deviceSupportedCharacteristics)
        // if (
        //   !deviceSupportedServices.includes(serviceReadinIdentifier) ||
        //   !deviceSupportedCharacteristics.includes(charNotificationIdentifier)
        // ) {
        //   //if required service ID and Char ID is not supported by hardware, close the connection.
        //   isConnected = false;
        //   await BleManager.disconnect(connectedDeviceId.current);
        //   return reject(
        //     "Connected device does not have required service and characteristic."
        //   );
        // }
        setCurrentDevice(deviceId)

        await BleManager.startNotification(
          deviceId,
          // serviceReadinIdentifier,
          "180F",
          // charNotificationIdentifier
          "2A19"
        )
          .then(async (response) => {
            console.log(
              "Started notification successfully on ",
            );
            await BleManager.read(deviceId, "180F", "2A19").then((response)=>{
              console.log('read notification response',JSON.stringify( response))
              extractDeviceName(response);
              
            }).catch(error =>{
              console.log('read notification error', error)
            })
          })
          .catch(() => {
            isConnected = false;
            BleManager.disconnect(connectedDeviceId.current);
            return reject(
              "Failed to start notification on required service and characteristic."
            );
          });

        let disconnectListener = BleManagerEmitter.addListener(
          "BleManagerDisconnectPeripheral",
          () => {
            //addd the code to execute after hardware disconnects.
            if (connectedDeviceId.current) {
              BleManager.disconnect(connectedDeviceId.current);
            }
            disconnectListener.remove();
          }
        );

        return resolve(isConnected);
      }
    }
    );
  };

  return (
    <View style={styles.container}>
      {isScanning ? (
        <View style={styles.rippleView}>
          <RippleEffect />
        </View>
      ) : (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <FlatList
            data={bleDevices}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
          />

          {/* <FlatListIndicator
          flatListProps={{
            // ItemSeparatorComponent: () => (
            //   <View style={{width: 1, backgroundColor: 'blue'}} />
            // ),
            data: [
              'Druid',
              'Sorceress',
              'Paladin',
              'Barbarian',
              'Necromancer',
              'Assassin',
              'Amazon',
            ],
            renderItem: ({item}) => (
              <View style={{justifyContent: 'center', padding: 10}}>
                <Text>{item}</Text>
              </View>
            ),
          }}
          horizontal={true}
          // position="bottom"
          // indStyle={{width: 30}}
          containerStyle={{borderWidth: 1, borderColor: 'black'}}
        /> */}
        </View>
      )}
    </View>
  );
};
export default ConnectDevice;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bleCard: {
    width: "80%",
    padding: 10,
    alignSelf: "center",
    marginVertical: 10,
    backgroundColor: colors.secondary,
    elevation: 5,
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rippleView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bleText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  btnText: {
    fontSize: 20,
    fontWeight: "700",
  },
  button: {
    width: 100,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
});
