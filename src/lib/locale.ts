// src/lib/locale.ts
// Utilidades de idioma/país

// Remove acentos e normaliza para minúsculas
export function normalizeText(input: string): string {
  return (input || "")
    .normalize("NFD")
    .replace(/\p{Diacritic}+/gu, "")
    .toLowerCase()
    .trim();
}

// Mapa de sinônimos -> ISO 639-1 (2 letras)
// Pode expandir à vontade; já cobre as principais entradas multi-idioma.
const LANG_SYNONYMS_TO_ISO2: Record<string, string> = {
  // Alemão
  "alemao": "de", "alemã": "de", "alemao (de)": "de",
  "alemán": "de", "german": "de", "deutsch": "de", "de": "de",
  // Inglês
  "ingles": "en", "inglês": "en", "inglese": "en", "english": "en", "en": "en",
  // Francês
  "frances": "fr", "francês": "fr", "francais": "fr", "français": "fr", "french": "fr", "fr": "fr",
  // Japonês
  "japones": "ja", "japonês": "ja", "nihongo": "ja", "japanese": "ja", "ja": "ja",
  // Português
  "portugues": "pt", "português": "pt", "portuguese": "pt", "pt": "pt",
  // Espanhol
  "espanhol": "es", "espanol": "es", "español": "es", "spanish": "es", "es": "es",
  // Italiano
  "italiano": "it", "italian": "it", "it": "it",
  // Chinês (mandarim genérico)
  "chines": "zh", "chinês": "zh", "chino": "zh", "chinese": "zh", "zh": "zh",
  // Hindi
  "hindi": "hi", "hi": "hi",
  // Árabe
  "arabe": "ar", "árabe": "ar", "arabic": "ar", "ar": "ar",
  // Russo
  "russo": "ru", "ruso": "ru", "russian": "ru", "ru": "ru",
  // Coreano
  "coreano": "ko", "korean": "ko", "ko": "ko",
  // Turco
  "turco": "tr", "turkish": "tr", "tr": "tr",
  // Holandês
  "holandes": "nl", "holandês": "nl", "dutch": "nl", "nl": "nl",
  // Sueco
  "sueco": "sv", "swedish": "sv", "sv": "sv",
  // Norueguês
  "noruegues": "no", "norueguês": "no", "norwegian": "no", "no": "no",
  // Dinamarquês
  "dinamarques": "da", "dinamarquês": "da", "danish": "da", "da": "da",
  // Polonês
  "polones": "pl", "polonês": "pl", "polish": "pl", "pl": "pl",
  // Grego
  "grego": "el", "greek": "el", "el": "el",
  // Tailandês
  "tailandes": "th", "tailandês": "th", "thai": "th", "th": "th",
  // Vietnamita
  "vietnamita": "vi", "vietnamese": "vi", "vi": "vi",
  // Indonésio
  "indonesio": "id", "indonésio": "id", "indonesian": "id", "id": "id",
  // Malaio
  "malayo": "ms", "malaio": "ms", "malay": "ms", "ms": "ms",
  // Hebraico
  "hebraico": "he", "hebrew": "he", "he": "he",
  // Persa / Farsi
  "persa": "fa", "farsi": "fa", "fa": "fa",
  // Ucraniano
  "ucraniano": "uk", "ukrainian": "uk", "uk": "uk",
  // Bengali
  "bengali": "bn", "bangla": "bn", "bn": "bn",
  // Punjabi
  "punjabi": "pa", "panjabi": "pa", "pa": "pa",
  // Latim
  "latim": "la", "latin": "la", "la": "la",
};

// Alguns nomes EN para fallback (case normalized)
export const ISO2_TO_ENGLISH_NAME: Record<string, string> = {
  de: "german",
  en: "english",
  fr: "french",
  ja: "japanese",
  pt: "portuguese",
es: "spanish",
  it: "italian",
  zh: "chinese",
  hi: "hindi",
  ar: "arabic",
  ru: "russian",
  ko: "korean",
  tr: "turkish",
  nl: "dutch",
  sv: "swedish",
  no: "norwegian",
  da: "danish",
  pl: "polish",
  el: "greek",
  th: "thai",
  vi: "vietnamese",
  id: "indonesian",
  ms: "malay",
  he: "hebrew",
  fa: "persian",
  uk: "ukrainian",
  bn: "bengali",
  pa: "punjabi",
  la: "latin",
};

// Converte o texto digitado para um ISO 639-1, quando possível
export function toIso2Language(input: string): string | null {
  const key = normalizeText(input);
  return LANG_SYNONYMS_TO_ISO2[key] || null;
}