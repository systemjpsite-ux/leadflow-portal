// src/firebase/provider.tsx
'use client';
import { FirebaseApp } from 'firebase/app';
import { Auth } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';
import React, { createContext, useContext } from 'react';

type FirebaseContextType = {
  app: FirebaseApp | null;
  auth: Auth | null;
  firestore: Firestore | null;
};

const FirebaseContext = createContext<FirebaseContextType>({
  app: null,
  auth: null,
  firestore: null,
});

/**
 * A React provider that makes Firebase services available to its children.
 *
 * @param {object} props - The properties for the component.
 * @param {FirebaseApp} props.app - The Firebase app instance.
 * @param {Auth} props.auth - The Firebase auth instance.
 * @param {Firestore} props.firestore - The Firebase firestore instance.
 * @param {React.ReactNode} props.children - The child components.
 */
export function FirebaseProvider({
  app,
  auth,
  firestore,
  children,
}: {
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
  children: React.ReactNode;
}) {
  return (
    <FirebaseContext.Provider value={{ app, auth, firestore }}>
      {children}
    </FirebaseContext.Provider>
  );
}

/**
 * React hook to get the Firebase app instance.
 * @returns The Firebase app instance.
 */
export function useFirebaseApp() {
  const context = useContext(FirebaseContext);
  if (!context.app) {
    throw new Error('useFirebaseApp must be used within a FirebaseProvider');
  }
  return context.app;
}

/**
 * React hook to get the Firebase auth instance.
 * @returns The Firebase auth instance.
 */
export function useAuth() {
  const context = useContext(FirebaseContext);
  if (!context.auth) {
    throw new Error('useAuth must be used within a FirebaseProvider');
  }
  return context.auth;
}

/**
 * React hook to get the Firebase firestore instance.
 * @returns The Firebase firestore instance.
 */
export function useFirestore() {
  const context = useContext(FirebaseContext);
  if (!context.firestore) {
    throw new Error('useFirestore must be used within a FirebaseProvider');
  }
  return context.firestore;
}
