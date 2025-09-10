import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { APP_NAME } from '../utils/constants';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

export default function SplashScreen({ navigation }: Props) {
  useEffect(() => {
    const t = setTimeout(() => navigation.replace('Permissions'), 1200);
    return () => clearTimeout(t);
  }, [navigation]);

  return (
    <View style={styles.container} accessible accessibilityRole="image" accessibilityLabel={`${APP_NAME} logo`}>
      <Text style={styles.title}>{APP_NAME}</Text>
      <Text style={styles.subtitle}>Accessible indoor visual assistant</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
  title: { fontSize: 36, fontWeight: '800' },
  subtitle: { marginTop: 10, fontSize: 14, color: '#444' },
});
