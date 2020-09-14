import React from "react";
import { Link } from "gatsby";

const TwitterShareLink: React.FC<{ message: string; url: string }> = ({
  children,
  message,
  url,
}) => {
  message = encodeURIComponent(message);
  url = encodeURIComponent(url);
  return <Link to={`https://twitter.com/share?text=${message}&url=${url}`}>{children}</Link>;
};

export default TwitterShareLink;
