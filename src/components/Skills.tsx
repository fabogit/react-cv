import "./../styles/Skills.css";

interface SkillsProps {
  title: string;
  skills: string[];
}

const Skills: React.FC<SkillsProps> = ({ title, skills }) => {
  return (
    <section className="skills card">
      <h2>{title}</h2>
      <ul className="skills-list">
        {skills.map((skill, index) => (
          <li key={index} className="skill-item">
            {skill}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Skills;
