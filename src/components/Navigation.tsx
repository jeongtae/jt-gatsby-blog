import React, { useState, useLayoutEffect, useRef } from "react";
import { useStaticQuery, graphql, Link } from "gatsby";
import { useEffectOnce } from "react-use";
import Img from "gatsby-image";
import { throttle } from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes, faSearch } from "@fortawesome/free-solid-svg-icons";
import oc from "open-color";
import { Site, File } from "../generated/graphql-types";
import styled, { ApplyBreaks, css, breaks } from "../utils/styled-components";
import { baseFontSizePx } from "../utils/typography";

const RESPONSIVE_BREAK = "sm";

const NAV_HEIGHT_REM = 3.8;
const NAV_HEIGHT_PX = baseFontSizePx * NAV_HEIGHT_REM;

const Nav = styled.nav`
  position: sticky;
  top: 0;
  height: ${NAV_HEIGHT_REM}rem;
  height: calc(env(safe-area-inset-top, 0) + ${NAV_HEIGHT_REM}rem);
  margin: 0;
  padding: 0;
  border-bottom: 1px solid ${oc.gray[3]};
  background-color: ${oc.white};
  backdrop-filter: blur(2px);
  opacity: 0.9;
  box-shadow: 0 0 0.7rem rgba(0, 0, 0, 0.12);
  transition: transform ease-in-out 200ms, box-shadow ease-in-out 200ms;
  z-index: 1;
  @media only screen and (max-width: ${breaks["lg"] - 0.03}px) and (orientation: portrait) {
    &.hidden {
      transform: translateY(-100%);
      box-shadow: unset;
    }
  }
`;

const WidthLimiter = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: 0 auto;
  max-width: ${breaks["xl"] * 1.2}px;
`;

const Left = styled.div`
  position: absolute;
  top: 0;
  left: env(safe-area-inset-left, 0);
  height: 100%;
  display: flex;
  align-items: center;
  z-index: 3;
`;
const Center = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  width: calc(100% - env(safe-area-inset-left, 0) - env(safe-area-inset-right, 0));
  margin: 0 auto;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
`;
const Right = styled.div`
  position: absolute;
  top: 0;
  right: env(safe-area-inset-right, 0);
  height: 100%;
  display: flex;
  align-items: center;
  z-index: 4;
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
  ${baseButton};
  transition: transform ease-in-out 150ms 150ms;
  &.collapsed {
    transform: scale(0);
  }
`;
const BackButton = styled.a`
  ${baseButton};
  transition: transform ease-in-out 150ms 150ms;
  &.collapsed {
    transform: scale(0);
  }
`;

