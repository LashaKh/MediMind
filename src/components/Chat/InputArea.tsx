import React, { useState } from 'react';
import { Send, Mic, MicOff } from 'lucide-react';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import clsx from 'clsx';

interface InputAreaProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export const InputArea: React.FC<InputAreaProps> = ({ onSend, disabled }) => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  const { isRecording, startRecording, stopRecording, isSupported: isRecordingSupported } = 
    useSpeechRecognition({
      onTranscript: (text) => setMessage(text),
      onError: setError
    });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleToggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      setError(null);
      startRecording();
    }
  };

  return (
    <div className="border-t dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        {error && (
          <div className="mb-2 text-red-500 text-sm p-2 bg-red-50 dark:bg-red-900/20 rounded">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="flex gap-2">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            rows={1}
            disabled={disabled}
            className="flex-1 resize-none rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-3 focus:outline-none focus:ring-2 focus:ring-primary dark:text-white disabled:opacity-50"
          />
          
          {isRecordingSupported && (
            <button
              type="button"
              onClick={handleToggleRecording}
              disabled={disabled}
              className={clsx(
                'flex-shrink-0 rounded-lg px-4 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
                isRecording 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
              )}
            >
              {isRecording ? (
                <MicOff className="w-5 h-5 text-white" />
              ) : (
                <Mic className="w-5 h-5 text-gray-700 dark:text-white" />
              )}
            </button>
          )}

          <button
            type="submit"
            disabled={!message.trim() || disabled}
            className="flex-shrink-0 rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>

        {isRecording && (
          <div className="mt-2 flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-sm text-gray-500">Recording...</span>
          </div>
        )}
      </div>
    </div>
  );
};