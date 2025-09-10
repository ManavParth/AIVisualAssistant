import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Linking } from 'react-native';
import BigButton from '../components/BigButton';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { checkMultiple, requestMultiple, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { Platform } from 'react-native';

type Props = NativeStackScreenProps<RootStackParamList, 'Permissions'>;

export default function PermissionsScreen({ navigation }: Props) {
  const [granted, setGranted] = useState(false);

  useEffect(() => {
    checkPermissions();
  }, []);

  async function checkPermissions() {
    const perms = [
      Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA,
      Platform.OS === 'ios' ? PERMISSIONS.IOS.MICROPHONE : PERMISSIONS.ANDROID.RECORD_AUDIO,
    ];
    const res = await checkMultiple(perms);
    const ok = Object.values(res).every(v => v === RESULTS.GRANTED);
    setGranted(ok);
  }

  async function requestPermissions() {
    const perms = [
      Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA,
      Platform.OS === 'ios' ? PERMISSIONS.IOS.MICROPHONE : PERMISSIONS.ANDROID.RECORD_AUDIO,
    ];
    const res = await requestMultiple(perms);
    const ok = Object.values(res).every(v => v === RESULTS.GRANTED);
    setGranted(ok);
    if (ok) navigation.replace('Camera');
    else {
      // open app settings so user can enable permanently if denied
      Linking.openSettings();
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.h1} accessibilityRole="header">Camera & Microphone permissions</Text>
      <Text style={styles.p}>We need camera access to detect objects and microphone access for optional voice commands.</Text>

      <BigButton
        label={granted ? 'Open Camera' : 'Grant Permissions'}
        hint={granted ? 'Go to camera' : 'Grant camera and microphone permissions'}
        onPress={() => (granted ? navigation.replace('Camera') : requestPermissions())}
      />

      <BigButton
        label="Settings"
        hint="Open device settings for this app"
        onPress={() => Linking.openSettings()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center' },
  h1: { fontSize: 22, fontWeight: '700', marginBottom: 10 },
  p: { textAlign: 'center', marginBottom: 20, color: '#444' }
});
