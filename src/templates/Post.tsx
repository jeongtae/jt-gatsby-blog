import React from "react";
import { Link, PageProps, graphql } from "gatsby";
import oc from "open-color";
import styled, { ApplyBreaks, css } from "../utils/styled-components";
import {
  SiteSiteMetadata,
  MarkdownRemarkFrontmatter,
  TagEdge,
  SitePageContext,
} from "../generated/graphql-types";
import Layout from "../components/Layout";
import TagList from "../components/TagList";
import MarkdownSection from "../components/MarkdownSection";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Title = styled.h1`
  margin: 2rem 0.5rem 0;
  font-size: 2.2rem;
  font-weight: 500;
  ${ApplyBreaks(
    px => css`
      margin-top: 3rem;
      text-align: center;
      font-size: 2.75rem;
    `,
    ["sm"]
  )};
`;

const Description = styled.p`
  margin: 1rem 0.7rem 0;
  color: ${oc.gray[7]};
  font-size: 0.9rem;
  font-weight: 300;
  ${ApplyBreaks(
    px => css`
      margin: 1.5rem 10% 0;
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
  margin: 2rem 0.3rem 2.5rem;
  padding: 0;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid ${oc.gray[4]};
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  ${ApplyBreaks(
    px => css`
      align-items: center;
    `,
    ["sm"]
  )};
  > * {
  }
`;

const NameAndDate = styled.div`
  display: flex;
  flex-direction: column-reverse;
  ${ApplyBreaks(
    px => css`
      flex-direction: row;
      align-items: center;
    `,
    ["sm"]
  )};
  address,
  time {
    display: block;
    margin: 0;
    padding: 0;
    font-style: inherit;
  }
  address {
    a {
      width: fit-content;
      border-radius: 1.5rem;
      padding: 0.25rem;
      display: flex;
      align-items: center;
      text-decoration: none;
      font-weight: 300;
      &:visited {
        color: inherit;
      }
      @media (hover) {
        &:hover {
          background-color: ${oc.gray[1]};
        }
      }
      .image {
        width: 2.5rem;
        height: 2.5rem;
        margin: 0;
        padding: 0;
        object-fit: cover;
        border-radius: 50%;
        border: 0.125rem solid white;
        background-color: ${oc.gray[1]};
      }
      .name {
        margin: 0;
        margin-left: 0.333rem;
        margin-right: 0.667rem;
      }
    }
  }
  time {
    margin: 0;
    margin-left: 0.5rem;
    color: ${oc.gray[6]};
  }
`;

const Buttons = styled.div`
  display: flex;
  justify-content: flex-end;
  /* margin-top: 0.5rem; */
  margin-bottom: 0.5rem;
  ${ApplyBreaks(
    px => css`
      margin-bottom: 0;
    `,
    ["sm"]
  )};
  button {
    border: none;
    border-radius: 0.5rem;
    padding: 0.5rem 0.75rem;
    appearance: none;
    background: none;
    cursor: pointer;
    font-weight: 300;
    display: flex;
    align-items: center;
    font-size: 0.9rem;
    color: ${oc.gray[8]};
    margin-right: 0.4rem;
    @media (hover) {
      &:hover {
        background-color: ${oc.gray[1]};
      }
    }
    &:last-child {
      margin-right: 0;
    }
    svg {
      margin-right: 0.3rem;
    }
  }
`;

type PageData = {
  site: {
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

const PostTemplate: React.FC<PageProps<PageData>> = ({ data, pageContext }) => {
  const { site, post, allTag } = data;
  const { author } = pageContext as SitePageContext;
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
      <AdditionalBox>
        <NameAndDate>
          <address>
            <Link to="/">
              <img className="image" alt="" src="#" />
              <p className="name">{site.siteMetadata.author}</p>
            </Link>
          </address>
          <time>{post.frontmatter.date}</time>
        </NameAndDate>
        <Buttons>
          <button
            onMouseDown={e => e.preventDefault()}
          >
            <FontAwesomeIcon icon={faLink} />
            <span>URL 복사</span>
          </button>
        </Buttons>
      </AdditionalBox>
      <hr />
      <MarkdownSection html={post.html} />
    </Layout>
  );
};
export default PostTemplate;

export const query = graphql`
  query postBySlug($slug: String!) {
    site {
      siteMetadata {
        author
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
