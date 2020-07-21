import React from "react";
import { useStaticQuery } from "gatsby";
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }
  html {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  }
`;

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
          <li>Powered by Gatsby</li>
          <li>Open Source Software Notice</li>
        </ul>
      </footer>
    </>
  );
};

export default Layout;
