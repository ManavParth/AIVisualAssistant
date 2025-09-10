import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';

export default function AccessibleSwitch({ label, value, onValueChange }: { label: string; value: boolean; onValueChange: (v: boolean) => void }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Switch accessibilityLabel={label} value={value} onValueChange={onValueChange} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 8 },
  label: { fontSize: 16 }
});
