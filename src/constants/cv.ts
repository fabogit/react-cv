/**
 * Supported languages in the CV dataset.
 */
export const SUPPORTED_LANGUAGES = ["Italiano", "English"] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

/**
 * Supported asset categories for URL and file resolution.
 */
export type AssetCategory = "profile" | "headerIcon" | "workLogo" | "schoolLogo" | "legalSignature";

/**
 * Directory paths for public assets relative to the repository root.
 */
export const PUBLIC_ASSET_DIRS: Record<AssetCategory, readonly string[]> = {
  profile: ["src/assets/img/"],
  headerIcon: ["src/assets/icons/header/"],
  workLogo: ["src/assets/icons/work/"],
  schoolLogo: ["src/assets/icons/school/"],
  legalSignature: ["src/assets/img/"],
};

/**
 * Directory paths for private assets (with gitignored underscore directories) relative to the repository root.
 */
export const PRIVATE_ASSET_DIRS: Record<AssetCategory, readonly string[]> = {
  profile: ["src/assets/_img/", "src/assets/img/"],
  headerIcon: ["src/assets/icons/header/"],
  workLogo: ["src/assets/icons/_work/", "src/assets/icons/work/"],
  schoolLogo: ["src/assets/icons/_school/", "src/assets/icons/school/"],
  legalSignature: ["src/assets/_img/", "src/assets/img/"],
};

const ALLOWED_CONTACT_SCHEMES = new Set(["https:", "http:", "mailto:", "tel:"]);

/**
 * Validates whether a contact link URI has a permitted safe protocol scheme.
 * Only https:, http:, mailto:, and tel: are permitted (rejecting javascript:, data:, vbscript:, etc.).
 *
 * @param link - Untrusted contact link URL string.
 * @returns boolean indicating if the scheme is explicitly allowed.
 */
export const isSafeContactLink = (link: string): boolean => {
  if (typeof link !== "string") {
    return false;
  }
  const trimmed = link.trim();
  if (!trimmed) {
    return false;
  }
  try {
    const parsed = new URL(trimmed);
    return ALLOWED_CONTACT_SCHEMES.has(parsed.protocol);
  } catch {
    return false;
  }
};
