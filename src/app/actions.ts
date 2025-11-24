'use server';

import { z } from 'zod';
import { db } from '@/lib/firebase';
import {
  doc,
  writeBatch,
  serverTimestamp,
} from 'firebase/firestore';
import { getLocaleDetails } from '@/lib/locale';

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
  const { languageCode, countryCode, countryName } = getLocaleDetails(languageInput);
  const nicheCollection = nicheToCollection[niche];

  const leadData = {
    name,
    email: emailId,
    niche,
    languageInput, // The original text typed by the agent
    languageCode,  // The detected ISO language code
    countryCode,   // The detected ISO country code
    countryName,   // The detected country name
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
