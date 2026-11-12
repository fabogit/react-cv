import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { NodeCompiler } from "@myriaddreamin/typst-ts-node-compiler";
import { loadEnv } from "vite";
import {
  PRIVATE_ASSET_DIRS,
  PUBLIC_ASSET_DIRS,
  SUPPORTED_LANGUAGES,
  type AssetCategory,
  type SupportedLanguage,
} from "../src/constants/cv.ts";
import { formatCvDate, formatLocalIsoDate } from "../src/utils/formatters.ts";
import { validateCvData } from "../src/utils/validateCvData.ts";

export type { AssetCategory };

const LANGUAGE_NAME_TO_ISO: Record<string, string> = {
  italiano: "IT",
  italian: "IT",
  inglese: "GB",
  english: "GB",
  spagnolo: "ES",
  spanish: "ES",
  olandese: "NL",
  dutch: "NL",
  francese: "FR",
  french: "FR",
  tedesco: "DE",
  german: "DE",
  portoghese: "PT",
  portuguese: "PT",
  giapponese: "JP",
  japanese: "JP",
  cinese: "CN",
  chinese: "CN",
  russo: "RU",
  russian: "RU",
  polacco: "PL",
  polish: "PL",
  svedese: "SE",
  swedish: "SE",
  norvegese: "NO",
  norwegian: "NO",
  danese: "DK",
  danish: "DK",
  finlandese: "FI",
  finnish: "FI",
  svizzero: "CH",
  swiss: "CH",
  austriaco: "AT",
  austrian: "AT",
  belga: "BE",
  belgian: "BE",
  greco: "GR",
  greek: "GR",
  irlandese: "IE",
  irish: "IE",
  statunitense: "US",
  american: "US",
};

/**
 * Decodes a Unicode regional indicator flag emoji (e.g. 🇮🇹 -> IT) or resolves an ISO code
 * from common localized language names (e.g. "Italiano" -> "IT").
 *
 * @param flag - Optional Unicode flag emoji string.
 * @param languageName - Optional language display name for fallback mapping.
 * @returns 2-letter uppercase ISO country code, or an empty string if unresolvable.
 */
export const decodeFlagEmoji = (flag?: string, languageName?: string): string => {
  if (flag) {
    const codePoints = [...flag].map((char) => char.codePointAt(0) ?? 0);
    const first = codePoints[0];
    const second = codePoints[1];
    if (
      codePoints.length >= 2 &&
      first !== undefined &&
      second !== undefined &&
      first >= 0x1f1e6 &&
      first <= 0x1f1ff &&
      second >= 0x1f1e6 &&
      second <= 0x1f1ff
    ) {
      return String.fromCharCode(first - 0x1f1e6 + 65, second - 0x1f1e6 + 65);
    }
  }

  if (languageName) {
    const normalized = languageName.trim().toLowerCase();
    const isoCode = LANGUAGE_NAME_TO_ISO[normalized];
    if (isoCode) {
      return isoCode;
    }
  }

  return "";
};

/**
 * Resolves an asset filename against the disk hierarchy, strictly isolating public from private
 * directories based on the `isPrivateProfile` parameter and enforcing directory containment.
 *
 * @param category - Category of asset to resolve.
 * @param filename - Base filename of the asset (e.g. "profile.jpg").
 * @param isPrivateProfile - Whether private underscore folders are allowed.
 * @param rootDir - Root directory of the repository workspace.
 * @returns Root-relative path formatted for Typst (e.g. "/src/assets/_img/profile.jpg") or undefined.
 */
export const resolveAssetPath = (
  category: AssetCategory,
  filename: string | undefined,
  isPrivateProfile: boolean,
  rootDir: string,
): string | undefined => {
  if (!filename || typeof filename !== "string") {
    return undefined;
  }

  if (filename.includes("..") || path.isAbsolute(filename)) {
    return undefined;
  }

  const candidateDirs = isPrivateProfile
    ? PRIVATE_ASSET_DIRS[category]
    : PUBLIC_ASSET_DIRS[category];

  for (const dir of candidateDirs) {
    const baseDir = path.resolve(rootDir, dir);
    const fullPath = path.resolve(baseDir, filename);

    // Enforce strict containment inside baseDir
    const relToBase = path.relative(baseDir, fullPath);
    if (relToBase.startsWith("..") || path.isAbsolute(relToBase) || relToBase === "") {
      continue;
    }

    try {
      if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
        const relativeToRoot = path.relative(rootDir, fullPath).replace(/\\/g, "/");
        return `/${relativeToRoot.replace(/^\//, "")}`;
      }
    } catch {
      continue;
    }
  }

  return undefined;
};

