/**
 * Represents an individual contact entry in the CV header.
 */
export interface ContactItem {
  /** Icon filename located in src/assets/icons/header/ */
  icon: string;
  /** Optional URL link (e.g. mailto:, https://) */
  link?: string;
  /** Display value for the contact (email address, phone number, location text) */
  value: string;
}

/**
 * Represents the primary personal header information.
 */
export interface HeaderData {
  /** Full name of the candidate */
  name: string;
  /** Professional title / role headline */
  title: string;
  /** Profile image filename located in src/assets/_img/ */
  image: string;
  /** List of contact entries */
  contacts: ContactItem[];
  /** Summary paragraphs describing professional background */
  summary: string[];
}

/**
 * Represents a single work experience entry.
 */
export interface WorkItem {
  /** Company or organization name */
  company: string;
  /** Job title / role */
  role: string;
  /** Dates of employment (e.g., ["2022-07", "2024-05"] or "1888 - 1890") */
  date: string[] | string;
  /** Optional geographic location of employment */
  location?: string;
  /** Company logo filename located in src/assets/icons/_work/ */
  logo: string;
  /** Key responsibilities and achievements */
  tasks: string[];
}

/**
 * Represents an education or academic credential entry.
 */
export interface EducationItem {
  /** Institution or university name */
  institute: string;
  /** Qualification, degree, or course description */
  description: string;
  /** Dates of study (e.g., "2019" or ["2018", "2021"]) */
  date: string[] | string;
  /** Optional location of the institution */
  location?: string;
  /** Institution logo filename located in src/assets/icons/school/ */
  logo: string;
}

/**
 * Represents a language proficiency entry.
 */
export interface LanguageItem {
  /** Language name (e.g., "English", "Italiano") */
  name: string;
  /** Proficiency level (e.g., "Native speaker", "Advanced (C1)") */
  level: string;
}

/**
 * Section titles for Hard and Soft skills.
 */
export interface SkillsTitle {
  hard: string;
  soft: string;
}

/**
 * Represents the candidate's technical (hard) and interpersonal (soft) skills.
 */
export interface SkillsData {
  title: SkillsTitle;
  hard: string[];
  soft: string[];
}

/**
 * Represents GDPR / legal consent data and signature info.
 */
export interface LegalData {
  /** Location/city where consent is issued */
  place: string;
  /** Legal consent text for personal data processing */
  text: string;
  /** Signature image filename located in src/assets/_img/ */
  signature: string;
}

/**
 * Represents a complete localized section of the CV data.
 */
export interface CvLanguageSection {
  header: HeaderData;
  work: {
    title: string;
    list: WorkItem[];
  };
  education: {
    title: string;
    list: EducationItem[];
  };
  languages: {
    title: string;
    list: LanguageItem[];
  };
  skills: SkillsData;
  legal: LegalData;
}

/**
 * Top-level root schema for the JSON data structure.
 */
export interface CvDataSchema {
  language: Record<string, CvLanguageSection>;
}

/**
 * Formats a CV date into a human-readable string.
 * Supports single date strings, single-item arrays, or range arrays.
 *
 * @param date - The date value as a string or array of strings.
 * @returns Formatted date string (e.g., "2022-07 - 2024-05" or "2019").
 */
export const formatCvDate = (date: string[] | string): string => {
  if (Array.isArray(date)) {
    if (date.length === 0) return '';
    if (date.length === 1) return date[0];
    return `${date[0]} - ${date[1]}`;
  }
  return date;
};
