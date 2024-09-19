import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ConnectDevice from './src/screens/bluetooth/ConnectDevice'
import Navigation from './src/navigation/Navigation'
import { Provider } from 'react-redux'
import { persistor, store } from './src/store'
import { PersistGate } from 'redux-persist/integration/react'

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={true}>
      <Navigation/>
       {/* <ConnectDevice/> */}
      </PersistGate>

    </Provider>
 
  
  )
}

export default App

const styles = StyleSheet.create({})