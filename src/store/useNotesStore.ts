import { create } from 'zustand';
import { db } from '../lib/firebase';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  getDocs,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import { useAuthStore } from './useAuthStore';
import type { Note } from '../types/notes';

interface NotesState {
  notes: Note[];
  selectedNoteId: string | null;
  selectedNote: Note | null;
  loading: boolean;
  error: string | null;
  unsubscribe: (() => void) | null;
  createNote: () => Promise<void>;
  loadNotes: () => Promise<void>;
  selectNote: (id: string) => void;
  updateNote: (id: string, updates: Partial<Note>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  saveNote: (id: string) => Promise<void>;
  cleanup: () => void;
}

export const useNotesStore = create<NotesState>((set, get) => ({
  notes: [],
  selectedNoteId: null,
  selectedNote: null,
  loading: false,
  error: null,
  unsubscribe: null,

  createNote: async () => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    try {
      set({ loading: true, error: null });
      const notesRef = collection(db, 'notes');
      
      const newNote = {
        title: 'Untitled Note',
        content: '',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        userId: user.uid
      };

      const docRef = await addDoc(notesRef, newNote);
      set({ selectedNoteId: docRef.id, loading: false });
    } catch (error) {
      console.error('Create note error:', error);
      set({ error: 'Failed to create note', loading: false });
    }
  },

  loadNotes: async () => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    try {
      set({ loading: true, error: null });
      
      const notesRef = collection(db, 'notes');
      const basicQuery = query(
        notesRef,
        where('userId', '==', user.uid)
      );

      // Set up real-time listener
      const unsubscribe = onSnapshot(basicQuery, (snapshot) => {
        const notes = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date()
        })) as Note[];

        // Sort notes by updatedAt locally
        notes.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

        set({ 
          notes,
          selectedNoteId: get().selectedNoteId || notes[0]?.id || null,
          selectedNote: get().selectedNoteId 
            ? notes.find(n => n.id === get().selectedNoteId) 
            : notes[0] || null
        });
      }, (error) => {
        console.error('Notes subscription error:', error);
        set({ error: 'Failed to load notes' });
      });

      set({ unsubscribe, loading: false });
    } catch (error) {
      console.error('Load notes error:', error);
      set({ error: 'Failed to load notes', loading: false });
    }
  },

  selectNote: (id: string) => {
    const note = get().notes.find(n => n.id === id);
    set({ selectedNoteId: id, selectedNote: note || null });
  },

  updateNote: async (id: string, updates: Partial<Note>) => {
    try {
      const noteRef = doc(db, 'notes', id);
      await updateDoc(noteRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Update note error:', error);
      set({ error: 'Failed to update note' });
    }
  },

  deleteNote: async (id: string) => {
    try {
      set({ loading: true, error: null });
      const noteRef = doc(db, 'notes', id);
      await deleteDoc(noteRef);

      set(state => {
        const remainingNotes = state.notes.filter(note => note.id !== id);
        return {
          notes: remainingNotes,
          selectedNoteId: state.selectedNoteId === id ? remainingNotes[0]?.id || null : state.selectedNoteId,
          selectedNote: state.selectedNoteId === id ? remainingNotes[0] || null : state.selectedNote,
          loading: false
        };
      });
    } catch (error) {
      console.error('Delete note error:', error);
      set({ error: 'Failed to delete note', loading: false });
    }
  },

  saveNote: async (id: string) => {
    try {
      set({ loading: true, error: null });
      const note = get().notes.find(n => n.id === id);
      if (!note) return;

      const noteRef = doc(db, 'notes', id);
      await updateDoc(noteRef, {
        title: note.title,
        content: note.content,
        updatedAt: serverTimestamp()
      });

      set({ loading: false });
    } catch (error) {
      console.error('Save note error:', error);
      set({ error: 'Failed to save note', loading: false });
    }
  },

  cleanup: () => {
    const { unsubscribe } = get();
    if (unsubscribe) {
      unsubscribe();
      set({ unsubscribe: null });
    }
  }
}));