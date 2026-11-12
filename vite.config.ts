import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import compression from "vite-plugin-compression";
import { generateCvPdfVariants } from "./scripts/pdfGenerator.ts";

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, ".", "VITE_");
  const isPrivateProfile =
    mode === "private" ||
    (command === "serve" && mode !== "public" && env.VITE_CV_PROFILE === "private");
  const rawPrivateDataFile = env.VITE_CV_DATA_FILE?.trim() || "cvData.revised.json";

  if (
    !rawPrivateDataFile ||
    rawPrivateDataFile.includes("..") ||
    rawPrivateDataFile.includes("/") ||
    rawPrivateDataFile.includes("\\") ||
    !rawPrivateDataFile.endsWith(".json")
  ) {
    throw new Error(
      `Invalid VITE_CV_DATA_FILE: "${rawPrivateDataFile}". Must be a plain .json filename located inside src/assets/data/.`,
    );
  }
  const privateDataFile = rawPrivateDataFile;

  return {
    plugins: [
      {
        name: "cv-pdf-generator",
        buildStart() {
          generateCvPdfVariants({
            isPrivateProfile,
            privateDataFile,
            outputDir: path.resolve(process.cwd(), "public/pdf"),
          });
        },
      },
      {
        name: "cv-profile-adapter",
        enforce: "pre",
        async resolveId(source, importer) {
          if (!isPrivateProfile) {
            return null;
          }

          if (
            source.endsWith("/adapters/cvProfile.public") ||
            source.endsWith("/adapters/cvProfile.public.ts")
          ) {
            return this.resolve(
              source.replace("/adapters/cvProfile.public", "/adapters/cvProfile.private"),
              importer,
              { skipSelf: true },
            );
          }

          if (
            importer?.endsWith("/adapters/cvProfile.private.ts") &&
            source === "../assets/data/cvData.json"
          ) {
            const resolvedPrivateData = await this.resolve(
              `../assets/data/${privateDataFile}`,
              importer,
              { skipSelf: true },
            );
            if (!resolvedPrivateData) {
              throw new Error(
                `Private CV data file "${privateDataFile}" could not be resolved from src/assets/data/. Ensure the file exists or check VITE_CV_DATA_FILE.`,
              );
            }
            return resolvedPrivateData;
          }

          return null;
        },
      },
      react(),
      compression({
        algorithm: "gzip", // Can be 'gzip' or 'brotliCompress'
        ext: ".gz", // Extension of compressed files
        deleteOriginFile: false, // Retain original uncompressed files
        threshold: 10240, // Compress only files larger than 10KB
      }),
      compression({
        algorithm: "brotliCompress", // Enable Brotli compression as well
        ext: ".br",
        deleteOriginFile: false,
        threshold: 10240,
      }),
    ],
    build: {
      cssCodeSplit: true, // Optimize CSS by generating separate files
      sourcemap: false, // Disable sourcemaps in production
    },
  };
});
