/**
 * Supported asset categories for URL resolution.
 */
export type AssetCategory = 'profile' | 'headerIcon' | 'workLogo' | 'schoolLogo' | 'legalSignature';

/**
 * Eagerly import all assets from src/assets to ensure Vite includes them in the production build.
 */
const assetModules = import.meta.glob<string>('../assets/**/*.{png,jpg,jpeg,webp,svg}', {
  eager: true,
  import: 'default',
});

/**
 * Primary directory path mappings for each asset category.
 */
const categoryMap: Record<AssetCategory, string[]> = {
  profile: ['../assets/_img/', '../assets/img/'],
  headerIcon: ['../assets/icons/header/'],
  workLogo: ['../assets/icons/_work/', '../assets/icons/work/'],
  schoolLogo: ['../assets/icons/school/'],
  legalSignature: ['../assets/_img/', '../assets/img/'],
};

/**
 * Resolves an asset filename to a full bundled URL using Vite `import.meta.glob`.
 *
 * @param category - The category of the asset determining its folder location.
 * @param filename - The filename of the asset (e.g. "profile.jpg", "mail.png").
 * @returns Resolved URL string or an empty string if resolution fails or filename is missing.
 */
export const getAssetUrl = (category: AssetCategory, filename: string): string => {
  if (!filename) return '';

  const possiblePaths = categoryMap[category] || [];
  for (const basePath of possiblePaths) {
    const key = `${basePath}${filename}`;
    if (assetModules[key]) {
      return assetModules[key];
    }
  }

  // Fallback: search for exact filename match anywhere in assetModules
  const fallbackKey = Object.keys(assetModules).find((key) => key.endsWith(`/${filename}`));
  if (fallbackKey && assetModules[fallbackKey]) {
    return assetModules[fallbackKey];
  }

  console.warn(`Failed to resolve asset for category "${category}" and filename "${filename}"`);
  return '';
};
