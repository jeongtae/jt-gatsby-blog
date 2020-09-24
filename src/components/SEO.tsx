import React from "react";
import { Helmet } from "react-helmet";
import { useStaticQuery, graphql } from "gatsby";

const SEO: React.FC<{ title?: string; description?: string; imageUrl?: string; lang?: string }> = ({
  title,
  description,
  imageUrl,
  lang,
}) => {
  const {
    site: { siteMetadata },
    logoFile: {
      childImageSharp: {
        fixed: { src: logoImageUrl },
      },
    },
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
        logoFile: file(relativePath: { eq: "logo.png" }) {
          childImageSharp {
            fixed(cropFocus: CENTER, fit: COVER, width: 500, height: 500) {
              src
            }
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
          property: "og:image",
          content: imageUrl || logoImageUrl,
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
