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
  serverTimestamp,
  orderBy,
  arrayUnion
} from 'firebase/firestore';
import { useAuthStore } from './useAuthStore';
import type { Patient, PatientNote } from '../types/patient';

interface PatientState {
  patients: Patient[];
  loading: boolean;
  error: string | null;
  unsubscribe: (() => void) | null;
  loadPatients: () => Promise<void>;
  addPatient: (patient: Omit<Patient, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updatePatient: (id: string, updates: Partial<Patient>) => Promise<void>;
  deletePatient: (id: string) => Promise<void>;
  transferPatient: (patientId: string, newRoomNumber: string) => Promise<void>;
  addNote: (patientId: string, note: Pick<PatientNote, 'content' | 'type'>) => Promise<void>;
  cleanup: () => void;
}

export const usePatientStore = create<PatientState>((set, get) => ({
  patients: [],
  loading: false,
  error: null,
  unsubscribe: null,

  loadPatients: async () => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    try {
      set({ loading: true, error: null });
      
      const patientsRef = collection(db, 'patients');
      const basicQuery = query(
        patientsRef,
        where('userId', '==', user.uid)
      );

      // Set up real-time listener
      const unsubscribe = onSnapshot(basicQuery, (snapshot) => {
        const patients = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
          admissionDate: doc.data().admissionDate?.toDate() || new Date(),
          notes: doc.data().notes?.map(note => ({
            ...note,
            timestamp: note.timestamp?.toDate() || new Date()
          })) || []
        })) as Patient[];

        set({ patients });
      }, (error) => {
        console.error('Patients subscription error:', error);
        set({ error: 'Failed to load patients' });
      });

      set({ unsubscribe, loading: false });
    } catch (error) {
      console.error('Load patients error:', error);
      set({ error: 'Failed to load patients', loading: false });
    }
  },

  addPatient: async (patient) => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    try {
      set({ loading: true, error: null });
      const patientsRef = collection(db, 'patients');
      
      await addDoc(patientsRef, {
        ...patient,
        userId: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        notes: []
      });

      set({ loading: false });
    } catch (error) {
      console.error('Add patient error:', error);
      set({ error: 'Failed to add patient', loading: false });
    }
  },

  updatePatient: async (id, updates) => {
    try {
      set({ loading: true, error: null });
      const patientRef = doc(db, 'patients', id);
      
      await updateDoc(patientRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });

      set({ loading: false });
    } catch (error) {
      console.error('Update patient error:', error);
      set({ error: 'Failed to update patient', loading: false });
    }
  },

  deletePatient: async (id) => {
    try {
      set({ loading: true, error: null });
      const patientRef = doc(db, 'patients', id);
      await deleteDoc(patientRef);
      set({ loading: false });
    } catch (error) {
      console.error('Delete patient error:', error);
      set({ error: 'Failed to delete patient', loading: false });
    }
  },

  transferPatient: async (patientId, newRoomNumber) => {
    try {
      set({ loading: true, error: null });
      const patientRef = doc(db, 'patients', patientId);
      
      await updateDoc(patientRef, {
        roomNumber: newRoomNumber,
        updatedAt: serverTimestamp()
      });

      // Update local state immediately
      set(state => ({
        patients: state.patients.map(p => 
          p.id === patientId 
            ? { ...p, roomNumber: newRoomNumber, updatedAt: new Date() }
            : p
        ),
        loading: false
      }));
    } catch (error) {
      console.error('Transfer patient error:', error);
      set({ error: 'Failed to transfer patient', loading: false });
    }
  },

  addNote: async (patientId, note) => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    try {
      set({ loading: true, error: null });
      const patientRef = doc(db, 'patients', patientId);
      
      const newNote: PatientNote = {
        id: Date.now().toString(),
        ...note,
        timestamp: new Date(),
        createdBy: user.uid
      };

      await updateDoc(patientRef, {
        notes: arrayUnion(newNote),
        updatedAt: serverTimestamp()
      });

      set({ loading: false });
    } catch (error) {
      console.error('Add note error:', error);
      set({ error: 'Failed to add note', loading: false });
    }
  },

  cleanup: () => {
    const { unsubscribe } = get();
    if (unsubscribe) {
      unsubscribe();
    }
  }
}));