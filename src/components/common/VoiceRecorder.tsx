import React, { useState } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import clsx from 'clsx';

interface VoiceRecorderProps {
  onTranscript: (text: string) => void;
  onError: (error: string) => void;
  language?: string;
  className?: string;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  onTranscript,
  onError,
  language = 'ka-GE',
  className = ''
}) => {
  const [localError, setLocalError] = useState<string | null>(null);
  
  const { 
    isRecording, 
    startRecording, 
    stopRecording, 
    isSupported 
  } = useSpeechRecognition({
    onTranscript: (text) => {
      setLocalError(null);
      onTranscript(text);
    },
    onError: (error) => {
      setLocalError(error);
      onError(error);
    },
    language
  });

  if (!isSupported) {
    return (
      <div className="text-sm text-gray-500">
        Speech recognition is not supported in this browser
      </div>
    );
  }

  return (
    <div className={clsx('flex flex-col items-center', className)}>
      <button
        onClick={() => {
          if (isRecording) {
            stopRecording();
          } else {
            setLocalError(null);
            startRecording();
          }
        }}
        className={clsx(
          'p-3 rounded-lg transition-colors text-white',
          isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-primary/90'
        )}
        title={isRecording ? 'Stop recording' : 'Start recording'}
      >
        {isRecording ? (
          <MicOff className="w-5 h-5" />
        ) : (
          <Mic className="w-5 h-5" />
        )}
      </button>

      {localError && (
        <div className="mt-2 text-sm text-red-500 text-center">
          {localError}
        </div>
      )}

      {isRecording && !localError && (
        <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <span>Recording...</span>
        </div>
      )}
    </div>
  );
};