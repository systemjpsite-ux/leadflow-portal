
"use server";

import { z } from "zod";
import { addDoc, collection, getDocs, query, serverTimestamp, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface LeadState {
  success: boolean;
  fieldErrors?: {
    name?: string[];
    email?: string[];
    niche?: string[];
    language?: string[];
    agentOrigin?: string[];
  };
  formError?: string;
}

const leadSchema = z.object({
  name: z.string().min(1, { message: "Full name is required." }),
  email: z.string().email({ message: "Invalid email address." }),
  niche: z.string().min(1, { message: "Please select a niche." }),
  language: z.string().min(1, { message: "Please select a language." }),
  agentOrigin: z.string().min(1, { message: "Please select an agent origin." }),
});

export async function registerLead(
  prevState: LeadState,
  formData: FormData
): Promise<LeadState> {
  
  console.log("Server Action: registerLead received data.");
  const rawData = Object.fromEntries(formData.entries());

  try {
    const validatedFields = leadSchema.safeParse(rawData);

    if (!validatedFields.success) {
      console.log("Server Action: Validation failed.", validatedFields.error.flatten().fieldErrors);
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
      console.log("Server Action: Duplicate email found.");
      return {
        success: false,
        fieldErrors: { email: ["This email is already registered."] },
      };
    }

    await addDoc(leadsRef, {
      name,
      email: email.toLowerCase(),
      niche,
      language,
      agent: agentOrigin,
      timestamp: serverTimestamp(),
      status: "new",
    });
    
    console.log("Server Action: Successfully wrote lead to Firestore.");
    return { success: true };

  } catch (e: any) {
    console.error("Server Action: An unexpected error occurred.", e.message);
    return {
      success: false,
      formError: "Unexpected server error. Please try again.",
    };
  }
}
