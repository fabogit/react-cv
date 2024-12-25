import "./../styles/LegalNotes.css";

interface LegalNotesProps {
  place: string;
  text: string;
  signature: string;
}

const LegalNotes: React.FC<LegalNotesProps> = ({ place, text, signature }) => {
  const currentDate = new Date().toISOString().split("T")[0];
  const signatureUrl = new URL(
    `../assets/img/${signature}`,
    import.meta.url
  ).toString();

  return (
    <section className="legal-notes">
      <hr />
      <p className="legal-text">{text}</p>
      <hr />
      <div className="legal-footer">
        <p className="legal-date">
          {place}, {currentDate}
        </p>
        <img src={signatureUrl} alt="Firma" className="legal-signature" />
      </div>
    </section>
  );
};

export default LegalNotes;
