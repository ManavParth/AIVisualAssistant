import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import DetectionOverlay from '../components/DetectionOverlay';
import { detectionEmitter, startNativeDetection, stopNativeDetection, setDetectionFps, Detection } from '../services/NativeDetectionModule';
import { speakIfAllowed, vibrateShort } from '../services/TtsHaptic';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';

export default function CameraScreen() {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const devices = useCameraDevices();
  const device = devices.find(d => d.position === 'back');
  const camRef = useRef<Camera>(null);
  const [running, setRunning] = useState(false);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [hasPermission, setHasPermission] = useState(false);
  const [frameSize] = useState({ width: 720, height: 1280 });

  // Request Camera & Microphone Permissions
  useEffect(() => {
    async function requestPermissions() {
      const cameraPermission = await Camera.requestCameraPermission();
      const microphonePermission = await Camera.requestMicrophonePermission();

      if (cameraPermission !== 'granted') console.warn('Camera permission denied');
      if (microphonePermission !== 'granted') console.warn('Microphone permission denied');

      setHasPermission(cameraPermission === 'granted' && microphonePermission === 'granted');
    }
    requestPermissions();
  }, []);

  // Set detection FPS
  useEffect(() => {
    setDetectionFps(8);
  }, []);

  // Listen to native detection events
  const lastSpokenId = useRef<string | null>(null);
  useEffect(() => {
    const sub = detectionEmitter.addListener('onDetections', (payload: { detections: Detection[] }) => {
      if (!running) return;
      const incoming = payload.detections || [];
      setDetections(incoming);

      // Find the most confident detection above threshold
      const best = incoming
        .filter(d => d.confidence > 0.6)
        .sort((a, b) => b.confidence - a.confidence)[0];

      if (best && best.id !== lastSpokenId.current) {
        lastSpokenId.current = best.id;
        const direction = computeDirection(best.bbox);
        const distanceText = approximateDistance(best.bbox);
        speakIfAllowed(`${best.className}, ${distanceText}, ${direction}`);
        vibrateShort();
      }
    });

    return () => sub.remove();
  }, [running]);

  function computeDirection(bbox: Detection['bbox']) {
    const cx = bbox.x + bbox.width / 2;
    if (cx < 0.33) return 'to your left';
    if (cx > 0.66) return 'to your right';
    return 'in front of you';
  }

  function approximateDistance(bbox: Detection['bbox']) {
    const area = bbox.width * bbox.height;
    if (area > 0.12) return 'very close';
    if (area > 0.04) return 'near';
    return 'far';
  }

  function toggleDetection() {
    if (running) {
      stopNativeDetection();
      setRunning(false);
      speakIfAllowed('Detection stopped', true);
    } else {
      startNativeDetection();
      setRunning(true);
      speakIfAllowed('Detection started', true);
    }
  }

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
        isActive={true}
        video={false}
        photo={false}
      />
      <DetectionOverlay
        boxes={detections.map(d => ({ ...d.bbox, className: d.className, confidence: d.confidence, id: d.id }))}
        frameSize={frameSize}
      />
      <View style={styles.controls} accessibilityRole="toolbar">
        <TouchableOpacity
          accessible
          accessibilityRole="button"
          accessibilityLabel={running ? "Stop detection" : "Start detection"}
          onPress={toggleDetection}
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
  controls: { position: 'absolute', bottom: 22, left: 12, right: 12, flexDirection: 'row', justifyContent: 'space-around' },
  controlButton: { backgroundColor: 'rgba(0,0,0,0.6)', padding: 12, borderRadius: 10 },
  controlText: { color: '#fff', fontSize: 16 },
  start: { borderColor: '#0f0', borderWidth: 1 },
  stop: { borderColor: '#f00', borderWidth: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' }
});
