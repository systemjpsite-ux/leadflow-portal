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
    const name = (formData.get("name") || "").toString().trim();
    const email = (formData.get("email") || "").toString().trim().toLowerCase();
    const niche = (formData.get("niche") || "").toString().trim(); // "health" | "wealth" | "relationships"
    const language = (formData.get("language") || "").toString().trim();
    const countryInput = (formData.get("country") || "").toString().trim();

    const fieldErrors: Record<string, string> = {};

    if (!name) fieldErrors.name = "Name is required";
    if (!email) fieldErrors.email = "Email is required";
    if (!niche) fieldErrors.niche = "Niche is required";
    if (!language) fieldErrors.language = "Language is required";
    if (!countryInput) fieldErrors.country = "Country is required";
    
    if (Object.keys(fieldErrors).length > 0) {
      return {
        success: false,
        message: "Please fix the highlighted fields.",
        fieldErrors,
      };
    }
    
    // Normalize country
    const countryId = countryInput.trim().toUpperCase();   // e.g. "BRASIL"
    const countryName = countryInput.trim(); // e.g. "brasil"

    // Map niche to Firestore collection ids
    let nicheCollectionId: "saude" | "dinheiro" | "relacionamento";
    let agentOrigin: string;

    const nicheLower = niche.toLowerCase();
    if (nicheLower === "health") {
      nicheCollectionId = "saude";
      agentOrigin = "Vendedor de Saúde";
    } else if (nicheLower === "wealth") {
      nicheCollectionId = "dinheiro";
      agentOrigin = "Vendedor de Dinheiro";
    } else if (nicheLower === "relationships") {
      nicheCollectionId = "relacionamento";
      agentOrigin = "Vendedor de Relacionamento";
    } else {
        return {
          success: false,
          message: "Invalid niche value.",
        };
    }

    const now = serverTimestamp();

    const leadData = {
      name,
      email,
      niche,
      language,
      country: countryName,
      countryId,
      agentOrigin,
      status: "new",
      createdAt: now,
    };

    const writes: Promise<unknown>[] = [];

    // 1) Global leads collection
    writes.push(
      setDoc(doc(db, "leads", email), leadData, { merge: true })
    );

    // 2) Global niche collections (health/wealth/relationships mapped to saude/dinheiro/relacionamento)
    writes.push(
      setDoc(doc(db, nicheCollectionId, email), leadData, { merge: true })
    );

    // 3) Country document metadata
    const countryRef = doc(db, "pais", countryId);
    writes.push(
      setDoc(
        countryRef,
        {
          countryId,
          countryName,
          updatedAt: now,
        },
        { merge: true }
      )
    );

    // 4) Country → leads subcollection
    writes.push(
      setDoc(
        doc(db, "pais", countryId, "leads", email),
        leadData,
        { merge: true }
      )
    );

    // 5) Country → niche subcollection (saude/dinheiro/relacionamento)
    writes.push(
      setDoc(
        doc(db, "pais", countryId, nicheCollectionId, email),
        leadData,
        { merge: true }
      )
    );

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
