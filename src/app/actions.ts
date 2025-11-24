"use server";

import { z } from "zod";
import { db } from "@/lib/firebase";
import { collection, addDoc, query, where, getDocs, serverTimestamp } from "firebase/firestore";

const leadSchema = z.object({
  name: z.string().min(2, { message: "Full name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  niche: z.enum(["health", "wealth", "love"], {
    required_error: "Please select a niche.",
    invalid_type_error: "Please select a niche.",
  }),
  language: z.string().min(1, { message: "Please select a language." }),
  otherLanguage: z.string().optional(),
  agent: z.string({ required_error: "Please select an agent origin." }).min(1, { message: "Please select an agent origin." }),
}).refine(data => {
  if (data.language === 'other') {
    return data.otherLanguage && data.otherLanguage.trim().length > 0;
  }
  return true;
}, {
  message: "Please specify the language.",
  path: ["otherLanguage"],
});

export type LeadState = {
  errors?: {
    name?: string[];
    email?: string[];
    niche?: string[];
    language?: string[];
    otherLanguage?: string[];
    agent?: string[];
    _form?: string[];
  };
  message?: string;
  success?: boolean;
};

const languages: { code: string; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'pt', label: 'Portuguese' },
    { code: 'es', label: 'Spanish' },
    { code: 'fr', label: 'French' },
    { code: 'de', label: 'German' },
    { code: 'it', label: 'Italian' },
    { code: 'ja', label: 'Japanese' },
    { code: 'ko', label: 'Korean' },
    { code: 'zh-CN', label: 'Chinese – Simplified' },
    { code: 'zh-TW', label: 'Chinese – Traditional' },
    { code: 'ar', label: 'Arabic' },
    { code: 'ru', label: 'Russian' },
    { code: 'hi', label: 'Hindi' },
    { code: 'id', label: 'Indonesian' },
    { code: 'tr', label: 'Turkish' },
    { code: 'other', label: 'Other' },
];

export async function registerLead(prevState: LeadState, formData: FormData): Promise<LeadState> {
  const validatedFields = leadSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    niche: formData.get("niche"),
    language: formData.get("language"),
    otherLanguage: formData.get("otherLanguage"),
    agent: formData.get("agent"),
  });
  
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Validation failed. Please check the fields.",
      success: false,
    };
  }
  
  const { name, email, niche, language, agent, otherLanguage } = validatedFields.data;

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

    let languageCode = language;
    let languageLabel = '';

    if (language === 'other') {
        languageCode = 'other';
        languageLabel = otherLanguage!;
    } else {
        const selectedLanguage = languages.find(l => l.code === language);
        languageLabel = selectedLanguage ? selectedLanguage.label : '';
    }
    
    await addDoc(leadsRef, {
      name,
      email: email.toLowerCase(),
      niche,
      languageCode,
      languageLabel,
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
