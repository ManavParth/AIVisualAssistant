import React from 'react';
import { View, Text, StyleSheet, Linking } from 'react-native';
import BigButton from '../components/BigButton';
import { useNavigation } from '@react-navigation/native';

export default function AboutScreen() {
  const nav = useNavigation();
  return (
    <View style={styles.container}>
      <Text style={styles.h1}>About AIVisualAssistant</Text>
      <Text style={styles.p}>AIVisualAssistant announces common objects and provides directional feedback. This app is a research / assistive tool and does not replace certified mobility aids.</Text>
      <Text style={styles.p}>Privacy: Camera frames are processed on device by default. No images are uploaded without your consent.</Text>

      <Text style={[styles.link]} onPress={() => Linking.openURL('https://your-privacy-policy.example.com')}>Privacy Policy</Text>

      <BigButton label="Back" onPress={() => nav.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  h1: { fontSize: 22, fontWeight: '800', marginBottom: 10 },
  p: { marginBottom: 10, color: '#444' },
  link: { color: '#0B6EF6', textDecorationLine: 'underline', marginBottom: 20 }
});
