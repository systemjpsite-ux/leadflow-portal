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
    const niche = String(formData.get("niche") || "").trim(); // "health" | "wealth" | "relationships"
    const language = String(formData.get("language") || "").trim();
    const country = String(formData.get("country") || "").trim(); // novo campo do formulário
    const agentOrigin = String(formData.get("agentOrigin") || "").trim();

    const fieldErrors: Record<string, string> = {};

    if (!name) fieldErrors.name = "Name is required";
    if (!email) fieldErrors.email = "Email is required";
    if (!niche) fieldErrors.niche = "Niche is required";
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

    // Dados que serão gravados em todos os lugares
    const leadData = {
      name,
      email,
      niche,
      language,
      country,
      agentOrigin,
      status: "new",
      createdAt: now,
    };

    // Normalizar countryId para usar no caminho do Firestore
    // Ex: "Brazil" -> "BRAZIL", "United States" -> "UNITED-STATES"
    const countryId = country
      .trim()
      .toUpperCase()
      .replace(/\s+/g, "-");

    // 1) Garantir que o documento do país exista
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

    // 2) Coleção principal de leads (global)
    const mainLeadRef = doc(db, "leads", email);

    // 3) Leads dentro do país
    const countryLeadRef = doc(db, "pais", countryId, "leads", email);

    // 4) Mapear nicho → coleção
    let nicheCollectionId: "saude" | "dinheiro" | "relacionamento" | null = null;
    if (niche === "Health") nicheCollectionId = "saude";
    else if (niche === "Wealth") nicheCollectionId = "dinheiro";
    else if (niche === "Relationships") nicheCollectionId = "relacionamento";

    const writes: Promise<any>[] = [];

    // gravação global
    writes.push(setDoc(mainLeadRef, leadData, { merge: true }));

    // gravação por país (subcoleção leads)
    writes.push(setDoc(countryLeadRef, leadData, { merge: true }));

    // gravação por nicho (global e por país)
    if (nicheCollectionId) {
      const rootNicheRef = doc(db, nicheCollectionId, email); // saude/dinheiro/relacionamento
      const countryNicheRef = doc(
        db,
        "pais",
        countryId,
        nicheCollectionId,
        email
      ); // pais/{countryId}/saude|dinheiro|relacionamento/{email}

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