export interface GenerateCvPdfOptions {
  /** Root directory of the repository workspace (defaults to process.cwd()). */
  rootDir?: string;
  /** Whether to compile using private assets and data. */
  isPrivateProfile: boolean;
  /** Name of the private JSON file in src/assets/data/ (defaults to VITE_CV_DATA_FILE or cvData.revised.json). */
  privateDataFile?: string;
  /** Optional directory to write compiled PDF files to. */
  outputDir?: string;
}

export interface GeneratedPdfVariant {
  /** Output filename (e.g. "cv-italiano-photo.pdf"). */
  fileName: string;
  /** Language of the CV variant. */
  language: SupportedLanguage;
  /** Whether profile photo was enabled. */
  showPhoto: boolean;
  /** Raw PDF buffer. */
  buffer: Buffer;
  /** Number of pages in the generated document. */
  pageCount: number;
}

/**
 * Generates all 4 PDF variants (Italiano photo/nophoto, English photo/nophoto) using Typst.
 *
 * @param options - Generation configuration options.
 * @returns Array of generated PDF variant records with buffers and page counts.
 */
export const generateCvPdfVariants = (options: GenerateCvPdfOptions): GeneratedPdfVariant[] => {
  const rootDir = options.rootDir ?? process.cwd();
  const typstTemplatePath = path.resolve(rootDir, "typst/cv.typ");

  if (!fs.existsSync(typstTemplatePath)) {
    throw new Error(`Typst template not found at expected path: ${typstTemplatePath}`);
  }

  const loadedEnv = loadEnv(
    options.isPrivateProfile ? "private" : (process.env.NODE_ENV ?? "development"),
    rootDir,
    "VITE_",
  );

  let selectedDataFileName = "cvData.json";
  const dataDir = path.resolve(rootDir, "src/assets/data");

  if (options.isPrivateProfile) {
    const candidatePrivateFile = (
      options.privateDataFile ||
      loadedEnv.VITE_CV_DATA_FILE ||
      process.env.VITE_CV_DATA_FILE ||
      "cvData.revised.json"
    ).trim();

    if (
      !candidatePrivateFile ||
      candidatePrivateFile.includes("..") ||
      path.isAbsolute(candidatePrivateFile) ||
      !candidatePrivateFile.endsWith(".json")
    ) {
      throw new Error(
        `Invalid private CV data file: "${candidatePrivateFile}". Must be a plain .json file located inside src/assets/data/.`,
      );
    }

    const privateDataPath = path.resolve(dataDir, candidatePrivateFile);
    const relToDataDir = path.relative(dataDir, privateDataPath);
    if (
      relToDataDir.startsWith("..") ||
      path.isAbsolute(relToDataDir) ||
      relToDataDir === "" ||
      relToDataDir.includes("/") ||
      relToDataDir.includes("\\")
    ) {
      throw new Error(
        `Path traversal detected for private CV data file: "${candidatePrivateFile}".`,
      );
    }

    if (!fs.existsSync(privateDataPath) || !fs.statSync(privateDataPath).isFile()) {
      throw new Error(
        `Private CV data file not found at: ${privateDataPath}. In private profile mode, a valid private data file is required.`,
      );
    }

    selectedDataFileName = candidatePrivateFile;
  }

  const dataFilePath = path.resolve(dataDir, selectedDataFileName);
  if (!fs.existsSync(dataFilePath) || !fs.statSync(dataFilePath).isFile()) {
    throw new Error(`CV data file not found at: ${dataFilePath}`);
  }

  const rawData = JSON.parse(fs.readFileSync(dataFilePath, "utf-8"));
  const validatedCv = validateCvData(rawData, selectedDataFileName);

  const compiler = NodeCompiler.create({
    workspace: rootDir,
    fontArgs: [{ fontPaths: [path.resolve(rootDir, "typst/fonts")] }],
  });
  const results: GeneratedPdfVariant[] = [];

  for (const language of SUPPORTED_LANGUAGES) {
    const langData = validatedCv.language[language];
    if (!langData) {
      throw new Error(`Missing validated CV data for language: ${language}`);
    }

    for (const showPhoto of [true, false]) {
      const fileName = `cv-${language.toLowerCase()}-${showPhoto ? "photo" : "nophoto"}.pdf`;

      const resolvedHeaderImage = resolveAssetPath(
        "profile",
        langData.header.image,
        options.isPrivateProfile,
        rootDir,
      );

      const payload = {
        lang: language === "Italiano" ? "it" : "en",
        header: {
          name: langData.header.name,
          title: langData.header.title,
          image: resolvedHeaderImage ?? null,
          contacts: langData.header.contacts.map((contact) => ({
            icon:
              resolveAssetPath("headerIcon", contact.icon, options.isPrivateProfile, rootDir) ??
              null,
            value: contact.value,
            link: contact.link ?? null,
          })),
          summary: langData.header.summary,
        },
        work: {
          title: langData.work.title,
          list: langData.work.list.map((item) => ({
            company: item.company,
            role: item.role,
            date: formatCvDate(item.date),
            location: item.location ?? null,
            logo:
              resolveAssetPath("workLogo", item.logo, options.isPrivateProfile, rootDir) ?? null,
            tasks: item.tasks,
          })),
        },
        education: {
          title: langData.education.title,
          list: langData.education.list.map((item) => ({
            institute: item.institute,
            description: item.description,
            date: formatCvDate(item.date),
            location: item.location ?? null,
            logo:
              resolveAssetPath("schoolLogo", item.logo, options.isPrivateProfile, rootDir) ?? null,
          })),
        },
        languages: {
          title: langData.languages.title,
          list: langData.languages.list.map((item) => ({
            name: item.name,
            level: item.level,
            iso: decodeFlagEmoji(item.flag, item.name),
          })),
        },
        skills: {
          softTitle: langData.skills.title.soft,
          soft: langData.skills.soft,
          hardTitle: langData.skills.title.hard,
          hard: langData.skills.hard,
        },
        legal: {
          place: langData.legal.place,
          date: `${langData.legal.place}, ${formatLocalIsoDate()}`,
          text: langData.legal.text,
          signature:
            resolveAssetPath(
              "legalSignature",
              langData.legal.signature,
              options.isPrivateProfile,
              rootDir,
            ) ?? null,
          signatureAlt: langData.legal.signatureAlt,
        },
      };

      const compileResult = compiler.compile({
        mainFilePath: typstTemplatePath,
        inputs: {
          data: JSON.stringify(payload),
          showPhoto: String(showPhoto),
        },
      });

      if (compileResult.hasError()) {
        compileResult.printErrors();
        throw new Error(`Typst failed to compile variant: ${fileName} (${selectedDataFileName})`);
      }

      const doc = compileResult.result;
      if (!doc) {
        throw new Error(`Typst returned null document for: ${fileName}`);
      }

      const pageCount = doc.numOfPages;
      const buffer = compiler.pdf(doc);

      if (buffer.subarray(0, 5).toString("ascii") !== "%PDF-") {
        throw new Error(`Generated artifact for ${fileName} is not a valid PDF file.`);
      }

      if (options.outputDir) {
        fs.mkdirSync(options.outputDir, { recursive: true });
        const outputPath = path.resolve(options.outputDir, fileName);
        fs.writeFileSync(outputPath, buffer);
      }

      results.push({
        fileName,
        language,
        showPhoto,
        buffer,
        pageCount,
      });
    }
  }

  return results;
};

// Direct CLI execution support
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const rootDir = process.cwd();
  const cliHasPrivate = process.argv.includes("--private");
  const cliEnv = loadEnv(cliHasPrivate ? "private" : "development", rootDir, "VITE_");
  const isPrivate =
    cliHasPrivate ||
    cliEnv.VITE_CV_PROFILE === "private" ||
    process.env.VITE_CV_PROFILE === "private";

  const outputDirArg = process.argv.find((arg) => arg.startsWith("--out="));
  if (outputDirArg !== undefined) {
    const rawOut = outputDirArg.slice(6);
    if (!rawOut.trim()) {
      throw new Error(
        "Usage error: '--out=' flag was passed with an empty path. Please specify a non-empty output directory.",
      );
    }
  }
  const outputDir = outputDirArg ? outputDirArg.slice(6).trim() : undefined;

  console.log(`[pdfGenerator] Compiling CV PDF variants (isPrivateProfile: ${isPrivate})...`);
  const variants = generateCvPdfVariants({
    isPrivateProfile: isPrivate,
    outputDir,
  });

  for (const variant of variants) {
    console.log(
      `✓ ${variant.fileName}: ${variant.pageCount} page(s), ${variant.buffer.length} bytes`,
    );
  }
}
