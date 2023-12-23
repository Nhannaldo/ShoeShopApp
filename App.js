import React from 'react';

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import AppStack from './src/navigations/StackNavigator';
import { MyContextControllerProvider } from './src/context';
export default function App(){
  return(
    <MyContextControllerProvider>
      <SafeAreaView style={{flex:1}}>
        <AppStack/>
      </SafeAreaView>
    </MyContextControllerProvider>
  )
}
