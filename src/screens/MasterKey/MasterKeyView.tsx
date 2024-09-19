import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import React from "react";
import CustomHeader from "../../Custom Components/CustomHeader";
import { Colors } from "../../Constants/Colors";
import { RFValue } from "react-native-responsive-fontsize";
import { FONTS } from "../../Constants/Fonts";
import CustomButton from "../../Custom Components/CustomButton";

const MasterKeyView = ({
  backPress,
  values,
  handleChange,
  ref1,
  ref2,
  ref3,
  submitPress
}) => {
  return (
    <ScrollView style={styles.container}>
      <CustomHeader onPress={backPress} text={"Hemant"} />

      <View style={styles.innnerContainer}>
        <Text style={styles.text}>
          Please enter the cup old code or the master code to update the device
          serial key
        </Text>
        <View style={styles.textInputs}>
          <TextInput
            ref={ref1}
            secureTextEntry={true}
            style={styles.textInput}
            value={values?.value1}
            onChangeText={(text) => handleChange("value1", text)}
            keyboardType="number-pad"
            maxLength={1}
          />
          <TextInput
            ref={ref2}
            secureTextEntry={true}
            style={styles.textInput}
            value={values?.value2}
            onChangeText={(text) => handleChange("value2", text)}
            keyboardType="number-pad"
            maxLength={1}
          />
          <TextInput
          secureTextEntry={true}
            ref={ref3}
            style={styles.textInput}
            value={values?.value3}
            onChangeText={(text) => handleChange("value3", text)}
            keyboardType="number-pad"
            maxLength={1}
          />

          
        </View>
        <CustomButton
            backgroundColor={Colors?.black}
            text={"Submit"}
            textColor={Colors?.white}
            onPress={submitPress}
            style={{marginTop :50}}
          />
      </View>
    </ScrollView>
  );
};

export default MasterKeyView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.titanWhite,
    paddingHorizontal: 20,
  },
  innnerContainer: {
    padding: 30,
    gap: 50,
    marginTop:50
  },
  text: {
    fontSize: RFValue(17),
    fontFamily: FONTS.wsSemibold,
  },
  textInput: {
    borderWidth: 1,
    textAlign:'center',
    fontSize:RFValue(20),
    width: "20%",
    alignItems: "center",
    paddingVertical: 30,
    backgroundColor: Colors.platinum,
  },
  textInputs: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
});
