import React from "react";
import { useStaticQuery, graphql } from "gatsby";
import styled, { GlobalStyle, Breaks, css } from "../utils/styled-components";

const Main = styled.main`
  width: 100%;
  margin: 0 auto;
  ${Object.keys(Breaks).map(
    key => css`
      @media only screen and (min-width: ${Breaks[key]}px) {
        max-width: ${Breaks[key]}px;
      }
    `
  )}
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
      <footer>
      <Main>{children}</Main>
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
