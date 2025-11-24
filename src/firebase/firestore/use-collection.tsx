// src/firebase/firestore/use-collection.tsx
'use client';
import {
  FirestoreError,
  Query,
  DocumentData,
  onSnapshot,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';

/**
 * React hook to get a real-time stream of documents from a Firestore collection.
 *
 * @param {Query<DocumentData> | null | undefined} query - The Firestore query to listen to.
 * @returns An object containing the data, loading state, and any error.
 */
export function useCollection<T = DocumentData>(
  query: Query<DocumentData> | null | undefined
) {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<FirestoreError | null>(null);

  useEffect(() => {
    if (query === null || query === undefined) {
      setData(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = onSnapshot(
      query,
      (snapshot) => {
        const docs = snapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as T)
        );
        setData(docs);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
        console.error(err);
      }
    );

    return () => unsubscribe();
  }, [query]);

  return { data, loading, error };
}
