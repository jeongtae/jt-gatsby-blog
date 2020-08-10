import React from "react";
import { Helmet } from "react-helmet";
import { useStaticQuery, graphql } from "gatsby";

const SEO: React.FC<{ title?: string; description?: string; lang?: string }> = ({
  title,
  description,
  lang,
}) => {
  const {
    site: { siteMetadata },
  } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            author
            description
          }
        }
      }
    `
  );

  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={title || siteMetadata.title}
      titleTemplate={title && `%s | ${siteMetadata.title}`}
      meta={[
        {
          name: "author",
          content: siteMetadata.author,
        },
        {
          name: "description",
          content: description || siteMetadata.description,
        },
        {
          property: "og:title",
          content: title || siteMetadata.title,
        },
        {
          property: "og:description",
          content: description || siteMetadata.description,
        },
        {
          property: "og:type",
          content: "website",
        },
      ]}
    />
  );
};
SEO.defaultProps = {
  lang: "ko",
  title: "",
  description: "",
};
export default SEO;
