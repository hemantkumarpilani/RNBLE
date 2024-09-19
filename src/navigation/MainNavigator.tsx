import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { mergedStacks } from './ScreenCollection'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useSelector } from 'react-redux'
import { RootState } from '../store/reducers'

const Stack = createNativeStackNavigator()
const MainNavigator = () => {
  const {access_token} = useSelector(
    (state: RootState) => ({
      access_token : state.login.access_token
    })
  ); 
  console.log('access_token', access_token)
  // let acces_token;
  // useEffect(()=>{
  //   const getAccessToekn = async ()=>{
  //      acces_token = await AsyncStorage.getItem('access-token')
  //      console.log('acces_token', acces_token)
  //   }
  //   getAccessToekn()
  // }, [acces_token])
  
  return (
   <Stack.Navigator screenOptions={{
    headerShown:false
   }} 
   initialRouteName={access_token ? 'HomeScreen' : 'Login'} 
   >
    {mergedStacks.map((item, index)=>{
        return(
            <Stack.Screen 
            key={index}
            name={item.name}
            component={item.component}
            />
        )
    })}
    
   </Stack.Navigator>
  )
}

export default MainNavigator

const styles = StyleSheet.create({})