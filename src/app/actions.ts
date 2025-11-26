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
    const niche = (formData.get("niche") || "").toString().trim();
    const language = (formData.get("language") || "").toString().trim();
    const country = (formData.get("country") || "").toString().trim();

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

    const countryId = country.trim().toUpperCase();

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
      country: country,
      countryId: countryId,
      agentOrigin,
      status: "new",
      createdAt: now,
    };

    const writes: Promise<unknown>[] = [];

    writes.push(
      setDoc(doc(db, "leads", email), leadData, { merge: true })
    );

    writes.push(
      setDoc(doc(db, nicheCollectionId, email), leadData, { merge: true })
    );

    const countryRef = doc(db, "pais", countryId);
    writes.push(
      setDoc(
        countryRef,
        {
          countryId: countryId,
          countryName: country,
          updatedAt: now,
        },
        { merge: true }
      )
    );

    writes.push(
      setDoc(
        doc(db, "pais", countryId, "leads", email),
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
