import React from "react";

const MailShareLink: React.FC<{ message: string; url: string }> = ({ children, message, url }) => {
  message = encodeURIComponent(message);
  url = encodeURIComponent(url);
  return <a href={`mailto:?&subject=${message}&body=${url}`}>{children}</a>;
};

export default MailShareLink;
