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
import { Buffer } from "buffer";
import { bytesToString } from "convert-string";
import { TextEncoder } from 'text-encoding';

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
        // startScanning()
        requestPermission()
        // Success code
        console.log("The bluetooth is already enabled or the user confirm")
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

  // useEffect(() => {
  //   startScanning();
  // }, []);

  const requestPermission = async () => {
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
  };

  const startScanning = () => {
    if (!isScanning) {
      BleManager.scan([], 10, true)
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
    // console.log(
    //   "enableBluetooth",
    //   (await BleManager.checkState()) === BleState.Off
    // );
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
    return true;
  };

  const isDeviceConnected = async (deviceId: string) => {
    const deviceCOnnected = await BleManager.isPeripheralConnected(deviceId);
    console.log('deviceCOnnected', deviceCOnnected)
    return await BleManager.isPeripheralConnected(deviceId);
  };

  function addListener(peripheral, service, characteristic) {
    return new Promise(async (resolve, reject) => {
      let timeOutId: NodeJS.Timeout;
      const listener = BleManagerEmitter.addListener(
        "BleManagerDidUpdateValueForCharacteristic",
        ({ value, peripheral, characteristic, service }) => {
          clearTimeout(timeOutId);
          if (value.length !== 20) {
            /**
             * value is less than 20 bytes. Because more than 20 bytes not possible at once.
             * Either first chunk itself have less than 20 bytes data
             * or we have less than 20 bytes data at next chunks.
             */
            // Convert bytes array to string
            const data = bytesToString(value);
            console.log(
              `Received ${data} for characteristic ${characteristic}`
            );
            resolve(data);
          } else {
            //value is of exactly 20 bytes, schedule to resolve after 2 sec.
            //because we may recieve more data than 20 bytes
            //Convert bytes array to string
            const data = bytesToString(value);
            console.log(
              `Received ${data} for characteristic ${characteristic}`
            );
            timeOutId = setTimeout(() => {
              resolve(data);
            }, 2500);
          }
        }
      );
    });
  }

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

  // const bytesToString = (bytes: any) => {
  //   return String.fromCharCode(...bytes);
  // };

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
                :  connect(item);
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
      .then((deviceDisconnect) => {
        console.log("deviceDisconnect", currentDevice);
        setCurrentDevice(null);
        console.log("disconnected");
      })
      .catch((error) => {
        console.log("onDisconnect error", error);
      });
  };

  const connect = (item): Promise<boolean> => {
    // deviceId: string,
    const deviceId = item?.id;
    return new Promise<boolean>(async (resolve, reject) => {
      let failedToConnectTimer: NodeJS.Timeout;

      //For android always ensure to enable the bluetooth again before connecting.
      const isEnabled = await enableBluetooth()

      if (!isEnabled) {
        //if blutooth is somehow off, first prompt user to turn on the bluetooth
        return resolve(false);
      }

      await BleManager.connect(deviceId).then((deviceconnect) => {
        console.log('deviceconnect', deviceconnect)
        //if connected successfully, stop the previous set timer.
        // clearTimeout(failedToConnectTimer);
      }).catch(error => console.log('connect error', error));

      //before connecting, ensure if app is already connected to device or not.
      let isConnected = await isDeviceConnected(deviceId);

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
        setCurrentDevice(deviceId);

        await BleManager.startNotification(
          deviceId,
          // serviceReadinIdentifier,
          "18D0",
          // "6E400001-B5A3-F393-E0A9-E50E24DCCA9E",
          // charNotificationIdentifier
          "2D00"
          // "6E400003-B5A3-F393-E0A9-E50E24DCCA9E"
        )
          .then(async (response) => {
            console.log("Started notification successfully on ");
            // await BleManager.read(deviceId, "fefc0002-5251-4a6d-9703-71bbfdc60", "2A19").then((response)=>{
            //   console.log('read notification response',JSON.stringify( response))
              // extractDeviceName(response);

            // }).catch(error =>{
            //   console.log('read notification error', error)
            // })

            await BleManager.read(
              deviceId,
              // "fefc0002-5251-4a6d-9703-71bbfdc60f0b",
              '1800',
              // "fefc2a19-5251-4a6d-9703-71bbfdc60f0b"
              "2A00"
            )
              .then(async (response: any) => {
                console.log(
                  "read notification response",
                  JSON.stringify(response)
                );
                // extractDeviceName(response)
                const batteryLevel = Buffer.from(response, "base64").readUInt8(
                  0
                );
                console.log("Battery level:", batteryLevel, "%");

                const buffer1 = Buffer.from('12300000');
                console.log('buffer1', buffer1.toJSON().data)

                let serviceUdid = ''

                try {
                  peripheralInformation?.characteristics?.map((value)=>{
                    if(value?.characteristic === 'fefc0002-5251-4a6d-9703-71bbfdc60f0b'){
                      serviceUdid = value?.service
                    }
                  })

                  console.log('serviceUdid serviceUdid', serviceUdid)
                  const response = await BleManager.write(
                    deviceId,
                    serviceUdid, // Service UUID
                    "fefc0002-5251-4a6d-9703-71bbfdc60f0b",  // Characteristic UUID
                    buffer1.toJSON().data                  // Data to write (byte array)
                  );
                
                  console.log('First: Write successful');
                  console.log("BleManager.write response:", response);
                } catch (error) {
                  console.log('Second: Write failed');
                  console.log("BleManager.write error:", error);
                }

                extractDeviceName(response);
              })
              .catch((error) => {
                console.log("read notification error", error);
              });
          })
          .catch((error) => {
            isConnected = false;
            BleManager.disconnect(connectedDeviceId.current);
            console.log("error startNotification", error);
            // return reject(
            //   "Failed to start notification on required service and characteristic."
            // );
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
    });
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
