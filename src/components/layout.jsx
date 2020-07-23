import React from "react";
import { useStaticQuery, graphql } from "gatsby";
import { GlobalStyle } from "../utils/styled-components";

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
    <>
      <GlobalStyle />
      <header>{data.site.siteMetadata.title}</header>
      <main>{children}</main>
      <footer>
        <ul>
          <li>
            &copy; {new Date().getFullYear()} Jeongtae Kim, All Rights Reserved
          </li>
          <li>Built with Gatsby</li>
          <li>Open Source Software Notice</li>
        </ul>
      </footer>
    </>
  );
};

export default Layout;
