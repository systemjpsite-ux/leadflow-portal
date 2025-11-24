
'use server';

import { addDoc, collection, getDocs, query, where, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { z } from 'zod';

export type RegisterLeadResult = {
  success: boolean;
  message?: string;
  fieldErrors?: {
    name?: string;
    email?: string;
    niche?: string;
    language?: string;
    agentOrigin?: string;
  };
};

const leadSchema = z.object({
  name: z.string().min(1, "Full name is required."),
  email: z.string().email("Invalid email address."),
  niche: z.string().min(1, "Please select a niche."),
  language: z.string().min(1, "Language is required.").max(50, "Language must be 50 characters or less."),
  agentOrigin: z.string().min(1, "Please select an agent origin."),
});

export async function registerLead(formData: FormData): Promise<RegisterLeadResult> {
  try {
    const rawData = Object.fromEntries(formData.entries());
    const validatedFields = leadSchema.safeParse(rawData);

    if (!validatedFields.success) {
      return {
        success: false,
        fieldErrors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const { name, email, niche, language, agentOrigin } = validatedFields.data;

    const leadsRef = collection(db, "leads");
    const q = query(leadsRef, where("email", "==", email.toLowerCase()));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return {
        success: false,
        fieldErrors: { email: "This email is already registered." },
      };
    }

    await addDoc(leadsRef, {
      name,
      email: email.toLowerCase(),
      niche,
      language,
      agent: agentOrigin, // Mapped from agentOrigin to agent
      timestamp: serverTimestamp(),
      status: "new",
    });

    return { success: true, message: "Lead registered successfully." };

  } catch (error) {
    console.error("Error in registerLead:", error);
    return {
      success: false,
      message: "Internal server error. Please try again.",
    };
  }
}
