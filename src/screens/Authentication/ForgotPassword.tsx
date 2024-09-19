import {
  Image,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { Colors } from "../../Constants/Colors";
import { heightPercentage } from "../../utils/Scaling";
import { RFValue } from "react-native-responsive-fontsize";
import { FONTS } from "../../Constants/Fonts";
import CustomTextInput from "../../Custom Components/CustomTextInput";
import CustomButton from "../../Custom Components/CustomButton";
import { goBack, navigate } from "../../utils/NavigationUtil";
import Icon from "react-native-vector-icons/MaterialIcons";
import { validateEmail } from "../../utils/ValidationUtils";
import showToast from "../../utils/toastmessage";
import { forgotPassword } from "../../api";
import CustomHeader from "../../Custom Components/CustomHeader";

const ForgotPassword = () => {
  // const [email, setEmail] = useState("");
  const [state, setState] = useState({ email: "" });

  const handleChange = (name, value) => {
    setState(() => ({ ...state, [name]: value }));
  };

  const buttonPress = async (text) => {
    if (text == "Confirm") {
      if (!validateEmail(state?.email)?.result) {
        showToast(validateEmail(state?.email)?.msg, "danger");
        return;
      }
      const response = await forgotPassword(state?.email);
      if (response?.status == 200) {
        showToast(response?.message, "success");
        navigate("Login");
      } else {
        showToast(response?.data?.message, "danger");
      }

      // navigate('Login')
    } else {
      goBack();
    }
  };
  return (
    <ScrollView
      style={styles.mainContainer}
    >
      <TouchableOpacity style={styles.backIconContainer}>
      <CustomHeader onPress={() => buttonPress("")} text={""} />
      </TouchableOpacity>
     

      <Image
        source={require("../../assets/images/coffeecup.png")}
        style={styles.logoImage}
      />
      <Text style={styles.text}>Forgot Your Password?</Text>

      <View style={styles.footerContainer}>
        <Text style={styles.emailText}>Enter Email Address</Text>
        <CustomTextInput
          value={state?.email}
          setValue={(text) => handleChange("email", text)}
          borderWidth={true}
          backgroundColor={true}
          placeHolder={''}
          style={{}}
        />
        <CustomButton
          text={"Confirm"}
          backgroundColor={Colors.black}
          textColor={Colors.white}
          onPress={() => buttonPress("Confirm")}
          style={{}}
        />

        <CustomButton
          text={"Back"}
          backgroundColor={Colors.white}
          textColor={Colors.black}
          onPress={() => buttonPress("")}
          style={{}}
        />
      </View>
    </ScrollView>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.magnolia,
    paddingHorizontal: 10,
  },
  logoImage: {
    alignSelf: "center",
    marginTop: heightPercentage("15"),
    width:150,
    height:150,
  },
  text: {
    alignSelf: "center",
    marginTop: 20,
    fontSize: RFValue(22),
    letterSpacing: 0.5,
    fontFamily: FONTS.wsSemibold,
    color: Colors.black,
  },
  footerContainer: {
    marginTop: heightPercentage("7"),
    gap: 14,
    paddingHorizontal: 11,
  },
  backIcon: {
    color: Colors.black,
  },
  backIconContainer: {
    paddingHorizontal: 10,
    marginTop: 10,
  },
  emailText: {
    letterSpacing: 0.9,
    fontSize: RFValue(14),
    fontFamily: FONTS.WsMedium,
  },
});
