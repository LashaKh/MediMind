import React from 'react';
import { format } from 'date-fns';
import { Bot, User } from 'lucide-react';
import { Message } from '../../../types/chat';
import { formatAIResponse, sanitizeHTML } from '../../../utils/messageFormatter';
import { MessageContent } from './MessageContent';
import clsx from 'clsx';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isAI = message.type === 'ai';

  return (
    <div
      className={clsx(
        'flex gap-3 p-4 animate-fade-in',
        isAI ? 'bg-gray-50 dark:bg-gray-800' : 'bg-white dark:bg-gray-900'
      )}
    >
      <div className="flex-shrink-0">
        {isAI ? (
          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
            <Bot className="w-5 h-5" />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
        )}
      </div>
      
      <div className="flex-1 space-y-2 min-w-0">
        <div className="flex items-center justify-between">
          <span className="font-medium">
            {isAI ? 'MediMind AI' : 'You'}
          </span>
          <span className="text-sm text-gray-500">
            {format(message.timestamp, 'HH:mm')}
          </span>
        </div>
        
        <MessageContent 
          content={isAI ? formatAIResponse(message.content) : message.content}
          isAI={isAI}
        />
      </div>
    </div>
  );
};