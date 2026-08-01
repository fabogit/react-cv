import React from "react";
import "./../styles/Header.css";
import { ContactItem } from "../types/cv";
import { getAssetUrl } from "../utils/assets";

/**
 * Props for the Header component.
 */
export interface HeaderProps {
  /** Array of contact details */
  contacts: ContactItem[];
  /** Summary paragraphs */
  summary: string[];
  /** Profile image filename */
  image: string;
  /** Full name of the candidate */
  name: string;
  /** Professional title headline */
  title: string;
}

/**
 * Header component displaying candidate identity (h1, h2), profile picture, contact list, and summary.
 */
const Header: React.FC<HeaderProps> = ({
  name,
  title,
  contacts,
  image,
  summary,
}) => {
  const imageUrl = getAssetUrl("profile", image);

  return (
    <header className="header card">
      <div className="header-container">
        {/* Left column: Profile Picture & Primary Info */}
        <div className="header-left">
          <img src={imageUrl} alt={`${name} - ${title}`} />
          <div className="header-identity">
            <h1 className="header-name">{name}</h1>
            <h2 className="header-title">{title}</h2>
          </div>
        </div>
        {/* Right column: Contacts */}
        <div className="header-right">
          <div className="header-contacts">
            {contacts.map((contact, index) => (
              <p key={`${contact.icon}-${index}`}>
                <img
                  src={getAssetUrl("headerIcon", contact.icon)}
                  alt=""
                  aria-hidden="true"
                  className="contact-icon"
                />
                {contact.link ? (
                  <a href={contact.link} className="contact-link" target="_blank" rel="noopener noreferrer">
                    {contact.value}
                  </a>
                ) : (
                  <span>{contact.value}</span>
                )}
              </p>
            ))}
          </div>
        </div>
      </div>
      <hr />
      <div className="header-summary">
        {summary.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
      <hr />
    </header>
  );
};

export default Header;
