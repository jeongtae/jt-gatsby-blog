import React, { useEffect, useRef } from "react";
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
        max-width: ${px / 10}rem;
        padding: 0 0.8rem;
      `
  )};
`;
const Main = styled.main`
  width: 100%;
  padding-left: calc(env(safe-area-inset-left, 0) + 1.2rem);
  padding-right: calc(env(safe-area-inset-right, 0) + 1.2rem);
  ${ApplyBreaks(
    px =>
      css`
        max-width: ${breaks["lg"] / 10}rem;
      `,
    [ASIDE_BREAK]
  )};
`;
const AsidePadder = styled.div`
  display: none;
  width: ${(breaks["xxl"] - breaks["lg"]) / 20}rem;
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
        width: ${(breaks[ASIDE_BREAK] - breaks["lg"]) / 10}rem;
      `,
    [ASIDE_BREAK]
  )};
  ${ApplyBreaks(
    px =>
      css`
        width: ${(breaks["xxl"] - breaks["lg"]) / 20}rem;
      `,
    ["xxl"]
  )};
`;

const Footer = styled.footer`
  text-align: center;
  font-size: 1.3rem;
  font-weight: 300;
  color: ${oc.gray[6]};
  ul {
    margin: 4rem 0 3.2rem;
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
        margin: 0.8rem;
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
    const listener = debounce(updateAsideY, 200);
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
          <li>&copy; {new Date().getFullYear()} Jeongtae Kim, All Rights Reserved</li>
          {/* <li>Built with Gatsby</li>
          <li>Open Source Software Notice</li> */}
        </ul>
      </Footer>
    </>
  );
};

export default Layout;
