import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
  Platform,
  NativeEventEmitter,
  NativeModules,
  PanResponder,
} from "react-native";
import React, { useEffect, useState } from "react";
import Icon from "react-native-vector-icons/AntDesign";
import { Colors } from "../../Constants/Colors";
import { RFValue } from "react-native-responsive-fontsize";
import { FONTS } from "../../Constants/Fonts";
import { heightPercentage, screenHeight } from "../../utils/Scaling";
import QRCodeScanner from "react-native-qrcode-scanner";
import { RNCamera } from "react-native-camera";
import { navigate } from "../../utils/NavigationUtil";
import Bluetooth from "react-native-vector-icons/Feather";
import CustomButton from "../../Custom Components/CustomButton";
import BleManager, { BleState } from "react-native-ble-manager";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/reducers";
import { showConfirmation } from "../../utils/Alert";
import { logout } from "../../api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setAccessToken } from "../../store/slices/login";
import { cupName, serialKeyUpdate } from "../../store/slices/SerialKeySlice";
import { DeviceDetailsSlice } from "../../store/slices/DeviceDetails";
import UUID from "../../utils/UUID";
import { Buffer } from "buffer";
import { useIsFocused } from "@react-navigation/native";
import Battery from "react-native-vector-icons/Feather";
import { deviceConnectionUpdate } from "../../store/slices/DeviceConnectSlice";

