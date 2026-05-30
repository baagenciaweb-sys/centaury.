import { useState, useEffect } from 'react';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  CollectionReference,
  DocumentData
} from 'firebase/firestore';
import { db } from '../config/firebase';

function getCollection<T>(path: string): CollectionReference<T, DocumentData> {
  return collection(db, path) as CollectionReference<T, DocumentData>;
}

export function useCollection<T extends { id?: string }>(path: string) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const ref = getCollection<T>(path);
      const q = query(ref, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const items = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      } as T));
      setData(items);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [path]);

  const add = async (item: Omit<T, 'id'>) => {
    const ref = getCollection<T>(path);
    const docRef = await addDoc(ref, {
      ...item,
      createdAt: new Date()
    });
    await fetchData();
    return docRef.id;
  };

  const update = async (id: string, updates: Partial<T>) => {
    const ref = doc(db, path, id);
    await updateDoc(ref, {
      ...updates,
      updatedAt: new Date()
    });
    await fetchData();
  };

  const remove = async (id: string) => {
    const ref = doc(db, path, id);
    await deleteDoc(ref);
    await fetchData();
  };

  return { data, loading, error, add, update, remove, refetch: fetchData };
}

export function useDocument<T extends { id?: string }>(path: string, id: string | null) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const ref = doc(db, path, id);
        const snapshot = await getDoc(ref);
        if (snapshot.exists()) {
          setData({ ...snapshot.data(), id: snapshot.id } as T);
        } else {
          setData(null);
        }
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [path, id]);

  return { data, loading, error };
}

export { getCollection };
