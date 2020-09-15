import React, { useEffect, useRef } from "react";
import { Link } from "gatsby";
import oc from "open-color";
import styled, { GlobalStyle, ApplyBreaks, css, breaks } from "../utils/styled-components";
import Navigation, { NavigationProps } from "./Navigation";
import NoScript from "./NoScript";
import { debounce } from "lodash";

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
        padding: 0 8px;
      `
  )};
`;
const Main = styled.main`
  width: 100%;
  padding-left: calc(env(safe-area-inset-left, 0) + 12px);
  padding-right: calc(env(safe-area-inset-right, 0) + 12px);
  ${ApplyBreaks(
    px =>
      css`
        max-width: ${breaks["lg"] - 16}px;
      `,
    [ASIDE_BREAK]
  )};
`;
const AsidePadder = styled.div`
  display: none;
  width: ${breaks["xl"] - breaks["lg"]}px;
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
  transition: transform 200ms ease-in-out;
  ${ApplyBreaks(
    px =>
      css`
        display: block;
        height: fit-content;
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
  font-size: 0.13rem;
  font-weight: 300;
  color: ${oc.gray[6]};
  ul {
    margin: 40px 0 32px;
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
        margin: 8px;
      }
      &:last-child::after {
        content: "";
      }
      a {
        text-decoration: none;
      }
      a:link,
      a:visited {
        color: ${oc.gray[9]};
      }
      a:hover {
        text-decoration: underline;
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
  const asideRef = useRef<HTMLElement>();
  const navRef = useRef<HTMLElement>();

  useEffect(() => {
    let asideY = 0;
    const updateAsideY = () => {
      const aside = asideRef.current;
      if (!aside) return;
      const asideHeight = aside.clientHeight;
      const nav = navRef.current;
      const navHeight = nav.clientHeight;
      const body = document.body;
      const html = document.documentElement;
      const documentHeight = Math.max(
        body.scrollHeight,
        body.offsetHeight,
        html.clientHeight,
        html.scrollHeight,
        html.offsetHeight
      );
      const windowHeight = window.innerHeight;
      const windowY = Math.min(window.scrollY, documentHeight - windowHeight);
      if (windowY + windowHeight > asideY + (asideHeight + navHeight)) {
        asideY = Math.min(windowY, windowY + windowHeight - (asideHeight + navHeight));
      } else if (windowY < asideY) {
        asideY = windowY;
      }
      if (windowY + windowHeight > documentHeight - 100) {
        asideY = Math.min(
          documentHeight - windowHeight,
          documentHeight - (asideHeight + navHeight)
        );
      } else if (windowY < 100) {
        asideY = 0;
      }
      aside.style.transform = `translateY(${asideY}px)`;
    };
    const listener = debounce(updateAsideY, 500);
    document.addEventListener("scroll", listener, false);
    return () => document.removeEventListener("scroll", listener);
  }, []);

  return (
    <>
      <GlobalStyle />
      <Navigation {...(navigationProps || {})} ref={navRef} />
      <NoScript>블로그 메뉴 이용, 포스트 목록 조회 및 검색, 댓글 등의 기능이 제한됩니다.</NoScript>
      <Container>
        {asideChildren && <AsidePadder />}
        <Main>{children}</Main>
        {asideChildren && <Aside ref={asideRef}>{asideChildren}</Aside>}
      </Container>
      <Footer>
        <ul>
          <li>
            Copyright &copy; {new Date().getFullYear()} <Link to="/">JTK Blog</Link> All Rights
            Reserved.
          </li>
          <li>
            Designed by <Link to="/about">Jeongtae Kim</Link>
          </li>
          <li>
            Built with{" "}
            <a href="https://www.gatsbyjs.com/" target="_blank">
              Gatsby.js
            </a>
          </li>
          {/* <li>Open Source Software Notice</li> */}
        </ul>
      </Footer>
    </>
  );
};

export default Layout;
