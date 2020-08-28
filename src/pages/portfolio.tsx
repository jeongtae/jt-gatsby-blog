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

const PortfolioPage: React.FC = () => {
  return (
    <Layout>
      <SEO title="포트폴리오" />
      <Message>포트폴리오 준비중</Message>
    </Layout>
  );
};
export default PortfolioPage;
