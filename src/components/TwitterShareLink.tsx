import React from "react";

const TwitterShareLink: React.FC<{ message: string; url: string }> = ({
  children,
  message,
  url,
}) => {
  message = encodeURIComponent(message);
  url = encodeURIComponent(url);
  return (
    <a href={`https://twitter.com/share?text=${message}&url=${url}`} target="_blank">
      {children}
    </a>
  );
};

export default TwitterShareLink;
