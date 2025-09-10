import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import Slider from '@react-native-community/slider';
import BigButton from '../components/BigButton';
import { useNavigation } from '@react-navigation/native';
import { speakIfAllowed } from '../services/TtsHaptic';
import AccessibleSwitch from '../components/AccessibleSwitch';
import Tts from 'react-native-tts';

export default function SettingsScreen() {
  const nav = useNavigation();
  const [rate, setRate] = useState(0.45);
  const [verbose, setVerbose] = useState(true);
  const [largeText, setLargeText] = useState(false);

  function applyRate(r: number) {
    setRate(r);
    Tts.setDefaultRate(r);
    speakIfAllowed('Speech rate set', true);
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.h1, largeText && styles.large]}>Accessibility Settings</Text>

      <Text style={styles.label}>Speech rate</Text>
      <Slider
        minimumValue={0.2}
        maximumValue={1.0}
        value={rate}
        onValueChange={applyRate}
        accessibilityLabel="Speech rate"
      />

      <AccessibleSwitch label="Verbose announcements" value={verbose} onValueChange={setVerbose} />
      <AccessibleSwitch label="Large text" value={largeText} onValueChange={setLargeText} />

      <BigButton label="Back" onPress={() => nav.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  h1: { fontSize: 22, fontWeight: '700', marginBottom: 20 },
  label: { marginTop: 10, marginBottom: 6 },
  large: { fontSize: 28 }
});
