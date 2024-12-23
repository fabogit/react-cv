import React, { useState } from "react";
import cvData from "./data/cvData.json";

const App: React.FC = () => {
  const [language, setLanguage] = useState<"it" | "en">("it");
  const data = cvData.languages[language];

  return (
    <div>
      <header>
        <h1>{data.header.name}</h1>
        <h2>{data.header.title}</h2>
        <p>Email: {data.header.contacts.email}</p>
        <button onClick={() => setLanguage("it")}>Italiano</button>
        <button onClick={() => setLanguage("en")}>English</button>
      </header>
      {/* components */}
    </div>
  );
};

export default App;
