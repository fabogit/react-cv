import activeCvData from "../assets/data/cvData.json";
import { PRIVATE_ASSET_DIRS, type AssetCategory } from "../constants/cv";
import type { CvDataSchema } from "../types/cv";
import { validateCvData } from "../utils/validateCvData";
import { resolveAssetFromModules } from "./cvProfile.types";

/**
 * Private asset modules including gitignored underscore directories (_img, _work, _school)
 * alongside shared public header icons and fallback directories.
 */
const privateAssetModules = import.meta.glob<string>(
  [
    "../assets/_img/**/*.{png,jpg,jpeg,webp,svg}",
    "../assets/img/**/*.{png,jpg,jpeg,webp,svg}",
    "../assets/icons/header/**/*.{png,jpg,jpeg,webp,svg}",
    "../assets/icons/_work/**/*.{png,jpg,jpeg,webp,svg}",
    "../assets/icons/work/**/*.{png,jpg,jpeg,webp,svg}",
    "../assets/icons/_school/**/*.{png,jpg,jpeg,webp,svg}",
    "../assets/icons/school/**/*.{png,jpg,jpeg,webp,svg}",
  ],
  {
    eager: true,
    import: "default",
  },
);

/**
 * Resolved at compile/serve time by the Vite `cv-profile-adapter` plugin to the single
 * JSON file specified in `VITE_CV_DATA_FILE` (or `cvData.revised.json`).
 */
export const cvData: CvDataSchema = validateCvData(activeCvData, "cvProfile.private");

export const getAssetUrl = (category: AssetCategory, filename: string): string =>
  resolveAssetFromModules(privateAssetModules, PRIVATE_ASSET_DIRS, category, filename);
