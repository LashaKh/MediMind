import { create } from 'zustand';
import { fetchAIResponse } from '../lib/api/chat';
import { db } from '../lib/firebase';
import { collection, addDoc, query, orderBy, getDocs, where, onSnapshot } from 'firebase/firestore';
import { useAuthStore } from './useAuthStore';
import type { Message } from '../types/chat';

interface ChatState {
  messages: Message[];
  loading: boolean;
  error: string | null;
  currentSessionId: string | null;
  unsubscribe: (() => void) | null;
  sendMessage: (content: string, sessionId: string) => Promise<void>;
  loadMessages: (conversationId: string) => void;
  setSessionId: (sessionId: string) => void;
  cleanup: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  loading: false,
  error: null,
  currentSessionId: null,
  unsubscribe: null,

  setSessionId: (sessionId: string) => {
    set({ currentSessionId: sessionId });
  },

  sendMessage: async (content: string, sessionId: string) => {
    const user = useAuthStore.getState().user;
    if (!user || !sessionId) return;

    try {
      set({ loading: true, error: null });
      
      // Add user message
      const userMessage: Message = {
        id: Date.now().toString(),
        conversationId: sessionId,
        content,
        type: 'user',
        timestamp: new Date(),
        status: 'sent'
      };

      // Save to Firestore
      const messagesRef = collection(db, `conversations/${sessionId}/messages`);
      await addDoc(messagesRef, userMessage);

      // Get AI response with session context
      const aiResponse = await fetchAIResponse(content, sessionId);
      
      // Add AI message
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        conversationId: sessionId,
        content: aiResponse.text,
        type: 'ai',
        timestamp: new Date(),
        status: 'delivered'
      };

      await addDoc(messagesRef, aiMessage);
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An error occurred while sending the message' });
    } finally {
      set({ loading: false });
    }
  },

  loadMessages: (conversationId: string) => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    // Clean up previous subscription
    const { unsubscribe: prevUnsubscribe } = get();
    if (prevUnsubscribe) {
      prevUnsubscribe();
    }

    try {
      set({ loading: true, error: null, currentSessionId: conversationId });
      
      const messagesRef = collection(db, `conversations/${conversationId}/messages`);
      const q = query(messagesRef, orderBy('timestamp', 'asc'));
      
      // Set up real-time listener
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const messages = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp.toDate(),
        })) as Message[];

        set({ messages, loading: false });
      }, (error) => {
        console.error('Messages subscription error:', error);
        set({ error: 'Failed to load messages', loading: false });
      });

      set({ unsubscribe });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load messages',
        loading: false 
      });
    }
  },

  cleanup: () => {
    const { unsubscribe } = get();
    if (unsubscribe) {
      unsubscribe();
      set({ unsubscribe: null, messages: [], currentSessionId: null });
    }
  }
}));