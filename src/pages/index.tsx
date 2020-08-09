import React from "react";
import { PageProps, Link, graphql } from "gatsby";
import styled from "styled-components";
import { MarkdownRemarkEdge, TagEdge, TagGroupEdge } from "../generated/graphql-types";
import Layout from "../components/Layout";
import SEO from "../components/SEO";
import PostList from "../components/PostList";
import TagList, { ListItem as TagListItem } from "../components/TagList";

const ListHeading = styled.h1`
  margin: 2rem 0.2rem 1rem;
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

  return (
    <Layout>
      <SEO />
      <ListHeading>태그</ListHeading>
      <TagGroups>
        <TagListItem className={!selectedTag ? "highlighted" : ""}>
          <Link to=".">전체 ({posts.length})</Link>
        </TagListItem>
        {tagGroups.map(tagGroup => (
          <TagGroup key={tagGroup.id}>
            <h2>{tagGroup.name}</h2>
            <TagList
              tags={tagGroup.tags}
              highlightedTagSlug={selectedTag ? selectedTag.slug : null}
            />
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
            group {
              color
            }
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
