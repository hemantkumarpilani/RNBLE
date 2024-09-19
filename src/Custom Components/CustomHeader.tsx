import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Colors } from "../Constants/Colors";
import { RFValue } from "react-native-responsive-fontsize";
import { FONTS } from "../Constants/Fonts";

const CustomHeader = ({ onPress, text }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backIconContainer} onPress={onPress}>
        <Icon
          name={"arrow-back-ios"}
          style={styles.backIcon}
          size={RFValue(30)}
        />
      </TouchableOpacity>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

export default CustomHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginTop: 10,
    // paddingHorizontal:10,
  },
  backIconContainer: {
  },
  backIcon: {
    color: Colors.black,
  },
  text:{
    textAlign:"center",
    textAlignVertical:'center',
    width:'85%',
    fontFamily:FONTS.WsMedium,
    fontSize:RFValue(22),
    color:Colors.black
    
  }
});
