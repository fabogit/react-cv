import React, { useState } from "react";
import cvData from "./data/cvData.json";
import Header from "./components/Header";
import "./styles/App.css";

const App: React.FC = () => {
  const languages = ["Italiano", "English"] as const; // Definisce i linguaggi disponibili
  const [language, setLanguage] =
    useState<(typeof languages)[number]>("Italiano");
  const data = cvData.languages[language].header;

  const handleLanguageToggle = () => {
    const currentIndex = languages.indexOf(language);
    const nextIndex = (currentIndex + 1) % languages.length; // Cicla tra i linguaggi
    setLanguage(languages[nextIndex]);
  };

  return (
    <div>
      <Header
        name={data.name}
        title={data.title}
        contacts={data.contacts}
        image={data.image}
        summary={data.description}
      />
      <button onClick={handleLanguageToggle}>
        ({language === "Italiano" ? "Italiano" : "English"})
      </button>
    </div>
  );
};

export default App;
