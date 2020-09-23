import React, { useState, useLayoutEffect, useRef } from "react";
import { useStaticQuery, graphql, Link } from "gatsby";
import { useEffectOnce } from "react-use";
import Img from "gatsby-image";
import { throttle } from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes, faSearch } from "@fortawesome/free-solid-svg-icons";
import oc from "open-color";
import { Site, File } from "../generated/graphql-types";
import styled, { css } from "styled-components";
import { ApplyBreaks, breaks } from "../utils/styled-components";

export const NAV_HEIGHT = 60;
const NAV_RESPONSIVE_BREAK = "sm";
const NAV_MAX_WIDTH = breaks["xl"] * 1.2;

const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: ${NAV_HEIGHT}px;
  height: calc(env(safe-area-inset-top, 0) + ${NAV_HEIGHT}px);
  margin: 0;
  padding: 0;
  border-bottom: 2px solid ${oc.gray[3]};
  background-color: ${oc.white};
  backdrop-filter: blur(2px);
  opacity: 0.9;
  box-shadow: 0 0 11px rgba(0, 0, 0, 0.12);
  transition: transform ease-in-out 200ms, box-shadow ease-in-out 200ms;
  z-index: 10000;
  @media only screen and (max-width: ${breaks["sm"]}px) {
    &.hidden {
      transform: translateY(-100%);
      box-shadow: unset;
    }
  }
  @media only screen and (max-width: ${breaks["lg"]}px) and (min-aspect-ratio: 4/3) {
    &.hidden {
      transform: translateY(-100%);
      box-shadow: unset;
    }
  }
  @media only screen and (max-width: ${breaks["xl"]}px) and (min-aspect-ratio: 18/9) {
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
  max-width: ${NAV_MAX_WIDTH}px;
`;

const Left = styled.div`
  position: absolute;
  top: 0;
  left: env(safe-area-inset-left, 0);
  height: 100%;
  display: flex;
  align-items: center;
  z-index: 30000;
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
  z-index: 20000;
`;
const Right = styled.div`
  position: absolute;
  top: 0;
  right: env(safe-area-inset-right, 0);
  height: 100%;
  display: flex;
  align-items: center;
  z-index: 40000;
`;

const baseButton = css`
  width: 40px;
  height: 40px;
  margin: 0 8px;
  background: none;
  appearance: none;
  border: none;
  display: block;
  font-size: 22px;
  color: ${oc.gray[9]};
  cursor: pointer;
  position: relative;
  border-radius: 10px;
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
    [NAV_RESPONSIVE_BREAK]
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
    [NAV_RESPONSIVE_BREAK]
  )};
