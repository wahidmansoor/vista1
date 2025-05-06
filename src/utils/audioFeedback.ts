/**
 * Audio Feedback Utility
 * 
 * Provides consistent audio feedback throughout the application.
 * Uses the Web Audio API to generate sounds for different user interactions.
 */

type SoundType = 'sort' | 'select' | 'error' | 'success' | 'warning';

/**
 * Plays a sound effect based on the specified type
 * @param type The type of sound to play
 */
export const playSound = (type: SoundType) => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Configure sound based on type
    switch (type) {
      case 'sort':
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4 note
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
        break;
      case 'select':
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(520, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.05);
        break;
      case 'success':
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(780, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.15);
        break;
      case 'warning':
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(320, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
        break;
      case 'error':
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(220, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
        break;
    }
  } catch (e) {
    console.warn('Audio feedback not supported', e);
  }
};

/**
 * Checks if audio feedback is supported in the current browser
 * @returns boolean indicating if audio is supported
 */
export const isAudioSupported = (): boolean => {
  return typeof window !== 'undefined' && 
         (typeof window.AudioContext !== 'undefined' || 
          typeof (window as any).webkitAudioContext !== 'undefined');
}; 