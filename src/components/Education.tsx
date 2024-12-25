import "./../styles/Education.css";

type EducationItem = {
  institute: string;
  description: string;
  date: string;
  logo: string;
};

interface EducationProps {
  title: string;
  education: EducationItem[];
}

const Education: React.FC<EducationProps> = ({ title, education }) => {
  return (
    <section className="education card">
      <h2>{title}</h2>
      <ul className="education-list">
        {education.map((item, index) => {
          const logoUrl = new URL(
            `../assets/icons/school/${item.logo}`,
            import.meta.url
          ).toString();
          console.log(logoUrl);

          return (
            <li key={index} className="education-item">
              <img
                src={logoUrl}
                alt={`${item.institute} logo`}
                className="education-logo"
              />
              <div className="education-info">
                <h3 className="education-institute">{item.institute}</h3>
                <p className="education-description">
                  {item.description}
                  <span className="education-date">{item.date}</span>
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default Education;
