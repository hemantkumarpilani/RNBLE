import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/Ionicons'
import { Colors } from '../Constants/Colors'
import { FONTS } from '../Constants/Fonts'
import { RFValue } from 'react-native-responsive-fontsize'

const PasswordConditions = () => {
  return (
    <View style={styles.mainContainer}>      
        <View style={styles.container}>
        <Icon name={'information-circle'} size={20} color = {Colors.white} style={styles.icon}/>
        <View style={styles.textsContainer}>
            <Text style={styles.commonText}>The password must:</Text>
            <Text style={styles.commonText}>-Be atleast 8 characters long</Text>
            <Text style={styles.commonText}>-include at least one uppercase letter</Text>
            <Text style={styles.commonText}>-include at least one lowercase letter</Text>
            <Text style={styles.commonText}>-include at least one numeric digit</Text>
            <Text style={styles.commonText}>-include at least one special character</Text>
        </View>
      </View>
    </View>
  )
}

export default PasswordConditions

const styles = StyleSheet.create({
    mainContainer:{
        borderWidth:1,
    },
    container:{
        flexDirection:"row",
        backgroundColor:Colors.black
    },
    textsContainer:{
        borderWidth:1, 
        paddingHorizontal:10,
        paddingVertical:10
    },
    commonText:{
        color:Colors.white,
        fontFamily:FONTS.wsSemibold,
        fontSize:RFValue(13)
    },
    icon:{
        marginTop:65,
        marginLeft:10
    }
})