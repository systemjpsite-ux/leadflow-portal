"use server";

import { db } from "@/lib/firebase";
import {
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

export type RegisterLeadState = {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string>;
};

export async function registerLead(
  prevState: RegisterLeadState,
  formData: FormData
): Promise<RegisterLeadState> {
  try {
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim().toLowerCase();
    const rawNiche = String(formData.get("niche") || "").trim(); // pode vir "Health", "Wealth", etc.
    const language = String(formData.get("language") || "").trim();
    const country = String(formData.get("country") || "").trim(); // campo que o agente preenche

    const fieldErrors: Record<string, string> = {};

    if (!name) fieldErrors.name = "Name is required";
    if (!email) fieldErrors.email = "Email is required";
    if (!rawNiche) fieldErrors.niche = "Niche is required";
    if (!language) fieldErrors.language = "Language is required";
    if (!country) fieldErrors.country = "Country is required";

    if (Object.keys(fieldErrors).length > 0) {
      return {
        success: false,
        message: "Please fix the highlighted fields.",
        fieldErrors,
      };
    }

    const now = serverTimestamp();

    // Normalizar nicho só para lógica interna
    const nicheNormalized = rawNiche.toLowerCase();

    // Gerar agentOrigin automaticamente com base no nicho
    let agentOrigin = "";
    if (nicheNormalized === "health") {
      agentOrigin = "Health Sales Agent";
    } else if (nicheNormalized === "wealth") {
      agentOrigin = "Wealth Sales Agent";
    } else if (nicheNormalized === "relationships") {
      agentOrigin = "Relationship Sales Agent";
    }

    // Dados gravados em todos os lugares
    const leadData = {
      name,
      email,
      niche: rawNiche,        // mantém como o agente digitou/selecionou
      language,
      country,
      agentOrigin,
      status: "new",
      createdAt: now,
    };

    // countryId para usar como ID de documento em /pais
    const countryId = country
      .trim()
      .toUpperCase()
      .replace(/\s+/g, "-"); // "Brazil" -> "BRAZIL"

    // 1) Documento do país
    const countryRef = doc(db, "pais", countryId);
    await setDoc(
      countryRef,
      {
        countryId,
        countryName: country,
        updatedAt: now,
      },
      { merge: true }
    );

    const writes: Promise<any>[] = [];

    // 2) Coleção global de leads
    const mainLeadRef = doc(db, "leads", email);
    writes.push(setDoc(mainLeadRef, leadData, { merge: true }));

    // 3) Leads dentro do país
    const countryLeadRef = doc(db, "pais", countryId, "leads", email);
    writes.push(setDoc(countryLeadRef, leadData, { merge: true }));

    // 4) Mapear nicho → coleções (case-insensitive)
    let nicheCollectionId: "saude" | "dinheiro" | "relacionamento" | null = null;
    if (nicheNormalized === "health") {
      nicheCollectionId = "saude";
    } else if (nicheNormalized === "wealth") {
      nicheCollectionId = "dinheiro";
    } else if (nicheNormalized === "relationships") {
      nicheCollectionId = "relacionamento";
    }

    // 5) Gravação por nicho (global + por país)
    if (nicheCollectionId) {
      const rootNicheRef = doc(db, nicheCollectionId, email);
      const countryNicheRef = doc(
        db,
        "pais",
        countryId,
        nicheCollectionId,
        email
      );

      writes.push(
        setDoc(rootNicheRef, leadData, { merge: true }),
        setDoc(countryNicheRef, leadData, { merge: true })
      );
    }

    // Executar todas as gravações
    await Promise.all(writes);

    return {
      success: true,
      message: "Lead registered successfully.",
    };
  } catch (error) {
    console.error("Error registering lead:", error);
    return {
      success: false,
      message: "An internal error occurred while saving the lead.",
    };
  }
}
