import React from "react";
import { useStaticQuery, graphql, Link } from "gatsby";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faSearch } from "@fortawesome/free-solid-svg-icons";
import oc from "open-color";
import { Site } from "../generated/graphql-types";

const Nav = styled.nav`
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

const Navigation: React.FC = () => {
  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
        }
      }
    }
  `) as { site: Site };
  return (
    <Nav>
      <FontAwesomeIcon icon={faBars} />
      <span>{data.site.siteMetadata.title}</span>
      <Link to="/">포스트</Link>
      <Link to="/">포트폴리오</Link>
      <Link to="/">소개</Link>
      <Link to="/search">
        <FontAwesomeIcon icon={faSearch} />
      </Link>
    </Nav>
  );
};

export default Navigation;
