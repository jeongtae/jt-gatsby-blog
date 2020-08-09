import React, { useState, useLayoutEffect, useRef } from "react";
import { useStaticQuery, graphql, Link } from "gatsby";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes, faSearch } from "@fortawesome/free-solid-svg-icons";
import oc from "open-color";
import { Site } from "../generated/graphql-types";
import styled, { ApplyBreaks, css, breaks } from "../utils/styled-components";

const RESPONSIVE_BREAK = "md";
const NAV_HEIGHT_REM = 3.8;

const NAV_HEIGHT_PX =
  parseFloat(getComputedStyle(document.documentElement).fontSize) * NAV_HEIGHT_REM;

const Nav = styled.nav`
  position: sticky;
  top: 0;
  height: ${NAV_HEIGHT_REM}rem;
  height: calc(env(safe-area-inset-top, 0) + ${NAV_HEIGHT_REM}rem);
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
  transition: transform ease-in-out 200ms, box-shadow ease-in-out 200ms;
  @media only screen and (max-width: ${breaks["lg"] - 0.03}px) and (orientation: portrait) {
    &.hidden {
      transform: translateY(-100%);
      box-shadow: unset;
    }
  }
`;

const Left = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  display: flex;
  align-items: center;
  z-index: 2;
`;
const Center = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
`;
const Right = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  display: flex;
  align-items: center;
  z-index: 2;
