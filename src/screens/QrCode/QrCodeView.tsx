import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import QRCodeScanner from 'react-native-qrcode-scanner';
import { navigate } from '../../utils/NavigationUtil';

const QrCodeView = ({screenName}) => {
  return (
    <View style={styles.mainContainer}>
    <QRCodeScanner
      onRead={(event) => {
        console.log("barcode event", JSON.stringify (event));
        // connectDevice()
        navigate("RenterScreen",  { deviceName: event?.data });
      }}
      // flashMode={RNCamera.Constants.FlashMode.torch}
      reactivate={true}
      reactivateTimeout={500}
      showMarker={true}
      // topContent={
      //   <Text style={styles.centerText}>
      //     Go to{' '}
      //     <Text style={styles.textBold}>wikipedia.org/wiki/QR_code</Text> on
      //     your computer and scan the QR code.
      //   </Text>
      // }
      // bottomContent={
      //   <TouchableOpacity style={styles.buttonTouchable}>
      //     <Text style={styles.buttonText}>OK. Got it!</Text>
      //   </TouchableOpacity>
      // }
    />
  </View>
  )
}

export default QrCodeView

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
      },
})