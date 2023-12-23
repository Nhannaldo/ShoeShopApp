import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import  HomeScreen  from '../screens/HomeScreen';
import {Login}  from '../screens/Login';
import BottomTabs from './BottomTabs';
import Details from '../screens/Details';
import Description from '../screens/Description';
import SignUp from '../screens/SignUp';
import Search from '../screens/Search';
import Category from '../screens/Category';
import  {ChangePassword}  from '../screens/ChangePassword';
import CheckOut from '../screens/CheckOut';
import Review from '../screens/Review';
const Stack = createStackNavigator();

function AppStack() {
  return (

    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown:false}} initialRouteName='Login'>
        <Stack.Screen name='Login' component={Login}/>
        <Stack.Screen name='SignUp' component={SignUp}/>
        <Stack.Screen name="HomeScreen" component={BottomTabs} />
        <Stack.Screen name="Details" component={Details} />
        <Stack.Screen name="Description" component={Description} />
        <Stack.Screen name="Search" component={Search} /> 
        <Stack.Screen name="Category" component={Category} /> 
        <Stack.Screen name="ChangePassword" component={ChangePassword} /> 
        <Stack.Screen name="CheckOut" component={CheckOut} /> 
        <Stack.Screen name="Review" component={Review} /> 
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppStack;