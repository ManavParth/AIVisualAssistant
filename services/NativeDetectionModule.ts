/**
 * NativeDetectionModule
 * - JS stub: the native module should emit 'onDetections' events with payload:
 *   { id: string, className: string, confidence: number, bbox: { x,y,width,height }, timestamp: number }
 *
 * Implementation notes:
 * - On Android implement a VisionCamera frame-processor using TFLite and when detection occurs emit events
 * - On iOS implement a similar frame processor with TFLite/Metal delegate
 */

import { NativeEventEmitter, NativeModules } from 'react-native';

const { DetectionNativeModule } = NativeModules as any;

export type Detection = {
  id: string;
  className: string;
  confidence: number;
  bbox: { x: number; y: number; width: number; height: number };
  timestamp: number;
};

export const detectionEmitter = new NativeEventEmitter(DetectionNativeModule || {});

export function startNativeDetection() {
  if (DetectionNativeModule && DetectionNativeModule.start) {
    DetectionNativeModule.start();
  }
}
export function stopNativeDetection() {
  if (DetectionNativeModule && DetectionNativeModule.stop) {
    DetectionNativeModule.stop();
  }
}
export function setDetectionFps(fps: number) {
  if (DetectionNativeModule && DetectionNativeModule.setFps) {
    DetectionNativeModule.setFps(fps);
  }
}
