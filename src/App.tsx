import React, { useState } from "react";
import Header from "./components/Header";
import Education from "./components/Education";
import Languages from "./components/Language";
import WorkExperience from "./components/WorkExperience";
import Skills from "./components/Skills";
import LegalNotes from "./components/LegalNotes";

import "./styles/App.css";
import cvData from "./assets/data/cvData.json";

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
      <Skills title="Soft Skills" skills={data.skills.soft} />
      <Skills title="Hard Skills" skills={data.skills.hard} />
      <LegalNotes
        place={data.legal.place}
        text={data.legal.text}
        signature={data.legal.signature}
      />
      <button onClick={handleLanguageToggle}>
        {language === "Italiano" ? "English" : "Italiano"}
      </button>
    </div>
  );
};

export default App;