const HomeScreen = () => {
  const [openCamera, setOpenCamera] = useState(false);
  const BleManagerModule = NativeModules.BleManager;
  const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);
  const [batteryLevel, setBatteryLevel] = useState("0%");
  const isFocuesd = useIsFocused();

  const dispatch = useDispatch();

  const { data, serialkey, renterDetailss, cupNmae, deviceConnection } =
    useSelector((state: RootState) => ({
      data: state.devicedetails.data,
      serialkey: state.SerialKey.key,
      renterDetailss: state.renter,
      cupNmae: state.SerialKey.cupNmae,
      deviceConnection: state.deviceConnection.deviceConnect,
    }));

  console.log("deviceConnection", deviceConnection);

  useEffect(() => {
    const handleDisconnectedPeripheral = (data) => {
      console.log("Device disconnected", data.peripheral);
      if (data.peripheral) {
        dispatch(deviceConnectionUpdate(false));
      }
    };

    const disconnectListener = bleManagerEmitter.addListener(
      "BleManagerDisconnectPeripheral",
      handleDisconnectedPeripheral
    );

    // Cleanup listeners on component unmount
    return () => {
      disconnectListener.remove();
    };
  }, []);

  useEffect(() => {
    isDeviceConnected();
  }, [isFocuesd]);

  const isDeviceConnected = async () => {
    const deviceCOnnected = await BleManager.isPeripheralConnected(data);
    // console.log("deviceCOnnected", deviceCOnnected);
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
        setBatteryLevel(batteryLevel + "%");
      } catch (error) {}
    }
  };

  const scanQRCode = () => {
    console.log("scanQRCode", data);
    if (deviceConnection) {
      navigate("Renter");
    } else {
      setOpenCamera(true);
    }
  };

  const buttonPress = () => {
    BleManager.disconnect(data)
      .then((deviceDisconnect) => {
        console.log("deviceDisconnect", data);
        console.log("disconnected");
        // dispatch(serialKeyUpdate(""));
        // dispatch(DeviceDetailsSlice(""));
        // dispatch(cupName(""));
      })
      .catch((error) => {
        console.log("onDisconnect error", error);
      });
    console.log("home screen buttonPress");
  };
  const logoutPress = () => {
    console.log("logoutPress logoutPress");
    showConfirmation(
      "Confirm",
      "Are you sure you want to logout",
      "No",
      "Yes",
      async () => {
        const response = await logout();
        if (response?.status == 200) {
          dispatch(setAccessToken(""));
          navigate("Login");
        }
      },
      () => {
        console.log("cancel pressed");
      }
    );
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {},
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dx < -50) {
        console.log("onPanResponderRelease");
        dispatch(DeviceDetailsSlice(""));
      }
    },
  });

  // const swipeToDelete = () => {
  //   const panResponder = PanResponder.create({
  //     onStartShouldSetPanResponder: () => true,
  //     onMoveShouldSetPanResponder: () => true,
  //     onPanResponderMove: (_, gestureState) => {},
  //     onPanResponderRelease: (_, gestureState) => {
  //       console.log("onPanResponderRelease");
  //       if (gestureState.dx < -50) {
  //         // dispatch(DeviceDetailsSlice(""));
  //       }
  //     },
  //   });
  // };
  return (
    <>
      {openCamera ? (
        <View style={styles.mainContainer}>
          <QRCodeScanner
            onRead={(event) => {
              console.log("barcode event", JSON.stringify(event));
              setOpenCamera(false);
              // connectDevice()
              navigate("SetUpDevice", { deviceName: event?.data });
            }}
            // flashMode={RNCamera.Constants.FlashMode.torch}
            reactivate={true}
            reactivateTimeout={500}
            showMarker={true}
            // topContent={
            //   <Text style={styles.centerText}>
            //     Go to{' '}
            //     <Text style={styles.textBold}>wikipedia.org/wiki/QR_code</Text> on
            //     your computer and scan the QR code.
            //   </Text>
            // }
            // bottomContent={
            //   <TouchableOpacity style={styles.buttonTouchable}>
            //     <Text style={styles.buttonText}>OK. Got it!</Text>
            //   </TouchableOpacity>
            // }
          />
          {/* <TouchableOpacity style={styles.iconConainer} onPress={logoutPress}>
            <Icon name={"poweroff"} color={Colors.white} size={20} />
          </TouchableOpacity> */}
        </View>
      ) : data ? (
        <View
          style={[styles.mainContainer, { backgroundColor: Colors.titanWhite }]}
        >
          <View style={styles.headerContainer}>
            <Text style={styles.text}>Bluetooth Near By</Text>
            <TouchableOpacity
              style={styles.iconConainer}
              onPress={logoutPress}
              activeOpacity={1}
            >
              <Icon name={"poweroff"} color={Colors.white} size={20} />
            </TouchableOpacity>
          </View>

          {/* <View  {...panResponder.panHandlers} style={{ borderWidth: 1 }}>  {...panResponder.panHandlers}  */}
          <View
            style={{ flexDirection: "row" }}
            {...panResponder.panHandlers}
            pointerEvents="box-none"  
          >
            <TouchableOpacity
              // onStartShouldSetResponder={() => true}
              style={styles.container}
              onPressIn={(e) => {
                e.persist();
                e.stopPropagation(); // Ensure no conflict with outer pan responder
              }}          
              onPress={() => navigate("Renter")}
              // activeOpacity={1}
              // {...panResponder.panHandlers}
            >
              <View style={styles.bluetoothContainer}>
                <Bluetooth name={"bluetooth"} color={Colors.black} size={43} />
                <View>
                  <Text style={styles.nameText}>{cupNmae}</Text>
                  <Text style={styles.deviceId}>{data}</Text>
                </View>

                {deviceConnection && (
                  <CustomButton
                    text={"Disconnect"}
                    textColor={Colors.white}
                    backgroundColor={Colors.black}
                    // onPress={buttonPress}
                    onPress={(e) => {
                      e.stopPropagation(); // Prevent parent onPress from firing
                      buttonPress();
                    }}
                    style={{ paddingHorizontal: 10, left: 100 }}
                  />
                )}

                {/* <CustomButton
                text={"Disconnect"}
                textColor={Colors.white}
                backgroundColor={Colors.black}
                onPress={buttonPress}
                style={{ paddingHorizontal: 10, left: 100 }}
              /> */}
              </View>
              <View style={{ flexDirection: "row", marginTop: 10 }}>
                {deviceConnection ? (
                  <View style={styles.container1}>
                    <View style={styles.batteryContainer1}>
                      <View
                        style={[
                          styles.batteryFill,
                          {
                            width: batteryLevel,
                            backgroundColor: Colors.green,
                          },
                        ]}
                      />
                    </View>
                    <View style={styles.batteryCap} />
                  </View>
                ) : (
                  <Battery
                    name={"battery"}
                    style={styles.battery}
                    size={RFValue(25)}
                  />
                )}
                <Text style={styles.serialText}>Serial Key {serialkey}</Text>
              </View>
            </TouchableOpacity>
            <View style={styles.rowContainer}>
              {/* {deviceConnection ? (
                <View style={styles.container1}>
                  <View style={styles.batteryContainer1}>
                    <View
                      style={[
                        styles.batteryFill,
                        {
                          width: batteryLevel, 
                          backgroundColor: Colors.green,
                        },
                      ]}
                    />
                  </View>
                  <View style={styles.batteryCap} />
                </View>
              ) : (
                <Battery
                  name={"battery"}
                  style={styles.battery}
                  size={RFValue(25)}
                />
              )} */}

              {/* <Text style={styles.serialText}>Serial Key {serialkey}</Text> */}
              <Text
                style={[
                  styles.issuedText,
                  {
                    color: !renterDetailss?.filledRenterDetails
                      ? Colors?.green
                      : Colors?.black,
                  },
                ]}
              >
                {renterDetailss?.filledRenterDetails ? "Issued" : "Available"}
              </Text>
            </View>
          </View>

          {/* </View> */}

          <TouchableOpacity style={styles.footerContainer} onPress={scanQRCode}>
            <Text style={styles.footerText}>Scan QR Code To Connect</Text>
          </TouchableOpacity>

          {/* <View /> */}
        </View>
      ) : (
        <View
          style={[styles.mainContainer, { backgroundColor: Colors.titanWhite }]}
        >
          <View style={styles.headerContainer}>
            <Text style={styles.text}>Bluetooth Near By</Text>
            <TouchableOpacity style={styles.iconConainer} onPress={logoutPress}>
              <Icon name={"poweroff"} color={Colors.white} size={20} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.footerContainer} onPress={scanQRCode}>
            <Text style={styles.footerText}>Scan QR Code To Connect</Text>
          </TouchableOpacity>

          {/* <View /> */}
        </View>
      )}
    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  headerContainer: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  iconConainer: {
    backgroundColor: Colors.black,
    padding: 10,
    borderWidth: 1,
    alignSelf: "center",
    borderRadius: 10,
    left: 20,
  },
  text: {
    textAlignVertical: "center",
    letterSpacing: 1,
    fontSize: RFValue(20),
    left: 30,
    fontFamily: FONTS.WsMedium,
    color: Colors.black,
  },
  footerContainer: {
    width: "90%",
    borderWidth: 1,
    marginHorizontal: 13,
    paddingVertical: 13,
    borderRadius: 12,
    bottom: 0,
    marginBottom: 20,
    alignSelf: "center",
    position: "absolute",
  },
  footerText: {
    alignSelf: "center",
    fontFamily: FONTS.wsSemibold,
    fontSize: RFValue(18),
    color: Colors.black,
  },
  centerText: {
    fontSize: 18,
    padding: 32,
    color: "#777",
  },
  textBold: {
    fontWeight: "500",
    color: "#000",
  },
  buttonText: {
    fontSize: 21,
    color: "rgb(0,122,255)",
  },
  buttonTouchable: {
    padding: 16,
  },
  container: {
    paddingHorizontal: 10,
    width: "60%",
  },
  bluetoothContainer: {
    flexDirection: "row",
  },
  nameText: {
    fontFamily: FONTS.wsSemibold,
    fontSize: RFValue(15),
    color: Colors.black,
  },
  deviceId: {
    fontFamily: FONTS.WsMedium,
    fontSize: RFValue(13),
  },
  rowContainer: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
    justifyContent: "space-evenly",
  },
  image: {
    width: 30,
    height: 30,
    right: 35,
  },
  serialText: {
    textAlignVertical: "center",
    fontFamily: FONTS.WsSemiBoldItallic,
    fontSize: RFValue(15),
    left: 15,
  },
  issuedText: {
    textAlignVertical: "center",
    alignSelf: "center",
    marginLeft: 50,
    marginTop: 40,
    // left: 35,
    fontFamily: FONTS.WsSemiBoldItallic,
    // color: Colors.black,
    fontSize: RFValue(15),
  },
  batteryContainer: {
    right: 30,
    paddingHorizontal: 20,
    paddingVertical: 7,
    // backgroundColor:Colors.green
  },
  innerBatteryContainer: {
    borderWidth: 1,
    position: "absolute",
    paddingHorizontal: 20,
    paddingVertical: 15,
    // backgroundColor:Colors.green
  },
  container1: {
    flexDirection: "row",
    alignItems: "center",
    left: 3,
    // right: 30,
  },
  batteryContainer1: {
    width: 40, // Width of the battery container
    height: 25, // Height of the battery container
    borderWidth: 2,
    borderColor: "black",
    borderRadius: 4,
    position: "relative",
    backgroundColor: "transparent",
  },
  batteryFill: {
    height: "100%",
    borderRadius: 3,
  },
  batteryCap: {
    width: 5,
    height: 15,
    backgroundColor: "black",
    marginLeft: 2,
    borderRadius: 2,
  },
  batteryText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
  battery: {
    color: Colors.green,
    opacity: 0.5,
    // right: 22,
  },
});
