import React from "react";
import { graphql } from "gatsby";
import BasePageFC from "../components/BasePageFC";
import Img from "gatsby-image";
import styled from "styled-components";
import { File } from "../generated/graphql-types";
import SEO from "../components/SEO";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faGithub } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

const About = styled.section`
  .gatsby-image-wrapper {
    border-radius: 8px;
    width: 200px;
    height: 200px;
  }
  address {
    font-style: normal;
    text-decoration: none;
    ul {
      list-style: none;
    }
    svg {
      margin-right: 0.03rem;
    }
    a {
      &:link,
      &:visited {
        color: inherit;
      }
    }
  }
`;

const AboutPage: BasePageFC<{
  profileFile: File;
}> = ({ data, transitionStatus }) => {
  const profileImageFluid = data.profileFile.childImageSharp.fluid;
  return (
    <>
      <SEO title="소개" />
      {/* <Message>소개 준비중</Message> */}
      <About>
        <h1>소개</h1>
        <Img fluid={profileImageFluid} />
        <h2>김정태</h2>
        {/* 생일: <time dateTime="1994-10-29">1994. 10. 29.</time> */}
        <p>무언가 배우는 것과 만들기를 좋아합니다.</p>
        {/* <h2>일반 관심사</h2>
        <ul>
          <li>DIY</li>
          <li>개발</li>
          <li>게임</li>
        </ul>
        <h2>개발 관심사</h2>
        <ul>
          <li>웹</li>
          <li>데스크탑 앱</li>
          <li>게임</li>
        </ul>
        <h2>연락처</h2> */}
        <address>
          <ul>
            <li>
              <a href="https://www.facebook.com/jeongtaekim1994" target="_blank">
                <FontAwesomeIcon icon={faFacebook} />
                jeongtaekim1994
              </a>
            </li>
            <li>
              <a href="https://github.com/jeongtae" target="_blank">
                <FontAwesomeIcon icon={faGithub} />
                jeongtae
              </a>
            </li>
            <li>
              <a href="mailto:jtk101@icloud.com">
                <FontAwesomeIcon icon={faEnvelope} />
                jtk101@icloud.com
              </a>
            </li>
          </ul>
        </address>
      </About>
    </>
  );
};
export default AboutPage;

export const query = graphql`
  query {
    profileFile: file(relativePath: { eq: "profile.jpg" }) {
      childImageSharp {
        fluid(maxWidth: 200, srcSetBreakpoints: [200, 300, 400, 600]) {
          ...GatsbyImageSharpFluid_withWebp
        }
      }
    }
  }
`;
