import {
  ActivityIndicator,
  Image,
  PermissionsAndroid,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import CustomHeader from "../../Custom Components/CustomHeader";
import { Colors } from "../../Constants/Colors";
import CustomTextInput from "../../Custom Components/CustomTextInput";
import { FONTS } from "../../Constants/Fonts";
import { RFValue } from "react-native-responsive-fontsize";
import CustomButton from "../../Custom Components/CustomButton";
import BleManager, { BleState } from "react-native-ble-manager";
import LoaderController from "../../components/Loader/LoaderController";

const SetUpDeviceView = ({
  backPress,
  values,
  handleChange,
  buttonPress,
  loading,
  textInputRef1, textInputRef2, onFocus1, onFocus2, onBlur1, onBlur2
}) => {
  return (
    <ScrollView style={styles.mainContainer}>
      <CustomHeader text={"Setup Device"} onPress={backPress} />
      <Image
        source={require("../../assets/images/coffeecup.png")}
        style={styles.logoImage}
      />
      <View style={styles.container}>
        <Text style={styles.text}>Cup name</Text>
        <CustomTextInput
        placeHolder={'Enter Cup Name'}
        ref={textInputRef1}
        onFocus={onFocus1}
        onBlur={onBlur1}
        // borderWidth={values?.focused1 ? true : false}
        borderWidth={true}
        blurOnSubmit={false}
          backgroundColor={false}
          value={values?.cupName}
          setValue={(text) => handleChange("cupName", text)}
          onSubmitEditing={()=>{
            textInputRef2?.current?.focus()}}
          returnKeyType={'next'}
          placeholder={'Enter Cup Name'}
          style={{}}
        />
        <Text style={styles.text}>Set New Serial Key</Text>
        <CustomTextInput
        placeHolder={'Enter New Serial Key'}
        ref={textInputRef2}
          onFocus={onFocus1}
          onBlur={onBlur1}
          secureTextEntry={true}
          // borderWidth={values?.focused1 ? true : false}
          borderWidth={true}
          blurOnSubmit={true} 
          returnKeyType={'done'}
          keyboardType={'number-pad'}
          maxLength={3}
          backgroundColor={false}
          value={values?.newSerialkey}
          setValue={(text) => handleChange("newSerialkey", text)}
          style={{}}
        />
        <CustomButton
          text={"Submit"}
          backgroundColor={Colors.black}
          textColor={Colors.white}
          onPress={buttonPress}
          style={{paddingVertical:16}}
        />
      </View>
    </ScrollView>
  );
};

export default SetUpDeviceView;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.titanWhite,
    paddingHorizontal: 20,
  },
  logoImage: {
    alignSelf: "center",
    marginTop: 60,
    width:150,
    height:150,
  },
  container: {
    gap: 10,
    marginTop: 20,
  },
  text: {
    fontFamily: FONTS.WsRegualr,
    fontSize: RFValue(15),
    color: Colors.DavyGrey,
  },
});
