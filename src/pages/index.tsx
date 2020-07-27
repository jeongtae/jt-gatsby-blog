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
};

const IndexPage: React.FC<PageProps<PageData>> = ({ data }) => {
  const posts = data.posts.edges.map(({ node: post }) => post);
  return (
    <Layout>
      <SEO title="" />
      <ul>
        <PostList posts={posts} />
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
          }
        }
      }
    }
  }
`;
