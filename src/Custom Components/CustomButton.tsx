import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { FONTS } from "../Constants/Fonts";

const CustomButton = ({ text, backgroundColor, textColor, onPress, style }) => {
  return (
    <TouchableOpacity
      style={[styles.mainContainer,style, { backgroundColor: backgroundColor }]}
      onPress={onPress}
    >
      <Text style={[styles.text, { color: textColor }]}>{text}</Text>
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  mainContainer: {
    // borderWidth: 1,
    padding:12,
    borderRadius: 10,
  },
  text: {
    fontFamily: FONTS.wsSemibold,
    alignSelf: "center",
    fontWeight: "600",
  },
});
