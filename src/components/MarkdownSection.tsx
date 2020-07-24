import React from "react";

type Props = {
  html: string;
};

const MarkdownSection: React.FC<Props> = ({ html }) => {
  return <section dangerouslySetInnerHTML={{ __html: html }} />;
};

export default MarkdownSection;
