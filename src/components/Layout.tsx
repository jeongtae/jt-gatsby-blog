import React from "react";
import oc from "open-color";
import styled, { GlobalStyle, ApplyBreaks, css, breaks } from "../utils/styled-components";
import Navigation, { NavigationProps } from "./Navigation";
import NoScript from "./NoScript";

export const ASIDE_BREAK = "xl";

const Container = styled.div`
  width: 100%;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  ${ApplyBreaks(
    px =>
      css`
        max-width: ${px}px;
        padding: 0 0.5rem;
      `
  )};
`;
const Main = styled.main`
  width: 100%;
  padding-left: calc(env(safe-area-inset-left, 0) + 0.75rem);
  padding-right: calc(env(safe-area-inset-right, 0) + 0.75rem);
  ${ApplyBreaks(
    px =>
      css`
        max-width: ${breaks["lg"]}px;
      `,
    [ASIDE_BREAK]
  )};
`;
const AsidePadder = styled.div`
  display: none;
  width: ${(breaks["xxl"] - breaks["lg"]) / 2}px;
  ${ApplyBreaks(
    px =>
      css`
        display: block;
      `,
    ["xxl"]
  )};
`;
const Aside = styled.aside`
  display: none;
  padding-right: env(safe-area-inset-right, 0);
  ${ApplyBreaks(
    px =>
      css`
        display: block;
        width: ${breaks[ASIDE_BREAK] - breaks["lg"]}px;
      `,
    [ASIDE_BREAK]
  )};
  ${ApplyBreaks(
    px =>
      css`
        width: ${(breaks["xxl"] - breaks["lg"]) / 2}px;
      `,
    ["xxl"]
  )};
`;

const Footer = styled.footer`
  text-align: center;
  font-size: 0.8rem;
  font-weight: 300;
  color: ${oc.gray[6]};
  ul {
    margin: 2.5rem 0 2rem;
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

const Layout: React.FC<{
  navigationProps?: NavigationProps;
  asideChildren?: React.ReactNode;
}> = ({ children, navigationProps, asideChildren }) => {
  return (
    <>
      <GlobalStyle />
      <Navigation {...(navigationProps || {})} />
      <NoScript>블로그 메뉴 이용, 포스트 목록 조회 및 검색, 댓글 등의 기능이 제한됩니다.</NoScript>
      <Container>
        {asideChildren && <AsidePadder />}
        <Main>{children}</Main>
        {asideChildren && <Aside>{asideChildren}</Aside>}
      </Container>
      <Footer>
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
