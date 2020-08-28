import React from "react";
import styled from "styled-components";
import Layout from "../components/Layout";
import SEO from "../components/SEO";

const Message = styled.p`
  margin: 3rem 0;
  text-align: center;
  font-size: 1.5rem;
  font-weight: 500;
`;

const AboutPage: React.FC = () => {
  return (
    <Layout>
      <SEO title="소개" />
      <Message>소개 준비중</Message>
    </Layout>
  );
};
export default AboutPage;
