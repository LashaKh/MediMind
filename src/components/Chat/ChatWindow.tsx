import React, { useEffect } from 'react';
import { MessageList } from './MessageList';
import { InputArea } from './InputArea';
import { useConversationStore } from '../../store/useConversationStore';
import { useChatStore } from '../../store/useChatStore';
import { Bot } from 'lucide-react';

export const ChatWindow: React.FC = () => {
  const { selectedConversationId } = useConversationStore();
  const { messages, loading, error, sendMessage, loadMessages, currentSessionId } = useChatStore();

  useEffect(() => {
    if (selectedConversationId) {
      loadMessages(selectedConversationId);
    }
  }, [selectedConversationId]);

  const handleSendMessage = async (content: string) => {
    if (currentSessionId) {
      await sendMessage(content, currentSessionId);
    }
  };

  if (!selectedConversationId) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Bot className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-xl font-medium text-gray-600 dark:text-gray-400">
            Select a conversation or start a new one
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      <MessageList messages={messages} loading={loading} error={error} />
      <InputArea onSend={handleSendMessage} disabled={loading} />
    </div>
  );
};