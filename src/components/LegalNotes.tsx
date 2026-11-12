import React from "react";
import "./../styles/LegalNotes.css";
import { getAssetUrl } from "../utils/assets";
import { formatLocalIsoDate } from "../utils/formatters";

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
  /** Accessible alt text for the signature image */
  signatureAlt: string;
}

/**
 * LegalNotes component rendering GDPR consent text, issuance date, location, and signature image.
 */
const LegalNotes: React.FC<LegalNotesProps> = ({ place, text, signature, signatureAlt }) => {
  const currentDate = formatLocalIsoDate();
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
        {signatureUrl && <img src={signatureUrl} alt={signatureAlt} className="legal-signature" />}
      </div>
    </footer>
  );
};

export default LegalNotes;
