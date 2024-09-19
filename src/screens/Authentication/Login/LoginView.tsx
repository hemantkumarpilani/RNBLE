import {
  Image,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useState } from "react";
import { Colors } from "../../../Constants/Colors";
import { heightPercentage, normalizeHeight } from "../../../utils/Scaling";
import { RFValue } from "react-native-responsive-fontsize";
import { FONTS } from "../../../Constants/Fonts";
import CustomTextInput from "../../../Custom Components/CustomTextInput";
import CustomButton from "../../../Custom Components/CustomButton";
import TouchableText from "../../../Custom Components/TouchableText";
import { navigate, resetAndNavigate } from "../../../utils/NavigationUtil";
import {
  validateEmail,
  validatePasswordEntry,
} from "../../../utils/ValidationUtils";
import showToast from "../../../utils/toastmessage";
import { login } from "../../../api";
import { useDispatch } from "react-redux";
import { setAccessToken } from "../../../store/slices/login";

const LoginView = ({
  values,
  handleChange,
  buttonPress,
  textPress,
  textInputRef1,
  textInputRef2,
  onFocus1,
  onFocus2,
  onBlur1,
  onBlur2,
}) => {
  return (
    <ScrollView
      style={styles.mainContainer}
      automaticallyAdjustKeyboardInsets={true}
    >
      <Image
        source={require("../../../assets/images/coffeecup.png")}
        style={styles.logoImage}
      />

      <Text
        style={[
          styles.heading,
          {
            marginTop: 10,
          },
        ]}
      >
        Welcome to Secure Cup
      </Text>
      <Text
        style={[
          styles.heading,
          {
            marginTop: 3,
          },
        ]}
      >
        Login to continue
      </Text>

      <View style={styles.footerContainer}>
        <Text style={styles.text}>Email </Text>
        <CustomTextInput
          ref={textInputRef1}
          value={values?.email}
          setValue={(text) => handleChange("email", text)}
          onFocus={onFocus1}
          onBlur={onBlur1}
          borderWidth={values?.focused1 ? true : false}
          blurOnSubmit={false}
          backgroundColor={true}
          placeHolder={""}
          onSubmitEditing={() => {
            textInputRef2?.current?.focus();
          }}
          returnKeyType="next"
          style={{}}
        />
        <Text style={styles.text}>Password</Text>
        <CustomTextInput
          ref={textInputRef2}
          value={values?.password}
          setValue={(text) => handleChange("password", text)}
          onFocus={onFocus2}
          onBlur={onBlur2}
          secureTextEntry={true}
          borderWidth={values?.focused2 ? true : false}
          blurOnSubmit={true}
          backgroundColor={true}
          placeHolder={""}
          returnKeyType="done"
          style={{}}
        />
        <TouchableText text={"Forgot Password?"} onPress={() => textPress()} />
        <CustomButton
          text={"Sign In"}
          backgroundColor={Colors.black}
          textColor={Colors.white}
          onPress={() => buttonPress("Sign in")}
          style={{}}
        />
        <CustomButton
          text={"Sign Up"}
          backgroundColor={Colors.titanWhite}
          textColor={Colors.black}
          onPress={() => buttonPress("Sign up")}
          style={{}}
        />
        <CustomButton
          text={"I am a renter"}
          backgroundColor={Colors.black}
          textColor={Colors.white}
          onPress={() => buttonPress("I am Renter")}
          style={{}}
        />
        <Text style={styles.lastText}>v 0.0.2</Text>
      </View>
    </ScrollView>
  );
};

export default LoginView;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.titanWhite,
  },
  logoImage: {
    alignSelf: "center",
    width: 150,
    height: 150,
    marginTop: 20,
  },
  heading: {
    alignSelf: "center",
    fontSize: RFValue(17),
    fontFamily: FONTS.wsSemibold,
    color: Colors.black,
  },
  footerContainer: {
    padding: 25,
    gap: 15,
  },
  text: {
    fontFamily: FONTS.wsSemibold,
    color: Colors.midGrey,
    fontSize: RFValue(15),
  },
  lastText: {
    alignSelf: "center",
    fontWeight: "bold",
    fontFamily: FONTS.Number,
    color: Colors.black,
  },
});
