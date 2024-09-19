
import {View, Text} from 'react-native';
import React from 'react';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useCustomTheme} from './Theme';
import { navigationRef } from '../utils/NavigationUtil';
import MainNavigator from './MainNavigator';
import FlashMessage from "react-native-flash-message";
import LoaderController from '../components/Loader/LoaderController';


const Stack = createNativeStackNavigator();
const Navigation = () => {
  const theme = useCustomTheme();
  const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: theme.colors.primary,
      background: theme.colors.background,
      card: theme.colors.card,
      text: theme.colors.text,
      border: theme.colors.border,
      notification: theme.colors.notification,
    },
  };

  return (
    <NavigationContainer ref={navigationRef} theme={MyTheme}>
      <MainNavigator/>
      <LoaderController/>
      <FlashMessage
      duration={2500}
      position={'top'}
      floating={true}
      animated={true}
      autoHide={true}
      />
    </NavigationContainer>
  );
};

export default Navigation;
