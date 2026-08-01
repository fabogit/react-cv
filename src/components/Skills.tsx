import React from "react";
import "./../styles/Skills.css";

/**
 * Props for the Skills component.
 */
export interface SkillsProps {
  /** Section title (e.g., "Hard Skills", "Soft Skills") */
  title: string;
  /** Array of skill description strings */
  skills: string[];
}

/**
 * Skills component rendering lists of technical or interpersonal skills.
 */
const Skills: React.FC<SkillsProps> = ({ title, skills }) => {
  return (
    <section className="skills card">
      <h2>{title}</h2>
      <ul className="skills-list">
        {skills.map((skill, index) => (
          <li key={`${skill.substring(0, 15)}-${index}`} className="skill-item">
            {skill}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Skills;
