'use server';

import { z } from 'zod';
import { db } from '@/lib/firebase';
import { doc, writeBatch, serverTimestamp, setDoc } from 'firebase/firestore';
import { toIso2Language, ISO2_TO_ENGLISH_NAME } from '@/lib/locale';

async function fetchCountryByLanguage(langIso2OrName: string) {
  const url = `https://restcountries.com/v3.1/lang/${encodeURIComponent(langIso2OrName)}`;
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return [];
    return (await res.json()) as any[];
  } catch (error) {
    console.error(`Error fetching country for language '${langIso2OrName}':`, error);
    return [];
  }
}

async function resolveCountryFromLanguage(inputLanguage: string) {
  // 1) normaliza para ISO2 quando possível
  const iso2 = toIso2Language(inputLanguage);

  // 2) tenta com iso2 primeiro
  if (iso2) {
    let list = await fetchCountryByLanguage(iso2);
    if (Array.isArray(list) && list.length > 0) {
      const c = list[0];
      return {
        countryCode: (c.cca2 || '').toUpperCase(),
        countryName: c?.name?.common || '',
      };
    }
    // 3) fallback: tenta com nome inglês da língua
    const enName = ISO2_TO_ENGLISH_NAME[iso2];
    if (enName) {
      list = await fetchCountryByLanguage(enName);
      if (Array.isArray(list) && list.length > 0) {
        const c = list[0];
        return {
          countryCode: (c.cca2 || '').toUpperCase(),
          countryName: c?.name?.common || '',
        };
      }
    }
  }

  // 4) último recurso: tenta direto com o texto normalizado (sem acentos)
  const tryRaw = inputLanguage.normalize('NFD').replace(/\p{Diacritic}+/gu, '').toLowerCase().trim();
  if (tryRaw) {
      let list = await fetchCountryByLanguage(tryRaw);
      if (Array.isArray(list) && list.length > 0) {
        const c = list[0];
        return {
          countryCode: (c.cca2 || '').toUpperCase(),
          countryName: c?.name?.common || '',
        };
      }
  }


  // Se nada deu certo, devolve nulos (não quebra o submit)
  return { countryCode: 'N/A', countryName: 'Unknown' };
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

  const { name, email, niche, language } = validatedFields.data;
  const emailId = email.toLowerCase();
  
  const agentOrigin = nicheToAgentOrigin[niche];
  const { countryCode, countryName } = await resolveCountryFromLanguage(language);
  const nicheCollection = nicheToCollection[niche];

  const leadData = {
    name,
    email: emailId,
    niche,
    language: language,
    country: countryName,
    agentOrigin,
    status: 'new',
    createdAt: serverTimestamp(),
  };
  
  const countryLeadData = {
    name,
    email: emailId,
    niche,
    language,
    countryCode, // Adicionando para consistência
    countryName,
    status: 'new',
    agentOrigin,
    createdAt: serverTimestamp(),
  };

  try {
    const batch = writeBatch(db);

    // 1. Main leads collection
    const leadRef = doc(db, 'leads', emailId);
    batch.set(leadRef, leadData);

    // 2. Countries collection (using countryName as document ID)
    if (countryName && countryName !== 'Unknown') {
        const countryLeadRef = doc(db, `pais/${countryName}/leads`, emailId);
        batch.set(countryLeadRef, countryLeadData);
    }
    

    // 3. Niche-specific collection
    if (nicheCollection) {
      const nicheLeadRef = doc(db, nicheCollection, emailId);
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
