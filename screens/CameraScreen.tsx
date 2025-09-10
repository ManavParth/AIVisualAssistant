import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Camera, useCameraDevices, useFrameProcessor } from 'react-native-vision-camera';
import { scheduleOnRN } from 'react-native-worklets';
import DetectionOverlay from '../components/DetectionOverlay';
import { speakIfAllowed } from '../services/TtsHaptic';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';

// Placeholder for your detection method inside frameProcessor
// You'll need to replace this with actual frame processor detection e.g. vision-camera-image-labeler, mlkit, or custom plugin
const detectObjects = (frame: any): { label: string; confidence: number }[] => {
  // TODO: Implement object detection here.
  // For now, returns empty array
  return [];
};

// Define detection type as before
type Detection = {
  bbox: { x: number; y: number; width: number; height: number };
  className: string;
  confidence: number;
  id: string;
};

export default function CameraScreen() {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const devices = useCameraDevices();
  const device = devices.find(d => d.position === 'back');
  const camRef = useRef<Camera>(null);

  const [running, setRunning] = useState(false);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [hasPermission, setHasPermission] = useState(false);
  const [frameSize] = useState({ width: 720, height: 1280 });
  const lastSpokenId = useRef<string | null>(null);

  // Request camera & microphone permissions
  useEffect(() => {
    async function requestPermissions() {
      const cameraPermission = await Camera.requestCameraPermission();
      const microphonePermission = await Camera.requestMicrophonePermission();
      setHasPermission(cameraPermission === 'granted' && microphonePermission === 'granted');
    }
    requestPermissions();
  }, []);

  // JS handler for detected labels
  const onDetected = (objects: { label: string; confidence: number }[]) => {
    if (objects.length > 0) {
      const bestObject = objects[0];
      if (bestObject.label !== lastSpokenId.current) {
        lastSpokenId.current = bestObject.label;
        speakIfAllowed(bestObject.label);
      }
      setDetections(
        objects.map(obj => ({
          bbox: { x: 0, y: 0, width: 0, height: 0 }, // Placeholder box - replace if your detection provides bounding boxes
          className: obj.label,
          confidence: obj.confidence,
          id: obj.label,
        }))
      );
    } else {
      lastSpokenId.current = null;
      setDetections([]);
    }
  };

  // Frame processor calls your detection method; replace `detectObjects` with your actual logic
  const frameProcessor = useFrameProcessor(
    (frame) => {
      'worklet';
      const labels = detectObjects(frame);
      if (labels.length > 0) {
        scheduleOnRN(onDetected, labels);
      } else {
        scheduleOnRN(onDetected, []);
      }
    },
    []
  );

  useEffect(() => {
    if (hasPermission && device && !running) {
      setRunning(true);
      speakIfAllowed('Detection started', true);
    }
    if ((!hasPermission || !device) && running) {
      setRunning(false);
      speakIfAllowed('Detection stopped', true);
      setDetections([]);
    }
  }, [hasPermission, device]);

  if (!device || !hasPermission) {
    return (
      <View style={styles.center}>
        <Text>Loading Camera...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={camRef}
        style={styles.camera}
        device={device}
        isActive={running}
        frameProcessor={frameProcessor}
        video={false}
        photo={false}
      />
      <DetectionOverlay
        boxes={detections.map(d => ({
          ...d.bbox,
          className: d.className,
          confidence: d.confidence,
          id: d.id,
        }))}
        frameSize={frameSize}
      />
      <View style={styles.controls} accessibilityRole="toolbar">
        <TouchableOpacity
          accessible
          accessibilityRole="button"
          accessibilityLabel={running ? 'Stop detection' : 'Start detection'}
          onPress={() => {
            if (running) {
              setRunning(false);
              speakIfAllowed('Detection stopped', true);
              setDetections([]);
            } else {
              setRunning(true);
              speakIfAllowed('Detection started', true);
            }
          }}
          style={[styles.controlButton, running ? styles.stop : styles.start]}
        >
          <Text style={styles.controlText}>{running ? 'Stop' : 'Start'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          accessible
          accessibilityRole="button"
          accessibilityLabel="Settings"
          onPress={() => nav.navigate('Settings')}
          style={styles.controlButton}
        >
          <Text style={styles.controlText}>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity
          accessible
          accessibilityRole="button"
          accessibilityLabel="History"
          onPress={() => nav.navigate('History')}
          style={styles.controlButton}
        >
          <Text style={styles.controlText}>History</Text>
        </TouchableOpacity>
        <TouchableOpacity
          accessible
          accessibilityRole="button"
          accessibilityLabel="About"
          onPress={() => nav.navigate('About')}
          style={styles.controlButton}
        >
          <Text style={styles.controlText}>About</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  camera: { width: '100%', height: '100%', position: 'absolute' },
  controls: {
    position: 'absolute',
    bottom: 22,
    left: 12,
    right: 12,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  controlButton: { backgroundColor: 'rgba(0,0,0,0.6)', padding: 12, borderRadius: 10 },
  controlText: { color: '#fff', fontSize: 16 },
  start: { borderColor: '#0f0', borderWidth: 1 },
  stop: { borderColor: '#f00', borderWidth: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
