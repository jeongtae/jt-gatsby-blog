import React from "react";
import { PageProps, Link, graphql } from "gatsby";
import { useEffectOnce } from "react-use";
import styled, { css } from "styled-components";
import oc from "open-color";
import { MarkdownRemarkEdge, TagEdge, TagGroupEdge } from "../generated/graphql-types";
import Layout from "../components/Layout";
import SEO from "../components/SEO";
import PostList from "../components/PostList";

const ListHeading = styled.h1`
  margin: 1.5rem 0.2rem 0.5rem;
`;

const TagGroups = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`;
const TagGroup = styled.li`
  h2 {
    margin: 0.5rem 0.5rem;
    font-weight: 500;
    font-size: 1.2rem;
  }
`;
const Tags = styled.ul`
  margin: 0.5rem 0;
  margin: 0;
  list-style: none;
  display: flex;
  flex-wrap: wrap;
`;
const Tag = styled.li`
  margin: 0 0.15rem;
  display: inline-block;
  a {
    width: 100%;
    height: 1.5rem;
    border: 1px solid ${oc.gray[7]};
    border-radius: 0.5rem;
    padding: 0 0.3rem;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 0.8rem;
    font-weight: 300;
    color: ${oc.gray[7]};
    text-decoration: none;
    transition: background-color ease-in-out 100ms, color ease-in-out 100ms;
    &::before {
      content: "#";
      margin-right: 0.2rem;
      transition: color ease-in-out 100ms;
      color: ${oc.gray[7]};
    }
    &:visited {
      color: ${oc.gray[7]};
    }
    @media (hover) {
      &:hover {
        background-color: ${oc.gray[2]};
      }
    }
  }
  &.selected a {
    background-color: ${oc.gray[7]};
    color: white;
    &::before {
      color: white;
    }
  }
  ${Object.keys(oc).map(
    key => css`
      &.${key} a {
        border-color: ${oc[key][5]};
        color: ${oc[key][5]};
        &::before {
          color: ${oc[key][5]};
        }
        @media (hover) {
          &:hover {
            background-color: ${oc[key][1]};
          }
        }
      }
      &.${key}.selected a {
        background-color: ${oc[key][5]};
        color: white;
        &::before {
          color: white;
        }
      }
    `
  )}
`;

type PageData = {
  posts: {
    edges: MarkdownRemarkEdge[];
  };
  tags: {
    edges: TagEdge[];
  };
  tagGroups: {
    edges: TagGroupEdge[];
  };
};

const IndexPage: React.FC<PageProps<PageData>> = ({ data, location }) => {
  const posts = data.posts.edges.map(({ node: post }) => post);
  const tagGroups = data.tagGroups.edges.map(({ node: tagGroup }) => tagGroup);
  const tags = data.tags.edges.map(({ node: tag }) => tag);
  const searchParams = new URLSearchParams(location.search);
  const selectedTagSlug = searchParams.get("tag")?.toLowerCase() || "";
  const selectedTag = tags.find(tag => tag.slug === selectedTagSlug);
  const filteredPosts = selectedTag
    ? posts.filter(post => post.frontmatter.tags.includes(selectedTag.slug))
    : posts;

  const preventingHandler: React.UIEventHandler = e => e.preventDefault();
  // useEffectOnce(() => {
  //   for (const element of document.querySelectorAll<HTMLAnchorElement>("")) {
  //     element.addEventListener("mousedown", e => e.preventDefault());
  //   }
  // });

  return (
    <Layout>
      <SEO />
      <ListHeading>태그</ListHeading>
      <TagGroups>
        <Tag className={!selectedTag ? "selected" : ""}>
          <Link to="." onMouseDown={preventingHandler}>
            전체 ({posts.length})
          </Link>
        </Tag>
        {tagGroups.map(tagGroup => (
          <TagGroup key={tagGroup.id}>
            <h2>{tagGroup.name}</h2>
            <Tags>
              {tagGroup.tags.map(tag => (
                <Tag
                  key={tag.slug}
                  className={[
                    tagGroup.color || "",
                    selectedTag && selectedTag.slug === tag.slug ? "selected" : "",
                  ].join(" ")}
                >
                  <Link to={`./?tag=${tag.slug}`} onMouseDown={preventingHandler}>
                    {tag.name} (
                    {posts.filter(post => post.frontmatter.tags.includes(tag.slug)).length})
                  </Link>
                </Tag>
              ))}
            </Tags>
          </TagGroup>
        ))}
      </TagGroups>
      <ListHeading>{selectedTag ? `${selectedTag.name} 포스트` : "모든 포스트"}</ListHeading>
      <PostList posts={filteredPosts} />
    </Layout>
  );
};
export default IndexPage;

export const query = graphql`
  query {
    posts: allMarkdownRemark(sort: { order: DESC, fields: frontmatter___date }) {
      edges {
        node {
          id
          excerpt(truncate: true, pruneLength: 200)
          timeToRead
          fields {
            slug
          }
          frontmatter {
            title
            date(formatString: "YYYY-MM-DD")
            tags
          }
        }
      }
    }
    tagGroups: allTagGroup {
      edges {
        node {
          id
          name
          color
          tags {
            slug
            name
          }
        }
      }
    }
    tags: allTag {
      edges {
        node {
          name
          slug
          group {
            color
          }
        }
      }
    }
  }
`;
