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
      agentOrigin = "Vendedor de Saúde";
    } else if (nicheNormalized === "wealth") {
      agentOrigin = "Vendedor de Dinheiro";
    } else if (nicheNormalized === "relationships") {
      agentOrigin = "Vendedor de Relacionamento";
    }

    // countryId para usar como ID de documento em /pais
    const countryId = country.toUpperCase(); // "Brazil" -> "BRAZIL"

    // Dados gravados em todos os lugares
    const leadData = {
      name,
      email,
      niche: rawNiche,
      language,
      country,
      countryId,
      agentOrigin,
      status: "new",
      createdAt: now,
    };

    // 1) Documento do país - metadados
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
    writes.push(setDoc(doc(db, "leads", email), leadData, { merge: true }));

    // 3) Leads dentro do país
    writes.push(setDoc(doc(db, "pais", countryId, "leads", email), leadData, { merge: true }));

    // 4) Mapear nicho → coleções
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
      // Coleção de nicho global
      writes.push(setDoc(doc(db, nicheCollectionId, email), leadData, { merge: true }));

      // Coleção de nicho DENTRO do país
      writes.push(
        setDoc(
          doc(db, "pais", countryId, nicheCollectionId, email),
          leadData,
          { merge: true }
        )
      );
    }
    
    // 6) Garantir que subcoleções existam com __meta
    const metaDoc = {
        type: "meta",
        createdAt: serverTimestamp(),
    };
    
    for (const coll of ["leads", "saude", "dinheiro", "relacionamento"]) {
        writes.push(
            setDoc(
                doc(db, "pais", countryId, coll, "__meta"),
                metaDoc,
                { merge: true }
            )
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
