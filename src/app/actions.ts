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
    const nicheRaw = (formData.get("niche") || "").toString().trim();
    const language = (formData.get("language") || "").toString().trim();
    const countryInput = (formData.get("country") || "").toString().trim();
    
    const fieldErrors: Record<string, string> = {};

    if (!name) fieldErrors.name = "Name is required";
    if (!email) fieldErrors.email = "Email is required";
    if (!nicheRaw) fieldErrors.niche = "Niche is required";
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
    const countryId = countryInput.toUpperCase(); // document id in collection 'pais'
    const countryName = countryInput;             // original text

    // Map niche → collection id + agent origin
    const nicheLower = nicheRaw.toLowerCase();
    let nicheCollectionId: "saude" | "dinheiro" | "relacionamento" | null = null;
    let agentOrigin = "";

    switch (nicheLower) {
      case "health":
        nicheCollectionId = "saude";
        agentOrigin = "Vendedor de Saúde";
        break;
      case "wealth":
        nicheCollectionId = "dinheiro";
        agentOrigin = "Vendedor de Dinheiro";
        break;
      case "relationships":
        nicheCollectionId = "relacionamento";
        agentOrigin = "Vendedor de Relacionamento";
        break;
      default:
        return {
          success: false,
          message: "Invalid niche value.",
        };
    }

    const now = serverTimestamp();

    const leadData = {
      name: name,
      email,
      niche: nicheRaw,       // keep original (Health/Wealth/Relationships)
      language,
      country: countryName,  // original country text
      agentOrigin,           // auto-filled from niche
      status: "new",
      createdAt: now,
    };

    const writes: Promise<any>[] = [];

    // 1) Main leads collection
    const rootLeadRef = doc(db, "leads", email);
    writes.push(setDoc(rootLeadRef, leadData, { merge: true }));

    // 2) Global niche collection (saude/dinheiro/relacionamento)
    if (nicheCollectionId) {
      const rootNicheRef = doc(db, nicheCollectionId, email);
      writes.push(setDoc(rootNicheRef, leadData, { merge: true }));
    }

    // 3) Country document (pais/{countryId})
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

    // 4) Country → leads
    const countryLeadRef = doc(db, "pais", countryId, "leads", email);
    writes.push(setDoc(countryLeadRef, leadData, { merge: true }));

    // 5) Country → niche (pais/{countryId}/saude|dinheiro|relacionamento/{email})
    if (nicheCollectionId) {
      const countryNicheRef = doc(
        db,
        "pais",
        countryId,
        nicheCollectionId,
        email
      );
      writes.push(setDoc(countryNicheRef, leadData, { merge: true }));
    }

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
