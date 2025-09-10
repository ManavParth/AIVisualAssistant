import Tts from 'react-native-tts';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

Tts.setDefaultRate(0.45);
Tts.setDefaultPitch(1.0);

let lastSpokenAt = 0;
const MIN_SPEAK_INTERVAL = 900; // ms

export function speakIfAllowed(text: string, force = false) {
  const now = Date.now();
  if (force || now - lastSpokenAt > MIN_SPEAK_INTERVAL) {
    lastSpokenAt = now;
    Tts.stop();
    Tts.speak(text);
  }
}

export function vibrateShort() {
  ReactNativeHapticFeedback.trigger('impactLight', { enableVibrateFallback: true });
}

export function vibrateMedium() {
  ReactNativeHapticFeedback.trigger('impactMedium', { enableVibrateFallback: true });
}
