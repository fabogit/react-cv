import { isSafeContactLink, SUPPORTED_LANGUAGES, type SupportedLanguage } from "../constants/cv.ts";
import type {
  ContactItem,
  CvDataSchema,
  CvLanguageSection,
  EducationItem,
  HeaderData,
  LanguageItem,
  LegalData,
  SkillsData,
  WorkItem,
} from "../types/cv.ts";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isString = (value: unknown): value is string => typeof value === "string";

const isOptionalString = (value: unknown): value is string | undefined =>
  value === undefined || typeof value === "string";

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every(isString);

const isDateValue = (value: unknown): value is string | string[] =>
  isString(value) || isStringArray(value);

const validateContactItem = (item: unknown, path: string, sourceName: string): ContactItem => {
  if (!isRecord(item)) {
    throw new Error(`Invalid CV data in ${sourceName}: '${path}' must be a non-null object.`);
  }
  if (!isString(item.icon) || item.icon.trim() === "") {
    throw new Error(`Invalid CV data in ${sourceName}: '${path}.icon' must be a non-empty string.`);
  }
  if (!isString(item.value) || item.value.trim() === "") {
    throw new Error(
      `Invalid CV data in ${sourceName}: '${path}.value' must be a non-empty string.`,
    );
  }
  if (item.link !== undefined) {
    if (!isString(item.link)) {
      throw new Error(
        `Invalid CV data in ${sourceName}: '${path}.link' must be an optional string.`,
      );
    }
    if (!isSafeContactLink(item.link)) {
      throw new Error(
        `Invalid CV data in ${sourceName}: '${path}.link' has an unsafe or invalid URI scheme: '${item.link}'. Only https:, http:, mailto:, and tel: are permitted.`,
      );
    }
  }

  const result: ContactItem = {
    icon: item.icon,
    value: item.value,
  };
  if (item.link !== undefined) {
    result.link = item.link;
  }
  return result;
};

const validateHeader = (header: unknown, path: string, sourceName: string): HeaderData => {
  if (!isRecord(header)) {
    throw new Error(`Invalid CV data in ${sourceName}: '${path}' must be a non-null object.`);
  }
  if (!isString(header.name) || header.name.trim() === "") {
    throw new Error(`Invalid CV data in ${sourceName}: '${path}.name' must be a non-empty string.`);
  }
  if (!isString(header.title) || header.title.trim() === "") {
    throw new Error(
      `Invalid CV data in ${sourceName}: '${path}.title' must be a non-empty string.`,
    );
  }
  if (!isOptionalString(header.image)) {
    throw new Error(
      `Invalid CV data in ${sourceName}: '${path}.image' must be an optional string.`,
    );
  }
  if (!Array.isArray(header.contacts)) {
    throw new Error(`Invalid CV data in ${sourceName}: '${path}.contacts' must be an array.`);
  }
  const contacts = header.contacts.map((contact, idx) =>
    validateContactItem(contact, `${path}.contacts[${idx}]`, sourceName),
  );
  if (!isStringArray(header.summary)) {
    throw new Error(
      `Invalid CV data in ${sourceName}: '${path}.summary' must be an array of strings.`,
    );
  }

  const result: HeaderData = {
    name: header.name,
    title: header.title,
    contacts,
    summary: [...header.summary],
  };
  if (header.image !== undefined) {
    result.image = header.image;
  }
  return result;
};

const validateWorkItem = (item: unknown, path: string, sourceName: string): WorkItem => {
  if (!isRecord(item)) {
    throw new Error(`Invalid CV data in ${sourceName}: '${path}' must be a non-null object.`);
  }
  if (!isString(item.company) || item.company.trim() === "") {
    throw new Error(
      `Invalid CV data in ${sourceName}: '${path}.company' must be a non-empty string.`,
    );
  }
  if (!isString(item.role) || item.role.trim() === "") {
    throw new Error(`Invalid CV data in ${sourceName}: '${path}.role' must be a non-empty string.`);
  }
  if (!isDateValue(item.date)) {
    throw new Error(
      `Invalid CV data in ${sourceName}: '${path}.date' must be a string or array of strings.`,
    );
  }
  if (!isOptionalString(item.location)) {
    throw new Error(
      `Invalid CV data in ${sourceName}: '${path}.location' must be an optional string.`,
    );
  }
  if (!isString(item.logo) || item.logo.trim() === "") {
    throw new Error(`Invalid CV data in ${sourceName}: '${path}.logo' must be a non-empty string.`);
  }
  if (!isStringArray(item.tasks)) {
    throw new Error(
      `Invalid CV data in ${sourceName}: '${path}.tasks' must be an array of strings.`,
    );
  }

  const result: WorkItem = {
    company: item.company,
    role: item.role,
    date: Array.isArray(item.date) ? [...item.date] : item.date,
    logo: item.logo,
    tasks: [...item.tasks],
  };
  if (item.location !== undefined) {
    result.location = item.location;
  }
  return result;
};

