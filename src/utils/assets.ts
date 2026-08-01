/**
 * Supported asset categories for URL resolution.
 */
export type AssetCategory = 'profile' | 'headerIcon' | 'workLogo' | 'schoolLogo' | 'legalSignature';

/**
 * Internal mapping between asset categories and their relative directory paths.
 */
const categoryMap: Record<AssetCategory, string> = {
  profile: '../assets/_img/',
  headerIcon: '../assets/icons/header/',
  workLogo: '../assets/icons/_work/',
  schoolLogo: '../assets/icons/school/',
  legalSignature: '../assets/_img/',
};

/**
 * Resolves an asset filename to a full absolute URL safely using Vite `import.meta.url`.
 *
 * @param category - The category of the asset determining its folder location.
 * @param filename - The filename of the asset (e.g. "profile.jpg", "mail.png").
 * @returns Resolved URL string or an empty string if resolution fails or filename is missing.
 */
export const getAssetUrl = (category: AssetCategory, filename: string): string => {
  if (!filename) return '';

  try {
    const basePath = categoryMap[category];
    return new URL(`${basePath}${filename}`, import.meta.url).href;
  } catch (error) {
    console.warn(`Failed to resolve asset for category "${category}" and filename "${filename}":`, error);
    return '';
  }
};
