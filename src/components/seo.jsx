import React from "react";
import { Helmet } from "react-helmet";
import { useStaticQuery, graphql } from "gatsby";

const SEO = ({ title, description, lang }) => {
  const {
    site: { siteMetadata },
  } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
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
