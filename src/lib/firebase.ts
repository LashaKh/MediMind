import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  query, 
  where, 
  getDocs, 
  orderBy,
  initializeFirestore,
  persistentLocalCache,
  persistentSingleTabManager
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDt1PeJc2QqkUWDHYuRlUNpVWl7d0-8Ln4",
  authDomain: "medi-mind-bolt.firebaseapp.com",
  projectId: "medi-mind-bolt",
  storageBucket: "medi-mind-bolt.appspot.com",
  messagingSenderId: "711323744590",
  appId: "1:711323744590:web:3a3033d9e8bbc3b416c320"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
export const auth = getAuth(app);

// Initialize Firestore with persistence
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache(
    { tabManager: persistentSingleTabManager() }
  )
});

// Initialize Firestore indexes
const initializeIndexes = async () => {
  try {
    // Test required composite indexes
    const patientsRef = collection(db, 'patients');
    const testQueries = [
      // Test patients index
      query(
        patientsRef,
        where('userId', '==', 'test'),
        orderBy('updatedAt', 'desc')
      ),
      // Test notes index
      query(
        collection(db, 'notes'),
        where('userId', '==', 'test'),
        orderBy('updatedAt', 'desc')
      )
    ];
    
    for (const testQuery of testQueries) {
      await getDocs(testQuery);
    }
    console.log('All required indexes are ready');
  } catch (error: any) {
    if (error?.code === 'failed-precondition') {
      console.warn('Required indexes are missing. Please create the following indexes:');
      console.warn(`
Collection: patients
Fields to index:
- userId (Ascending)
- updatedAt (Descending)

Collection: notes
Fields to index:
- userId (Ascending)
- updatedAt (Descending)
      `);
    }
  }
};

// Call initializeIndexes immediately
initializeIndexes();

export { app as default };