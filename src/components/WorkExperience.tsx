import React from "react";
import "./../styles/WorkExperience.css";

type Task = string;

interface WorkItem {
  logo: string;
  company: string;
  role: string;
  date: string[];
  tasks: Task[];
}

interface WorkExperienceProps {
  title: string;
  work: WorkItem[];
}
const WorkExperience: React.FC<WorkExperienceProps> = ({ title, work }) => {
  return (
    <section className="work-experience card">
      <h2>{title}</h2>
      <div className="work-list">
        {work.map((item, index) => {
          const logoUrl = new URL(
            `../assets/icons/work/${item.logo}`,
            import.meta.url
          ).toString();
          return (
            <div key={index} className="work-item">
              <div className="work-header">
                <div className="work-top">
                  {/* Colonna sinistra: Logo */}
                  <img
                    src={logoUrl}
                    alt={`${item.company} logo`}
                    className="work-logo"
                  />
                  {/* Colonna centrale: Nome Azienda e Ruolo */}
                  <div className="work-info">
                    <h3 className="work-company">{item.company}</h3>
                    <p className="work-role">{item.role}</p>
                  </div>
                  {/* Colonna destra: Date */}
                  <div className="work-dates">
                    <p>
                      {item.date[1]} - {item.date[0]}
                    </p>
                  </div>
                </div>
              </div>
              {/* Lista dei Task */}
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