const LogoButton = styled(Link)`
  ${baseButton};
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

const SearchInputBox = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  height: 2.5rem;
  margin: 0 3.5rem;
  padding: 0;
  transition: opacity ease-in-out 150ms 150ms;
  &.collapsed {
    opacity: 0;
  }
  ${ApplyBreaks(
    px =>
      css`
        justify-self: flex-end;
        margin-left: auto;
        width: 18rem;
      `,
    [RESPONSIVE_BREAK]
  )};
  > input {
    position: absolute;
    width: 100%;
    height: 100%;
    padding: 0 0.7rem 0 2.2rem;
    border: 2px solid transparent;
    border-radius: 0.5rem;
    background-color: ${oc.gray[2]};
    font-size: 1rem;
    font-weight: 500;
    color: ${oc.gray[7]};
    appearance: none;
    transition: background-color ease-in-out 100ms, border-color ease-in-out 100ms;
    &::placeholder {
      padding: 0.2rem 0;
      font-size: 1rem;
      color: ${oc.gray[6]};
      font-weight: 500;
    }
    @media (hover) {
      &:hover {
        border-color: ${oc.gray[3]};
        background-color: ${oc.gray[1]};
      }
    }
    &:focus {
      background-color: ${oc.gray[0]};
      border-color: ${oc.gray[6]};
      outline: none;
    }
  }
  > svg {
    height: fit-content;
    margin: auto 0;
    margin-left: 0.7rem;
    position: absolute;
    top: 0;
    bottom: 0;
    color: ${oc.gray[6]};
    pointer-events: none;
  }
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
  showSearchInput?: boolean;
  searchInputValue?: string;
  onChangeSearchInput?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};
const Navigation: React.FC<NavigationProps> = ({
  title,
  showSearchInput,
  searchInputValue,
  onChangeSearchInput,
}) => {
  const data = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
          }
        }
        logoFile: file(relativePath: { eq: "logo.png" }) {
          childImageSharp {
            fluid(maxWidth: 40, srcSetBreakpoints: [40, 60, 80, 120]) {
              ...GatsbyImageSharpFluid_withWebp_tracedSVG
            }
          }
        }
      }
    `
  ) as { site: Site; logoFile: File };
  const [isMenuExpanded, setIsMenuExpanded] = useState(false);
  const [isWideScreen, setIsWideScreen] = useState(false);
  const navRef = useRef<HTMLElement>();
  const searchInputRef = useRef<HTMLInputElement>();

  useEffectOnce(() => {
    searchInputRef.current?.focus();
  });

  useLayoutEffect(() => {
    let prevScrollY = window.scrollY;
    const scrollListner = throttle(() => {
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
    }, 100);
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
      <WidthLimiter>
        <Left>
          <MenuButton
            className={isMenuExpanded && "expanded"}
            onClick={() => {
              setIsMenuExpanded(!isMenuExpanded);
              searchInputRef.current?.blur();
            }}
            onMouseDown={e => e.preventDefault()}
          >
            <FontAwesomeIcon icon={faBars} />
            <FontAwesomeIcon icon={faTimes} />
          </MenuButton>
          <LogoButton to="/">
            <Img fluid={data.logoFile.childImageSharp.fluid} />
          </LogoButton>
        </Left>
        <Center>
          <Menu className={isMenuExpanded && "expanded"}>
            <li>
              <Link
                to="/"
                tabIndex={!isMenuExpanded && !isWideScreen ? -1 : 0}
                onMouseDown={e => e.preventDefault()}
              >
                포스트
              </Link>
            </li>
            <li>
              <Link
                to="/"
                tabIndex={!isMenuExpanded && !isWideScreen ? -1 : 0}
                onMouseDown={e => e.preventDefault()}
              >
                포트폴리오
              </Link>
            </li>
            <li>
              <Link
                to="/"
                tabIndex={!isMenuExpanded && !isWideScreen ? -1 : 0}
                onMouseDown={e => e.preventDefault()}
              >
                소개
              </Link>
            </li>
          </Menu>
          <Title className={isMenuExpanded && "collapsed"} hidden={showSearchInput}>
            {title || data.site.siteMetadata.title}
          </Title>
          <SearchInputBox className={isMenuExpanded && "collapsed"} hidden={!showSearchInput}>
            <input
              ref={searchInputRef}
              tabIndex={isMenuExpanded ? -1 : 0}
              value={searchInputValue}
              onChange={onChangeSearchInput}
            />
            <FontAwesomeIcon icon={faSearch} />
          </SearchInputBox>
        </Center>
        <Right>
          {showSearchInput ? (
            <BackButton
              className={isMenuExpanded && "collapsed"}
              tabIndex={isMenuExpanded ? -1 : 0}
              href="javascript:history.back()"
            >
              <FontAwesomeIcon icon={faTimes} />
            </BackButton>
          ) : (
            <SearchButton
              className={isMenuExpanded && "collapsed"}
              tabIndex={isMenuExpanded ? -1 : 0}
              to="/search"
            >
              <FontAwesomeIcon icon={faSearch} />
            </SearchButton>
          )}
        </Right>
      </WidthLimiter>
    </Nav>
  );
};

export default Navigation;
