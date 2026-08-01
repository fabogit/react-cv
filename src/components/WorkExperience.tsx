import React from "react";
import "./../styles/WorkExperience.css";
import { WorkItem, formatCvDate } from "../types/cv";
import { getAssetUrl } from "../utils/assets";

/**
 * Props for the WorkExperience component.
 */
export interface WorkExperienceProps {
  /** Section title (e.g., "Work Experience", "Esperienza Lavorativa") */
  title: string;
  /** Array of work experience entries */
  work: WorkItem[];
}

/**
 * WorkExperience component rendering professional roles, company logos, locations, dates, and bullet tasks.
 */
const WorkExperience: React.FC<WorkExperienceProps> = ({ title, work }) => {
  return (
    <section className="work-experience card">
      <h2>{title}</h2>
      <div className="work-list">
        {work.map((item, index) => {
          const logoUrl = getAssetUrl("workLogo", item.logo);
          const itemKey = `${item.company}-${item.role}-${index}`;

          return (
            <div key={itemKey} className="work-item">
              <div className="work-header">
                <div className="work-top">
                  {/* Left column: Logo */}
                  <img
                    src={logoUrl}
                    alt={`${item.company} logo`}
                    className="work-logo"
                  />
                  {/* Center column: Company Name, Role, Location */}
                  <div className="work-info">
                    <h3 className="work-company">
                      {item.company}
                      {item.location && (
                        <span className="work-location"> • {item.location}</span>
                      )}
                    </h3>
                    <p className="work-role">{item.role}</p>
                  </div>
                  {/* Right column: Dates */}
                  <div className="work-dates">
                    <p>{formatCvDate(item.date)}</p>
                  </div>
                </div>
              </div>
              {/* Task list */}
              <ul className="work-tasks">
                {item.tasks.map((task, taskIndex) => (
                  <li key={taskIndex}>{task}</li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default WorkExperience;
