import React from 'react';
import { Send } from 'lucide-react';
import { VoiceInput } from './VoiceInput';
import { useMessageInput } from './useMessageInput';
import { useTranslation } from '../../../hooks/useTranslation';
import { MessageInputProps } from './types';

export const InputArea: React.FC<MessageInputProps> = ({ onSend, disabled }) => {
  const { message, setMessage, handleSubmit } = useMessageInput(onSend);
  const { t } = useTranslation();

  return (
    <div className="border-t dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder={t('chat.typeMessage')}
            rows={1}
            disabled={disabled}
            className="flex-1 resize-none rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-3 focus:outline-none focus:ring-2 focus:ring-primary dark:text-white disabled:opacity-50"
          />

          <VoiceInput
            onTranscript={(text) => setMessage(prev => prev + text)}
            disabled={disabled}
          />

          <button
            type="submit"
            disabled={!message.trim() || disabled}
            className="flex-shrink-0 rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};