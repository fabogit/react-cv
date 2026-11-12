import React from "react";
import "./../styles/Header.css";
import { isSafeContactLink } from "../constants/cv";
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
  /** Optional profile image filename */
  image?: string;
  /** Full name of the candidate */
  name: string;
  /** Professional title headline */
  title: string;
  /** Optional flag to toggle photo rendering (defaults to true) */
  showImage?: boolean;
}

/**
 * Header component displaying candidate identity (h1, p), optional profile picture, contact list, and summary.
 */
const Header: React.FC<HeaderProps> = ({
  name,
  title,
  contacts,
  image,
  summary,
  showImage = true,
}) => {
  const imageUrl = image ? getAssetUrl("profile", image) : "";
  const shouldRenderImage = Boolean(showImage && imageUrl);

  return (
    <header className="header card">
      <div className="header-top">
        {shouldRenderImage && (
          <img src={imageUrl} alt={`${name} - ${title}`} className="header-avatar" />
        )}
        <div className="header-identity">
          <h1 className="header-name">{name}</h1>
          <p className="header-title">{title}</p>
        </div>
      </div>

      <div className="header-contacts">
        {contacts.map((contact, index) => {
          const iconUrl = getAssetUrl("headerIcon", contact.icon);
          const hasSafeLink = Boolean(contact.link && isSafeContactLink(contact.link));
          const isExternalHttpLink =
            hasSafeLink &&
            typeof contact.link === "string" &&
            (contact.link.startsWith("http://") || contact.link.startsWith("https://"));

          return (
            <span key={`${contact.icon}-${index}`} className="header-contact-item">
              {iconUrl && <img src={iconUrl} alt="" aria-hidden="true" className="contact-icon" />}
              {hasSafeLink && contact.link ? (
                <a
                  href={contact.link}
                  className="contact-link"
                  {...(isExternalHttpLink ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  {contact.value}
                </a>
              ) : (
                <span>{contact.value}</span>
              )}
            </span>
          );
        })}
      </div>

      <hr className="header-divider" />

      <div className="header-summary">
        {summary.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </header>
  );
};

export default Header;
