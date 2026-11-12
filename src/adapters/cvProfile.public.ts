import rawPublicCvData from "../assets/data/cvData.json";
import { PUBLIC_ASSET_DIRS, type AssetCategory } from "../constants/cv";
import type { CvDataSchema } from "../types/cv";
import { validateCvData } from "../utils/validateCvData";
import { resolveAssetFromModules } from "./cvProfile.types";

/**
 * Public asset modules strictly restricted to git-tracked non-underscore folders.
 * Private directories (_img, _work, _school) are never matched or bundled here.
 */
const publicAssetModules = import.meta.glob<string>(
  [
    "../assets/img/**/*.{png,jpg,jpeg,webp,svg}",
    "../assets/icons/header/**/*.{png,jpg,jpeg,webp,svg}",
    "../assets/icons/work/**/*.{png,jpg,jpeg,webp,svg}",
    "../assets/icons/school/**/*.{png,jpg,jpeg,webp,svg}",
  ],
  {
    eager: true,
    import: "default",
  },
);

export const cvData: CvDataSchema = validateCvData(rawPublicCvData, "cvData.json");

export const getAssetUrl = (category: AssetCategory, filename: string): string =>
  resolveAssetFromModules(publicAssetModules, PUBLIC_ASSET_DIRS, category, filename);
