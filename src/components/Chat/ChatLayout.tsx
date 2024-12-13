import React, { useState, useEffect } from 'react';
import { ConversationList } from './ConversationList';
import { ChatWindow } from './ChatWindow';
import { NewChatButton } from './NewChatButton';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useConversationStore } from '../../store/useConversationStore';
import clsx from 'clsx';

export const ChatLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { loadConversations } = useConversationStore();

  useEffect(() => {
    loadConversations();
  }, []);

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      <div
        className={clsx(
          'flex flex-col border-r dark:border-gray-700 transition-all duration-300',
          isSidebarOpen ? 'w-80' : 'w-0'
        )}
      >
        <div className={clsx('flex-shrink-0 p-4 border-b dark:border-gray-700', !isSidebarOpen && 'hidden')}>
          <NewChatButton />
        </div>
        <div className={clsx('flex-1 min-h-0', !isSidebarOpen && 'hidden')}>
          <ConversationList />
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute left-0 top-20 z-10 p-2 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-r-lg shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          {isSidebarOpen ? (
            <ChevronLeft className="w-5 h-5" />
          ) : (
            <ChevronRight className="w-5 h-5" />
          )}
        </button>
        <ChatWindow />
      </div>
    </div>
  );
};