import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { Colors } from "../../Constants/Colors";
import Icon from "react-native-vector-icons/AntDesign";
import { FONTS } from "../../Constants/Fonts";
import { RFValue } from "react-native-responsive-fontsize";
import CustomTextInput from "../../Custom Components/CustomTextInput";
import UnlockIcon from "react-native-vector-icons/FontAwesome5";

const Renter1View = ({ logoutPress, handleChange, value, unlockMug, disconnectPress }) => {
  console.log('valuess', value)
  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={disconnectPress}>
        <Image
          source={require("../../assets/images/disconnect-removebg-preview.png")}
          style={styles.disconnect}
        />
        </TouchableOpacity>
       
        <TouchableOpacity style={styles.iconConainer} onPress={logoutPress}>
          <Icon name={"poweroff"} color={Colors.white} size={20} />
        </TouchableOpacity>
      </View>

      <View style={styles.container1}>
                {/* Battery outer case */}
                <View style={styles.batteryContainer1}>
                  {/* Battery fill */}
                  <View
                    style={[
                      styles.batteryFill,
                      {
                        width: value?.batteryLevel, // Dynamic width based on battery level
                        backgroundColor: Colors.green,
                      },
                    ]}
                  />
                </View>

                {/* Battery terminal */}
                <View style={styles.batteryCap} />
              </View>
      {/* <Image
        source={require("../../assets/images/power.png")}
        style={styles.image}
      /> */}
      <View style={styles.middleContainer}>
        <Image
          source={require("../../assets/images/coffeecup.png")}
          style={styles.logoImage}
        />
        <Text style={styles.text}>Cup Serial Key</Text>
        <CustomTextInput
       keyboardType={'numeric'} 
        secureTextEntry={true}
        textAlign={'center'}
        maxLength={3}
          placeHolder={"Enter 3 digits serial key"}
          borderWidth={true}
          value={value?.serialKey}
          setValue={(text)=>{handleChange('serialKey', text)}}
          style={{alignSelf : 'center', paddingHorizontal : 30, fontSize :RFValue(15)}}
          backgroundColor={false}
        />
      </View>

      <TouchableOpacity style={styles.bigTextContainer} onPress={unlockMug}>
          <UnlockIcon name={"unlock-alt"} color={Colors.black} size={70} />
          <Text style={styles.unlockText}>Unlock Mug</Text>
        </TouchableOpacity>
    </ScrollView>
  );
};

export default Renter1View;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.titanWhite,
    paddingHorizontal: 20,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 30,
  },
  iconConainer: {
    backgroundColor: Colors.black,
    padding: 10,
    borderWidth: 1,
    alignSelf: "center",
    borderRadius: 10,
  },
  disconnect: {
    width: 50,
    height: 50,
  },
  image: {
    width: 50,
    height: 50,
    marginTop: 30,
    // right: 35,
  },
  logoImage: {
    alignSelf: "center",
    width:150,
    height:150,
  },
  middleContainer: {
    gap: 20,
    marginTop: 20,
  },
  text: {
    alignSelf: "center",
    fontFamily: FONTS.wsSemibold,
    fontSize: RFValue(19),
    color: Colors.black,
  },
  bigTextContainer: {
    borderWidth: 1,
    borderRadius: 20,
    flexDirection: "row",
    padding: 25,
    justifyContent: "center",
    gap: 20,
    marginTop:40
  },
  unlockText: {
    textAlignVertical: "center",
    fontFamily: FONTS.wsSemibold,
    fontSize: RFValue(25),
    color: Colors.black,
  },
  container1: {
    flexDirection: "row",
    alignItems: "center",
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
});
