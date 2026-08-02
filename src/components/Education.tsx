import React from "react";
import "./../styles/Education.css";
import { EducationItem, formatCvDate } from "../types/cv";
import { getAssetUrl } from "../utils/assets";

/**
 * Props for the Education component.
 */
export interface EducationProps {
  /** Section title (e.g., "Education", "Istruzione") */
  title: string;
  /** Array of education entries */
  education: EducationItem[];
}

/**
 * Education component rendering academic institutions, credentials, locations, and dates.
 */
const Education: React.FC<EducationProps> = ({ title, education }) => {
  return (
    <section className="education card">
      <h2>{title}</h2>
      <ul className="education-list">
        {education.map((item, index) => {
          const logoUrl = getAssetUrl("schoolLogo", item.logo);
          const itemKey = `${item.institute}-${index}`;

          return (
            <li key={itemKey} className="education-item">
              <img
                src={logoUrl}
                alt={`${item.institute} logo`}
                className="education-logo"
              />
              <div className="education-info">
                <h3 className="education-institute">
                  {item.institute}
                  {item.location && (
                    <span className="education-location"> • {item.location}</span>
                  )}
                </h3>
                <p className="education-description">{item.description}</p>
              </div>
              <div className="education-dates">
                <p>{formatCvDate(item.date)}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default Education;
