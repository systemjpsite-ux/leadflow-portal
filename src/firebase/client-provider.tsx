// src/firebase/client-provider.tsx
'use client';
import React, { createContext, useContext, useMemo } from 'react';
import { FirebaseProvider, initializeFirebase, type FirebaseServices } from '.';

const FirebaseContext = createContext<FirebaseServices | null>(null);

/**
 * A client-side provider that initializes Firebase and makes it available to its children.
 * Ensures that Firebase is only initialized once.
 *
 * @param {object} props - The properties for the component.
 * @param {React.ReactNode} props.children - The child components.
 */
export function FirebaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const firebaseServices = useMemo(() => initializeFirebase(), []);

  return (
    <FirebaseProvider {...firebaseServices}>
      <FirebaseContext.Provider value={firebaseServices}>
        {children}
      </FirebaseContext.Provider>
    </FirebaseProvider>
  );
}

export const useFirebaseServices = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error(
      'useFirebaseServices must be used within a FirebaseClientProvider'
    );
  }
  return context;
};
