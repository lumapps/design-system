export interface Locale {
    /** ISO locale code `lang-REGION` (ex: `en-US`) */
    code: string;
    /** ISO locale language code (ex: `en`) */
    language: string;
    /** ISO locale region code (ex: `US`) */
    region?: string;
}