`;

const baseButton = css`
  width: 2.5rem;
  height: 2.5rem;
  margin: 0 0.5rem;
  background: none;
  appearance: none;
  border: none;
  display: block;
  font-size: 1.4rem;
  color: ${oc.gray[9]};
  cursor: pointer;
  position: relative;
  border-radius: 0.667rem;
  transition: background-color ease-in-out 200ms;
  text-decoration: none;
  > svg {
    position: absolute;
    margin: auto;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
  @media (hover) {
    &:hover {
      background-color: ${oc.gray[2]};
    }
  }
`;
const MenuButton = styled.button`
  ${baseButton}
  > svg {
    &:first-child {
      transform: scale(1);
      transition: transform ease-in-out 150ms 150ms;
    }
    &:last-child {
      transform: scale(0);
      transition: transform ease-in-out 150ms 0ms;
    }
  }
  &.expanded {
    svg {
      &:first-child {
        transform: scale(0);
        transition-delay: 0ms;
      }
      &:last-child {
        transform: scale(1);
        transition-delay: 150ms;
      }
    }
  }
  ${ApplyBreaks(
    px =>
      css`
        display: none;
      `,
    [RESPONSIVE_BREAK]
  )};
`;
const SearchButton = styled(Link)`
  ${baseButton}
  transition: transform ease-in-out 150ms 150ms;
  &.collapsed {
    transform: scale(0);
  }
`;
const LogoButton = styled(Link)`
  ${baseButton}
  transition: transform ease-in-out 150ms;
  display: none;
  transform: scale(0);
  ${ApplyBreaks(
    px =>
      css`
        display: block;
        transform: scale(1);
      `,
    [RESPONSIVE_BREAK]
  )};
`;

const Menu = styled.ul`
  position: absolute;
  left: 0;
  height: 0;
  margin: 0;
  margin-left: 2.25rem;
  padding: 0 0.5rem;
  overflow: hidden;
  align-items: center;
  list-style: none;
  display: flex;
  transition: transform ease-in-out 150ms, opacity ease-in-out 150ms;
  transform: translateX(-1rem);
  opacity: 0;
  z-index: 3;
  @media (hover) {
    &:hover {
      color: ${oc.gray[5]};
      li::after {
        opacity: 1;
      }
      li a:hover {
        color: ${oc.gray[9]};
      }
    }
  }
  li {
    margin: 0;
    padding: 0;
    &::after {
      content: "";
      border-right: 1px solid ${oc.gray[4]};
      opacity: 0;
      color: transparent;
      transition: opacity ease-in-out 200ms;
    }
    &:last-child::after {
      border-right: none;
    }
    a {
      padding: 0.75rem;
      font-size: 1rem;
      font-weight: 700;
      text-transform: uppercase;
      text-decoration: none;
      transition: color ease-in-out 150ms;
      &:visited {
        color: inherit;
      }
    }
  }
  &.expanded {
    /* display: flex; */
    transition-delay: 150ms;
    transform: translateX(0);
    opacity: 1;
    height: 100%;
  }
  ${ApplyBreaks(
    px =>
      css`
        transform: translateX(0);
        opacity: 1;
        height: 100%;
      `,
    [RESPONSIVE_BREAK]
  )};
`;

const Title = styled.p`
  position: absolute;
  left: 0;
  right: 0;
  margin: 0;
  padding: 0.5rem 4rem;
  transition: opacity ease-in-out 150ms 150ms;
  opacity: 1;
  font-size: 1.1rem;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
  ${ApplyBreaks(
    px =>
      css`
        text-align: right;
        padding-left: 18rem;
        padding-right: 3.5rem;
      `,
    [RESPONSIVE_BREAK]
  )};
  &.collapsed {
    opacity: 0;
    ${ApplyBreaks(
      px =>
        css`
          opacity: 1;
        `,
      [RESPONSIVE_BREAK]
    )};
  }
`;

export type NavigationProps = {
  title?: string;
};
const Navigation: React.FC<NavigationProps> = ({
  title,
}) => {
  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
        }
      }
    }
  `) as { site: Site };
  const [isMenuExpanded, setIsMenuExpanded] = useState(false);
  const [isWideScreen, setIsWideScreen] = useState(false);
  const navRef = useRef<HTMLElement>();

  useLayoutEffect(() => {
    let prevScrollY = window.scrollY;
    const scrollListner = () => {
      const classList = navRef.current.classList;
      const newScrollY = Math.max(window.scrollY, 0);
      if (newScrollY < NAV_HEIGHT_PX) {
        classList.remove("hidden");
        return;
      }
      if (Math.abs(newScrollY - prevScrollY) < NAV_HEIGHT_PX / 2) {
        return;
      }
      if (newScrollY > prevScrollY) {
        classList.add("hidden");
      } else {
        classList.remove("hidden");
      }
      prevScrollY = newScrollY;
    };
    window.addEventListener("scroll", scrollListner, false);

    const mql = window.matchMedia(`only screen and (min-width: ${breaks[RESPONSIVE_BREAK]}px)`);
    setIsWideScreen(mql.matches);
    const mqlListener = (e: MediaQueryListEvent) => {
      setIsWideScreen(e.matches);
    };
    mql.addListener(mqlListener);
    return () => {
      mql.removeListener(mqlListener);
      window.removeEventListener("scroll", scrollListner);
    };
  }, []);

  return (
    <Nav ref={navRef}>
      <Left>
        <MenuButton
          className={isMenuExpanded && "expanded"}
          onClick={() => setIsMenuExpanded(!isMenuExpanded)}
          onMouseDown={e => e.preventDefault()}
        >
          <FontAwesomeIcon icon={faBars} />
          <FontAwesomeIcon icon={faTimes} />
        </MenuButton>
        <LogoButton to="/">jtk</LogoButton>
      </Left>
      <Center>
        <Menu className={isMenuExpanded && "expanded"}>
          <li>
            <Link to="/" tabIndex={!isMenuExpanded && !isWideScreen ? -1 : 0}>
              포스트
            </Link>
          </li>
          <li>
            <Link to="/" tabIndex={!isMenuExpanded && !isWideScreen ? -1 : 0}>
              포트폴리오
            </Link>
          </li>
          <li>
            <Link to="/" tabIndex={!isMenuExpanded && !isWideScreen ? -1 : 0}>
              소개
            </Link>
          </li>
        </Menu>
        <Title className={isMenuExpanded && "collapsed"}>
          {title || data.site.siteMetadata.title}
        </Title>
      </Center>
      <Right>
        <SearchButton
          className={isMenuExpanded && "collapsed"}
          tabIndex={isMenuExpanded ? -1 : 0}
          to="/search"
        >
          <FontAwesomeIcon icon={faSearch} />
        </SearchButton>
      </Right>
      {/* <Link className={isMenuExpanded ? "logo expanded" : "logo"} to="/">
        로고영역
      </Link> */}
      {/* <span>{data.site.siteMetadata.title}</span> */}
    </Nav>
  );
};

export default Navigation;