const validateEducationItem = (item: unknown, path: string, sourceName: string): EducationItem => {
  if (!isRecord(item)) {
    throw new Error(`Invalid CV data in ${sourceName}: '${path}' must be a non-null object.`);
  }
  if (!isString(item.institute) || item.institute.trim() === "") {
    throw new Error(
      `Invalid CV data in ${sourceName}: '${path}.institute' must be a non-empty string.`,
    );
  }
  if (!isString(item.description) || item.description.trim() === "") {
    throw new Error(
      `Invalid CV data in ${sourceName}: '${path}.description' must be a non-empty string.`,
    );
  }
  if (!isDateValue(item.date)) {
    throw new Error(
      `Invalid CV data in ${sourceName}: '${path}.date' must be a string or array of strings.`,
    );
  }
  if (!isOptionalString(item.location)) {
    throw new Error(
      `Invalid CV data in ${sourceName}: '${path}.location' must be an optional string.`,
    );
  }
  if (!isString(item.logo) || item.logo.trim() === "") {
    throw new Error(`Invalid CV data in ${sourceName}: '${path}.logo' must be a non-empty string.`);
  }

  const result: EducationItem = {
    institute: item.institute,
    description: item.description,
    date: Array.isArray(item.date) ? [...item.date] : item.date,
    logo: item.logo,
  };
  if (item.location !== undefined) {
    result.location = item.location;
  }
  return result;
};

const validateLanguageItem = (item: unknown, path: string, sourceName: string): LanguageItem => {
  if (!isRecord(item)) {
    throw new Error(`Invalid CV data in ${sourceName}: '${path}' must be a non-null object.`);
  }
  if (!isString(item.name) || item.name.trim() === "") {
    throw new Error(`Invalid CV data in ${sourceName}: '${path}.name' must be a non-empty string.`);
  }
  if (!isString(item.level) || item.level.trim() === "") {
    throw new Error(
      `Invalid CV data in ${sourceName}: '${path}.level' must be a non-empty string.`,
    );
  }
  if (!isOptionalString(item.flag)) {
    throw new Error(`Invalid CV data in ${sourceName}: '${path}.flag' must be an optional string.`);
  }

  const result: LanguageItem = {
    name: item.name,
    level: item.level,
  };
  if (item.flag !== undefined) {
    result.flag = item.flag;
  }
  return result;
};

const validateSkills = (skills: unknown, path: string, sourceName: string): SkillsData => {
  if (!isRecord(skills)) {
    throw new Error(`Invalid CV data in ${sourceName}: '${path}' must be a non-null object.`);
  }
  if (!isRecord(skills.title)) {
    throw new Error(`Invalid CV data in ${sourceName}: '${path}.title' must be a non-null object.`);
  }
  if (!isString(skills.title.hard) || skills.title.hard.trim() === "") {
    throw new Error(
      `Invalid CV data in ${sourceName}: '${path}.title.hard' must be a non-empty string.`,
    );
  }
  if (!isString(skills.title.soft) || skills.title.soft.trim() === "") {
    throw new Error(
      `Invalid CV data in ${sourceName}: '${path}.title.soft' must be a non-empty string.`,
    );
  }
  if (!isStringArray(skills.hard)) {
    throw new Error(
      `Invalid CV data in ${sourceName}: '${path}.hard' must be an array of strings.`,
    );
  }
  if (!isStringArray(skills.soft)) {
    throw new Error(
      `Invalid CV data in ${sourceName}: '${path}.soft' must be an array of strings.`,
    );
  }

  return {
    title: {
      hard: skills.title.hard,
      soft: skills.title.soft,
    },
    hard: [...skills.hard],
    soft: [...skills.soft],
  };
};

const validateLegal = (legal: unknown, path: string, sourceName: string): LegalData => {
  if (!isRecord(legal)) {
    throw new Error(`Invalid CV data in ${sourceName}: '${path}' must be a non-null object.`);
  }
  if (!isString(legal.place) || legal.place.trim() === "") {
    throw new Error(
      `Invalid CV data in ${sourceName}: '${path}.place' must be a non-empty string.`,
    );
  }
  if (!isString(legal.text) || legal.text.trim() === "") {
    throw new Error(`Invalid CV data in ${sourceName}: '${path}.text' must be a non-empty string.`);
  }
  if (!isString(legal.signature) || legal.signature.trim() === "") {
    throw new Error(
      `Invalid CV data in ${sourceName}: '${path}.signature' must be a non-empty string.`,
    );
  }
  if (!isString(legal.signatureAlt) || legal.signatureAlt.trim() === "") {
    throw new Error(
      `Invalid CV data in ${sourceName}: '${path}.signatureAlt' must be a non-empty string.`,
    );
  }

  return {
    place: legal.place,
    text: legal.text,
    signature: legal.signature,
    signatureAlt: legal.signatureAlt,
  };
};

