import React, { useState } from "react";
import cvData from "./data/cvData.json";
import "./styles/App.css";
import Header from "./components/Header";
import Education from "./components/Education";
import Languages from "./components/Language";
import WorkExperience from "./components/WorkExperience";

const App: React.FC = () => {
  const localization = ["Italiano", "English"] as const; // Definisce i linguaggi disponibili
  const [language, setLanguage] =
    useState<(typeof localization)[number]>("Italiano");
  const data = cvData.language[language];

  const handleLanguageToggle = () => {
    const currentIndex = localization.indexOf(language);
    const nextIndex = (currentIndex + 1) % localization.length; // Cicla tra i linguaggi
    setLanguage(localization[nextIndex]);
  };

  return (
    <div>
      <Header
        name={data.header.name}
        title={data.header.title}
        contacts={data.header.contacts}
        image={data.header.image}
        summary={data.header.summary}
      />
      <WorkExperience title={data.work.title} work={data.work.list} />
      <Education title={data.education.title} education={data.education.list} />
      <Languages title={data.languages.title} languages={data.languages.list} />
      <button onClick={handleLanguageToggle}>
        {language === "Italiano" ? "English" : "Italiano"}
      </button>
    </div>
  );
};

export default App;
