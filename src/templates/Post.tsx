import React from "react";
import { PageProps, graphql } from "gatsby";
import styled, { ApplyBreaks, css } from "../utils/styled-components";
import { SiteSiteMetadata, MarkdownRemarkFrontmatter, TagEdge } from "../generated/graphql-types";
import Layout from "../components/Layout";
import TagList from "../components/TagList";
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

const TagListBox = styled.div`
  margin: 1rem 0.7rem 1rem;
  display: flex;
  ${ApplyBreaks(
    px => css`
      margin-top: 1.3rem;
      justify-content: center;
    `,
    ["sm"]
  )};
`;

const AdditionalBox = styled.div`
  display: flex;
  margin: 2rem 0 2.5rem;
  flex-direction: column;
  align-items: flex-start;
  ${ApplyBreaks(
    px => css`
      flex-direction: row;
      align-items: center;
    `,
    ["sm"]
  )};
  address {
    display: inline-block;
    margin: 0;
    padding: 0;
    font-style: inherit;
    .profile {
      padding: (0.25rem/4);
      border-radius: 1.25rem;
      display: flex;
      align-items: center;
      font-weight: 300;
      @media (hover) {
        &:hover {
          background-color: $oc-gray-3;
        }
      }
      .avatar {
        width: 2.25rem;
        height: 2.25rem;
        object-fit: cover;
        border-radius: 100%;
        border: 0.125rem solid white;
      }
      .name {
        margin: 0;
        margin-left: 0.333rem;
        margin-right: 0.667rem;
      }
    }
  }
  time {
    font-weight: 300;
    color: $oc-gray-6;
    font-size: 0.8rem;
  }
`;

type PageData = {
  site: {
    siteMetadata: {
      title: string;
    };
    siteMetadata: SiteSiteMetadata;
  };
  post: {
    id: string;
    excerpt: string;
    html: string;
    frontmatter: MarkdownRemarkFrontmatter;
  };
  allTag: {
    edges: TagEdge[];
  };
};

const PostTemplate: React.FC<PageProps<PageData>> = ({ data }) => {
  const { site, post, allTag } = data;
  const tags = allTag.edges
    .map(edge => edge.node)
    .filter(tag => post.frontmatter.tags?.includes(tag.slug));
  return (
    <Layout navigationProps={{ title: post.frontmatter.title }}>
      <Title>{post.frontmatter.title}</Title>
      <Description>{post.excerpt}</Description>
      <TagListBox>
        <TagList tags={tags} />
      </TagListBox>
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
    allTag {
      edges {
        node {
          slug
          name
          group {
            color
          }
        }
      }
    }
    post: markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date
        tags
      }
    }
  }
`;
