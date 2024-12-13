import React, { useState } from 'react';
import { useConversationStore } from '../../store/useConversationStore';
import { Search, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ConversationTitle } from './ConversationTitle';
import { useTranslation } from '../../hooks/useTranslation';

export const ConversationList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { t } = useTranslation();
  const { 
    conversations,
    loading,
    error,
    selectedConversationId,
    selectConversation
  } = useConversationStore();

  const filteredConversations = conversations.filter(conversation =>
    conversation.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800">
      <div className="flex-shrink-0 p-4 border-b dark:border-gray-700">
        <div className="relative">
          <input
            type="text"
            placeholder={t('chat.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-primary"
          />
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
        </div>
      </div>

      {error && (
        <div className="p-4 text-red-500 text-center">
          {error}
        </div>
      )}

      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {filteredConversations.map(conversation => (
          <div
            key={conversation.id}
            className={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 border-b dark:border-gray-700 group ${
              selectedConversationId === conversation.id ? 'bg-gray-100 dark:bg-gray-600' : ''
            }`}
            onClick={() => selectConversation(conversation.id)}
          >
            <ConversationTitle conversation={conversation} />
            {conversation.lastMessage && (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 truncate">
                {conversation.lastMessage.content}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-400">
              {format(conversation.updatedAt, 'MMM d, yyyy HH:mm')}
            </p>
          </div>
        ))}

        {loading && (
          <div className="p-4 flex justify-center">
            <LoadingSpinner />
          </div>
        )}

        {!loading && filteredConversations.length === 0 && (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>
              {searchQuery
                ? t('chat.noConversationsFound')
                : t('chat.noConversations')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};