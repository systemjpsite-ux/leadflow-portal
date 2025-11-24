"use server";

import { z } from "zod";
import { db } from "@/lib/firebase";
import { collection, addDoc, query, where, getDocs, serverTimestamp } from "firebase/firestore";

const leadSchema = z.object({
  name: z.string().min(2, { message: "Full name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  niche: z.enum(["health", "wealth", "love"], {
    errorMap: () => ({ message: "Please select a niche." }),
  }),
  language: z.string().min(1, { message: "Please select a language." }),
  agent: z.string().min(1, { message: "Please select an agent origin." }),
});

export type LeadState = {
  errors?: {
    name?: string[];
    email?: string[];
    niche?: string[];
    language?: string[];
    agent?: string[];
    _form?: string[];
  };
  message?: string;
  success?: boolean;
};

export async function registerLead(prevState: LeadState, formData: FormData): Promise<LeadState> {
  const validatedFields = leadSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    niche: formData.get("niche"),
    language: formData.get("language"),
    agent: formData.get("agent"),
  });
  
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Validation failed. Please check the fields.",
      success: false,
    };
  }
  
  const { name, email, niche, language, agent } = validatedFields.data;

  try {
    const leadsRef = collection(db, "leads");
    const q = query(leadsRef, where("email", "==", email.toLowerCase()));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      return {
        errors: { email: ["This email is already registered."] },
        message: "Duplicate email.",
        success: false,
      };
    }
    
    await addDoc(leadsRef, {
      name,
      email: email.toLowerCase(),
      niche,
      language,
      agent,
      timestamp: serverTimestamp(),
      status: "new",
    });

    return { message: "Lead registered successfully!", success: true };
  } catch (e) {
    console.error("Error adding document: ", e);
    return {
      errors: { _form: ["Something went wrong on our end. Please try again."] },
      message: "Database error.",
      success: false,
    };
  }
}
