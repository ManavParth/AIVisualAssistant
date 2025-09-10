import React from 'react';
import { TouchableOpacity, Text, StyleSheet, AccessibilityProps } from 'react-native';

type Props = {
  label: string;
  onPress: () => void;
  hint?: string;
} & AccessibilityProps;

export default function BigButton({ label, onPress, hint }: Props) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={hint}
      accessible
      style={styles.button}
      onPress={onPress}
    >
      <Text style={styles.text}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#0B6EF6',
    paddingVertical: 16,
    paddingHorizontal: 22,
    borderRadius: 14,
    alignItems: 'center',
    marginVertical: 10,
    minWidth: 220,
  },
  text: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});
