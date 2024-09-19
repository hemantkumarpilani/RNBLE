import { ActivityIndicator, Modal, Platform, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { screenHeight, screenWidth } from '../../utils/Scaling'

const LoaderView = (props) => {
  const {loading} = props
  return (
    <Modal visible={loading} animationType="none" transparent={true}>
    <View style={styles.mainView}>
        <ActivityIndicator color={'blue'} size={Platform.OS === 'ios' ? 'large' : 30} />
    </View>
</Modal>
  )
}

export default LoaderView

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: screenHeight,
    width: screenWidth,
    opacity: 0.6,
    backgroundColor: '#0000007c'
}
})