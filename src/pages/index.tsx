import React, { useState } from "react";
import { PageProps, graphql, navigate } from "gatsby";
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
      <form name="tag">
        <ul>
          <li>
            <input
              type="radio"
              name="tag"
              id="all"
              value="all"
              checked={!selectedTag}
              onChange={() => navigate(".")}
            />
            <label htmlFor="all">All ({posts.length})</label>
          </li>
          {tagGroups.map(tagGroup => (
            <li key={tagGroup.id}>
              <p>{tagGroup.name}</p>
              <ul>
                {tagGroup.tags.map(tag => (
                  <li key={tag.slug}>
                    <input
                      type="radio"
                      name="tag"
                      id={tag.slug}
                      value={tag.slug}
                      checked={selectedTag ? selectedTag.slug === tag.slug : false}
                      onChange={() => navigate(`./?tag=${tag.slug}`)}
                    />
                    <label htmlFor={tag.slug} style={{ color: oc[tagGroup.color][5] }}>
                      {tag.name} (
                      {posts.filter(post => post.frontmatter.tags.includes(tag.slug)).length})
                    </label>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </form>
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
