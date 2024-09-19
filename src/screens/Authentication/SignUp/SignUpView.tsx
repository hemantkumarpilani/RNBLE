import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { Colors } from "../../../Constants/Colors";
import Icon from "react-native-vector-icons/MaterialIcons";
import { RFValue } from "react-native-responsive-fontsize";
import { FONTS } from "../../../Constants/Fonts";
import PasswordConditions from "../../../Custom Components/PasswordConditions";
import CustomTextInput from "../../../Custom Components/CustomTextInput";
import CustomButton from "../../../Custom Components/CustomButton";

const SignUpView = ({
  values,
  handleChange,
  buttonPress,
  backIconPress,
  textInputRef1,
  textInputRef2,
  textInputRef3,
  textInputRef4,
  onFocus1,
  onFocus2,
  onFocus3,
  onFocus4,
  onBlur1,
  onBlur2,
  onBlur3,
  onBlur4
}) => {
  return (
    <ScrollView
      contentContainerStyle={styles.mainContainer}
      keyboardShouldPersistTaps={"always"}
      keyboardDismissMode="none"
    >
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backIconContainer} onPress={() => backIconPress()}>
          <Icon
            name={"arrow-back-ios"}
            style={styles.backIcon}
            size={RFValue(30)}
          />
        </TouchableOpacity>
        <Text style={styles.signUpText}>Sign Up</Text>
      </View>

      <Image
        source={require("../../../assets/images/coffeecup.png")}
        style={styles.logoImage}
      />
      <View style={styles.footerContainer}>
        <PasswordConditions />
        <Text style={styles.common}>Full name</Text>
        <CustomTextInput
          ref={textInputRef1}
          onFocus={onFocus1}
          onBlur={onBlur1}
          borderWidth={values?.focused1 ? true : false}
          blurOnSubmit={false} 
          value={values?.name}
          setValue={(text) => handleChange("name", text)}
          backgroundColor={true}
          placeHolder={""}
          onSubmitEditing={()=>{textInputRef2?.current?.focus()}}
          returnKeyType="next"
          style={{}}
        />

        <Text style={styles.common}>Email</Text>
        <CustomTextInput
          ref={textInputRef2}
          onFocus={onFocus2}
          onBlur={onBlur2}
          borderWidth={values?.focused2 ? true : false}
          blurOnSubmit={false} 
          value={values?.email}
          setValue={(text) => handleChange("email", text)}
          backgroundColor={true}
          placeHolder={""}
          returnKeyType="next"
          onSubmitEditing={()=>{textInputRef3?.current?.focus()}}
          style={{}}
        />

        <Text style={styles.common}>Password</Text>
        <CustomTextInput
          ref={textInputRef3}
          onFocus={onFocus3}
          onBlur={onBlur3}
          borderWidth={values?.focused3 ? true : false}
          blurOnSubmit={false} 
          value={values?.password}
          setValue={(text) => handleChange("password", text)}
          backgroundColor={true}
          placeHolder={""}
          returnKeyType="next"
          onSubmitEditing={()=>{textInputRef4?.current?.focus()}}
          style={{}}
        />

        <Text style={styles.common}>Confirm password</Text>
        <CustomTextInput
          ref={textInputRef4}
          onFocus={onFocus4}
          onBlur={onBlur4}
          borderWidth={values?.focused4 ? true : false}
          blurOnSubmit={true} 
          value={values?.confirmPassword}
          setValue={(text) => handleChange("confirmPassword", text)}
          backgroundColor={true}
          returnKeyType="done"
          placeHolder={""}
          style={{}}
        />

        <CustomButton
          text={"Continue"}
          backgroundColor={Colors.black}
          textColor={Colors.white}
          onPress={() => buttonPress()}
          style={{}}
        />
      </View>
    </ScrollView>
  );
};

export default SignUpView;

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: Colors.titanWhite,
    paddingBottom: 20,
  },
  backIcon: {
    color: Colors.black,
  },
  headerContainer: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    flexDirection: "row",
  },
  signUpText: {
    width: "90%",
    textAlign: "center",
    textAlignVertical: "center",
    letterSpacing: 1,
    fontSize: RFValue(20),
    color: Colors.DavyGrey,
    fontFamily: FONTS.WsRegualr,
  },
  logoImage: {
    alignSelf: "center",
    marginTop: 20,
    width:150,
    height:150,
  },
  footerContainer: {
    paddingHorizontal: 22,
    marginTop: 20,
    gap: 10,
  },
  common: {
    fontFamily: FONTS.wsSemibold,
    fontSize: RFValue(15),
  },
  backIconContainer:{
    left:10
  }
});
