// src/lib/locale.ts

interface LocaleMapping {
  [key: string]: {
    languageCode: string;
    countryCode: string;
    countryName: string;
  };
}

// Mapeamento simplificado para normalização de idiomas e associação a um país principal.
// Uma implementação de produção usaria uma biblioteca de i18n mais robusta.
const localeMap: LocaleMapping = {
  // Portuguese
  portuguese: { languageCode: 'pt', countryCode: 'BR', countryName: 'Brazil' },
  português: { languageCode: 'pt', countryCode: 'BR', countryName: 'Brazil' },
  portugues: { languageCode: 'pt', countryCode: 'BR', countryName: 'Brazil' },
  
  // English
  english: { languageCode: 'en', countryCode: 'US', countryName: 'United States' },

  // Spanish
  spanish: { languageCode: 'es', countryCode: 'ES', countryName: 'Spain' },
  español: { languageCode: 'es', countryCode: 'ES', countryName: 'Spain' },
  espanhol: { languageCode: 'es', countryCode: 'ES', countryName: 'Spain' },

  // Japanese
  japanese: { languageCode: 'ja', countryCode: 'JP', countryName: 'Japan' },
  japonês: { languageCode: 'ja', countryCode: 'JP', countryName: 'Japan' },
  japones: { languageCode: 'ja', countryCode: 'JP', countryName: 'Japan' },
  日本語: { languageCode: 'ja', countryCode: 'JP', countryName: 'Japan' },

  // Chinese
  chinese: { languageCode: 'zh', countryCode: 'CN', countryName: 'China' },
  chinês: { languageCode: 'zh', countryCode: 'CN', countryName: 'China' },
  chines: { languageCode: 'zh', countryCode: 'CN', countryName: 'China' },

  // Hindi
  hindi: { languageCode: 'hi', countryCode: 'IN', countryName: 'India' },
};

const defaultLocale = { languageCode: 'en', countryCode: 'US', countryName: 'United States' };

/**
 * Determina o código do idioma, código do país e nome do país a partir de uma entrada de idioma.
 * @param languageInput O idioma digitado pelo usuário.
 * @returns Um objeto contendo languageCode, countryCode e countryName.
 */
export function getLocaleDetails(languageInput: string | null | undefined): { languageCode: string; countryCode: string; countryName: string; } {
  if (!languageInput) {
    return defaultLocale;
  }
  
  const normalizedInput = languageInput.trim().toLowerCase();
  
  // Procura por uma correspondência direta no mapa
  if (localeMap[normalizedInput]) {
    return localeMap[normalizedInput];
  }
  
  // Tenta encontrar uma correspondência parcial (ex: "inglês" em "english")
  for (const key in localeMap) {
    if (key.includes(normalizedInput) || normalizedInput.includes(key)) {
      return localeMap[key];
    }
  }

  // Retorna um padrão se nenhuma correspondência for encontrada
  return defaultLocale;
}
