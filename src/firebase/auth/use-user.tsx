// src/firebase/auth/use-user.tsx
'use client';
import { type User, onIdTokenChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { useAuth } from '../';

/**
 * React hook to get the currently authenticated user.
 *
 * @returns An object containing the user, loading state, and any error.
 */
export function useUser() {
  const auth = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onIdTokenChanged(
      auth,
      (user) => {
        setUser(user);
        setLoading(false);
      },
      (error) => {
        setError(error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [auth]);

  return { user, loading, error };
}
