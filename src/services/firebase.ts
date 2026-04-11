import { initializeApp, getApps } from 'firebase/app';
import { initializeAuth, getReactNativePersistence, signInWithEmailAndPassword, signOut as firebaseSignOut } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore, collection, doc, addDoc, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { ParsedTransformerData } from '../types/TransformerData';

const firebaseConfig = {
  apiKey: 'AIzaSyC00S_4zOtBDdOxTS8RcJz24qLeV0P6qf0',
  authDomain: 'transformerwatch-30d13.firebaseapp.com',
  projectId: 'transformerwatch-30d13',
  storageBucket: 'transformerwatch-30d13.firebasestorage.app',
  messagingSenderId: '881826251095',
  appId: '1:881826251095:web:0d3089267a3a88b9eb7e12',
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const db = getFirestore(app);

export async function signIn(email: string, password: string) {
  await signInWithEmailAndPassword(auth, email, password);
}

export async function signOut() {
  await firebaseSignOut(auth);
}

export function onAuthStateChanged(callback: (user: any) => void) {
  return auth.onAuthStateChanged(callback);
}

export async function saveReading(data: ParsedTransformerData) {
  await addDoc(collection(doc(collection(db, 'devices'), data.deviceId), 'logs'), {
    deviceId: data.deviceId,
    temp: data.temp,
    status: data.status,
    relay: data.relay,
    buzzer: data.buzzer,
    timestamp: data.timestamp,
    current: data.current,
    voltage: data.voltage,
  });
}

export function subscribeLast24Hours(
  deviceId: string,
  onUpdate: (rows: ParsedTransformerData[]) => void,
): () => void {
  const from = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const q = query(
    collection(doc(collection(db, 'devices'), deviceId), 'logs'),
    where('timestamp', '>=', from),
    orderBy('timestamp'),
  );

  return onSnapshot(q, (snap) => {
    const rows: ParsedTransformerData[] = snap.docs.map((d) => {
      const data = d.data();
      return {
        deviceId: String(data.deviceId ?? deviceId),
        temp: Number(data.temp ?? 0),
        status: (data.status as ParsedTransformerData['status']) ?? 'NORMAL',
        relay: Number(data.relay ?? 0),
        buzzer: Boolean(data.buzzer),
        timestamp: data.timestamp?.toDate?.() ?? new Date(0),
        current: Number(data.current ?? 0),
        voltage: Number(data.voltage ?? 0),
      };
    });
    onUpdate(rows);
  });
}