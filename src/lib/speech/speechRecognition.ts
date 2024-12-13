import { SPEECH_CONFIG } from './config';

export class SpeechRecognitionService {
  private recognition: SpeechRecognition | null = null;
  private isWebSpeechSupported: boolean;

  constructor() {
    this.isWebSpeechSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    if (this.isWebSpeechSupported) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
    }
  }

  startRecording(options: {
    onResult: (text: string) => void;
    onError: (error: string) => void;
    language?: string;
  }): void {
    if (!this.recognition) {
      options.onError('Speech recognition is not supported in this browser');
      return;
    }

    try {
      this.recognition.lang = options.language || SPEECH_CONFIG.defaults.languageCode;
      
      this.recognition.onresult = (event) => {
        const result = event.results[event.results.length - 1];
        if (result.isFinal) {
          options.onResult(result[0].transcript);
        }
      };

      this.recognition.onerror = (event) => {
        if (event.error === 'not-allowed') {
          options.onError('Microphone access denied. Please check your permissions.');
        } else if (event.error === 'no-speech') {
          // Ignore no-speech errors as they're common and not critical
          return;
        } else {
          options.onError(`Speech recognition error: ${event.error}`);
        }
      };

      this.recognition.start();
    } catch (error) {
      options.onError('Failed to start recording');
    }
  }

  stopRecording(): void {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (error) {
        console.error('Error stopping recognition:', error);
      }
    }
  }

  isSupported(): boolean {
    return this.isWebSpeechSupported;
  }
}