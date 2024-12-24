import React from "react";
import "./../styles/Language.css";

type LanguageItem = {
  name: string;
  level: string;
};
interface LanguagesProps {
  title: string;
  languages: LanguageItem[];
}

const Languages: React.FC<LanguagesProps> = ({ title, languages }) => {
  return (
    <section className="languages card">
      <h2>{title}</h2>
      <ul className="languages-list">
        {languages.map((language, index) => (
          <li key={index} className="language-item">
            <span className="language-name">{language.name}</span>
            <span className="language-level">{language.level}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Languages;
