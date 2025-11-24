// src/firebase/firestore/use-doc.tsx
'use client';
import {
  DocumentData,
  DocumentReference,
  FirestoreError,
  onSnapshot,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';

/**
 * React hook to get a real-time stream of a single document from Firestore.
 *
 * @param {DocumentReference<DocumentData> | null | undefined} ref - The Firestore document reference to listen to.
 * @returns An object containing the data, loading state, and any error.
 */
export function useDoc<T = DocumentData>(
  ref: DocumentReference<DocumentData> | null | undefined
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<FirestoreError | null>(null);

  useEffect(() => {
    if (ref === null || ref === undefined) {
      setData(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = onSnapshot(
      ref,
      (doc) => {
        if (doc.exists()) {
          setData({ id: doc.id, ...doc.data() } as T);
        } else {
          setData(null);
        }
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
        console.error(err);
      }
    );

    return () => unsubscribe();
  }, [ref]);

  return { data, loading, error };
}
