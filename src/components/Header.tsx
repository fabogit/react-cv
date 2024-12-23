import React from "react";

interface Contact {
  label: string;
  value: string;
  link?: string; // Opzionale per URL o email
}

interface HeaderProps {
  name: string;
  title: string;
  contacts: Contact[];
}

const Header: React.FC<HeaderProps> = ({ name, title, contacts }) => {
  return (
    <header className="bg-gray-100 p-4 rounded-lg shadow-md">
      <div className="text-center mb-4">
        <h1 className="text-3xl font-bold">{name}</h1>
        <h2 className="text-xl text-gray-600">{title}</h2>
      </div>
      <div className="flex flex-col items-center space-y-2">
        {contacts.map((contact, index) => (
          <p key={index}>
            {contact.label}:{" "}
            {contact.link ? (
              <a href={contact.link} className="text-blue-500">
                {contact.value}
              </a>
            ) : (
              contact.value
            )}
          </p>
        ))}
      </div>
    </header>
  );
};

export default Header;
