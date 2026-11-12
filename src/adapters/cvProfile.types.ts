import type { AssetCategory } from "../constants/cv";
import type { CvDataSchema } from "../types/cv";

export type { AssetCategory };

/**
 * Interface contract satisfied by both public (cloud) and private (local) CV profile adapters.
 */
export interface CvProfileAdapter {
  readonly cvData: CvDataSchema;
  readonly getAssetUrl: (category: AssetCategory, filename: string) => string;
}

/**
 * Resolves an asset filename against a provided module map and category directory mapping.
 * Strictly searches only within the specified category's candidate directories without cross-category fallback.
 */
export const resolveAssetFromModules = (
  assetModules: Record<string, string>,
  categoryMap: Record<AssetCategory, readonly string[]>,
  category: AssetCategory,
  filename: string,
): string => {
  if (!filename) return "";

  const possiblePaths = categoryMap[category] ?? [];
  for (const basePath of possiblePaths) {
    const cleanBase = basePath.replace(/^\/+/, "");
    const candidates = [
      `/${cleanBase}${filename}`,
      `../${cleanBase.replace(/^src\//, "")}${filename}`,
      `${cleanBase}${filename}`,
    ];
    for (const key of candidates) {
      const resolved = assetModules[key];
      if (resolved) {
        return resolved;
      }
    }
  }

  console.warn(`Failed to resolve asset for category "${category}" and filename "${filename}"`);
  return "";
};
