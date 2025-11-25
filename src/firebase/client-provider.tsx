"use client";

import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";

// Config do seu projeto (a mesma que você mandou)
const firebaseConfig = {
  apiKey: "AIzaSyCXeImhZWnul1sP7H_DFdAvn-9_eVQkZ8w",
  authDomain: "leadflow-portal-fc917.firebaseapp.com",
  projectId: "leadflow-portal-fc917",
  storageBucket: "leadflow-portal-fc917.firebasestorage.app",
  messagingSenderId: "1089649840506",
  appId: "1:1089649840506:web:70cc6bdd977997500ec6c3",
};

export type FirebaseServices = {
  app: FirebaseApp;
  user: User | null;
};

const FirebaseContext = createContext<FirebaseServices | null>(null);

type FirebaseClientProviderProps = {
  children: ReactNode;
};

export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  const [services, setServices] = useState<FirebaseServices | null>(null);

  useEffect(() => {
    // só roda no navegador
    if (typeof window === "undefined") return;

    const app =
      getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

    const auth = getAuth(app);
    const unsub = onAuthStateChanged(auth, (user) => {
      setServices({ app, user });
    });

    // já seta uma vez enquanto espera o onAuth
    if (!services) {
      setServices({ app, user: auth.currentUser });
    }

    return () => unsub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!services) {
    // opcional: tela de loading mínima
    return null;
  }

  return (
    <FirebaseContext.Provider value={services}>
      {children}
    </FirebaseContext.Provider>
  );
}

export function useFirebaseServices() {
  const ctx = useContext(FirebaseContext);
  if (!ctx) {
    throw new Error("useFirebaseServices must be used within FirebaseClientProvider");
  }
  return ctx;
}