`;

const Menu = styled.ul`
  position: absolute;
  left: 0;
  height: 0;
  margin: 0;
  margin-left: 36px;
  padding: 0 8px;
  overflow: hidden;
  align-items: center;
  list-style: none;
  display: flex;
  transition: 150ms ease-in-out;
  transition-property: transform, opacity;
  transform: translateX(-16px);
  opacity: 0;
  z-index: 30000;
  @media (hover) {
    &:hover {
      color: ${oc.gray[5]};
      text-shadow: 0 0 1px ${oc.gray[5]};
      li::after {
        opacity: 1;
      }
      li a:hover {
        color: ${oc.gray[9]};
        text-shadow: none;
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
      transition: opacity 200ms ease-in-out;
    }
    &:last-child::after {
      border-right: none;
    }
    a {
      padding: 12px;
      font-size: 0.16rem;
      font-weight: 500;
      text-transform: uppercase;
      text-decoration: none;
      transition: 150ms ease-in-out;
      transition-property: color text-shadow;
      &:link,
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
    [NAV_RESPONSIVE_BREAK]
  )};
`;

const SearchInputBox = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  height: 40px;
  margin: 0 56px;
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
        width: 288px;
      `,
    [NAV_RESPONSIVE_BREAK]
  )};
  > input {
    position: absolute;
    width: 100%;
    height: 100%;
    padding: 0 11px 0 35px;
    border: 2px solid transparent;
    border-radius: 8px;
    background-color: ${oc.gray[2]};
    font-size: 16px;
    font-weight: 500;
    color: ${oc.gray[7]};
    appearance: none;
    transition: background-color ease-in-out 150ms, border-color ease-in-out 150ms;
    &::placeholder {
      padding: 3px 0;
      font-size: 16px;
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
    margin-left: 11px;
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
  padding: 8px 64px;
  transition: opacity ease-in-out 150ms 150ms;
  opacity: 1;
  font-size: 0.18rem;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
  ${ApplyBreaks(
    px =>
      css`
        text-align: right;
        padding-left: 288px;
        padding-right: 56px;
      `,
    [NAV_RESPONSIVE_BREAK]
  )};
  &.collapsed {
    opacity: 0;
    ${ApplyBreaks(
      px =>
        css`
          opacity: 1;
        `,
      [NAV_RESPONSIVE_BREAK]
    )};
  }
`;

export type NavigationProps = {
  title?: string;
  showSearchInput?: boolean;
  searchInputValue?: string;
  onChangeSearchInput?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  ref?: React.Ref<HTMLElement>;
};
const Navigation: React.FC<NavigationProps> = React.forwardRef(
  ({ title, showSearchInput, searchInputValue, onChangeSearchInput }, ref) => {
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
              fluid(fit: COVER, maxWidth: 40, maxHeight: 40, srcSetBreakpoints: [40, 60, 80, 120]) {
                ...GatsbyImageSharpFluid_withWebp_tracedSVG
              }
            }
          }
        }
      `
    ) as { site: Site; logoFile: File };
    const [isMenuExpanded, setIsMenuExpanded] = useState(false);
    const [isWideScreen, setIsWideScreen] = useState(false);
    let navRef = useRef<HTMLElement>();
    if (ref) navRef = ref as any;
    const searchInputRef = useRef<HTMLInputElement>();

    useEffectOnce(() => {
      searchInputRef.current?.focus();
    });

    useLayoutEffect(() => {
      let prevScrollY = window.scrollY;
      const scrollListner = throttle(() => {
        const classList = navRef.current?.classList;
        const newScrollY = Math.max(window.scrollY, 0);
        if (newScrollY < NAV_HEIGHT) {
          classList?.remove("hidden");
          return;
        }
        if (Math.abs(newScrollY - prevScrollY) < NAV_HEIGHT / 2) {
          return;
        }
        if (newScrollY > prevScrollY) {
          classList?.add("hidden");
        } else {
          classList?.remove("hidden");
        }
        prevScrollY = newScrollY;
      }, 100);
      document.addEventListener("scroll", scrollListner, false);

      const mql = window.matchMedia(
        `only screen and (min-width: ${breaks[NAV_RESPONSIVE_BREAK]}px)`
      );
      setIsWideScreen(mql.matches);
      const mqlListener = (e: MediaQueryListEvent) => {
        setIsWideScreen(e.matches);
      };
      mql.addListener(mqlListener);
      return () => {
        mql.removeListener(mqlListener);
        document.removeEventListener("scroll", scrollListner);
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
                  to="/portfolio"
                  tabIndex={!isMenuExpanded && !isWideScreen ? -1 : 0}
                  onMouseDown={e => e.preventDefault()}
                >
                  포트폴리오
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
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
                onMouseDown={e => e.preventDefault()}
              >
                <FontAwesomeIcon icon={faTimes} />
              </BackButton>
            ) : (
              <SearchButton
                className={isMenuExpanded && "collapsed"}
                tabIndex={isMenuExpanded ? -1 : 0}
                onMouseDown={e => e.preventDefault()}
                to="/search"
              >
                <FontAwesomeIcon icon={faSearch} />
              </SearchButton>
            )}
          </Right>
        </WidthLimiter>
      </Nav>
    );
  }
);

export default Navigation;
