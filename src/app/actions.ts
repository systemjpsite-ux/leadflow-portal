
"use server";

import { z } from "zod";
import { addDoc, collection, getDocs, query, serverTimestamp, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface LeadState {
  success: boolean;
  errors?: {
    name?: string[];
    email?: string[];
    niche?: string[];
    language?: string[];
    otherLanguage?: string[];
    agent?: string[];
    _form?: string[];
  };
}

const leadSchema = z.object({
  name: z.string().min(1, { message: "Full name is required." }),
  email: z.string().email({ message: "Invalid email address." }),
  niche: z.string().min(1, { message: "Please select a niche." }),
  language: z.string().min(1, { message: "Please select a language." }),
  otherLanguage: z.string().optional(),
  agent: z.string().min(1, { message: "Please select an agent origin." }),
}).refine(data => {
  if (data.language === 'other') {
    return data.otherLanguage && data.otherLanguage.trim().length > 0;
  }
  return true;
}, {
  message: "Please specify the language when 'Other' is selected.",
  path: ["otherLanguage"],
});

const languages = [
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

export async function registerLead(
  prevState: LeadState,
  formData: FormData
): Promise<LeadState> {
  
  const rawData = {
    name: formData.get("name") || "",
    email: formData.get("email") || "",
    niche: formData.get("niche") || "",
    language: formData.get("language") || "",
    otherLanguage: formData.get("otherLanguage") || "",
    agent: formData.get("agent") || "",
  };
  
  const validatedFields = leadSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, email, niche, language, agent, otherLanguage } = validatedFields.data;

  try {
    const leadsRef = collection(db, "leads");
    const q = query(leadsRef, where("email", "==", email.toLowerCase()));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return {
        success: false,
        errors: { email: ["This email is already registered."] },
      };
    }
    
    let languageCode = language;
    let languageLabel = '';

    if (language === 'other') {
        languageLabel = otherLanguage!;
    } else {
        const selectedLanguage = languages.find(l => l.code === language);
        languageLabel = selectedLanguage ? selectedLanguage.label : language;
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

    return { success: true };

  } catch (e: any) {
    return {
      success: false,
      errors: { _form: ["Something went wrong on our end. Please try again."] },
    };
  }
}
