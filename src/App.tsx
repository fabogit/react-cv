import React, { useState } from "react";
import cvData from "./data/cvData.json";
import Header from "./components/Header";

const App: React.FC = () => {
  const [language, setLanguage] = useState<"it" | "en">("it");
  const data = cvData.languages[language].header;

  return (
    <div>
      <Header name={data.name} title={data.title} contacts={data.contacts} />
      <button onClick={() => setLanguage("it")}>Italiano</button>
      <button onClick={() => setLanguage("en")}>English</button>
    </div>
  );
};

export default App;
