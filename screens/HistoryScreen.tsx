import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BigButton from '../components/BigButton';

type HistoryItem = { id: string; className: string; time: number; meta?: string };

const sample: HistoryItem[] = [
  { id: '1', className: 'Chair', time: Date.now() - 60 * 1000 },
  { id: '2', className: 'Door', time: Date.now() - 120 * 1000 },
];

export default function HistoryScreen() {
  const nav = useNavigation();
  const [items] = useState<HistoryItem[]>(sample);

  return (
    <View style={styles.container}>
      <Text style={styles.h1} accessibilityRole="header">Detection History</Text>
      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <View style={styles.item} accessible accessibilityLabel={`${item.className}, detected ${new Date(item.time).toLocaleString()}`}>
            <Text style={styles.itemTitle}>{item.className}</Text>
            <Text style={styles.itemTime}>{new Date(item.time).toLocaleString()}</Text>
          </View>
        )}
        ListEmptyComponent={<Text>No detections yet</Text>}
      />
      <BigButton label="Back" onPress={() => nav.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  h1: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  item: { paddingVertical: 12, borderBottomWidth: 1, borderColor: '#eee' },
  itemTitle: { fontSize: 16, fontWeight: '600' },
  itemTime: { color: '#666', marginTop: 4 }
});
