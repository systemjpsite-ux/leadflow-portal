'use server';

import { z } from 'zod';
import { db } from '@/lib/firebase';

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
  name: z.string().trim().min(1, { message: 'Name is required' }),
  email: z.string().trim().email({ message: 'Invalid email address' }),
  niche: z.string().min(1, { message: 'Niche is required' }),
  language: z.string().trim().min(1, { message: 'Language is required' }),
  agentOrigin: z.string().min(1, { message: 'Agent origin is required' }),
});

export async function registerLead(
  prevState: RegisterLeadResult | null,
  formData: FormData
): Promise<RegisterLeadResult> {
  const rawData = {
    name: formData.get('name'),
    email: formData.get('email'),
    niche: formData.get('niche'),
    language: formData.get('language'),
    agentOrigin: formData.get('agentOrigin'),
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
        agentOrigin: fieldErrors.agentOrigin?.[0],
      },
    };
  }
  
  const { name, email, niche, language, agentOrigin } = validatedFields.data;

  try {
    const leadRef = db.collection('leads').doc(email.toLowerCase());
    
    await leadRef.set({
      name,
      email: email.toLowerCase(),
      niche,
      language,
      agentOrigin,
      createdAt: new Date().toISOString(),
    }, { merge: true });

    console.log('Lead saved:', email);

    return { success: true, message: 'Lead registered successfully.' };
  } catch (error) {
    console.error('Error saving lead to Firestore:', error);
    return { success: false, message: 'Internal error while saving lead.' };
  }
}
