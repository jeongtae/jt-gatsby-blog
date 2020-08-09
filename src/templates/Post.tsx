import React from "react";
import { PageProps, graphql } from "gatsby";
import styled, { ApplyBreaks, css } from "../utils/styled-components";
import { MarkdownRemarkFrontmatter } from "../generated/graphql-types";
import Layout from "../components/Layout";
import MarkdownSection from "../components/MarkdownSection";

const Title = styled.h1`
  margin: 1.5rem 0 0.75rem;
  font-size: 2.2rem;
  font-weight: 500;
  ${ApplyBreaks(
    px => css`
      margin: 2.5rem 0 1rem;
      text-align: center;
      font-size: 3rem;
      font-weight: 700;
    `,
    ["sm"]
  )};
`;

const Description = styled.p`
  margin: 0.75rem 0.5rem 2rem;
  color: $oc-gray-7;
  font-size: 0.9rem;
  font-weight: 300;
  ${ApplyBreaks(
    px => css`
      margin: 1.5rem 10% 1rem;
      text-align: center;
      font-size: 1rem;
    `,
    ["sm"]
  )};
`;

type PageData = {
  site: {
    siteMetadata: {
      title: string;
    };
  };
  post: {
    id: string;
    excerpt: string;
    html: string;
    frontmatter: MarkdownRemarkFrontmatter;
  };
};

const PostTemplate: React.FC<PageProps<PageData>> = ({ data }) => {
  const { site, post } = data;
  return (
    <Layout navigationProps={{ title: post.frontmatter.title }}>
      <Title>{post.frontmatter.title}</Title>
      <Description>{post.excerpt}</Description>
      <time>{post.frontmatter.date}</time>
      <MarkdownSection html={post.html} />
    </Layout>
  );
};
export default PostTemplate;

export const query = graphql`
  query postBySlug($slug: String!) {
    site {
      siteMetadata {
        title
      }
    }
    post: markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date
      }
    }
  }
`;
