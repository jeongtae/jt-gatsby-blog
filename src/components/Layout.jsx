import React from "react";
import { useStaticQuery, graphql, Link } from "gatsby";
import oc from "open-color";
import styled, { GlobalStyle, ApplyBreaks, css } from "../utils/styled-components";

const Main = styled.main`
  width: 100%;
  margin: 0 auto;
  ${ApplyBreaks(
    px =>
      css`
        max-width: ${px}px;
      `,
    ["xl"]
  )}
`;
const Header = styled.header`
  position: sticky;
  top: 0;
  height: 3.8rem;
  height: calc(env(safe-area-inset-top, 0) + 3.8rem);
  margin: 0;
  padding: 0;
  padding-top: env(safe-area-inset-top, 0);
  padding-left: env(safe-area-inset-left, 0);
  padding-right: env(safe-area-inset-right, 0);
  border-bottom: 1px solid ${oc.gray[3]};
  background-color: ${oc.white};
  backdrop-filter: blur(2px);
  opacity: 0.9;
  box-shadow: 0 0 0.7rem rgba(0, 0, 0, 0.12);
  transition: transform linear 150ms;
  transform: translateY(0%);
  display: flex;
  /* justify-content: space-between; */
  align-items: center;
  &.hidden {
    transform: translateY(-100%);
  }
`;
const Footer = styled.footer`
  text-align: center;
  font-size: 0.8rem;
  font-weight: 300;
  color: ${oc.gray[6]};
  border-top: 1px solid $oc-gray-3;
  ul {
    margin: 1rem 0 2rem;
    padding-bottom: env(safe-area-inset-bottom, 0);
    padding-left: env(safe-area-inset-left, 0);
    padding-right: env(safe-area-inset-right, 0);
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    li {
      display: block;
      &::after {
        content: "•";
        margin: 0.2rem;
      }
      &:last-child::after {
        content: "";
      }
    }
  }
  a {
    text-decoration: underline;
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
      <noscript>Enable JavaScript</noscript>
      <Header>
        <span>{data.site.siteMetadata.title}</span>
        <Link to="/">홈</Link>
        <Link to="/search">검색</Link>
      </Header>
      <Main>{children}</Main>
      <Footer className="sans">
        <ul>
          <li>&copy; {new Date().getFullYear()} Jeongtae Kim, All Rights Reserved</li>
          <li>Built with Gatsby</li>
          <li>Open Source Software Notice</li>
        </ul>
      </Footer>
    </>
  );
};

export default Layout;
