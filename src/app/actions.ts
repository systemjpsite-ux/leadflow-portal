
"use server";

import { z } from "zod";
import { addDoc, collection, getDocs, query, serverTimestamp, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Define the shape of the state object returned by the action
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

// Define the validation schema using Zod
const leadSchema = z.object({
  name: z.string().min(1, { message: "Full name is required." }),
  email: z.string().email({ message: "Invalid email address." }),
  niche: z.string().min(1, { message: "Please select a niche." }),
  language: z.string().min(1, { message: "Please select a language." }),
  otherLanguage: z.string().optional(),
  agent: z.string().min(1, { message: "Please select an agent origin." }),
}).refine(data => {
  // If 'other' is selected for language, the 'otherLanguage' field must not be empty.
  if (data.language === 'other') {
    return data.otherLanguage && data.otherLanguage.trim().length > 0;
  }
  return true;
}, {
  message: "Please specify the language when 'Other' is selected.",
  path: ["otherLanguage"], // This specifies which field the error message is associated with
});

// A list of languages to populate the dropdown and for validation
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
  
  // Safely get form data and ensure they are strings, not null.
  const rawData = {
    name: formData.get("name") || "",
    email: formData.get("email") || "",
    niche: formData.get("niche") || "",
    language: formData.get("language") || "",
    otherLanguage: formData.get("otherLanguage") || "",
    agent: formData.get("agent") || "",
  };
  
  // Validate the data against the Zod schema
  const validatedFields = leadSchema.safeParse(rawData);

  if (!validatedFields.success) {
    // If validation fails, return the errors in a structured object
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, email, niche, language, agent, otherLanguage } = validatedFields.data;

  try {
    // Check if the email already exists in the Firestore 'leads' collection
    const leadsRef = collection(db, "leads");
    const q = query(leadsRef, where("email", "==", email.toLowerCase()));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // If the email exists, return a specific error for the email field
      return {
        success: false,
        errors: { email: ["This email is already registered."] },
      };
    }
    
    // Determine the correct language code and label to save
    let languageCode = language;
    let languageLabel = '';

    if (language === 'other') {
        languageLabel = otherLanguage!;
    } else {
        const selectedLanguage = languages.find(l => l.code === language);
        languageLabel = selectedLanguage ? selectedLanguage.label : language; // Fallback to code if not found
    }

    // Add the new lead to Firestore
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

    // On success, return a simple success object
    return { success: true };

  } catch (e: any) {
    console.error("Error adding document: ", e);
    // In case of a database or other server error, return a generic error message
    return {
      success: false,
      errors: { _form: ["Something went wrong on our end. Please try again."] },
    };
  }
}