const validateLanguageSection = (
  section: unknown,
  path: string,
  sourceName: string,
): CvLanguageSection => {
  if (!isRecord(section)) {
    throw new Error(`Invalid CV data in ${sourceName}: '${path}' must be a non-null object.`);
  }

  const header = validateHeader(section.header, `${path}.header`, sourceName);

  if (!isRecord(section.work)) {
    throw new Error(`Invalid CV data in ${sourceName}: '${path}.work' must be a non-null object.`);
  }
  if (!isString(section.work.title) || section.work.title.trim() === "") {
    throw new Error(
      `Invalid CV data in ${sourceName}: '${path}.work.title' must be a non-empty string.`,
    );
  }
  if (!Array.isArray(section.work.list)) {
    throw new Error(`Invalid CV data in ${sourceName}: '${path}.work.list' must be an array.`);
  }
  const workList = section.work.list.map((w, idx) =>
    validateWorkItem(w, `${path}.work.list[${idx}]`, sourceName),
  );

  if (!isRecord(section.education)) {
    throw new Error(
      `Invalid CV data in ${sourceName}: '${path}.education' must be a non-null object.`,
    );
  }
  if (!isString(section.education.title) || section.education.title.trim() === "") {
    throw new Error(
      `Invalid CV data in ${sourceName}: '${path}.education.title' must be a non-empty string.`,
    );
  }
  if (!Array.isArray(section.education.list)) {
    throw new Error(`Invalid CV data in ${sourceName}: '${path}.education.list' must be an array.`);
  }
  const educationList = section.education.list.map((e, idx) =>
    validateEducationItem(e, `${path}.education.list[${idx}]`, sourceName),
  );

  if (!isRecord(section.languages)) {
    throw new Error(
      `Invalid CV data in ${sourceName}: '${path}.languages' must be a non-null object.`,
    );
  }
  if (!isString(section.languages.title) || section.languages.title.trim() === "") {
    throw new Error(
      `Invalid CV data in ${sourceName}: '${path}.languages.title' must be a non-empty string.`,
    );
  }
  if (!Array.isArray(section.languages.list)) {
    throw new Error(`Invalid CV data in ${sourceName}: '${path}.languages.list' must be an array.`);
  }
  const languagesList = section.languages.list.map((l, idx) =>
    validateLanguageItem(l, `${path}.languages.list[${idx}]`, sourceName),
  );

  const skills = validateSkills(section.skills, `${path}.skills`, sourceName);
  const legal = validateLegal(section.legal, `${path}.legal`, sourceName);

  return {
    header,
    work: {
      title: section.work.title,
      list: workList,
    },
    education: {
      title: section.education.title,
      list: educationList,
    },
    languages: {
      title: section.languages.title,
      list: languagesList,
    },
    skills,
    legal,
  };
};

/**
 * Validates raw data against the `CvDataSchema` contract at runtime.
 * Throws a descriptive Error detailing the exact invalid field if schema constraints are violated.
 *
 * @param raw - Untrusted input data to validate.
 * @param sourceName - Descriptive name of the data source for error messages.
 * @returns Strongly typed `CvDataSchema`.
 */
export const validateCvData = (raw: unknown, sourceName = "cvData"): CvDataSchema => {
  if (!isRecord(raw)) {
    throw new Error(`Invalid CV data in ${sourceName}: root must be a non-null object.`);
  }
  if (!isRecord(raw.language)) {
    throw new Error(`Invalid CV data in ${sourceName}: 'language' must be a non-null object.`);
  }

  for (const lang of SUPPORTED_LANGUAGES) {
    if (!(lang in raw.language)) {
      throw new Error(`Invalid CV data in ${sourceName}: missing required language '${lang}'.`);
    }
  }

  const validatedLanguages: Record<SupportedLanguage, CvLanguageSection> = {
    Italiano: validateLanguageSection(raw.language.Italiano, "language.Italiano", sourceName),
    English: validateLanguageSection(raw.language.English, "language.English", sourceName),
  };

  return {
    language: validatedLanguages,
  };
};
