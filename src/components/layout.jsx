import React from "react";
import { useStaticQuery } from "gatsby";

const Layout = ({ children }) => {
  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
        }
      }
    }
  `);
  return (
    <div>
      <header>{data.site.siteMetadata.title}</header>
      <main>{children}</main>
      <footer>
        <ul>
          <li>
            &copy; {new Date().getFullYear()} Jeongtae Kim, All Rights Reserved
          </li>
          <li>Powered by Gatsby</li>
          <li>Open Source Software Notice</li>
        </ul>
      </footer>
    </div>
  );
};

export default Layout;
