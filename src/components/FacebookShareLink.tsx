import React from "react";
import { Link, useStaticQuery, graphql } from "gatsby";
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
    <Link
      to={`https://www.facebook.com/dialog/share?app_id=${data.site.siteMetadata.facebookAppId}&display=popup&href=${url}`}
    >
      {children}
    </Link>
  );
};

export default FacebookShareLink;
