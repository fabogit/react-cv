import "./../styles/Education.css";

type EducationItem = {
  institute: string;
  description: string;
  date: string;
};

interface EducationProps {
  title: string;
  education: EducationItem[];
}

const Education: React.FC<EducationProps> = ({ title, education }) => {
  return (
    <section className="education card">
      <h2>{title}</h2>
      <ul>
        {education.map((item, index) => (
          <li key={index}>
            <h3>{item.institute}</h3>
            <p>{item.description}</p>
            <span>{item.date}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Education;
