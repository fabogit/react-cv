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

const DEFAULT_FLAGS: Record<string, string> = {
  Italiano: "🇮🇹",
  Italian: "🇮🇹",
  Inglese: "🇬🇧",
  English: "🇬🇧",
  Spagnolo: "🇪🇸",
  Spanish: "🇪🇸",
};

/**
 * Languages component rendering language names, flag emojis, and proficiency levels.
 */
const Languages: React.FC<LanguagesProps> = ({ title, languages }) => {
  return (
    <section className="languages card">
      <h2>{title}</h2>
      <ul className="languages-list">
        {languages.map((language, index) => {
          const flagEmoji = language.flag || DEFAULT_FLAGS[language.name] || "";

          return (
            <li key={`${language.name}-${index}`} className="language-item">
              <span className="language-name">
                {flagEmoji && (
                  <span className="language-flag" aria-hidden="true">
                    {flagEmoji}{" "}
                  </span>
                )}
                {language.name}
              </span>
              <span className="language-level">{language.level}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default Languages;
