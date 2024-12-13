import { useState, useCallback, useRef, useEffect } from 'react';
import { SpeechRecognitionService } from '../lib/speech/speechRecognition';

interface UseSpeechRecognitionProps {
  onTranscript: (text: string) => void;
  onError: (error: string) => void;
  language?: string;
}

export const useSpeechRecognition = ({
  onTranscript,
  onError,
  language = 'ka-GE'
}: UseSpeechRecognitionProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const speechService = useRef(new SpeechRecognitionService());

  useEffect(() => {
    return () => {
      if (isRecording) {
        speechService.current.stopRecording();
      }
    };
  }, [isRecording]);

  const startRecording = useCallback(() => {
    try {
      speechService.current.startRecording({
        onResult: (text) => {
          if (text.trim()) {
            onTranscript(text.trim());
          }
        },
        onError,
        language
      });
      setIsRecording(true);
    } catch (error) {
      onError('Failed to start recording');
      setIsRecording(false);
    }
  }, [onTranscript, onError, language]);

  const stopRecording = useCallback(() => {
    speechService.current.stopRecording();
    setIsRecording(false);
  }, []);

  return {
    isRecording,
    startRecording,
    stopRecording,
    isSupported: speechService.current.isSupported()
  };
};