import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type BBox = { x: number; y: number; width: number; height: number; className: string; confidence: number; id: string };

export default function DetectionOverlay({ boxes, frameSize }: { boxes: BBox[]; frameSize: { width: number; height: number } }) {
  if (!boxes || boxes.length === 0) return null;

  return (
    <View pointerEvents="none" style={styles.overlay}>
      {boxes.map(b => {
        const style = {
          left: b.x * frameSize.width,
          top: b.y * frameSize.height,
          width: b.width * frameSize.width,
          height: b.height * frameSize.height,
        };
        return (
          <View key={b.id} style={[styles.box, style]} accessible accessibilityLabel={`${b.className} detected with ${Math.round(b.confidence * 100)} percent confidence`}>
            <Text style={styles.label}>{b.className} · {Math.round(b.confidence * 100)}%</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 },
  box: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#00FF00',
    borderRadius: 6,
    overflow: 'hidden',
  },
  label: { backgroundColor: 'rgba(0,0,0,0.6)', color: '#fff', paddingHorizontal: 6, paddingVertical: 2, fontSize: 12 }
});
