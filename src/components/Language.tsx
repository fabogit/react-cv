import React from "react";
import "./../styles/Language.css";
import { LanguageItem } from "../types/cv";

/**
 * Props for the Languages component.
 */
export interface LanguagesProps {
  /** Section title (e.g., "Languages", "Lingue") */
  title: string;
  /** Array of language entries */
  languages: LanguageItem[];
}

/**
 * Languages component rendering language names and proficiency levels.
 */
const Languages: React.FC<LanguagesProps> = ({ title, languages }) => {
  return (
    <section className="languages card">
      <h2>{title}</h2>
      <ul className="languages-list">
        {languages.map((language, index) => (
          <li key={`${language.name}-${index}`} className="language-item">
            <span className="language-name">{language.name}</span>
            <span className="language-level">{language.level}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Languages;
