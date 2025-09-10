import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/SplashScreen';
import PermissionsScreen from '../screens/PermissionsScreen';
import CameraScreen from '../screens/CameraScreenOld';
import SettingsScreen from '../screens/SettingsScreen';
import HistoryScreen from '../screens/HistoryScreen';
import AboutScreen from '../screens/AboutScreen';

export type RootStackParamList = {
  Splash: undefined;
  Permissions: undefined;
  Camera: undefined;
  Settings: undefined;
  History: undefined;
  About: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Permissions" component={PermissionsScreen} />
      <Stack.Screen name="Camera" component={CameraScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="History" component={HistoryScreen} />
      <Stack.Screen name="About" component={AboutScreen} />
    </Stack.Navigator>
  );
}
