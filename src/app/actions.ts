'use server';

import { z } from 'zod';
import { db } from '@/lib/firebase';
import { doc, writeBatch, serverTimestamp } from 'firebase/firestore';

// A local, simplified map to get a language code for the API call.
const languageToCodeMap: Record<string, string> = {
  english: 'en',
  portuguese: 'pt',
  spanish: 'es',
  japanese: 'ja',
  chinese: 'zh',
  hindi: 'hi',
  french: 'fr',
  german: 'de',
  russian: 'ru',
  arabic: 'ar',
  italian: 'it',
  korean: 'ko',
  dutch: 'nl',
  turkish: 'tr',
  vietnamese: 'vi',
  polish: 'pl',
  ukrainian: 'uk',
  romanian: 'ro',
  greek: 'el',
  swedish: 'sv',
  czech: 'cs',
  hungarian: 'hu',
  danish: 'da',
  finnish: 'fi',
  norwegian: 'no',
  hebrew: 'he',
  thai: 'th',
  indonesian: 'id',
  malay: 'ms',
  português: 'pt',
  español: 'es',
  japonês: 'ja',
  chinês: 'zh',
  français: 'fr',
  deutsch: 'de',
  alemão: 'de',
  italiano: 'it',
  latin: 'la',
  latim: 'la',
  en: 'en',
  pt: 'pt',
  es: 'es',
  ja: 'ja',
  zh: 'zh',
  hi: 'hi',
  fr: 'fr',
  de: 'de',
  ru: 'ru',
  ar: 'ar',
  it: 'it',
  ko: 'ko',
  nl: 'nl',
  la: 'la',
};

async function getCountryFromLanguage(language: string): Promise<{ countryCode: string; countryName: string }> {
  const normalizedLanguage = language.trim().toLowerCase();
  const langCode = languageToCodeMap[normalizedLanguage] || normalizedLanguage; // Use map or fallback to input

  try {
    const response = await fetch(`https://restcountries.com/v3.1/lang/${langCode}`);
    if (!response.ok) {
      console.warn(`Could not find country for language: ${langCode}. Defaulting to US.`);
      return { countryCode: 'US', countryName: 'United States' };
    }
    const data = await response.json();
    
    // Use the first country from the list as the primary one.
    if (data && data.length > 0) {
      const country = data[0];
      return {
        countryCode: country.cca2 || 'N/A',
        countryName: country.name.common || 'Unknown',
      };
    }
  } catch (error) {
    console.error('Error fetching country data:', error);
  }

  // Default fallback
  return { countryCode: 'US', countryName: 'United States' };
}


export type RegisterLeadResult = {
  success: boolean;
  message?: string;
  fieldErrors?: {
    name?: string;
    email?: string;
    niche?: string;
    language?: string;
  };
  formError?: string;
};

const leadSchema = z.object({
  name: z.string().trim().min(1, { message: 'Name is required' }),
  email: z.string().trim().email({ message: 'Invalid email address' }),
  niche: z.enum(['Health', 'Wealth', 'Relationships'], {
    errorMap: () => ({ message: 'Niche is required' }),
  }),
  language: z.string().trim().min(1, { message: 'Language is required' }),
});

const nicheToAgentOrigin: Record<string, string> = {
  Health: 'Vendedor de Saúde',
  Wealth: 'Vendedor de Dinheiro',
  Relationships: 'Vendedor de Relacionamento',
};

const nicheToCollection: Record<string, string> = {
  Health: 'saude',
  Wealth: 'dinheiro',
  Relationships: 'relacionamento',
};

export async function registerLead(
  prevState: RegisterLeadResult,
  formData: FormData
): Promise<RegisterLeadResult> {
  const rawData = {
    name: formData.get('name'),
    email: formData.get('email'),
    niche: formData.get('niche'),
    language: formData.get('language'),
  };

  const validatedFields = leadSchema.safeParse(rawData);

  if (!validatedFields.success) {
    const fieldErrors = validatedFields.error.flatten().fieldErrors;
    return {
      success: false,
      fieldErrors: {
        name: fieldErrors.name?.[0],
        email: fieldErrors.email?.[0],
        niche: fieldErrors.niche?.[0],
        language: fieldErrors.language?.[0],
      },
      formError: 'Please correct the errors below.',
    };
  }

  const { name, email, niche, language: languageInput } = validatedFields.data;
  const emailId = email.toLowerCase();
  
  const agentOrigin = nicheToAgentOrigin[niche];
  const { countryCode, countryName } = await getCountryFromLanguage(languageInput);
  const nicheCollection = nicheToCollection[niche];

  const leadData = {
    name,
    email: emailId,
    niche,
    language: languageInput, // The original text typed by the agent
    country: countryName,   // The detected country name
    agentOrigin,
    status: 'new',
    createdAt: serverTimestamp(),
  };

  try {
    const batch = writeBatch(db);

    // 1. Main leads collection
    const leadRef = doc(db, 'leads', emailId);
    batch.set(leadRef, leadData);

    // 2. Countries collection
    const countryLeadRef = doc(db, `pais/${countryCode}/leads`, emailId);
    batch.set(countryLeadRef, { registeredAt: serverTimestamp() });

    // 3. Niche-specific collection
    if (nicheCollection) {
      const nicheLeadRef = doc(db, nicheCollection, emailId);
      // For niche collections, we store the full lead data as well
      batch.set(nicheLeadRef, leadData);
    }
    
    await batch.commit();

    console.log('Lead saved successfully across multiple collections:', emailId);

    return { success: true, message: 'Lead registered successfully!' };
  } catch (error) {
    console.error('Error registering lead with batch write:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage.includes('permission-denied')) {
       return {
        success: false,
        formError: 'You do not have permission to perform this action.',
        fieldErrors: {},
      };
    }
    return {
      success: false,
      formError: 'An internal error occurred while saving the lead.',
      fieldErrors: {},
    };
  }
}
