import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { FONTS } from "../Constants/Fonts";
import { Colors } from "../Constants/Colors";
import { RFValue } from "react-native-responsive-fontsize";

const TouchableText = ({ text, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
};

export default TouchableText;

const styles = StyleSheet.create({
  text: {
    fontFamily: FONTS.wsSemibold,
    color: Colors.midGrey,
    fontSize: RFValue(15),
    alignSelf: "flex-end",
  },
});
