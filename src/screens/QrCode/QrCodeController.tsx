import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import QrCodeView from './QrCodeView'

const QrCodeController = ({route}) => {
  console.log('QrCodeController', route)
  return (
   <QrCodeView screenName = {route?.params?.screenName}/>
  )
}

export default QrCodeController

const styles = StyleSheet.create({})