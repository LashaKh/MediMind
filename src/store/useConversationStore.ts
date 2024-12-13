import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  collection, 
  query, 
  orderBy,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  where,
  serverTimestamp,
  limit,
  Timestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuthStore } from './useAuthStore';
import type { Conversation } from '../types/chat';

interface ConversationState {
  conversations: Conversation[];
  selectedConversationId: string | null;
  loading: boolean;
  error: string | null;
  loadConversations: () => Promise<void>;
  createConversation: () => Promise<string>;
  selectConversation: (id: string) => void;
  archiveConversation: (id: string) => Promise<void>;
  deleteConversation: (id: string) => Promise<void>;
  updateConversationTitle: (id: string, title: string) => Promise<void>;
}

export const useConversationStore = create<ConversationState>()(
  persist(
    (set, get) => ({
      conversations: [],
      selectedConversationId: null,
      loading: false,
      error: null,

      loadConversations: async () => {
        const user = useAuthStore.getState().user;
        if (!user) return;

        try {
          set({ loading: true, error: null });
          const conversationsRef = collection(db, 'conversations');
          
          // Basic query without complex ordering
          const q = query(
            conversationsRef,
            where('participantIds', 'array-contains', user.uid)
          );

          const snapshot = await getDocs(q);
          
          const conversations = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              title: data.title || 'New Conversation',
              createdAt: data.createdAt?.toDate() || new Date(),
              updatedAt: data.updatedAt?.toDate() || new Date(),
              participantIds: data.participantIds || [user.uid],
              status: data.status || 'active',
              lastMessage: data.lastMessage ? {
                content: data.lastMessage.content,
                timestamp: data.lastMessage.timestamp?.toDate() || new Date(),
                senderId: data.lastMessage.senderId
              } : undefined
            } as Conversation;
          });

          // Sort conversations locally
          conversations.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

          set({ 
            conversations,
            selectedConversationId: get().selectedConversationId || conversations[0]?.id || null,
            loading: false 
          });
        } catch (error) {
          console.error('Load conversations error:', error);
          set({ error: 'Failed to load conversations', loading: false });
        }
      },

      createConversation: async () => {
        const user = useAuthStore.getState().user;
        if (!user) throw new Error('User not authenticated');

        try {
          set({ loading: true, error: null });
          const conversationsRef = collection(db, 'conversations');
          
          const newConversation = {
            title: 'New Conversation',
            participantIds: [user.uid],
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            status: 'active' as const
          };

          const docRef = await addDoc(conversationsRef, newConversation);
          
          const conversation: Conversation = {
            id: docRef.id,
            ...newConversation,
            createdAt: new Date(),
            updatedAt: new Date(),
            participantIds: [user.uid],
            status: 'active'
          };

          set(state => ({
            conversations: [conversation, ...state.conversations],
            selectedConversationId: docRef.id,
            loading: false
          }));

          return docRef.id;
        } catch (error) {
          console.error('Create conversation error:', error);
          set({ error: 'Failed to create conversation', loading: false });
          throw error;
        }
      },

      selectConversation: (id: string) => {
        set({ selectedConversationId: id });
      },

      archiveConversation: async (id: string) => {
        try {
          set({ loading: true, error: null });
          const conversationRef = doc(db, 'conversations', id);
          
          await updateDoc(conversationRef, {
            status: 'archived',
            updatedAt: serverTimestamp()
          });

          set(state => ({
            conversations: state.conversations.map(conv =>
              conv.id === id ? { ...conv, status: 'archived' as const } : conv
            ),
            loading: false
          }));
        } catch (error) {
          console.error('Archive conversation error:', error);
          set({ error: 'Failed to archive conversation', loading: false });
        }
      },

      deleteConversation: async (id: string) => {
        try {
          set({ loading: true, error: null });
          const conversationRef = doc(db, 'conversations', id);
          await deleteDoc(conversationRef);

          set(state => ({
            conversations: state.conversations.filter(conv => conv.id !== id),
            selectedConversationId: state.selectedConversationId === id ? null : state.selectedConversationId,
            loading: false
          }));
        } catch (error) {
          console.error('Delete conversation error:', error);
          set({ error: 'Failed to delete conversation', loading: false });
        }
      },

      updateConversationTitle: async (id: string, title: string) => {
        try {
          set({ loading: true, error: null });
          const conversationRef = doc(db, 'conversations', id);
          
          await updateDoc(conversationRef, {
            title,
            updatedAt: serverTimestamp()
          });

          set(state => ({
            conversations: state.conversations.map(conv =>
              conv.id === id ? { ...conv, title } : conv
            ),
            loading: false
          }));
        } catch (error) {
          console.error('Update conversation title error:', error);
          set({ error: 'Failed to update conversation title', loading: false });
        }
      }
    }),
    {
      name: 'conversation-storage',
      getStorage: () => localStorage,
      partialize: (state) => ({
        selectedConversationId: state.selectedConversationId
      })
    }
  )
);