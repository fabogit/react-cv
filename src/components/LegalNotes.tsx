import React from "react";
import "./../styles/LegalNotes.css";
import { getAssetUrl } from "../utils/assets";

/**
 * Props for the LegalNotes component.
 */
export interface LegalNotesProps {
  /** Location/city where the CV is issued */
  place: string;
  /** Legal consent text for GDPR / privacy compliance */
  text: string;
  /** Signature image filename */
  signature: string;
}

/**
 * LegalNotes component rendering GDPR consent text, issuance date, location, and signature image.
 */
const LegalNotes: React.FC<LegalNotesProps> = ({ place, text, signature }) => {
  const currentDate = new Date().toISOString().split("T")[0];
  const signatureUrl = getAssetUrl("legalSignature", signature);

  return (
    <footer className="legal-notes card">
      <hr />
      <p className="legal-text">{text}</p>
      <hr />
      <div className="legal-footer">
        <p className="legal-date">
          {place}, {currentDate}
        </p>
        {signatureUrl && (
          <img src={signatureUrl} alt="Signature" className="legal-signature" />
        )}
      </div>
    </footer>
  );
};

export default LegalNotes;
