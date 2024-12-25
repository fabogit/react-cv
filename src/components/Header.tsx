import "./../styles/Header.css";

type Contact = {
  icon: string;
  link?: string;
  value: string;
};

interface HeaderProps {
  contacts: Contact[];
  summary: string[];
  image: string;
  name: string;
  title: string;
}

const Header: React.FC<HeaderProps> = ({
  //   name,
  //   title,
  contacts,
  image,
  summary,
}) => {
  const imageUrl = new URL(
    `../assets/img/${image}`,
    import.meta.url
  ).toString();

  const getIconUrl = (icon: string) => {
    return new URL(`../assets/icons/header/${icon}`, import.meta.url).toString();
  };

  return (
    <header className="header card">
      <div className="header-container">
        {/* Colonna sinistra */}
        <div className="header-left">
          {/* <h1>{name}</h1> */}
          <img src={imageUrl} alt={`${name}'s profile`} />
        </div>
        {/* Colonna destra */}
        <div className="header-right">
          {/* <h2>{title}</h2> */}
          <div className="header-contacts">
            {contacts.map((contact, index) => (
              <p key={index}>
                <img
                  src={getIconUrl(contact.icon)}
                  alt={`Contact icon ${index}`}
                  className="contact-icon"
                />
                {contact.link ? (
                  <a href={contact.link} className="contact-link">
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
