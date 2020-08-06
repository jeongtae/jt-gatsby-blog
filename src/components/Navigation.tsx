import React from "react";
import { useStaticQuery, graphql, Link } from "gatsby";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faSearch } from "@fortawesome/free-solid-svg-icons";
import { Site } from "../generated/graphql-types";

const Nav = styled.nav`
  width: 100%;
  height: 100%;
  display: flex;
  /* justify-content: space-between; */
  align-items: center;
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
