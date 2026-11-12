import React, { useEffect, useState } from "react";
import Education from "./components/Education";
import Header from "./components/Header";
import Languages from "./components/Language";
import LegalNotes from "./components/LegalNotes";
import Skills from "./components/Skills";
import WorkExperience from "./components/WorkExperience";
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from "./constants/cv";
import { type ThemeMode, useTheme } from "./hooks/useTheme";
import "./styles/App.css";
import { cvData } from "./utils/assets";

const getThemeAriaLabel = (theme: ThemeMode, lang: SupportedLanguage): string => {
  const isIt = lang === "Italiano";
  switch (theme) {
    case "light":
      return isIt
        ? "Tema: Chiaro (clicca per passare a Scuro)"
        : "Theme: Light (click to switch to Dark)";
    case "dark":
      return isIt
        ? "Tema: Scuro (clicca per passare a Sistema)"
        : "Theme: Dark (click to switch to System)";
    case "system":
      return isIt
        ? "Tema: Sistema (clicca per passare a Chiaro)"
        : "Theme: System (click to switch to Light)";
  }
};

const handlePrint = (): void => {
  if (typeof window !== "undefined" && typeof window.print === "function") {
    window.print();
  }
};

const App: React.FC = () => {
  const [language, setLanguage] = useState<SupportedLanguage>("Italiano");
  const [showPhoto, setShowPhoto] = useState<boolean>(true);
  const { theme, toggleTheme } = useTheme();
  const data = cvData.language[language] ?? cvData.language.Italiano;

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = language === "Italiano" ? "it" : "en";
    }
  }, [language]);

  const handleLanguageToggle = () => {
    const currentIndex = SUPPORTED_LANGUAGES.indexOf(language);
    const nextIndex = (currentIndex + 1) % SUPPORTED_LANGUAGES.length;
    const nextLanguage = SUPPORTED_LANGUAGES[nextIndex];
    if (nextLanguage) {
      setLanguage(nextLanguage);
    }
  };

  const handlePhotoToggle = () => {
    setShowPhoto((prev) => !prev);
  };

  const isItalian = language === "Italiano";
  const controlsAriaLabel = isItalian ? "Controlli CV" : "CV Controls";
  const languageToggleLabel = isItalian
    ? "Cambia lingua in English"
    : "Switch language to Italiano";
  const photoToggleLabel = isItalian
    ? showPhoto
      ? "Nascondi foto profilo"
      : "Mostra foto profilo"
    : showPhoto
      ? "Hide profile photo"
      : "Show profile photo";
  const themeToggleLabel = getThemeAriaLabel(theme, language);
  const printLabel = isItalian ? "Stampa CV" : "Print CV";

  const pdfVariantSlug = `${isItalian ? "italiano" : "english"}-${showPhoto ? "photo" : "nophoto"}`;
  const baseUrl = (import.meta.env.BASE_URL || "/").replace(/\/+$/, "");
  const pdfHref = `${baseUrl}/pdf/cv-${pdfVariantSlug}.pdf`;

  const sanitizedCandidateName = data.header.name
    .replace(/[/\\:*?"<>|]/g, "")
    .trim()
    .replace(/\s+/g, "_");
  const candidateSlug = sanitizedCandidateName || "CV";
  const pdfDownloadName = `${candidateSlug}_CV_${isItalian ? "IT" : "EN"}${showPhoto ? "" : "_NoPhoto"}.pdf`;
  const downloadPdfLabel = isItalian ? "Scarica CV in PDF" : "Download CV PDF";

  return (
    <div className="cv-container">
      <nav className="controls no-print" aria-label={controlsAriaLabel}>
        <button
          type="button"
          onClick={handleLanguageToggle}
          aria-label={languageToggleLabel}
          title={languageToggleLabel}
        >
          <span aria-hidden="true">{isItalian ? "🇬🇧" : "🇮🇹"}</span>
        </button>
        <button
          type="button"
          onClick={handlePhotoToggle}
          aria-label={photoToggleLabel}
          title={photoToggleLabel}
        >
          <span aria-hidden="true">{showPhoto ? "❌📷" : "📷"}</span>
        </button>
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={themeToggleLabel}
          title={themeToggleLabel}
        >
          <span aria-hidden="true">
            {theme === "light" ? "☀️" : theme === "dark" ? "🌙" : "💻"}
          </span>
        </button>
        <button type="button" onClick={handlePrint} aria-label={printLabel} title={printLabel}>
          <span aria-hidden="true">🖨️</span>
        </button>
        <a
          href={pdfHref}
          download={pdfDownloadName}
          className="control-action"
          aria-label={downloadPdfLabel}
          title={downloadPdfLabel}
        >
          <span aria-hidden="true">📥</span>
        </a>
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
        signatureAlt={data.legal.signatureAlt}
      />
    </div>
  );
};

export default App;
