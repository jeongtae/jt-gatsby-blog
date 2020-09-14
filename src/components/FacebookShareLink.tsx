import React from "react";
import { useStaticQuery, graphql } from "gatsby";
import { Site } from "../generated/graphql-types";

// https://developers.facebook.com/docs/sharing/reference/share-dialog
const FacebookShareLink: React.FC<{ url: string }> = ({ children, url }) => {
  const data = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            facebookAppId
          }
        }
      }
    `
  ) as { site: Site };
  url = encodeURIComponent(url);
  return (
    <a
      href={`https://www.facebook.com/dialog/share?app_id=${data.site.siteMetadata.facebookAppId}&display=popup&href=${url}`}
      target="_blank"
    >
      {children}
    </a>
  );
};

export default FacebookShareLink;
