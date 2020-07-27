import React, { useState } from "react";
import { PageProps, Link, graphql } from "gatsby";
import oc from "open-color";
import { MarkdownRemarkEdge, TagEdge, TagGroupEdge } from "../generated/graphql-types";
import Layout from "../components/Layout";
import SEO from "../components/SEO";
import PostList from "../components/PostList";

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
      <ul>
        <li>
          <Link to="." className={!selectedTag ? "highlight" : ""}>
            All ({posts.length})
          </Link>
        </li>
        {tagGroups.map(tagGroup => (
          <li key={tagGroup.id}>
            <p>{tagGroup.name}</p>
            <ul>
              {tagGroup.tags.map(tag => (
                <li key={tag.slug}>
                  <Link
                    to={`./?tag=${tag.slug}`}
                    className={selectedTag && selectedTag.slug === tag.slug ? "highlight" : ""}
                  >
                    {tag.name} (
                    {posts.filter(post => post.frontmatter.tags.includes(tag.slug)).length})
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      <h1>{selectedTag ? `Post tagged with ${selectedTag.name}` : "All Post"}</h1>
      <ul>
        <PostList posts={filteredPosts} />
      </ul>
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
