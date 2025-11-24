// src/lib/locale.ts

interface LocaleDetail {
  languageCode: string;
  countryCode: string;
  countryName: string;
}

// A comprehensive mapping from various language names/codes to a primary country.
const localeMap: Record<string, LocaleDetail> = {
  // Major languages with primary countries
  english: { languageCode: 'en', countryCode: 'US', countryName: 'United States' },
  portuguese: { languageCode: 'pt', countryCode: 'BR', countryName: 'Brazil' },
  spanish: { languageCode: 'es', countryCode: 'ES', countryName: 'Spain' },
  japanese: { languageCode: 'ja', countryCode: 'JP', countryName: 'Japan' },
  chinese: { languageCode: 'zh', countryCode: 'CN', countryName: 'China' },
  hindi: { languageCode: 'hi', countryCode: 'IN', countryName: 'India' },
  french: { languageCode: 'fr', countryCode: 'FR', countryName: 'France' },
  german: { languageCode: 'de', countryCode: 'DE', countryName: 'Germany' },
  russian: { languageCode: 'ru', countryCode: 'RU', countryName: 'Russia' },
  arabic: { languageCode: 'ar', countryCode: 'SA', countryName: 'Saudi Arabia' },
  italian: { languageCode: 'it', countryCode: 'IT', countryName: 'Italy' },
  korean: { languageCode: 'ko', countryCode: 'KR', countryName: 'South Korea' },
  dutch: { languageCode: 'nl', countryCode: 'NL', countryName: 'Netherlands' },
  turkish: { languageCode: 'tr', countryCode: 'TR', countryName: 'Turkey' },
  vietnamese: { languageCode: 'vi', countryCode: 'VN', countryName: 'Vietnam' },
  polish: { languageCode: 'pl', countryCode: 'PL', countryName: 'Poland' },
  ukrainian: { languageCode: 'uk', countryCode: 'UA', countryName: 'Ukraine' },
  romanian: { languageCode: 'ro', countryCode: 'RO', countryName: 'Romania' },
  greek: { languageCode: 'el', countryCode: 'GR', countryName: 'Greece' },
  swedish: { languageCode: 'sv', countryCode: 'SE', countryName: 'Sweden' },
  czech: { languageCode: 'cs', countryCode: 'CZ', countryName: 'Czech Republic' },
  hungarian: { languageCode: 'hu', countryCode: 'HU', countryName: 'Hungary' },
  danish: { languageCode: 'da', countryCode: 'DK', countryName: 'Denmark' },
  finnish: { languageCode: 'fi', countryCode: 'FI', countryName: 'Finland' },
  norwegian: { languageCode: 'no', countryCode: 'NO', countryName: 'Norway' },
  hebrew: { languageCode: 'he', countryCode: 'IL', countryName: 'Israel' },
  thai: { languageCode: 'th', countryCode: 'TH', countryName: 'Thailand' },
  indonesian: { languageCode: 'id', countryCode: 'ID', countryName: 'Indonesia' },
  malay: { languageCode: 'ms', countryCode: 'MY', countryName: 'Malaysia' },
  
  // Aliases and alternative names
  português: { languageCode: 'pt', countryCode: 'BR', countryName: 'Brazil' },
  portugues: { languageCode: 'pt', countryCode: 'BR', countryName: 'Brazil' },
  español: { languageCode: 'es', countryCode: 'ES', countryName: 'Spain' },
  espanhol: { languageCode: 'es', countryCode: 'ES', countryName: 'Spain' },
  japonês: { languageCode: 'ja', countryCode: 'JP', countryName: 'Japan' },
  japones: { languageCode: 'ja', countryCode: 'JP', countryName: 'Japan' },
  日本語: { languageCode: 'ja', countryCode: 'JP', countryName: 'Japan' },
  chinês: { languageCode: 'zh', countryCode: 'CN', countryName: 'China' },
  chines: { languageCode: 'zh', countryCode: 'CN', countryName: 'China' },
  mandarin: { languageCode: 'zh', countryCode: 'CN', countryName: 'China' },
  français: { languageCode: 'fr', countryCode: 'FR', countryName: 'France' },
  deutsch: { languageCode: 'de', countryCode: 'DE', countryName: 'Germany' },
  alemão: { languageCode: 'de', countryCode: 'DE', countryName: 'Germany' },
  italiano: { languageCode: 'it', countryCode: 'IT', countryName: 'Italy' },
  latin: { languageCode: 'la', countryCode: 'VA', countryName: 'Vatican City' },
  latim: { languageCode: 'la', countryCode: 'VA', countryName: 'Vatican City' },

  // ISO codes
  en: { languageCode: 'en', countryCode: 'US', countryName: 'United States' },
  pt: { languageCode: 'pt', countryCode: 'BR', countryName: 'Brazil' },
  es: { languageCode: 'es', countryCode: 'ES', countryName: 'Spain' },
  ja: { languageCode: 'ja', countryCode: 'JP', countryName: 'Japan' },
  zh: { languageCode: 'zh', countryCode: 'CN', countryName: 'China' },
  hi: { languageCode: 'hi', countryCode: 'IN', countryName: 'India' },
  fr: { languageCode: 'fr', countryCode: 'FR', countryName: 'France' },
  de: { languageCode: 'de', countryCode: 'DE', countryName: 'Germany' },
  ru: { languageCode: 'ru', countryCode: 'RU', countryName: 'Russia' },
  ar: { languageCode: 'ar', countryCode: 'SA', countryName: 'Saudi Arabia' },
  it: { languageCode: 'it', countryCode: 'IT', countryName: 'Italy' },
  ko: { languageCode: 'ko', countryCode: 'KR', countryName: 'South Korea' },
  nl: { languageCode: 'nl', countryCode: 'NL', countryName: 'Netherlands' },
  la: { languageCode: 'la', countryCode: 'VA', countryName: 'Vatican City' },
};

const defaultLocale: LocaleDetail = { languageCode: 'en', countryCode: 'US', countryName: 'United States' };

/**
 * Determines the language code, country code, and country name from a language input.
 * @param languageInput The language typed by the user.
 * @returns An object containing languageCode, countryCode, and countryName.
 */
export function getLocaleDetails(languageInput: string | null | undefined): LocaleDetail {
  if (!languageInput) {
    return defaultLocale;
  }
  
  // Normalize the input: lowercase and trim whitespace
  const normalizedInput = languageInput.trim().toLowerCase();
  
  // Look for a direct match in the map (covers primary names, aliases, and ISO codes)
  if (localeMap[normalizedInput]) {
    return localeMap[normalizedInput];
  }
  
  // If no direct match, try to find a partial match (e.g., "english" in "us-english")
  for (const key in localeMap) {
    if (normalizedInput.includes(key) || key.includes(normalizedInput)) {
      return localeMap[key];
    }
  }

  // Return a sensible default if no match is found
  return defaultLocale;
}
