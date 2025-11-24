// NÃO adicione "use client" nem "use server" neste arquivo.

import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Configuração oficial do meu Firebase Web App
const firebaseConfig = {
  apiKey: "AIzaSyCXeImhZWnul1sP7H_DFdAvn-9_eVQkZ8w",
  authDomain: "leadflow-portal-fc917.firebaseapp.com",
  projectId: "leadflow-portal-fc917",
  storageBucket: "leadflow-portal-fc917.appspot.com",
  messagingSenderId: "1089649840506",
  appId: "1:1089649840506:web:70cc6bdd977997500ec6c3",
};

// Evitar inicialização duplicada
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Exportar Firestore
export const db = getFirestore(app);
export default app;
