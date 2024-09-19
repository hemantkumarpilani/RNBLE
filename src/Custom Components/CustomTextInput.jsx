import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import React, { forwardRef } from "react";
import { Colors } from "../Constants/Colors";
import Eye from "react-native-vector-icons/Entypo";
import { RFValue } from "react-native-responsive-fontsize";

const CustomTextInput = forwardRef(
  (
    {
      value,
      setValue,
      borderWidth,
      backgroundColor,
      placeHolder,
      style,
      onSubmitEditing,
      returnKeyType,
      blurOnSubmit,
      onFocus,
      onBlur,
      keyboardType,
      maxLength,
      password,
      onPress,
      iconName,
      eyeIconPress,
      secureTextEntry,
      textAlign
    },
    ref
  ) => {
    return (
      <View style={styles.container}>
        <TextInput
          ref={ref}
          // onS
          textAlign={textAlign}
          placeholder={placeHolder}
          value={value}
          onFocus={onFocus}
          secureTextEntry={secureTextEntry}
          onBlur={onBlur}
          maxLength={maxLength ? maxLength : 50}
          blurOnSubmit={blurOnSubmit}
          keyboardType={keyboardType ? keyboardType : "default"}
          onChangeText={setValue}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          style={[
            styles.textInputConatiner,
            {
              borderWidth: borderWidth ? 1 : 0,
              backgroundColor: backgroundColor
                ? Colors.white
                : Colors?.titanWhite,
            },
            style,
          ]}
        />
        {password ? <TouchableOpacity
            style={styles.eyeContainer}
            onPress={eyeIconPress}
          >
            <Eye
              name={iconName}
              size={RFValue(20)}
              style={styles.eyeColor}
            />
          </TouchableOpacity> : null}
      </View>
    );
  }
);

export default CustomTextInput;

const styles = StyleSheet.create({
  container:{
    flexDirection:"row",
    justifyContent:'space-between',
    alignItems:'center'
  },
  textInputConatiner: {
    borderRadius: 10,
    width:'100%'
  },
  eyeContainer: {
    width:'10%',
    alignItems:"center",
    justifyContent:'center',
    right: 40,
    height: 48,
    // position:'absolute',
    // justifyContent:'center',
    // alignItems:'center'

  },
});
