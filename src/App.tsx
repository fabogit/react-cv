import React, { useState } from "react";
import Header from "./components/Header";
import Education from "./components/Education";
import Languages from "./components/Language";
import WorkExperience from "./components/WorkExperience";
import Skills from "./components/Skills";
import LegalNotes from "./components/LegalNotes";

import "./styles/App.css";
import rawCvData from "./assets/data/cvData.json";
import { CvDataSchema } from "./types/cv";

const cvData = rawCvData as unknown as CvDataSchema;

const App: React.FC = () => {
  const localization = ["Italiano", "English"] as const;
  const [language, setLanguage] =
    useState<(typeof localization)[number]>("Italiano");
  const [showPhoto, setShowPhoto] = useState<boolean>(true);
  const data = cvData.language[language];

  const handleLanguageToggle = () => {
    const currentIndex = localization.indexOf(language);
    const nextIndex = (currentIndex + 1) % localization.length;
    setLanguage(localization[nextIndex]);
  };

  const handlePhotoToggle = () => {
    setShowPhoto((prev) => !prev);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="cv-container">
      <nav className="controls no-print" aria-label="CV Controls">
        <button
          type="button"
          onClick={handleLanguageToggle}
          aria-label={`Switch language to ${language === "Italiano" ? "English" : "Italiano"}`}
          title={`Switch language to ${language === "Italiano" ? "English" : "Italiano"}`}
        >
          {language === "Italiano" ? "🇬🇧" : "🇮🇹"}
        </button>
        <button
          type="button"
          onClick={handlePhotoToggle}
          aria-label="Toggle profile photo"
          title="Toggle profile photo"
        >
          {showPhoto ? "❌📷" : "📷"}
        </button>
        <button
          type="button"
          onClick={handlePrint}
          aria-label="Print CV"
          title="Print CV"
        >
          🖨️ <span className="sr-only">Print</span>
        </button>
      </nav>

      <Header
        name={data.header.name}
        title={data.header.title}
        contacts={data.header.contacts}
        image={data.header.image}
        summary={data.header.summary}
        showImage={showPhoto}
      />
      <main className="cv-main">
        <WorkExperience title={data.work.title} work={data.work.list} />
        {/* Manual spacers and print divider disabled */}
        {/* <div id="spacer-bot"></div> */}
        {/* <hr className="print-divider" /> */}
        {/* <div id="spacer-top"></div> */}
        <Education title={data.education.title} education={data.education.list} />
        <Languages title={data.languages.title} languages={data.languages.list} />
        <Skills title={data.skills.title.soft} skills={data.skills.soft} />
        <Skills title={data.skills.title.hard} skills={data.skills.hard} />
      </main>
      <LegalNotes
        place={data.legal.place}
        text={data.legal.text}
        signature={data.legal.signature}
      />
    </div>
  );
};

export default App;
