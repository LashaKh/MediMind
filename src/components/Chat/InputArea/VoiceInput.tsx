import React, { useCallback } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { useSpeechRecognition } from '../../../hooks/useSpeechRecognition';
import { VoiceInputProps } from './types';

export const VoiceInput: React.FC<VoiceInputProps> = ({ onTranscript, disabled }) => {
  const handleError = useCallback((error: string) => {
    console.error('Speech recognition error:', error);
  }, []);

  const { isRecording, startRecording, stopRecording, isSupported } = useSpeechRecognition({
    onTranscript,
    onError: handleError,
    language: 'ka-GE'
  });

  if (!isSupported || disabled) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={() => {
        if (isRecording) {
          stopRecording();
        } else {
          startRecording();
        }
      }}
      disabled={disabled}
      className={`flex-shrink-0 rounded-lg px-4 py-2 transition-colors ${
        isRecording
          ? 'bg-red-500 text-white hover:bg-red-600'
          : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
      }`}
      title={isRecording ? 'Stop recording' : 'Start recording'}
    >
      {isRecording ? (
        <MicOff className="w-5 h-5" />
      ) : (
        <Mic className="w-5 h-5" />
      )}
    </button>
  );
};