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
import CustomHeader from "../../Custom Components/CustomHeader";
import CustomButton from "../../Custom Components/CustomButton";
import { FONTS } from "../../Constants/Fonts";
import { RFValue } from "react-native-responsive-fontsize";
import UnlockIcon from "react-native-vector-icons/FontAwesome5";
import DownIcon from "react-native-vector-icons/AntDesign";
import CustomTextInput from "../../Custom Components/CustomTextInput";
import Eye from "react-native-vector-icons/Entypo";

const RenterView = ({
  backIconPress,
  resetPress,
  values,
  handleChange,
  assignPress,
  masterkey,
  unlockMug,
  renterDetailss,
  removePress,
}) => {
  return (
    <ScrollView style={styles.container}>
      <CustomHeader onPress={backIconPress} text={"Device Name"} />
      <View style={styles.imageButtonContainer}>
        <Image
          source={require("../../assets/images/coffeecup.png")}
          style={styles.image}
        />
        <CustomButton
          textColor={Colors.white}
          text={"RESET"}
          onPress={resetPress}
          backgroundColor={Colors.black}
          style={{
            height: 42,
            paddingHorizontal: 20,
            left: 40,
            top: 10,
            borderRadius: 20,
          }}
        />
      </View>
      <View style={styles.footerContainer}>
        <Text style={styles.cupText}>Cup Serial Key</Text>
        <View style={styles.hiddenKeyContainer}>
          <Text style={styles.numberText}>
            {values?.serialKeyHidden ? masterkey : "• • •"}
          </Text>
          <TouchableOpacity
            style={styles.eyeContainer}
            onPress={() =>
              handleChange("serialKeyHidden", !values?.serialKeyHidden)
            }
          >
            <Eye
              name={values?.serialKeyHidden ? "eye" : "eye-with-line"}
              size={RFValue(20)}
              style={styles.eyeColor}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.bigTextContainer} onPress={unlockMug}>
          <UnlockIcon name={"unlock-alt"} color={Colors.black} size={70} />
          <Text style={styles.unlockText}>Unlock Mug</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footerContainer1}>
        <View style={styles.rowContainer}>
          <Text style={styles.assignText}>Assign Renter</Text>
          <TouchableOpacity
            onPress={() =>
              handleChange(
                "renterDetailsFilledShown",
                !values?.renterDetailsFilledShown
              )
            }
          >
            <DownIcon
              name={"down"}
              size={20}
              color={Colors.black}
              style={styles.downIcon}
            />
          </TouchableOpacity>
        </View>
        {values?.renterDetailsFilledShown && (
          <View style={styles.textInputsContainer}>
            <CustomTextInput
              borderWidth={true}
              backgroundColor={false}
              value={renterDetailss?.name ? renterDetailss?.name : values?.name}
              setValue={(value) => handleChange("name", value)}
              placeHolder={"Enter Full Name"}
              style={{}}
            />
            <CustomTextInput
              borderWidth={true}
              backgroundColor={false}
              value={
                renterDetailss?.email ? renterDetailss?.email : values?.email
              }
              setValue={(value) => handleChange("email", value)}
              placeHolder={"Enter Email Address"}
              style={{}}
            />
            <CustomTextInput
              borderWidth={true}
              keyboardType={"numeric"}
              backgroundColor={false}
              value={
                renterDetailss?.phoneNumber
                  ? renterDetailss?.phoneNumber
                  : values?.phoneNumber
              }
              setValue={(value) => handleChange("phoneNumber", value)}
              placeHolder={"Enter Phone Number"}
              maxLength={10}
              style={{}}
            />
            <CustomTextInput
              borderWidth={true}
              secureTextEntry={values.renterSerialKeyHidden}
              backgroundColor={false}
              keyboardType={"numeric"}
              value={
                renterDetailss?.renterSerialKey
                  ? renterDetailss?.renterSerialKey  
                  : values?.serialKey
              }
              setValue={(value) => handleChange("serialKey", value)}
              placeHolder={"Enter 3 digit renter serial key"}
              maxLength={3}
              password = {true}
              iconName={values.renterSerialKeyHidden ? 'eye' : 'eye-with-line'}
              eyeIconPress={() => handleChange('renterSerialKeyHidden', !values.renterSerialKeyHidden)}
              style={{}}
            />

            <View style={{ alignSelf: "flex-end" }}>
              {renterDetailss?.filledRenterDetails ? (
                <CustomButton
                  text={"Remove"}
                  onPress={removePress}
                  backgroundColor={Colors.black}
                  textColor={Colors.white}
                  style={{ paddingVertical: 10, paddingHorizontal: 30 }}
                />
              ) : (
                <CustomButton
                  text={"Assign"}
                  onPress={assignPress}
                  backgroundColor={Colors.black}
                  textColor={Colors.white}
                  style={{ paddingVertical: 10, paddingHorizontal: 30 }}
                />
              )}
            </View>
          </View>
        )}
      </View>

      <Text></Text>
    </ScrollView>
  );
};

export default RenterView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.titanWhite,
    paddingHorizontal: 20,
  },
  image: {
    alignSelf: "center",
    width: 150,
    height: 150,
    left: 40,
  },
  imageButtonContainer: {
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "center",
  },
  cupText: {
    alignSelf: "center",
    fontFamily: FONTS.wsSemibold,
    color: Colors.black,
    fontSize: RFValue(16),
  },
  numberText: {
    left: 60,
    fontFamily: FONTS.WsRegualr,
    color: Colors.black,
    fontSize: RFValue(16),
  },
  footerContainer: {
    marginTop: 20,
  },
  bigTextContainer: {
    borderWidth: 1,
    borderRadius: 20,
    flexDirection: "row",
    padding: 40,
    justifyContent: "center",
    gap: 20,
    marginTop: 30,
  },
  unlockText: {
    textAlignVertical: "center",
    fontFamily: FONTS.wsSemibold,
    fontSize: RFValue(25),
    color: Colors.black,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerContainer1: {
    marginTop: 20,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    gap: 20,
  },
  downIcon: {
    top: 5,
  },
  assignText: {
    fontFamily: FONTS.wsSemibold,
    fontSize: RFValue(20),
    color: Colors.black,
  },
  textInputsContainer: {
    gap: 20,
  },
  hiddenKeyContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  eyeColor: {
    color: Colors.black,
  },
  eyeContainer: {
    left: 100,
  },
});
