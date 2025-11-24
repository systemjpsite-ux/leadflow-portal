
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
  otherLanguage: z.string().optional(),
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
  
  try {
    const rawData = {
      name: formData.get("name"),
      email: formData.get("email"),
      niche: formData.get("niche"),
      language: formData.get("language"),
      agentOrigin: formData.get("agentOrigin"),
      otherLanguage: formData.get("otherLanguage"),
    };

    const validatedFields = leadSchema.safeParse(rawData);

    if (!validatedFields.success) {
      return {
        success: false,
        fieldErrors: validatedFields.error.flatten().fieldErrors,
      };
    }
    
    if (validatedFields.data.language === 'other' && !validatedFields.data.otherLanguage) {
        return {
            success: false,
            fieldErrors: {
                otherLanguage: ["Please specify the language when 'Other' is selected."],
            }
        }
    }

    const { name, email, niche, language, agentOrigin, otherLanguage } = validatedFields.data;

    const leadsRef = collection(db, "leads");
    const q = query(leadsRef, where("email", "==", email.toLowerCase()));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return {
        success: false,
        fieldErrors: { email: ["This email is already registered."] },
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
      agent: agentOrigin,
      timestamp: serverTimestamp(),
      status: "new",
    });

    return { success: true };

  } catch (e: any) {
    return {
      success: false,
      formError: "An unexpected error occurred. Please try again.",
    };
  }
}
